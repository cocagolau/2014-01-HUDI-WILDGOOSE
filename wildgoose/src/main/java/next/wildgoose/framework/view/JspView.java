package next.wildgoose.framework.view;

import java.io.IOException;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

@Component("jsp")
public class JspView implements View {

	@Override
	public void show (HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String viewName)  throws ServletException, IOException {
		String jspName = viewName + ".jsp";
		
		request.setAttribute("data", model);
		RequestDispatcher reqDispatcher = request.getRequestDispatcher("/WEB-INF/pages/" + jspName);
		
		reqDispatcher.forward(request, response);
		
	}



}
