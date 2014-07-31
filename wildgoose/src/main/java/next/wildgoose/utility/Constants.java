package next.wildgoose.utility;

public class Constants {
	public static final String DEFAULT_RESOURCE = "search";
	public static final String[] RESOURCES = { "accounts", "error", "me", "reporters", "search", "session", "templates", "users" };
	
	public static final String DEFAULT_REDIRECT_PREFIX = "redirect:";
	public static final String DEFAULT_API_PREFIX = "api";
	
	public static final String HEADER_CON_TYPE_JSON = "application/json; charset=UTF-8";
	public static final String CHAR_ENCODING = "UTF-8";

	public static final String PAGE_ERROR = "error.jsp";
	public static final String PAGE_SEARCH = "search.jsp";
	public static final String PAGE_REPORTERS = "reporters.jsp";
	public static final String PAGE_ME = "me.jsp";
	
	public static final String RESOURCE_ROOT = "/";
	public static final String RESOURCE_STATISTICS = "statistics";
	public static final String RESOURCE_NOA = "number_of_articles";
	
	public static final String MSG_WENT_WRONG = "존재하지 않는 주소입니다";
	public static final String MSG_ERROR = "예상치 못한 문제 발생";
	
	public static final String MSG_AUTH_NEED = "로그인이 필요합니다";
	public static final String MSG_WRONG_ID = "존재하지 않는 유저입니다";
	public static final String MSG_EXIST_ID = "이미 가입된 아이디입니다";
	public static final String MSG_WRONG_PW = "비밀번호가 틀렸습니다";
	public static final String MSG_WRONG_QUERY = "검색할 수 없는 입력입니다";
	
	
	public static final String ERROR_404 = "존재하지 않는 주소입니다";
	public static final String ERROR_401 = "로그인이 필요합니다";
	public static final String ERROR_500 = "예상치 못한 문제가 발생했습니다";
	
	public static final int NUM_OF_CARDS = 24;
	public static final int NUM_OF_ARTICLES = 10;
	public static final int SESSION_EXPIRING_TIME = 3 * 24 * 60 * 60;
	
}
