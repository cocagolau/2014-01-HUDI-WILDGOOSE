package next.wildgoose.framework.view;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface View {
//	void show(HttpServletRequest request, HttpServletResponse response, Result resultData) throws ServletException, IOException;
	void show(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String viewName) throws ServletException, IOException;
}
