package com.hms.user_service.service;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(SecretKey signingKey,
                      @Value("${jwt.expiration-ms}") long expirationMs) {
        this.signingKey = signingKey;
        this.expirationMs = expirationMs;
    }

    public String generateToken(String subjectEmail) {
        long now = System.currentTimeMillis();

        return Jwts.builder()
                .setSubject(subjectEmail)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationMs))
                .signWith(signingKey)
                .compact();
    }
}