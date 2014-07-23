package next.wildgoose.backcontroller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import next.wildgoose.dao.ArticleDAO;
import next.wildgoose.dao.FavoriteDAO;
import next.wildgoose.dao.ReporterDAO;
import next.wildgoose.dto.Article;
import next.wildgoose.dto.Reporter;
import next.wildgoose.dto.result.MeResult;
import next.wildgoose.framework.Result;
import next.wildgoose.framework.utility.Uri;
import next.wildgoose.framework.utility.Utility;
import next.wildgoose.utility.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("me")
public class MeController extends AuthController {
	private static final Logger LOGGER = LoggerFactory.getLogger(MeController.class.getName());
	
	@Autowired
	private ArticleDAO articleDao;
	@Autowired
	private FavoriteDAO favoriteDao;
	@Autowired
	private ReporterDAO reporterDao;
	
	public Result execute(HttpServletRequest request) {
		Result result = null;
		Uri uri = new Uri(request);
		String userId = uri.get(1);

		result = authenticate(request, userId);
		if (result != null) {
			return result;
		}

		int startItem = (request.getParameter("start_item") != null)? Integer.parseInt(request.getParameter("start_item")) : 0;
		int howMany = (request.getParameter("how_many") != null)? Integer.parseInt(request.getParameter("how_many")) : Constants.NUM_OF_ARTICLES;
		LOGGER.debug("startItem: " + startItem + ", howMany: " + howMany);
		
		
		if (uri.check(2, null)) {
			result = getMe(request, userId, startItem, howMany);
		}
		else if (uri.check(2, "timeline")) {
			result = getArticlesForTimeline(request, userId, startItem, howMany);
		}
		
		
		
		return result;
	}
	
	private Result getArticlesForTimeline(HttpServletRequest request, String userId, int start, int howMany) {
		MeResult meResult = new MeResult();
		
		List<Article> articles = articleDao.findArticlesByFavorite(userId, start, howMany);
		
		meResult.setStatus(200);
		meResult.setMessage("success");
		meResult.setArticles("articles", articles);
		
		LOGGER.debug("articles: " + Utility.toJsonString(articles));
		
		return meResult;
	}

	private Result getMe(HttpServletRequest request, String userId, int start, int howMany) {

		MeResult meResult = new MeResult();
		meResult.setPageName("me");
		
		List<Article> articles = articleDao.findArticlesByFavorite(userId, start, howMany);
		int totalNum = articleDao.findNumberOfArticlesByFavorite(userId);
		
		List<Reporter> reporters = favoriteDao.findFavoriteReporters(userId);
		
		List<Reporter> recommands = reporterDao.getRandomReporters(userId, 12);
		
		meResult.setStatus(200);
		meResult.setMessage("success");
		meResult.setTotalNum(totalNum);
		meResult.setArticles("articles", articles);
		meResult.setFavorites("reporters", reporters);
		meResult.setRecommands("recommands", recommands);
		return meResult;
	}
}
