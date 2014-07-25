package next.wildgoose.framework;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.controller.JspMapping;
import next.wildgoose.controller.RequestMapping;
import next.wildgoose.dto.result.Result;
import next.wildgoose.framework.uri.NewUri;
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
	private NewUri newUri;
	
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
//		Uri uri = newUri.analyze(request);
		Controller controller = this.requestMapping.findController(uri.getPrimeResource());
		// 기본가정: uri로 client의 모든 정보를 파악할 수 있다.
		// 따라서 uri를 알게 되는 순가 controller->model, view를 알 수 있고 view의 계산을 다른 controller로 미룰 필요가 없다.
		// 또한 frontController에서 model과 view의 연결을 관리하면 훨씬 직관적일 수 있다.
		// 하지만 한가지 문제점은 redirect가 문제다. 이 경우는 controller에서 redirect발생시 redirect status를 담은 Model을 전달하여 해결한다.
		
		// 요청 자원을 파악하고 uri에 저장한다.
		
		// uri로 controller와 view를 준비한다.
		
		// controller로 model를 계산한다.
		
		// model을 view와 연결한다.
		
		
		// 1. 요청 자원을 파악하고 uri에 저장한다.
//		Uri uri = requestUri.analyze(request);
		
		// uri로 controller를 준비한다.
//		Controller controller = uri.findController(request);
		
		// controller로 model를 계산한다.
//		ModelAndView modelAndView = controller.execute(request, response);
		
		// 모델을 보여준다.
//		modelAndView.show();
		
//		View view = uri.findView();

		
		
		
		
		
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
