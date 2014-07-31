package next.wildgoose.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.framework.Controller;
import next.wildgoose.framework.model.Model;
import next.wildgoose.framework.resource.Uri;
import next.wildgoose.framework.support.ResourceLoader;
import next.wildgoose.utility.Constants;

import org.springframework.stereotype.Component;

@Component("templates")
public class TemplateController implements Controller {
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response, Model model) {
		ServletContext context = request.getServletContext();
		Uri uri = new Uri(request);
		
		String templateFileName = uri.get(1);
		String root = context.getRealPath(Constants.RESOURCE_ROOT);
		String path = root +"WEB-INF/templates/html/"+ templateFileName;
		
		StringBuilder htmlDocumentSB = ResourceLoader.load(path);
		if (htmlDocumentSB != null) {
			int status = 200;
			String message = "OK";
			
			model.put("status", status);
			model.put("message", message);
			model.put("template", htmlDocumentSB.toString());
			
			return null;
			
		}
		
		return null;
		
	}
	
}
