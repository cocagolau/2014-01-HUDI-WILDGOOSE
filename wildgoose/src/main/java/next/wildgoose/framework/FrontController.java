package next.wildgoose.framework;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.controller.JspMapping;
import next.wildgoose.controller.RequestMapping;
import next.wildgoose.dto.result.Result;
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
	private JspMapping jspMapping;
	private RequestMapping requestMapping;
	
	@Override
	public void init() throws ServletException {
		this.applicationContext = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
		this.jspMapping = this.applicationContext.getBean("jspMapping", JspMapping.class);
//		this.requestMapping = this.context.getBean("requestMapping", RequestMapping.class);
		this.requestMapping = (RequestMapping) this.getServletContext().getAttribute("requestMapping");
	}

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Uri uri = new Uri(request);
		Controller controller = this.requestMapping.findController(uri.getPrimeResource());
		
		Result resultData = controller.execute(request);

		View view = uri.createView(applicationContext);
		
		pickJsp(request, uri, resultData);
		
		view.show(request, response, resultData);
	}
	
	// view 결정
	// page 이동
	
	
	private String pickJsp(HttpServletRequest request, Uri uri, Result resultData) {
		String jspFileName = "error.jsp";
		
		// JSPView의 경우 이 과정에서 내부적으로 대응하는 .jsp 파일을 멤버로 확보하도록 한다.
		if (resultData != null && resultData.getStatus() == 200) {			
			jspFileName = jspMapping.findJsp(uri);
		}
		
		request.setAttribute("jspName", jspFileName);
		
		return jspFileName;
	}
}
