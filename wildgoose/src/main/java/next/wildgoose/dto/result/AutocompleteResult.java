package next.wildgoose.dto.result;

import java.util.List;

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
