package next.wildgoose.controller;

import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import next.wildgoose.dao.SignDAO;
import next.wildgoose.dto.result.AccountResult;
import next.wildgoose.dto.result.Result;
import next.wildgoose.dto.result.SimpleResult;
import next.wildgoose.framework.Controller;
import next.wildgoose.framework.security.RandomNumber;
import next.wildgoose.framework.security.SHA256;
import next.wildgoose.framework.utility.Uri;
import next.wildgoose.utility.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("session")
public class SessionController implements Controller {
	private static final Logger LOGGER = LoggerFactory.getLogger(SessionController.class.getName());
	
	@Autowired
	private SignDAO signDao;
	
	@Override
	public Result execute(HttpServletRequest request) {
		Result result = null;
		Uri uri = new Uri(request);
		String method = request.getMethod();
		
		if (uri.check(1, null)) {
			if ("POST".equals(method)) {
				result = login(request);
			} else if ("DELETE".equals(method)) {
				result = logout(request);
			} else if ("GET".equals(method)) {
				String email = request.getParameter("email");
				result = joinedEmail(request, email);
			}
		} else if (uri.check(1, "rand")) {
			result = getRanomNumber(request);
		}
		
		return result;
	}
	private AccountResult getRanomNumber(HttpServletRequest request) {
		AccountResult accountResult = new AccountResult();
		String randNum = RandomNumber.set(request.getSession());
		accountResult.setRand(randNum);
		LOGGER.debug("issue a randNum: " + randNum);
		
		accountResult.setStatus(200);
		accountResult.setMessage("OK");
		return accountResult; 
	}
	
	private AccountResult joinedEmail(HttpServletRequest request, String email) {
		AccountResult accountResult = new AccountResult();
		
		if(isJoinable(signDao, email)){
			accountResult.setStatus(500);
			accountResult.setMessage(Constants.MSG_EXIST_ID);
		} else {
			accountResult.setStatus(200);
			accountResult.setMessage("OK");
		}
		accountResult.setEmail(email);

		return accountResult;
	}
	
	private boolean isJoinable(SignDAO signDao, String email) {
		if (isValidEmail(email)) {
			return !signDao.findEmail(email);
		}
		return false;
	}
	
	private boolean isValidEmail(String email) {
		String regex = "^[\\w\\.-_\\+]+@[\\w-]+(\\.\\w{2,4})+$";

		return isFilled(email) && Pattern.matches(regex, email);
	}
	
	private boolean isFilled(String data) {
		
		if (data != null && data.length() > 0) {
			return true;
		}
		
		return false;
		
	}
	
	private SimpleResult login(HttpServletRequest request) {
		HttpSession session = request.getSession();
		
		String email = request.getParameter("email");
		String hashedPassword = request.getParameter("password");
		String randNum = RandomNumber.get(session);
		LOGGER.debug ("check randNum: " + randNum);

		SimpleResult simpleResult = new SimpleResult();
		LOGGER.debug("email: " + email + ", passw: " + hashedPassword);
		LOGGER.debug(randNum);
		
		String accountPw = signDao.findAccount(email);
		if (accountPw == null) {
			simpleResult.setMessage(Constants.MSG_WRONG_ID);
			return simpleResult;
		}
		// H(db_password+random)
		if(SHA256.testSHA256(accountPw + randNum).equals(hashedPassword)){
			
			simpleResult.setStatus(200);
			simpleResult.setMessage("OK");
			simpleResult.setData("userId", email);
			session.setAttribute("userId", email);
			session.setMaxInactiveInterval(Constants.SESSION_EXPIRING_TIME);

		} else {
			simpleResult.setMessage(Constants.MSG_WRONG_PW);
		}
		return simpleResult;
	}

	private SimpleResult logout(HttpServletRequest request) {
		HttpSession session = request.getSession();
		session.removeAttribute("userId");
		
		SimpleResult simpleResult = new SimpleResult();
		simpleResult.setStatus(200);
	    simpleResult.setMessage("OK");
		return simpleResult;
	}
}
