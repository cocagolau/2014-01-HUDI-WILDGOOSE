package next.wildgoose.framework.listener;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import next.wildgoose.utility.Constants;

public class ErrorListener implements ServletContextListener {

     public void contextInitialized(ServletContextEvent event) {
    	 ServletContext context = event.getServletContext();
    	 Map<Integer, String> errorCodeMap = new HashMap<Integer, String>();
 		
    	 errorCodeMap.put(404, Constants.ERROR_404);
    	 errorCodeMap.put(401, Constants.ERROR_401);
    	 
    	 errorCodeMap.put(500, Constants.ERROR_500);
 		
    	 context.setAttribute("errorCodeMap", errorCodeMap);
    }

    public void contextDestroyed(ServletContextEvent event) {
        // TODO Auto-generated method stub
    }
	
}
