package next.wildgoose.framework;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import next.wildgoose.framework.utility.Uri;
import next.wildgoose.utility.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class FrontController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(FrontController.class.getName());

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		
		// 로그인 유지(3일)를 위한 쿠키만료기간 재설정 
		if (session.getAttribute("userId") != null) {
			renewAuth(request, response);
		}
		
		LOGGER.debug(request.getRequestURI());
		BackController backController = getBackController(request);
		Result resultData = backController.execute(request);

		View view = createView(request, resultData);
		view.show(request, response, resultData);
	}
	
	private void renewAuth(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();		
		session.setMaxInactiveInterval(Constants.SESSION_EXPIRING_TIME);
		Cookie[] cookies = request.getCookies();
		Cookie jsessionid = null;

		for (int i=0; i<cookies.length; i++) {
			Cookie cookie = cookies[i];
			if("JSESSIONID".equals(cookie.getName())) {
				jsessionid = cookie;
			}
		}
		if(jsessionid != null) {
			jsessionid.setMaxAge(Constants.SESSION_EXPIRING_TIME);
		}
		response.addCookie(jsessionid);			
	}
	
	// 요청(request path)에 해당하는 BackController 구현체를 받아오기
	private BackController getBackController(HttpServletRequest request) {
		ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
		
//		Lecture lecture = context.getBean("standardGradeLecture", Lecture.class);
//		
//		ServletContext context = request.getServletContext();
//		Map<String, BackController> controllerMap = (Map<String, BackController>) context.getAttribute("controllerMap");
		Uri uri = new Uri(request);
		String primeResource = uri.getPrimeResource();
		if ("".equals(primeResource)) {
			primeResource = "search";
		}
		
		BackController result = context.getBean(primeResource, BackController.class);
//		result = controllerMap.get(uri.getPrimeResource());
//		result = context.getBean(primeResource, BackController.class);
		if (result == null) {
			result = context.getBean("error", BackController.class);
		}
		return result;
	}
	
	private View createView(HttpServletRequest request, Result resultData) {
		Uri uri = new Uri(request);
		// 요청종류에 따라 뷰 구현체의 인스턴스를 마련한다.
		if (uri.isAPI()) {
			return new JSONView();
		}
		String jspFileName = pickJsp(request, uri, resultData);
		request.setAttribute("jspName", jspFileName);
		return new JSPView();
	}
	
	private String pickJsp(HttpServletRequest request, Uri uri, Result resultData) {
		ServletContext context = request.getServletContext();
		Map<Uri, String> jspMap = (Map<Uri, String>) context.getAttribute("jspMap");
		String result = null;
		
		//// JSPView의 경우 이 과정에서 내부적으로 대응하는 .jsp 파일을 멤버로 확보하도록 한다.
		if (resultData == null) {
			result = jspMap.get(null);
		} else if (resultData.getStatus() == 200) {			
			Uri keyUri = getKey(jspMap.keySet(), uri);
			result = jspMap.get(keyUri);
		}
//		else if (resultData.getStatus() == 401) {
//			// Not Authenticated
//			result = "error.jsp";
//		} else if (resultData.getStatus() == 404) {
//			result = "404.jsp";
//		}
		else {
			result = "error.jsp";
		}
		
		return result;
	}

	private Uri getKey(Set<Uri> keySet, Uri uri) {
		Uri keySchema = null;
		Iterator<Uri> schemaIr = keySet.iterator();
		
		while (keySchema == null && schemaIr.hasNext()) {
			Uri schema = schemaIr.next();
			if (schema == null) {
				continue;
			}
			for (int i=schema.size()-1; i>=0; --i) {
				String subSchema = schema.get(i);
				
				if ("*".equals(subSchema)) {
					continue;
				}
				
				if (!subSchema.equals(uri.get(i))) {
					break;
				}
				
				keySchema = schema;
			}
		}
		return keySchema;
	}
}
