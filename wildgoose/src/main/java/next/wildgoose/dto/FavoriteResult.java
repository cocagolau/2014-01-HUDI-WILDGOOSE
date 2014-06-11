package next.wildgoose.dto;

import java.util.List;

import next.wildgoose.framework.Result;

public class FavoriteResult extends Result {

	public FavoriteResult() {
		super(null);
		// TODO Auto-generated constructor stub
	}

	public FavoriteResult(String pageName) {
		super(pageName);
	}

	public List<Reporter> getFavorites() {
		return (List<Reporter>) super.getData("reporterCards");
	}
	public void setFavorites(String string, List<Reporter> reporters) {
		super.setData("reporterCards", reporters);
	}

}
