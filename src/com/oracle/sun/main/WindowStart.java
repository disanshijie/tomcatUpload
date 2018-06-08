package com.oracle.sun.main;

import java.io.IOException;

import com.oracle.sun.service.WindowOperate;
/**
 * 
* @ClassName: WindowStart
* @Description: windows端
* @author sun
* @date 2018年5月11日 下午5:31:32
 */
public class WindowStart {
	public static void main(String[] args) throws IOException {
		
	WindowOperate wo=new WindowOperate();
		wo.deleUpFile(); //TODO
		//wo.copyFile();
		wo.copyFormTomcat();
		wo.backUpFile();

	
	}
}
