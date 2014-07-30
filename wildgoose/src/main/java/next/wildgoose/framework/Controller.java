package next.wildgoose.framework;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface Controller {
//	public Result execute(HttpServletRequest request);
	public String execute(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model);
//	public Result execute(HttpServletRequest request, HttpServletResponse response, Uri uri);
}
