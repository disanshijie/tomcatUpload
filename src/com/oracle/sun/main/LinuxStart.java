package com.oracle.sun.main;

import java.io.IOException;

import com.oracle.sun.service.LinuxOperate;
/**
 * 
* @ClassName: LinuxStart
* @Description: Linux端使用
* @author sun
* @date 2018年5月11日 下午5:31:51
 */
public class LinuxStart {


	public static void main(String[] args) throws IOException {
		LinuxOperate lo=new LinuxOperate();
		lo.backUpFile();
		//lo.writeFile();	//本地测试
		lo.upload2Linux(); //上传到Linux
		
	}
}
