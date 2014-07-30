package next.wildgoose.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.dao.ArticleDAO;
import next.wildgoose.dao.FavoriteDAO;
import next.wildgoose.dao.ReporterDAO;
import next.wildgoose.dto.Article;
import next.wildgoose.dto.Reporter;
import next.wildgoose.framework.utility.Uri;
import next.wildgoose.utility.Constants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("me")
public class MeController extends AuthController {
	
	@Autowired
	private ArticleDAO articleDao;
	
	@Autowired
	private FavoriteDAO favoriteDao;
	
	@Autowired
	private ReporterDAO reporterDao;
	
	public String execute(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		Uri uri = new Uri(request);
		int status = 500;
		String message = "failure";
		String userId = uri.get(1);
		String view = null;
		
		view = authenticate(request, response, model, userId);
		if (view != null) {
			
			return view;
			
		}

		int startItem = (request.getParameter("start_item") != null)? Integer.parseInt(request.getParameter("start_item")) : 0;
		int howMany = (request.getParameter("how_many") != null)? Integer.parseInt(request.getParameter("how_many")) : Constants.NUM_OF_ARTICLES;
		
		if (uri.check(2, null)) {
			int totalNum = articleDao.findNumberOfArticlesByFavorite(userId);
			List<Article> articles = articleDao.findArticlesByFavorite(userId, startItem, howMany);
			List<Reporter> reporters = favoriteDao.findFavoriteReporters(userId);
			List<Reporter> recommands = reporterDao.getRandomReporters(userId, 12);
			
			status = 200;
			message = "success";
			
			model.put("status", status);
			model.put("message", message);
			model.put("totalNum",totalNum);
			model.put("articles", articles);
			model.put("favorites", reporters);
			model.put("recommands", recommands);
			model.put("pageName", "me");
			
			return "me";
			
		} else if (uri.check(2, "timeline")) {
			status = 200;
			message = "success";
			List<Article> articles = articleDao.findArticlesByFavorite(userId, startItem, howMany);

			model.put("status", status);
			model.put("message", message);
			model.put("articles", articles);

			return null;
			
		}
		
		return "me";
		
	}

}
