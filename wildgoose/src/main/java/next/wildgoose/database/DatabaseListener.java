package next.wildgoose.database;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class DatabaseListener implements ServletContextListener {
	public void contextInitialized(ServletContextEvent event) {
		ServletContext sc = event.getServletContext();
		
		// DATABASE
		String dbDriver = sc.getInitParameter("driverClassName");
		String dbUrl = sc.getInitParameter("dbUrl");
		String userName = sc.getInitParameter("userName");
		String userPassword = sc.getInitParameter("userPassword");
//		DataSource.init(dbDriver, userName, userPassword, dbUrl);
	}
	
	public void contextDestroyed(ServletContextEvent event) {
		// 컨텍스트가 종료될 때 처리해야할 일
		// do-nothing
	}

}
