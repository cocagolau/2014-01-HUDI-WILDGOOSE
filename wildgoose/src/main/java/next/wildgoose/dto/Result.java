package next.wildgoose.dto;

import java.util.Map;

public class Result {
	
	public int status;
	public String message;
	public Map<String, Object> data;
	
	public Result(Map<String, Object> model) {
		this.status = (Integer) model.remove("status");
		this.message = (String) model.remove("message");
		this.data = model;
		
	}

}
