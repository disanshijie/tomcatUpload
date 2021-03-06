package com.oracle.sun.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Vector;

import org.apache.commons.lang.StringUtils;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

/**
 * 文件工具类.<br>
 * 1.所有的文件路径必须以'/'开头和结尾，否则路径最后一部分会被当做是文件名<br>
 * 1.1通过程序获取的路径 需要 =replaceAll("\\\\","/")<br>
 * 2. @since version-0.3 方法出现异常的时候，<del>会关闭sftp连接(但是不会关闭session和channel)</del>(del @ version 0.31)，异常会抛出<br>
 * @author Leon Lee
 * 
 * 缺陷 路劲必须是 /形式的
 * 
 */
public class SftpUtil {

    /**
     * 文件路径前缀. /ddit-remote
     */
    private static final String PRE_FIX = "/test-noryar";

    /**
     * sftp连接池.
     */
    private static final Map<String, Channel> SFTP_CHANNEL_POOL = new HashMap<String, Channel>();

    /**
     * 获取sftp协议连接.
     * @param host 主机名
     * @param port 端口
     * @param username 用户名
     * @param password 密码
     * @return 连接对象
     * @throws JSchException 异常
     */
    public static ChannelSftp getSftpConnect(final String host, final int port, final String username,
            final String password) throws JSchException {
        Session sshSession = null;
        Channel channel = null;
        ChannelSftp sftp = null;
        String key = host + "," + port + "," + username + "," + password;
        if (null == SFTP_CHANNEL_POOL.get(key)) {
            JSch jsch = new JSch();
            jsch.getSession(username, host, port);
            sshSession = jsch.getSession(username, host, port);
            sshSession.setPassword(password);
            Properties sshConfig = new Properties();
            //设置第一次登陆的时候提示，可选值:(ask | yes | no) 
            sshConfig.put("StrictHostKeyChecking", "no");
            sshSession.setConfig(sshConfig);
            sshSession.connect();
            //30秒连接超时 
            //sshSession.connect(30000); 
            //sshSession.setTimeout(30000); // 设置timeout时间  好像一样
            channel = sshSession.openChannel("sftp");
            channel.connect();
            SFTP_CHANNEL_POOL.put(key, channel);
        } else {
            channel = SFTP_CHANNEL_POOL.get(key);
            sshSession = channel.getSession();
            if (!sshSession.isConnected())
                sshSession.connect();
            if (!channel.isConnected())
                channel.connect();
        }
        sftp = (ChannelSftp) channel;
        return sftp;
    }

    /**
     * 下载文件-sftp协议.
     * @param downloadFile 下载的文件
     * @param saveFile 存在本地的路径
     * @param sftp sftp连接
     * @return 文件
     * @throws Exception 异常
     */
    public static File download(final String downloadFile, final String saveFile, final ChannelSftp sftp)
            throws Exception {
        FileOutputStream os = null;
        File file = new File(saveFile);
        try {
            if (!file.exists()) {
                File parentFile = file.getParentFile();
                if (!parentFile.exists()) {
                    parentFile.mkdirs();
                }
                file.createNewFile();
            }
            os = new FileOutputStream(file);
            List<String> list = formatPath(downloadFile);
            sftp.get(list.get(0) + list.get(1), os);
        } catch (Exception e) {
            throw e;
        } finally {
            os.close();
        }
        return file;
    }

    /**
     * 下载文件-sftp协议.
     * @param downloadFile 下载的文件
     * @param saveFile 存在本地的路径
     * @param sftp sftp连接
     * @return 文件 byte[]
     * @throws Exception 异常
     */
    public static byte[] downloadAsByte(final String downloadFile, final ChannelSftp sftp) throws Exception {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        try {
            List<String> list = formatPath(downloadFile);
            sftp.get(list.get(0) + list.get(1), os);
        } catch (Exception e) {
            throw e;
        } finally {
            os.close();
        }
        return os.toByteArray();
    }

    /**
     * 删除文件-sftp协议.
     * @param pathString 要删除的文件
     * @param sftp sftp连接
     * @throws SftpException 异常
     */
    public static void rmFile(final String pathString, final ChannelSftp sftp) throws SftpException {
        List<String> list = formatPath(pathString);
        String dir = list.get(0);
        String file = list.get(1);
        if (dirExist(dir + file, sftp)) {
            sftp.rm(list.get(0) + list.get(1));
        }
    }

