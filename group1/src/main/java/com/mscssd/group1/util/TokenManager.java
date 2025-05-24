package com.mscssd.group1.util;

import com.mscssd.group1.exceptions.TokenExpiredException;
import com.mscssd.group1.models.RefreshToken;
import com.mscssd.group1.models.Token;
import com.mscssd.group1.models.User;
import com.mscssd.group1.repositories.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Component
public class TokenManager {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Value("${jwt.refresh.expiration}")
    private Long refreshExpiration;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Token generateNewToken(String username, String role, String userId) {
        String jwToken = generateToken(username, jwtExpiration, role, userId);
        String refreshToken = generateToken(username, refreshExpiration, role, userId);
        return new Token(jwToken, refreshToken);
    }

    private String generateToken(String username, Long expiration, String role, String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        return createToken(claims, username, expiration);
    }

    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims verifyToken(String token) {
        System.out.println("Token is : "+token);
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            // Check if token is expired
            if (claims.getExpiration().before(new Date())) {
                throw new TokenExpiredException("Access token is expired");
            }
            
            return claims;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            if (e instanceof TokenExpiredException) {
                throw (TokenExpiredException) e;
            }
            throw new RuntimeException("Invalid token");
        }
    }

    public void invalidateToken(String token) {
        if (token != null && !token.isEmpty()) {
            refreshTokenRepository.findByToken(token).ifPresent(refreshToken -> {
                refreshToken.setRevoked(true);
                refreshTokenRepository.save(refreshToken);
            });
        }
    }

    public void saveRefreshToken(String token, User user) {
        // Check if user already has a refresh token
        Optional<RefreshToken> existingToken = refreshTokenRepository.findByUser(user);
        
        if (existingToken.isPresent()) {
            // Update existing token
            RefreshToken currentToken = existingToken.get();
            currentToken.setToken(token);
            currentToken.setExpiryDate(Instant.now().plus(refreshExpiration, ChronoUnit.MILLIS));
            currentToken.setRevoked(false);
            refreshTokenRepository.save(currentToken);
        } else {
            // Create new token
            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setToken(token);
            refreshToken.setUser(user);
            refreshToken.setExpiryDate(Instant.now().plus(refreshExpiration, ChronoUnit.MILLIS));
            refreshToken.setRevoked(false);
            refreshTokenRepository.save(refreshToken);
        }
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().toString());
        claims.put("userId", user.getUserId());
        return createToken(claims, user.getUserName());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, User user) {
        final String username = extractUsername(token);
        return (username.equals(user.getUserName()) && !isTokenExpired(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", String.class));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
} 