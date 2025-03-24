package com.project.backend.Util;

import java.util.Date;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.project.backend.Entity.InvalidTokens;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;



@Component
public class JwtUtil {

	private final Firestore db;
	
	@Autowired
    public JwtUtil(Firestore db) {
        this.db = db;
    }
	private static final String SECRET_KEY="very_long_secret_key_@_backend";
//	private static final int TOKEN_VALIDITY = 3600*5; //5 hours
	
	public String generateToken(String uid)
	{
		return Jwts.builder()
				.setSubject(uid)
				.setIssuedAt(new Date())
//				.setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
	}
	
	public Claims extractClaims(String token) {
	    if (token == null || token.trim().isEmpty()) {
	        throw new IllegalArgumentException("JWT token is empty or null.");
	    }
	    
	    return Jwts.parser()
	            .setSigningKey(SECRET_KEY)
	            .parseClaimsJws(token)
	            .getBody();
	}


    public String extractUserId(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String userId) {
        return extractUserId(token).equals(userId) && !isTokenExpired(token) && !isTokenBlacklisted(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
    
    // Store invalid token in Fire store
    public void invalidateToken(String token) {
        Date expiry = extractClaims(token).getExpiration();
        InvalidTokens invalidToken=new InvalidTokens();
        invalidToken.setTokenId(token);
        invalidToken.setExpiry(expiry);
        DocumentReference docRef = db.collection("invalid_tokens").document(token);
        docRef.set(invalidToken);
    }
    
    // Check if token is blacklisted
    private boolean isTokenBlacklisted(String token) {
        try {
            DocumentSnapshot document = db.collection("invalid_tokens").document(token).get().get();
            return document.exists();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    @Scheduled(cron = "0 0 * * * ?") // Runs every hour
    public void cleanupExpiredTokens() {
        try {
            CollectionReference collection = db.collection("invalid_tokens");
            ApiFuture<QuerySnapshot> querySnapshot = collection.get();

            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                Date expiry = document.getDate("expiry");
                if (expiry==null) {
                    document.getReference().delete();
                }
            }
            System.out.println("Expired tokens cleaned up.");
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }
}