    /**
     * 删除文件夹-sftp协议.如果文件夹有内容，则会抛出异常.
     * @param pathString 文件夹路径
     * @param sftp sftp连接
     * @param resursion 递归删除
     * @throws SftpException 异常
     */
    public static void rmDir(final String pathString, final ChannelSftp sftp, final boolean recursion)
            throws SftpException {
        String fp = formatPath(pathString).get(0);
        if (dirExist(fp, sftp)) {
            if (recursion)
                exeRmRec(fp, sftp);
            else
                sftp.rmdir(fp);
        }
    }

    /**
     * 递归删除执行.
     * @param pathString 文件路径
     * @param sftp sftp连接
     * @throws SftpException
     */
    private static void exeRmRec(final String pathString, final ChannelSftp sftp) throws SftpException {
        @SuppressWarnings("unchecked")
        Vector<LsEntry> vector = sftp.ls(pathString);
        if (vector.size() == 1) { // 文件，直接删除
            sftp.rm(pathString);
        } else if (vector.size() == 2) { // 空文件夹，直接删除
            sftp.rmdir(pathString);
        } else {
            String fileName = "";
            // 删除文件夹下所有文件
            for (LsEntry en : vector) {
                fileName = en.getFilename();
                if (".".equals(fileName) || "..".equals(fileName)) {
                    continue;
                } else {
                    exeRmRec(pathString + "/" + fileName, sftp);
                }
            }
            // 删除文件夹
            sftp.rmdir(pathString);
        }
    }

    /**
     * 上传文件-sftp协议.
     * @param srcFile 源文件	必须是文件啊
     * @param dir 保存路径		需要/开头和结尾
     * @param fileName 保存文件名
     * @param sftp sftp连接
     * @throws Exception 异常
     */
    public static void uploadFile(final String srcFile, final String dir, final String fileName, final ChannelSftp sftp)
            throws SftpException {
    	//处理Linux上路径
    	if (StringUtils.isBlank(dir)) {
        	System.out.println("Linux路径空");
        	return ;
        }
        String md = dir.replaceAll("\\\\", "/");
        if (md.indexOf("/") != 0 || md.length() == 1) {
        	return ;
        }
        md=md.endsWith("/")?md:md+"/";
        
        mkdir(md, sftp); //可以递归
        sftp.cd(md);
        sftp.put(srcFile, fileName);
        // sftp.put(srcFile, new String(fileName.getBytes(),"UTF-8"));  //中文名称的  
        //sftp.setFilenameEncoding("UTF-8");  
    }
    /**
    * 上传文件-sftp协议.
    * @author sun
    * @date  2018年6月7日 下午6:22:20
    * @param srcFile 源文件
     * @param directory 保存路径
     * @param sftp sftp连接
     * @throws FileNotFoundException 
     * @throws UnsupportedEncodingException 
     * @throws Exception 异常
     */
    public static void uploadFile(File srcFile, String directory, ChannelSftp sftp)
    		throws SftpException, FileNotFoundException, UnsupportedEncodingException {
    	//File srcFile = new File(srcFile);
    	if(srcFile.isFile()){
    		System.out.println(srcFile.getAbsolutePath());
    		System.out.println(directory);
    		System.out.println(srcFile.getName());
    		System.out.println("--------");
    		uploadFile(srcFile.getAbsolutePath(), directory, srcFile.getName(),sftp);
         }else{ //
             File[] files = srcFile.listFiles();
             for (File file2 : files) {
                 String dir = file2.getAbsolutePath();
                 if(file2.isDirectory()){
                     //String str = dir.substring(dir.lastIndexOf(file2.separator));  
                     //directory = FileUtil.normalize(directory + str);  
                     directory =directory+"/"+file2.getName();
                 }
                 uploadFile(file2,directory,sftp);  
             }  
         } 
    }

    /**
     * 上传文件-sftp协议.
     * @param srcFile 源文件路径，/xxx/xx.yy 或 x:/xxx/xxx.yy
     * @param sftp sftp连接
     * @return 上传成功与否
     * @throws SftpException 异常
     */
    public static boolean uploadFile(final String srcFile, final ChannelSftp sftp) throws SftpException {
        File file = new File(srcFile);
        if (file.exists()) {
            List<String> list = formatPath(srcFile);
            uploadFile(srcFile, list.get(0), list.get(1), sftp);
            return true;
        }
        return false;
    }

