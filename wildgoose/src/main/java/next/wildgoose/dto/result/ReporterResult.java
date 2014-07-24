package next.wildgoose.dto.result;

import java.util.List;

import next.wildgoose.dto.Article;
import next.wildgoose.dto.NumberOfArticles;
import next.wildgoose.dto.Reporter;
import next.wildgoose.dto.StatPoints;

public class ReporterResult extends Result {

	public ReporterResult() {
		super();
	}

	public List<Article> getArticles() {
		return (List<Article>) super.getData("articles");
	}

	public void setArticles(List<Article> articles) {
		super.setData("articles", articles);
	}

	public Reporter getReporter() {
		return (Reporter) super.getData("reporter");
	}

	public void setReporter(Reporter reporter) {
		super.setData("reporter", reporter);
	}

	public List<NumberOfArticles> getNumberOfArticles() {
		return (List<NumberOfArticles>) super.getData("numberOfArticles");
	}

	public void setNumberOfArticles(List<NumberOfArticles> numberOfArticles) {
		super.setData("numberOfArticles", numberOfArticles);
	}

	public void setStatPoints(StatPoints statPoints) {
		super.setData("statPoints", statPoints);
	}
	
	public StatPoints getStatPoints() {
		return (StatPoints) super.getData("statPoints");
	}

	public void setReporters(List<Reporter> totalReporters) {
		super.setData("reporters", totalReporters);
		
	}
	public List<Reporter> getReporters() {
		return (List<Reporter>) super.getData("reporters");
	}

}
