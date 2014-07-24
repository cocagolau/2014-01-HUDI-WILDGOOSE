package next.wildgoose.framework.view;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.dto.result.Result;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("jsp")
public class JSPView implements View {
	private static final Logger LOGGER = LoggerFactory.getLogger(JSPView.class.getName());

	@Override
	public void show(HttpServletRequest request, HttpServletResponse response, Result resultData) throws ServletException, IOException{
		String jspName = (String) request.getAttribute("jspName");
		LOGGER.debug("jspFileName " + jspName);
		
		request.setAttribute("data", resultData);
		RequestDispatcher reqDispatcher = request.getRequestDispatcher("/WEB-INF/pages/" + jspName);
		reqDispatcher.forward(request, response);
	}



}
