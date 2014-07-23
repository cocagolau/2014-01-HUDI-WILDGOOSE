package next.wildgoose.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import next.wildgoose.dto.Article;
import next.wildgoose.framework.dao.template.JdbcTemplate;
import next.wildgoose.framework.dao.template.PreparedStatementSetter;
import next.wildgoose.framework.dao.template.RowMapper;

import org.springframework.stereotype.Component;

@Component
public class ArticleDAO {
	static RowMapper articlesRm = new RowMapper() {

		@Override
		public Object mapRow(ResultSet rs) throws SQLException {
			List<Article> articles = new ArrayList<Article>();
			Article article = null;
			while (rs.next()) {
				article = new Article();
				article.setUrl(rs.getString("URL"));
				article.setTitle(rs.getString("title"));
				article.setAuthorId(rs.getInt("id"));
				article.setName(rs.getString("name"));
				article.setContent(rs.getString("content"));
				article.setDatetime(rs.getTimestamp("datetime").toString());
				articles.add(article);
			}
			return articles;
		}
		
	};
	
	public List<Article> findArticlesById(final int reporterId) {
		JdbcTemplate t = new JdbcTemplate();
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setInt(1, reporterId);
			}
			
		};
		
		RowMapper rm = new RowMapper() {

			@Override
			public Object mapRow(ResultSet rs) throws SQLException {
				List<Article> articles = new ArrayList<Article>();
				Article article = null;
				while (rs.next()) {
					article = new Article();
					article.setUrl(rs.getString("url"));
					article.setTitle(rs.getString("title"));
					article.setSectionId(rs.getInt("section"));
					article.setContent(rs.getString("content"));
					article.setDatetime(rs.getTimestamp("datetime").toString());
					articles.add(article);
				}
				return articles;
			}
			
		};
		
		StringBuilder query = new StringBuilder();
		query.append("SELECT article.URL as url, article.title as title, ");
		query.append("article.section_id as section, article.content as content, article.datetime as datetime ");
		query.append("FROM article_author JOIN article ON article.URL = article_author.article_URL ");
		query.append("WHERE article_author.author_id = ? ORDER BY datetime DESC limit 5;");
		
		return (List<Article>) t.execute(query.toString(), pss, rm);
	}
	
	public List<Article> findArticlesByFavorite(final String email) {
		JdbcTemplate t = new JdbcTemplate();
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setString(1, email);
			}
			
		};
		
		StringBuilder query = new StringBuilder();
		query.append("SELECT author.name, author.id, favorite.* from author JOIN ");
		query.append("(SELECT * FROM article JOIN article_author ON article_author.article_URL = article.URL ");
		query.append("WHERE article_author.author_id IN ");
		query.append("(SELECT author_id FROM favorite WHERE user_email = ?) ");
		query.append("ORDER BY article.datetime desc limit 24) AS favorite ON author.id = favorite.author_id;");
		
		return (List<Article>) t.execute(query.toString(), pss, articlesRm);
	}

	public List<Article> findArticlesByFavorite(final String email, final int start, final int howMany) {
		JdbcTemplate t = new JdbcTemplate();
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setString(1, email);
				psmt.setInt(2, start);
				psmt.setInt(3, howMany);
			}
			
		};
		
		StringBuilder query = new StringBuilder();
		query.append("SELECT author.name, author.id, favorite.* from author JOIN ");
		query.append("(SELECT * FROM article JOIN article_author ON article_author.article_URL = article.URL ");
		query.append("WHERE article_author.author_id IN ");
		query.append("(SELECT author_id FROM favorite WHERE user_email = ?) ");
		query.append("ORDER BY article.datetime desc limit ?,?) AS favorite ON author.id = favorite.author_id;");
		
		return (List<Article>) t.execute(query.toString(), pss, articlesRm);
	}
	
	public int findNumberOfArticlesByFavorite(final String email) {
		JdbcTemplate t = new JdbcTemplate();
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setString(1, email);
			}
			
		};
		
		RowMapper rm = new RowMapper() {

			@Override
			public Object mapRow(ResultSet rs) throws SQLException {
				int result = 0;
				if (rs.first()) {
					result = rs.getInt("count");
				}
				return result;
			}
			
		};
		
		StringBuilder query = new StringBuilder();
		query.append("SELECT COUNT(*) AS count from author JOIN ");
		query.append("(SELECT * FROM article JOIN article_author ON article_author.article_URL = article.URL ");
		query.append("WHERE article_author.author_id IN ");
		query.append("(SELECT author_id FROM favorite WHERE user_email = ?)) AS favorite ");
		query.append("ON author.id = favorite.author_id;");
		
		return (Integer) t.execute(query.toString(), pss, rm);
	}
	
}
