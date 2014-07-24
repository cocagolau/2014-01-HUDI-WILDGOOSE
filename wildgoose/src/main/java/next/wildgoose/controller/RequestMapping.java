package next.wildgoose.controller;

import java.util.HashMap;
import java.util.Map;

import next.wildgoose.framework.Controller;
import next.wildgoose.utility.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class RequestMapping {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(RequestMapping.class.getName());
	
	private Map<String, Controller> requestMappings = new HashMap<String, Controller>();


	public RequestMapping(ApplicationContext applicationContext) {
		
		for (String resource : Constants.RESOURCES) {
			this.requestMappings.put(resource, applicationContext.getBean(resource, Controller.class));
		}
	}

	// 요청(request path)에 해당하는 Controller 구현체를 받아오기
	public Controller findController(String key) {
		Controller controller = this.requestMappings.get(key);
		
		if ("".equals(key)) {
			controller = this.requestMappings.get(Constants.DEFAULT_RESOURCE);
			
		} else if (controller == null) {
			controller = this.requestMappings.get("error");
			
		}
		
		return controller;
	}
	
}
