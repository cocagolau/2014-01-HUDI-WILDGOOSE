package next.wildgoose.framework.view;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.framework.model.Model;

import org.springframework.stereotype.Component;

@Component("jsp")
public class JspView implements View {

	@Override
	public void show (HttpServletRequest request, HttpServletResponse response, Model model, String viewName)  throws ServletException, IOException {
		String jspName = viewName + ".jsp";
		
		request.setAttribute("data", model.getModel());
		RequestDispatcher reqDispatcher = request.getRequestDispatcher("/WEB-INF/pages/" + jspName);
		
		reqDispatcher.forward(request, response);
		
	}

}
