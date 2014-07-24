package next.wildgoose.dto.result;

import java.util.List;

import next.wildgoose.dto.Article;
import next.wildgoose.dto.Reporter;

public class MeResult extends Result{
	
	public MeResult() {
		super();
	}
	
	public List<Article> getArticles() {
		return (List<Article>) super.getData("articles");
	}
	public void setArticles(String string, List<Article> articles) {
		super.setData("articles", articles);
	}

	public List<Reporter> getFavorites() {
		return (List<Reporter>) super.getData("reporterCards");
	}
	public void setFavorites(String string, List<Reporter> reporters) {
		super.setData("reporterCards", reporters);
	}

	public List<Reporter> getRecommands() {
		return (List<Reporter>) super.getData("recommands");
	}
	
	public void setRecommands(String string, List<Reporter> recommands) {
		super.setData("recommands", recommands);
	}
		
	public int getTotalNum() {
		return (Integer) super.getData("totalNum");
	}
	
	public void setTotalNum(int totalNum) {
		super.setData("totalNum", totalNum);
	}

}
