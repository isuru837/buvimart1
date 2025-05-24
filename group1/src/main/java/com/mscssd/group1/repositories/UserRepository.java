package com.mscssd.group1.repositories;

import com.mscssd.group1.models.User;
import com.mscssd.group1.models.Role;

import org.springframework.data.domain.Sort;
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
    Optional<User> findByMobile(String phoneNumber);
    List<User> findAll(Sort sort);
    
    // Find user by username and password
    @Query("SELECT u FROM User u WHERE u.userName = :userName AND u.password = :password")
    Optional<User> findByUserNameAndPassword(@Param("userName") String userName, @Param("password") String password);
    
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    
    // Find only non-deleted users
    @Query("SELECT u FROM User u WHERE u.deleted = false")
    List<User> findAllActive();
    
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
           "u.addressLine3 = :addressLine3, u.role = :role " +
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
                   @Param("role") Role role);
    
    // Soft delete method
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.deleted = true WHERE u.userId = :id")
    void deleteUser(@Param("id") Long id);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.deleted = false")
    List<User> findByRole(@Param("role") Role role);
    
    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRoleIncludingDeleted(@Param("role") Role role);
    
    @Query("SELECT u FROM User u WHERE u.userName LIKE %:keyword% OR u.email LIKE %:keyword% OR u.mobile LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);
} 