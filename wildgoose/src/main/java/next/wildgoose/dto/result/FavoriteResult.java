package next.wildgoose.dto.result;

import java.util.List;

import next.wildgoose.dto.Reporter;

public class FavoriteResult extends Result {

	public FavoriteResult() {
		super();
		// TODO Auto-generated constructor stub
	}

	public List<Reporter> getFavorites() {
		return (List<Reporter>) super.getData("reporterCards");
	}
	public void setFavorites(List<Reporter> reporters) {
		super.setData("reporterCards", reporters);
	}

}
