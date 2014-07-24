package next.wildgoose.dto.result;

import java.util.HashMap;
import java.util.Map;

public abstract class Result {
	
	protected int status;
	protected String message;
	protected Map<String, Object> data;
	
	protected Result() {
		this.status = 500;
		this.message = "failure";
		this.data = new HashMap<String, Object>();
	}
	protected Result(boolean success) {
		if (success) {
			this.status = 200;
			this.message = "success";	
		} else {
			this.status = 500;
			this.message = "failure";
		}
		this.data = new HashMap<String, Object>();
	}

	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	public Object getData(String key) {
		return this.data.get(key);
	}
	protected void setData(String key, Object value) {
		this.data.put(key, value);
	}
	
	public void setPageName(String pageName) {
		this.setData("pageName", pageName);
	}
	
	public String getPageName() {
		return (String) this.getData("pageName");
	}
	
	
}
