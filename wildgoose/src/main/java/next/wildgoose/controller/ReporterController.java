package next.wildgoose.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import next.wildgoose.dao.ArticleDAO;
import next.wildgoose.dao.DummyData;
import next.wildgoose.dao.NumberOfArticlesDAO;
import next.wildgoose.dao.ReporterDAO;
import next.wildgoose.dto.Article;
import next.wildgoose.dto.NumberOfArticles;
import next.wildgoose.dto.Reporter;
import next.wildgoose.dto.StatPoints;
import next.wildgoose.framework.Controller;
import next.wildgoose.framework.model.Model;
import next.wildgoose.framework.resource.Uri;
import next.wildgoose.utility.Constants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("reporters")
public class ReporterController implements Controller {
	
	@Autowired
	private ReporterDAO reporterDao;
	
	@Autowired
	private ArticleDAO articleDao;
	
	@Autowired
	private NumberOfArticlesDAO numberOfArticlesDao;
	
	@Autowired
	private DummyData dummy;
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response, Model model) {
		Uri uri = new Uri(request);
		int reporterId = Integer.parseInt(uri.get(1));
		
		// id가 필요없는 api
		if (request.getParameter("method") != null) {
			int max = Integer.parseInt(request.getParameter("max"));

			return getRandomReporters(request, response, model,  max);
			
		}
		
		// id가 필요없는 경우가 아님에도 입력되지 않은 경우 처리
		if (uri.size() <= 1 || uri.check(1, "")) {
			model.put("status", 500);
			model.put("message", Constants.MSG_WENT_WRONG);
			
			return null;
			
		}
		
		// id만 존재하는 경우
		if (uri.get(2) == null) {
			
			return getReporterPage(request, response, model, reporterId);
			
		} else if (uri.check(2, Constants.RESOURCE_STATISTICS)) {
			
			return getGraphData(request, response, model, reporterId);
			
		}

		return null;
		
	}

	
	private String getRandomReporters(HttpServletRequest request, HttpServletResponse response, Model model, int reportersNum) {
		int status = 200;
		String message = "OK";
		HttpSession session = request.getSession();
		String userId = (String) session.getAttribute("userId");
		int howmany = Math.min(reportersNum, 20);
		List<Reporter> totalReporters = null;

		if (userId == null) {
			status = 401;
			message = Constants.MSG_AUTH_NEED;
			
			model.put("status", status);
			model.put("message", message);
			
			return null;
			
		}
		
		totalReporters = reporterDao.getRandomReporters(userId, howmany);
		
		model.put("status", status);
		model.put("message", message);
		model.put("reporters", totalReporters);
		
		return null;
		
	}
	
	private String getReporterPage(HttpServletRequest request, HttpServletResponse response, Model model, int reporterId) {
		int status = 200;
		String message = "OK";
		Reporter reporter = null;
		List<Article> articles = null;

		// DB에서 id로 검색하여 reporterCardData 가져오기
		reporter = reporterDao.findReporterById(reporterId);
		articles = articleDao.findArticlesById(reporterId);
		
		model.put("status", status);
		model.put("message", message);
		model.put("reporter", reporter);
		model.put("articles", articles);
		
		return "reporters";

	}
	
	
	private String getGraphData(HttpServletRequest request, HttpServletResponse response, Model model, int reporterId) {
		int status = 500;
		String message = "failure"; 
		String graph = request.getParameter("data");
		String by = request.getParameter("by");
		List<NumberOfArticles> numberOfArticles = null;
		StatPoints statPoints = null;
		
		if(Constants.RESOURCE_NOA.equals(graph)){
			
			if("day".equals(by)){
				status = 200;
				message = "success";
				numberOfArticles = numberOfArticlesDao.findNumberOfArticlesByDay(reporterId);
				
			} else if ("section".equals(by)){
				status = 200;
				message = "success";
				numberOfArticles = numberOfArticlesDao.findNumberOfArticlesBySection(reporterId);
			}
			
		} else if ("stat_points".equals(by)){
			status = 200;
			message = "success";
			statPoints = dummy.getStatPoints(reporterId);
			
		}
		
		model.put("status", status);
		model.put("message", message);
		model.put("numberOfArticles", numberOfArticles);
		model.put("statPoints", statPoints);
		
		return null;
		
	}

}
