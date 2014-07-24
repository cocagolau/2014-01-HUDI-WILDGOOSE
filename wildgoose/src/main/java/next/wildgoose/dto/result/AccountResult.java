package next.wildgoose.dto.result;


public class AccountResult extends Result{
	
	public AccountResult() {
		super();
	}
	
	public String getEmail() {
		return (String)super.getData("email");
	}
	
	public void setEmail(String email) {
		super.setData("email", email);
	}
	
	public String getRand() {
		return (String) super.getData("rand");
	}
	
	public void setRand(String rand) {
		super.setData("rand", rand);
	}

}
