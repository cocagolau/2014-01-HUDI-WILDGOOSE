package next.wildgoose.framework.model.status;

public class JsonStatus implements Status{
	
	private int state;
	private String message;

	public void setState(int state) {
		
		this.state = state;
	}
	
	public void setMessage(String message) {
		
		this.message = message;
	}

	public int getState() {
		
		return state;
	}

	public String getMessage() {
		
		return message;
	}
	
}
