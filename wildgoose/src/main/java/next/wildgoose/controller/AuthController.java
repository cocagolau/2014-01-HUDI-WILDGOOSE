package next.wildgoose.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import next.wildgoose.dao.SignDAO;
import next.wildgoose.framework.Controller;
import next.wildgoose.utility.Constants;

import org.springframework.beans.factory.annotation.Autowired;

public abstract class AuthController implements Controller {

	@Autowired
	protected SignDAO signDao;
	
	public String authenticate(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String userId) {
		int status = 500;
		String message = "failure";
		String pageName = null;
		
		if (!isValidUserId(request, userId)) {
			status = 404;
			message = Constants.MSG_WRONG_ID;
			pageName = "join";

			model.put("status", status);
			model.put("message", message);
			model.put("pageName", pageName);
			
			return "error";
			
		}
		
		HttpSession session = request.getSession();
		String visitor = (String) session.getAttribute("userId");
		
		// 로그인 하도록 유도하기
		if (visitor == null) {
			status = 401;
			message = Constants.MSG_AUTH_NEED;
			pageName = "login";
			
			model.put("status", status);
			model.put("message", message);
			model.put("pageName", pageName);
			
			return "error";
			
		}

		return null;
		
	}
	
	private boolean isValidUserId(HttpServletRequest request, String userId) {
		if (signDao.findEmail(userId)) {
			return true;
		}
		return false;
	}

}
