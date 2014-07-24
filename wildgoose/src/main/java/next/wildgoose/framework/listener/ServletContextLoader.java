package next.wildgoose.framework.listener;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import next.wildgoose.controller.JspMapping;

public class ServletContextLoader implements ServletContextListener {
//	public static final String DEFAULT_REQUEST_MAPPING = "DEFAULT_REQUEST_MAPPING";
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		ServletContext context = sce.getServletContext();
		
		context.setAttribute("jspMapping", new JspMapping());
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}
}