    /**
     * 根据路径创建文件夹.
     * @param dir 路径 必须是 /xxx/xxx/ 不能就单独一个/
     * @param sftp sftp连接
     * @throws SftpException 异常
     */
    public static boolean mkdir(final String dir, final ChannelSftp sftp) throws SftpException {
    	
        return mkdirs(dir, sftp);
    }

    /**
     * 递归创建文件夹.
     * @param dir 路径
     * @param sftp sftp连接
     * @return 是否创建成功
     * @throws SftpException 异常
     */
    private static boolean mkdirs(final String dir, final ChannelSftp sftp) throws SftpException {
        String dirs = dir.substring(1, dir.length() - 1);
        String[] dirArr = dirs.split("/");
        String base = "";
        for (String d : dirArr) {
            base += "/" + d;
            if (dirExist(base + "/", sftp)) {
                continue;
            } else {
                sftp.mkdir(base + "/");
            }
        }
        return true;
    }

    /**
     * 判断文件夹是否存在.
     * @param dir 文件夹路径， /xxx/xxx/
     * @param sftp sftp协议
     * @return 是否存在
     */
    private static boolean dirExist(final String dir, final ChannelSftp sftp) {
        try {
            Vector<?> vector = sftp.ls(dir);
            if (null == vector)
                return false;
            else
                return true;
        } catch (SftpException e) {
            return false;
        }
    }

    /**
     * 格式化路径.
     * @param srcPath 原路径. /xxx/xxx/xxx.yyy 或 X:/xxx/xxx/xxx.yy
     * @return list, 第一个是路径（/xxx/xxx/）,第二个是文件名（xxx.yy）
     */
    public static List<String> formatPath(final String srcPath) {
        List<String> list = new ArrayList<String>(2);
        String repSrc = srcPath.replaceAll("\\\\", "/");
        int firstP = repSrc.indexOf("/");
        int lastP = repSrc.lastIndexOf("/");
        String fileName = lastP + 1 == repSrc.length() ? "" : repSrc.substring(lastP + 1);
        String dir = firstP == -1 ? "" : repSrc.substring(firstP, lastP);
        dir = PRE_FIX + (dir.length() == 1 ? dir : (dir + "/"));
        list.add(dir);
        list.add(fileName);
        return list;
    }

    /**
     * 关闭协议-sftp协议.(关闭会导致连接池异常，因此不建议用户自定义关闭)
     * @param sftp sftp连接
     */
    public static void exit(final ChannelSftp sftp) {
        sftp.exit();
    }
    
    //测试
    public static void main(String[] args) throws Exception {
    	//test2();
    	test3();
    }
    
    public void test1() throws Exception {
    	 ChannelSftp sftp = SftpUtil.getSftpConnect("59.110.224.8", 22, "root", "sjc@7ZXJPDZ");
         String pathString = "D:\\sunjinchao\\垃圾箱/new33.txt";
         System.out.println("上传文件开始...");
         uploadFile(pathString, sftp);
    	// File file = new File(pathString);
        // System.out.println("上传成功，开始删除本地文件...");
        // file.delete();
        // System.out.println("删除完成，开始校验本地文件...");
        // if (!file.exists()) {
        // System.out.println("文件不存在，开始从远程服务器获取...");
        // download(pathString, pathString, sftp);
        // System.out.println("下载完成");
        // } else {
        // System.out.println("在本地找到文件");
        // }
        // rmDir("", sftp, true);
       // String path = "E:\\aaa.zip";
       // File file = SftpUtil.download(path, path, sftp);
        // SftpUtil.exit(sftp);
        exit(sftp);
        System.exit(0);
    }
    public static void test2() throws Exception {
    	 ChannelSftp sftp = SftpUtil.getSftpConnect("59.110.224.8", 22, "root", "sjc@7ZXJPDZ");
         String pathString = "D:\\sunjinchao\\垃圾箱/new33.txt";
         String dest = "/usr/games";
         String name = "new33.txt";
         uploadFile(pathString,dest,dest, sftp);
         exit(sftp);
         System.exit(0);
    }
    //上传文件
    public static void test3() throws Exception {
    	ChannelSftp sftp = SftpUtil.getSftpConnect("59.110.224.8", 22, "root", "sjc@7ZXJPDZ");
    	String pathString = "D:\\opt\\tomcat-7.0\\webapps\\51Cruise\\WEB-INF";
    	String dest = "/usr/games";
    	//String name = "new33.txt";
    	uploadFile(new File(pathString),dest,sftp);
    	exit(sftp);
    	System.exit(0);
    }
}
