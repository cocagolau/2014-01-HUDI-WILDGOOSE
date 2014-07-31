package next.wildgoose.framework.model;

import java.util.HashMap;
import java.util.Map;

public class Model {
	
	private Map<String, Object> model;

	public Model() {
		this.model = new HashMap<String, Object>();
	}
	
	
	public Model(Map<String, Object> model) {
		this.model = model;
	}


	public void put (String key, Object value) {
		this.model.put(key, value);
	}
	
	public Object remove(String key) {
		return this.model.remove(key);
	}

	public Map<String, Object> getModel() {
		return this.model;
	}

	public void setModel(Map<String, Object> model) {
		this.model = model;
	}
	
	
	
	
	
}
