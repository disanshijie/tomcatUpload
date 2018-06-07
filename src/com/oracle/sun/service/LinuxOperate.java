package com.oracle.sun.service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import com.oracle.sun.utils.FileBox;
import com.oracle.sun.utils.SftpUtil;

public class LinuxOperate {

	private static final String BASEPARAMS="resource/params.properties";
	private static String BASEPATH=System.getProperty("user.dir");
	private static final String SAVE_PATH=BASEPATH+"/prepare/";	//更新数据根目录
	private static final String SAVE_PATH_FILE=BASEPATH+"/prepare/update/"; //需要跟新文件的位置
	private static final String SAVE_PATH_READEME=SAVE_PATH+"reademe.txt"; //更新文件说明
	private static String PROJECTNAME=FileBox.getProperties(BASEPARAMS, "PROJECTNAME"); //项目
	private static final String LINUX_BASE=FileBox.getProperties(BASEPARAMS, "LINUX_BASE"); //Linux上根目录
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd-HHmmss");
	
	public static List<String> createTargetFile()  {
		List<String> targetFiles= new ArrayList<String>();
		List<String> paths= FileBox.readFileLine(SAVE_PATH_READEME);
		for (String source : paths) {
			//System.out.println(source);
			if(source==null || "".equals(source.trim()) || !source.contains(PROJECTNAME))continue;
			String name=FileBox.obtainFileName(source);
			
			//java 文件
			if(name.contains(".java")) {
				name = name.replace(".java", ".class");
				source = source.replace(PROJECTNAME+"/src/com", PROJECTNAME+"/WEB-INF/classes/com").replace(".java", ".class");
				int index=source.indexOf(PROJECTNAME);
				String jPath=source.substring(index+PROJECTNAME.length(), source.length());
				source=LINUX_BASE+jPath;
				//System.out.println(source);
			}else
			if(name.contains(".jsp") || name.contains(".js")) {
				//source = source.replace("eyou/web", "eyou/");
				int index=source.indexOf(PROJECTNAME);
				String jPath=source.substring(index+PROJECTNAME.length()+4, source.length());
				source=LINUX_BASE+jPath;
				//System.out.println(source);
			}else
			if(name.contains(".xml")) {
				if(source.contains("sqlMappers")) {
					source = source.replace(PROJECTNAME+"/src/com", PROJECTNAME+"/WEB-INF/classes/com");
					int index=source.indexOf(PROJECTNAME);
					String jPath=source.substring(index+PROJECTNAME.length(), source.length());
					source=LINUX_BASE+jPath;
					//System.out.println(source);
				}else if(source.contains("resource")) {
					source = source.replace(PROJECTNAME+"/resource", PROJECTNAME+"/WEB-INF/classes");
					int index=source.indexOf(PROJECTNAME);
					String jPath=source.substring(index+PROJECTNAME.length(), source.length());
					source=LINUX_BASE+jPath;
					//System.out.println(source);
					
				}
			}else if(name.contains(".properties")) {
				if(source.contains("resource")) {
					source = source.replace(PROJECTNAME+"/resource", PROJECTNAME+"/WEB-INF/classes");
					int index=source.indexOf(PROJECTNAME);
					String jPath=source.substring(index+PROJECTNAME.length(), source.length());
					source=LINUX_BASE+jPath;
					//System.out.println(source);
					
				}
			}
			targetFiles.add(source);
		}
		return targetFiles;
	}
	
	public void writeFile() {
		List<String> targetFiles= createTargetFile();
		Integer fileNum=0;
		for (String source : targetFiles) {
			//System.out.println(source);
			String name=FileBox.obtainFileName(source);
			//一 window上
			FileBox.mkDir(new File(source.substring(0,source.lastIndexOf("/"))));
			FileBox.copyFileUsingFileStreams(SAVE_PATH_FILE+name,source);
			
			System.out.println(SAVE_PATH_FILE+name);
			fileNum +=1;
		}
		System.out.println("更新文件数量："+fileNum);
	}
	/**
	 * 
	* @Title: backUpFile
	* @Description: 执行前备份上次的数据
	* @author sun
	* @date  2018年5月2日 下午3:06:50
	* @throws IOException
	 */
	public void backUpFile() throws IOException {
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat sdf2 = new SimpleDateFormat("HHmmss");
		String time1= sdf1.format(new Date());
		String time2= sdf2.format(new Date());
		File target=new File(BASEPATH+"/backUpLinux/"+time1+"/"+time2);
		FileBox.mkDir(target);
		FileBox.copyFile(new File(SAVE_PATH),target);
	}
	
	/**
	* @Description: 文件上传到linux上去
	* @author sun
	* @date  2018年6月7日 下午2:32:27
	* @param source 源
	* @param dest	目标路径
	* @param filename	user.txt
	 */
	public void upload2Linux() {
		String host=FileBox.getProperties(BASEPARAMS, "host");
		String username=FileBox.getProperties(BASEPARAMS, "username");
		String passwd=FileBox.getProperties(BASEPARAMS, "passwd");
		try {
			ChannelSftp sftp = SftpUtil.getSftpConnect(host, 22, username, passwd);
			List<String> targetFiles= createTargetFile();
			
			Integer fileNum=0;
			for (String source : targetFiles) {
				File sourcefile=new File(source);
				String name=FileBox.obtainFileName(source);//文件名称
				String dest=sourcefile.getParent();//文件所在目录
				
				String sodir=SAVE_PATH_FILE.replaceAll("\\\\", "/");
				dest=dest.replaceAll("\\\\", "/");
				//更新的文件
				System.out.println(dest+"/"+name);
				SftpUtil.uploadFile(sodir+name,dest+"/",name,sftp);
				//计数
				fileNum +=1;
			}
			System.out.println("更新文件数量："+fileNum);
			
			SftpUtil.exit(sftp);
			System.exit(0);
			
		} catch (JSchException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SftpException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
}
