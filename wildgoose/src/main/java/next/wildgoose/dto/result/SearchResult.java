package next.wildgoose.dto.result;

import java.util.List;

import next.wildgoose.dto.Reporter;

public class SearchResult extends Result {
	
	public SearchResult() {
		super();
	}

	public List<Reporter> getReporters() {
		return (List<Reporter>) super.getData("reporters");
	}

	public void setReporters(List<Reporter> reporters) {
		super.setData("reporters", reporters);
	}

	public String getSearchQuery() {
		return (String) super.getData("searchQuery");

	}
	public void setSearchQuery(String searchQuery) {
		super.setData("searchQuery", searchQuery);
	}
	
	public Boolean getHasMore() {
		return (Boolean) super.getData("hasMore");

	}
	public void setHasMore(boolean hasMore) {
		super.setData("hasMore", hasMore);
	}
	
	public int getTotalNum() {
		return (Integer) super.getData("totalNum");
	}
	
	public void setTotalNum(int totalNum) {
		super.setData("totalNum", totalNum);
	}
	
}
