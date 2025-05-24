package com.mscssd.group1.repositories;

import com.mscssd.group1.models.RefreshToken;
import com.mscssd.group1.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    
    @Modifying
    int deleteByUser(User user);
    
    Optional<RefreshToken> findByUser(User user);
    
    Optional<RefreshToken> findByUserAndRevokedFalse(User user);
    
    Optional<RefreshToken> findByUserAndRevokedTrue(User user);
} 