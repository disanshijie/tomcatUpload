package com.oracle.sun.main;

import java.io.IOException;

import com.oracle.sun.service.LinuxOperate;
import com.oracle.sun.service.WindowOperate;

public class Test {

	public static void main(String[] args) throws IOException {
		
		WindowOperate wo=new WindowOperate();
		
		wo.deleUpFile(); //TODO
		//wo.copyFile();
		wo.copyFormTomcat();
		wo.backUpFile();
		
		LinuxOperate lo=new LinuxOperate();
		lo.upload2Linux();
	
	}

}
