package next.wildgoose.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import next.wildgoose.dao.SignDAO;
import next.wildgoose.dto.result.Result;
import next.wildgoose.dto.result.SimpleResult;
import next.wildgoose.framework.Controller;
import next.wildgoose.utility.Constants;

import org.springframework.beans.factory.annotation.Autowired;

public abstract class AuthController implements Controller {

	@Override
	public abstract Result execute(HttpServletRequest request);
	
	@Autowired
	protected SignDAO signDao;
	
	public SimpleResult authenticate(HttpServletRequest request, String userId) {
		SimpleResult sResult = null;
		if (!isValidUserId(request, userId)) {
			sResult = new SimpleResult();
			sResult.setStatus(404);
			sResult.setPageName("join");
			sResult.setMessage(Constants.MSG_WRONG_ID);
			return sResult;
		}
		
		HttpSession session = request.getSession();
		String visitor = (String) session.getAttribute("userId");
		
		if (visitor == null) {
			sResult = new SimpleResult();
			sResult.setStatus(401);
			sResult.setPageName("login");
			sResult.setMessage(Constants.MSG_AUTH_NEED);
			// 로그인 하도록 유도하기
		}
		return sResult;
	}
	private boolean isValidUserId(HttpServletRequest request, String userId) {
		if (signDao.findEmail(userId)) {
			return true;
		}
		return false;
	}

}
