package next.wildgoose.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import next.wildgoose.dto.NumberOfArticles;
import next.wildgoose.framework.dao.template.JdbcTemplate;
import next.wildgoose.framework.dao.template.PreparedStatementSetter;
import next.wildgoose.framework.dao.template.RowMapper;

@Component
public class NumberOfArticlesDAO {
	
	@Autowired
	private JdbcTemplate t;
	
	public List<NumberOfArticles> findNumberOfArticlesByDay(int reporterId) {
		return findNumberOfArticlesByCondition("day", reporterId);
	}
	
	public List<NumberOfArticles> findNumberOfArticlesBySection (int reporterId) {
		return findNumberOfArticlesByCondition("section", reporterId);
	}
	
	private List<NumberOfArticles> findNumberOfArticlesByCondition (String condition, final int reporterId) {
		StringBuilder query = null;
		RowMapper rm = null;
		
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setInt(1, reporterId);
			}
			
		};
		
		query = getSuitableQueryForCondition(condition);
		rm = getSuitableRowMapperForCondition(condition);
		
		return (List<NumberOfArticles>) t.execute(query.toString(), pss, rm);
	}
	
	
	private StringBuilder getSuitableQueryForCondition (String condition) {
		StringBuilder query = new StringBuilder();
		
		if ("day".equals(condition)) {
			query.append("select date_format(datetime, '%m/%d') as date, count(URL) as count from article ");
			query.append("WHERE URL in (Select article_URL as url from article_author where author_id = ?) ");
			query.append("and DATEDIFF(now(), article.datetime) < 7 ");
			query.append("group by date_format(datetime, '%m/%d');");
			
		} else if ("section".equals(condition)) {
			query.append("SELECT distinct sec.name, count(section_id) FROM article ");
			query.append("JOIN (SELECT author_id, article_URL FROM article_author as aa WHERE aa.author_id = ?) as result ");
			query.append("ON URL = result.article_URL ");
			query.append("JOIN section as sec ON section_id = sec.id ");
			query.append("GROUP BY section_id ORDER BY section_id LIMIT 5;");
		}
		
		return query;
	}

	private RowMapper getSuitableRowMapperForCondition (String condition) {
		RowMapper rm = null;
		
		if ("day".equals(condition)) {
			rm = new RowMapper() {

				@Override
				public Object mapRow(ResultSet rs) throws SQLException {
					List<NumberOfArticles> result = new ArrayList<NumberOfArticles>();
					NumberOfArticles numOfArticle = null;
					while (rs.next()) {
						numOfArticle = new NumberOfArticles();
						numOfArticle.setCount(rs.getInt("count"));
						numOfArticle.setDate(rs.getString("date"));
						result.add(numOfArticle);
					}
					return result;
				}
				
			};
		} else if ("section".equals(condition)) {
			rm = new RowMapper() {

				@Override
				public Object mapRow(ResultSet rs) throws SQLException {
					List<NumberOfArticles> result = new ArrayList<NumberOfArticles>();
					NumberOfArticles numOfArticle = null;
					while (rs.next()) {
						numOfArticle = new NumberOfArticles();
						numOfArticle.setLabel(rs.getString(1));
						numOfArticle.setValue(rs.getInt(2));
						result.add(numOfArticle);
					}
					return result;
				}
				
			};
		}
		
		return rm;
	}
}
