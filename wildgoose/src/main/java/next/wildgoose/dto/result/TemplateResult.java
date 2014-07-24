package next.wildgoose.dto.result;


public class TemplateResult extends Result {
	public TemplateResult() {
		super();
	}

	public String getTemplate() {
		return (String) super.getData("template");
	}

	public void setTemplate(String templateString) {
		super.setData("template", templateString);
	}
	
	public String getRand() {
		return (String) super.getData("rand");
	}
	
	public void setRand(String rand) {
		super.setData("rand", rand);
	}
}
