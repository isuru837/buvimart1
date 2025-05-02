package com.mscssd.group1.repositories;

import com.mscssd.group1.models.User;
import com.mscssd.group1.models.UserType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String userName);
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
    
    // Find only non-deleted users
    List<User> findByDeletedFalse();
    
    // Custom add user method
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.deleted = false WHERE u.userId = :id")
    void addUser(@Param("id") Long id);
    
    // Custom update user method
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.userName = :userName, u.firstName = :firstName, " +
           "u.lastName = :lastName, u.email = :email, u.mobile = :mobile, " +
           "u.addressLine1 = :addressLine1, u.addressLine2 = :addressLine2, " +
           "u.addressLine3 = :addressLine3, u.userType = :userType " +
           "WHERE u.userId = :id")
    void updateUser(@Param("id") Long id,
                   @Param("userName") String userName,
                   @Param("firstName") String firstName,
                   @Param("lastName") String lastName,
                   @Param("email") String email,
                   @Param("mobile") String mobile,
                   @Param("addressLine1") String addressLine1,
                   @Param("addressLine2") String addressLine2,
                   @Param("addressLine3") String addressLine3,
                   @Param("userType") UserType userType);
    
    // Soft delete method
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.deleted = true WHERE u.userId = :id")
    void deleteUser(@Param("id") Long id);
} 