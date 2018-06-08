package com.oracle.sun.service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.oracle.sun.utils.FileBox;

public class WindowOperate {

	private static final String BASEPARAMS="resource/params.properties";
	private static String PROJECTNAME=FileBox.getProperties(BASEPARAMS, "PROJECTNAME");
	private static String BASEPATH=System.getProperty("user.dir");
	private static final String WINDOW_BASE=FileBox.getProperties(BASEPARAMS, "WINDOW_BASE");
	private static final String WINDOW_TOMCAT_BASE=FileBox.getProperties(BASEPARAMS, "WINDOW_TOMCAT_BASE");
	private static final String SAVE_PATH=BASEPATH+"/prepare/";
	private static final String SAVE_PATH_FILE=BASEPATH+"/prepare/update/";
	private static final String SAVE_PATH_READEME=SAVE_PATH+"reademe.txt";
	private static  Integer fileNum=0;
	
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd-HHmmss");
	
	public void copyFile() {
		//System.out.println("项目路径"+BASEPATH);
		//System.out.println("项目父路径"+ FileBox.obtainParentPath(BASEPATH));
		
		List<String> paths= FileBox.readFileLine(SAVE_PATH_READEME);
		
		for (String source : paths) {
			//System.out.println(source);
			if(source==null || "".equals(source.trim()) || !source.contains(PROJECTNAME))continue;
			
			String name=FileBox.obtainFileName(source);
			
			int indexb=source.indexOf(PROJECTNAME);
			String jPath=source.substring(indexb+PROJECTNAME.length(), source.length());
			source=WINDOW_BASE+jPath;
			//System.out.println("window下的目录"+source);
			
			//java 文件
			if(name.contains(".java")) {
				//String jPath=source.substring(index+5, source.length());
				source = source.replace(PROJECTNAME+"/src/com", PROJECTNAME+"/web/WEB-INF/classes/com").replace(".java", ".class");
			//	source = source.replace(PROJECTNAME+"/src/com", PROJECTNAME+"/WEB-INF/classes/com").replace(".java", ".class");
				name = name.replace(".java", ".class");
			//	System.out.println("java替换"+source);
			}
			//复制文件
			FileBox.copyFileUsingFileStreams(source,SAVE_PATH_FILE+name);
			System.out.println(source);
			fileNum +=1;
		}
		System.out.println("操作文件数量："+fileNum);
	}
	public void copyFormTomcat() {
		List<String> paths= FileBox.readFileLine(SAVE_PATH_READEME);
		for (String source : paths) {
			//System.out.println(source);
			if(source==null || "".equals(source.trim()) || !source.contains(PROJECTNAME))continue;
			String name=FileBox.obtainFileName(source);
			
			int indexb=source.indexOf(PROJECTNAME);
			String jPath=source.substring(indexb+PROJECTNAME.length(), source.length());
			//System.out.println("window下的目录"+source);
			//System.out.println("window下的截取"+jPath);
			//src目录
			if(jPath.startsWith("/src/")) {
				jPath = jPath.replace("/src/", "/WEB-INF/classes/");
				//java 文件
				if(name.contains(".java")) {
					//String jPath=source.substring(index+5, source.length());
					//	source = source.replace(PROJECTNAME+"/src/com", PROJECTNAME+"/WEB-INF/classes/com").replace(".java", ".class");
					jPath = jPath.replace(".java", ".class");
					name = name.replace(".java", ".class");
				}
			}else if(jPath.startsWith("/resource/")) {
				jPath = jPath.replace("/resource/", "/WEB-INF/classes/");
				
			}else if(jPath.startsWith("/web/")) {
				jPath = jPath.replace("/web/", "/");
			}else{
				
			}
			source=(WINDOW_TOMCAT_BASE+jPath).trim();
			//复制文件
			FileBox.copyFileUsingFileStreams(source,SAVE_PATH_FILE+name);
			System.out.println(source);
			fileNum +=1;
		}
		System.out.println("操作文件数量："+fileNum);
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
		File target=new File(BASEPATH+"/backUp/"+time1+"/"+time2);
		FileBox.mkDir(target);
		FileBox.copyFolder(new File(SAVE_PATH),target);
	}
	
	public void deleUpFile() throws IOException {
		FileBox.delDirNoThis(new File(SAVE_PATH_FILE));
	}
	
}
