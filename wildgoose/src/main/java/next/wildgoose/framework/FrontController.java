package next.wildgoose.framework;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.framework.utility.Uri;
import next.wildgoose.framework.view.View;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class FrontController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(FrontController.class.getName());
	
	private ApplicationContext applicationContext;
	
	@Override
	public void init() throws ServletException {
		this.applicationContext = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
	}
	

	@Override
	public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Uri uri = new Uri(request);
		Controller controller = null;
		
		try {
			controller = this.applicationContext.getBean(uri.getPrimeResource(), Controller.class);

		} catch (Exception e) {
			controller = this.applicationContext.getBean("error", Controller.class);
			LOGGER.debug(e.getMessage(), e);
			
		}
		
		Map<String, Object> model = new HashMap<String, Object>();
		String viewName = controller.execute(request, response, model);
		
		LOGGER.debug("view: " + viewName);
		
		View view = uri.createView(applicationContext);
		view.show(request, response, model, viewName);
		
	}

}
