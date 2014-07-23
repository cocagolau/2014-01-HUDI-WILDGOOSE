package next.wildgoose.backcontroller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import next.wildgoose.dao.ArticleDAO;
import next.wildgoose.dao.DummyData;
import next.wildgoose.dao.NumberOfArticlesDAO;
import next.wildgoose.dao.ReporterDAO;
import next.wildgoose.dto.Article;
import next.wildgoose.dto.NumberOfArticles;
import next.wildgoose.dto.Reporter;
import next.wildgoose.dto.StatPoints;
import next.wildgoose.dto.result.ReporterResult;
import next.wildgoose.framework.BackController;
import next.wildgoose.framework.Result;
import next.wildgoose.framework.utility.Uri;
import next.wildgoose.utility.Constants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("reporters")
public class ReporterController implements BackController {
	
	@Autowired
	private ReporterDAO reporterDao;
	@Autowired
	private ArticleDAO articleDao;
	@Autowired
	private NumberOfArticlesDAO numberOfArticlesDao;
	@Autowired
	private DummyData dummy;
	
	@Override
	public Result execute(HttpServletRequest request) {
		Result result = null;
		Uri uri = new Uri(request);
		
		// id가 필요없는 api
		if (request.getParameter("method") != null) {
			int max = Integer.parseInt(request.getParameter("max"));
			result = getRandomReporters(request, max);
			return result;
		}
		// id가 필요없는 경우가 아님에도 입력되지 않은 경우 처리
		if (uri.size() <= 1 || uri.check(1, "")) {
			result = new ReporterResult();
			result.setMessage(Constants.MSG_WENT_WRONG);
			return result;
		}
		int reporterId = Integer.parseInt(uri.get(1));
		if (uri.get(2) == null) {
			result = getReporterPage(request, reporterId);
		} else if (uri.check(2, Constants.RESOURCE_STATISTICS)) {
			result = getGraphData(request, reporterId);
		}

		return result;
	}

	private Result getRandomReporters(HttpServletRequest request, int reportersNum) {
		HttpSession session = request.getSession();
		String userId = (String) session.getAttribute("userId");
		int howmany = Math.min(reportersNum, 20);
		
		ReporterResult reporterResult = new ReporterResult();
		if (userId == null) {
			reporterResult.setStatus(401);
			reporterResult.setMessage(Constants.MSG_AUTH_NEED);
		} else {
			reporterResult.setStatus(200);
			reporterResult.setMessage("OK");
			List<Reporter> totalReporters = reporterDao.getRandomReporters(userId, howmany);
			reporterResult.setReporters(totalReporters);
		}
		
		return reporterResult;
	}
	
	private ReporterResult getGraphData(HttpServletRequest request, int reporterId) {
		
		ReporterResult reporterResult = new ReporterResult();
		
		String graph = request.getParameter("data");
		String by = request.getParameter("by");
		List<NumberOfArticles> numberOfArticlesList = null;
		
		if(Constants.RESOURCE_NOA.equals(graph)){
			if("day".equals(by)){
				reporterResult.setStatus(200);
				numberOfArticlesList = numberOfArticlesDao.findNumberOfArticlesByDay(reporterId);
				reporterResult.setNumberOfArticles(numberOfArticlesList);
			} else if ("section".equals(by)){
				reporterResult.setStatus(200);
				numberOfArticlesList = numberOfArticlesDao.findNumberOfArticlesBySection(reporterId);
				reporterResult.setNumberOfArticles(numberOfArticlesList);
			}
		} else if ("stat_points".equals(by)){
			StatPoints statPoints = dummy.getStatPoints(reporterId);
			reporterResult.setStatus(200);
			reporterResult.setStatPoints(statPoints);
		}
		return reporterResult;
	}

	private ReporterResult getReporterPage(HttpServletRequest request, int reporterId) {
		ReporterResult reporterResult = new ReporterResult();

		Reporter reporter = null;
		List<Article> articles = null;

		// DB에서 id로 검색하여 reporterCardData 가져오기
		reporter = reporterDao.findReporterById(reporterId);
		articles = articleDao.findArticlesById(reporterId);

		reporterResult.setReporter(reporter);
		reporterResult.setArticles(articles);
		reporterResult.setStatus(200);
		reporterResult.setMessage("OK");
		
		return reporterResult;
	}

}
