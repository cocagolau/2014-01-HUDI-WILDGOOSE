package next.wildgoose.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.dao.FavoriteDAO;
import next.wildgoose.dto.Reporter;
import next.wildgoose.framework.utility.Uri;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("users")
public class UserController extends AuthController {
	
	@Autowired
	private FavoriteDAO favoriteDao;
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		Uri uri = new Uri(request);
		
		String userId = uri.get(1);
		String pageName = uri.get(2);
		String method = request.getMethod();
		
		String view;
		
		view = authenticate(request, response, model, userId);

		if (view != null) {
			
			return view;
			
		}
		
		
		model.put("pageName", "me");
		if ("favorites".equals(pageName)) {
			
			if ("GET".equals(method)) {
				
				if (uri.check(3, null)) {

					return getFavorites(request, response, model, userId);
					
				} else {
					int reporterId = Integer.parseInt(uri.get(3));

					return isFavorite(request, response, model, userId, reporterId);
					
				}
				
			} else if ("POST".equals(method)) {

				return modifyFavorites(request, response, model, "add", userId);
				
			} else if ("DELETE".equals(method)) {

				return modifyFavorites(request, response, model, "remove", userId);
				
			}
			
		}
		
		return "me";
		
	}
	
	private String getFavorites(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String userId) {
		int status = 200;
		String message = "OK";
		List<Reporter> reporters = favoriteDao.findFavoriteReporters(userId);
		
		model.put("status", status);
		model.put("message", message);
		model.put("reporterCards", reporters);
		
		return null;
		
	}
	

	private String isFavorite(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String userId, int reporterId) {
		int status = 200;
		String message = "success";
		
		model.put("status", status);
		model.put("message", message);
		model.put("bool", favoriteDao.isFavorite(userId, reporterId));
		
		return null;
		
	}
	

	private String modifyFavorites(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String how, String userId) {
		int status = 500;
		String message = "failure";
		int reporterId = Integer.parseInt(request.getParameter("reporter_id"));
		
		if ("add".equals(how) && favoriteDao.addFavorite(reporterId, userId)) {
			status = 200;
			message = "success";
			
		} else if ("remove".equals(how) && favoriteDao.removeFavorite(reporterId, userId)) {
			status = 200;
			message = "success";
			
		}
		
		model.put("status", status);
		model.put("message", message);
		
		return null;
		
	}
}
