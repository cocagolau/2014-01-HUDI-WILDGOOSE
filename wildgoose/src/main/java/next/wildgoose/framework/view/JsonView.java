package next.wildgoose.framework.view;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.dto.Result;
import next.wildgoose.framework.model.Model;
import next.wildgoose.framework.utility.Utility;
import next.wildgoose.utility.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("json")
public class JsonView implements View {
	private static final Logger LOGGER = LoggerFactory.getLogger(JsonView.class.getName());

	@Override
	public void show (HttpServletRequest request, HttpServletResponse response, Model model, String viewName)  throws ServletException, IOException {
		ServletContext context = request.getServletContext();
		Result result = new Result(model.getModel());
		
		PrintWriter out = null;
		String jsonString = Utility.toJsonString(result);
		
		LOGGER.debug("json: " + jsonString);
		
		response.setCharacterEncoding(context.getInitParameter("encoding"));
		response.setContentType(Constants.HEADER_CON_TYPE_JSON);

		try {
			out = response.getWriter();
			out.println(jsonString);
			
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			
		} finally {
			out.close();	
			
		}
		
	}
}
