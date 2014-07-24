package next.wildgoose.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import next.wildgoose.dao.FavoriteDAO;
import next.wildgoose.dto.Reporter;
import next.wildgoose.dto.result.FavoriteResult;
import next.wildgoose.dto.result.Result;
import next.wildgoose.dto.result.SimpleResult;
import next.wildgoose.framework.utility.Uri;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("users")
public class UserController extends AuthController {
	private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class.getName());
	
	@Autowired
	private FavoriteDAO favoriteDao;
	
	@Override
	public Result execute(HttpServletRequest request) {
		Result result = null;
		Uri uri = new Uri(request);
		String userId = uri.get(1);
		String pageName = uri.get(2);
		String method = request.getMethod();
		LOGGER.debug(uri.toString());
		
		result = authenticate(request, userId);
		if (result != null) {
			return result;
		}
		 
		if ("favorites".equals(pageName)) {
			if ("GET".equals(method)) {
				if (uri.check(3, null)) {
					result = getFavorites(request, userId);
				} else {
					int reporterId = Integer.parseInt(uri.get(3));
					result = isFavorite(request, userId, reporterId);
				}
			} else if ("POST".equals(method)) {
				result = modifyFavorites("add", request, userId);
			} else if ("DELETE".equals(method)) {
				result = modifyFavorites("remove", request, userId);
			}
		}
		result.setPageName("me");
		return result;
	}
	
	private Result isFavorite(HttpServletRequest request, String userId,
			int reporterId) {
		SimpleResult result = new SimpleResult(true);
		result.setData("bool", favoriteDao.isFavorite(userId, reporterId));
		return result;
	}
	
	private Result getFavorites(HttpServletRequest request, String userId) {
		List<Reporter> reporters = favoriteDao.findFavoriteReporters(userId);
		
		FavoriteResult favoriteResult = new FavoriteResult();
		favoriteResult.setStatus(200);
		favoriteResult.setMessage("OK");
		LOGGER.debug(""+reporters.size());
		favoriteResult.setFavorites(reporters);
		return favoriteResult;
	}
	
	private SimpleResult modifyFavorites(String how, HttpServletRequest request, String userId) {
		boolean success = false;
		
		int reporterId = Integer.parseInt(request.getParameter("reporter_id"));
		
		if ("add".equals(how) && favoriteDao.addFavorite(reporterId, userId)) {
			success = true;
		} else if ("remove".equals(how) && favoriteDao.removeFavorite(reporterId, userId)) {
			success = true;
		}
		return new SimpleResult(success);
	}
}
