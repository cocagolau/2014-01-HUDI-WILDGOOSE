package next.wildgoose.dto;

import java.util.List;
import java.util.Map;

import next.wildgoose.framework.Result;

public class AutocompleteResult extends Result {

	public AutocompleteResult() {
		super();
	}
	
	public List<String> getNames() {
		return (List<String>) super.getData("names");
	}
	
	public void setNames(List<String> names) {
		super.setData("names", names);
	}

}
