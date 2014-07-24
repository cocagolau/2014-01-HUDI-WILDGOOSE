package next.wildgoose.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import next.wildgoose.dto.result.Result;
import next.wildgoose.dto.result.TemplateResult;
import next.wildgoose.framework.Controller;
import next.wildgoose.framework.support.ResourceLoader;
import next.wildgoose.framework.utility.Uri;
import next.wildgoose.utility.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("templates")
public class TemplateController implements Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(TemplateController.class.getName());
	
	@Override
	public Result execute(HttpServletRequest request) {
		ServletContext context = request.getServletContext();
		Uri uri = new Uri(request);
		String templateFileName = uri.get(1);
		LOGGER.debug("templateFileName: " + templateFileName);
		String root = context.getRealPath(Constants.RESOURCE_ROOT);
		String path = root +"WEB-INF/templates/html/"+ templateFileName;
		Result result = readTemplate(path);
		
		return result;
	}
	
	private TemplateResult readTemplate(String path) {
		TemplateResult result = new TemplateResult();
		StringBuilder htmlDocumentSB = ResourceLoader.load(path);
		
		if (htmlDocumentSB != null) {
			result.setStatus(200);
			result.setMessage("OK");
			result.setTemplate(htmlDocumentSB.toString());
		}
		
		return result;
	}
}
