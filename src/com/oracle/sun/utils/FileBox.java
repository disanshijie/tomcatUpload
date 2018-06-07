package com.oracle.sun.utils;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class FileBox {

	
	
	/**
	 * 
	* @Title: readFileLine
	* @Description: TODO(这里用一句话描述这个方法的作用)
	* @author sun
	* @date  2018年4月28日 上午10:22:48
	* @param fileName
	* @return
	 */
	public static List<String> readFileLine(String fileName){
		BufferedReader bre = null;
		List<String> res=new ArrayList<>();
		String str="";
		try {
			String file = fileName;
			bre = new BufferedReader(new FileReader(file));//此时获取到的bre就是整个文件的缓存流
			while ((str = bre.readLine())!= null) { // 判断最后一行不存在，为空结束循环
				//System.out.println(str);//原样输出读到的内容
				res.add(str);
			};
		} catch (Exception e) {
			// TODO: handle exception
		}
		return res;
	}
	/**
	 * 
	* @Title: copyFileUsingFileStreams
	* @Description: TODO(这里用一句话描述这个方法的作用)
	* @author sun
	* @date  2018年5月2日 下午2:35:06
	* @param source	源文件
	* @param dest 目标文件
	* @throws IOException
	 */
	public static void copyFileUsingFileStreams(String source, String dest){    
		File iFile=new File(source);
		File oFile=new File(dest);
		if(!iFile.exists()){
			System.out.println("源文件错误");
			System.out.println(source);
			return ;
		}
		try {
			copyFileByStreams(iFile, oFile);
		} catch (IOException e) {
			System.out.println("复制文件异常位置：");
			System.out.println("源文件："+source);
			System.out.println("目标位置："+dest);
			e.printStackTrace();
		}
	}
	public static void copyFileByStreams(File fromFile,File toFile) throws IOException {
		InputStream input = null;    
	    OutputStream output = null;  
	    try {
	    	  input = new FileInputStream(fromFile);
	           output = new FileOutputStream(toFile);
	           byte[] buf = new byte[1024];
	           int bytesRead;
	           while ((bytesRead = input.read(buf)) > 0) {
	               output.write(buf, 0, bytesRead);
	           }
		}finally {
			try {
				input.close();
				output.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			
	    }
	}
	
	/**
	* @Title: copyFile
	* @Description: 递归复制文件方法
	* @author sun
	* @date  2018年5月2日 下午2:52:25
	* @param file
	* @param file2
	 */
    public static void copyFile(File file, File file2) {
        // 当找到目录时，创建目录
        if (file.isDirectory()) {
            file2.mkdir();
            File[] files = file.listFiles();
            for (File file3 : files) {
               // 递归
               copyFile(file3, new File(file2, file3.getName()));
            }
            //当找到文件时
        } else if (file.isFile()) {
            File file3 = new File(file2.getAbsolutePath());
            try {
                file3.createNewFile();
                copyFileUsingFileStreams(file.getAbsolutePath(), file3.getAbsolutePath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
	
	//获取文件名
	public static String obtainFileName(String path) {
		String fileName="";
		int index=path.lastIndexOf("/");
		fileName=path.substring(index+1, path.length());
		//System.out.println("获取文件名称"+fileName);
		return fileName;
	}
	
	//递归创建多级目录 //TODO　一个mkdirs不就可以吗
	 public static void mkDir(File file){
		 if(file.getParentFile().exists()){
			 file.mkdir();
		 }else{
			 mkDir(file.getParentFile());
			 file.mkdir();
		 }
	 }
	//递归创建多级非文件  TODO
	 public static void mkDirNoFile(File file){
		 if(!file.getParentFile().exists()){
			 mkDirNoFile(file.getParentFile());
		 }
		 //TODO 这样好像不行吧  如果文件存在也可以 应该以 . 为标志
		 if(!file.isFile()) {
			 file.mkdir();
		 }
	 }
	
	 /**
	  * 
	 * @Description: //获取目录上一级目录 或者获取文件目录  文件本身不存在不影响获得上一级（上一级存在就行）
	 * @author sun
	 * @date  2018年6月7日 下午2:22:19
	 * @param path 目录/文件路径 
	 * @return 如果文件目录或目录的上一级目录不存在 返回null
	  */
	 public static String obtainParentPath(String path) {
		File file=new File(path);
		if(file.getParentFile().exists()){
			//dir=file.getParentFile().getAbsolutePath();
			return file.getParent();
			//dir=file.getParentFile().getPath();
		 }else{
		 }
		 return null;
	 }
	
    /**
     * 读Properties文件
     * @path 路径  eg :<br>"src/log4j.properties"---项目/src目录下;
     *             <br> "config/projectPath.properties"---项目/config 下
     *
     */
    private static Properties getProperties(String path) {
        Properties prop = new Properties(); InputStream in = null;
        try {
          //根目录为 src
          //in =Tools.class.getClassLoader().getResourceAsStream(path);
          //根目录为项目下(不需要写"/")
            in = new BufferedInputStream(new FileInputStream(path));
            //prop.load(in);//直接这么写，如果properties文件中有汉子，则汉字会乱码。因为未设置编码格式。
            prop.load(new InputStreamReader(in, "utf-8"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    System.out.println(e.getMessage());
                }
            }
        }
        return prop;
    }
    /**
     * @param path 路径  eg :<br>"src/log4j.properties"---项目/src目录下;
     *             <br> "config/projectPath.properties"---项目/config 下
     * @param key 键值对 中的key
     * @return
     */
    public static String getProperties(String path,String key) {
      Properties prop =getProperties(path);
     return prop.getProperty(key);
    }

    public static void delDir(File f) {
        // 判断是否是一个目录, 不是的话跳过, 直接删除; 如果是一个目录, 先将其内容清空.
        if(f.isDirectory()) {
            // 获取子文件/目录
            File[] subFiles = f.listFiles();
            // 遍历该目录
            for (File subFile : subFiles) {
                // 递归调用删除该文件: 如果这是一个空目录或文件, 一次递归就可删除. 如果这是一个非空目录, 多次
                // 递归清空其内容后再删除
                delDir(subFile);
            }
        }
        // 删除空目录或文件
        f.delete();
    }
    public static void delDirNoThis(File f) {
    	if(f.isDirectory()) {
    		File[] subFiles = f.listFiles();
    		for (File subFile : subFiles) {
    			delDir(subFile);
    		}
    	}
    }
    
    public static void main(String[] args) {
    	//String fd=obtainParentPath("D:/opt/tomcat-7.0/webapps/51Cruise/");
    	//String fd=obtainParentPath("D:\\opt\\tomcat-7.0\\webapps\\51Cruise");
    	//System.out.println(fd);
    	/*  File srcFile=new File("D:/opt/tomcat-7.0/");  
          File destFile=new File("D:/opt/test/");
    	  copyFile(srcFile,destFile);*/
    	/*String f=obtainParentPath("D:/opt/tomcat-7.0");
    	System.out.println(f);*/
    	
    	//mkDirNoFile(new File("D:/opt/tomcat-7.0"));
    	
    	String df=obtainParentPath("D:/opt\\tomcat-7.0/webapps/51Cruise\\resource/");
    	System.out.println(df);
	}
}
