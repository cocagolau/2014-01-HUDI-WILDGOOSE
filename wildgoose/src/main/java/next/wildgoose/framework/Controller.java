package next.wildgoose.framework;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.framework.model.Model;

public interface Controller {
	
	public String execute(HttpServletRequest request, HttpServletResponse response, Model model);
	
}
