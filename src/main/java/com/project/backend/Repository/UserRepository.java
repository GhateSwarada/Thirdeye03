//package com.project.backend.Repository;
//
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.project.backend.Entity.User;
//
//public interface UserRepository extends JpaRepository<User, String>{
//	
//	Optional<User> findByUsernameAndPassword(String username, String password);
//	Optional<User> findByUsername(String username);
//	boolean existsByUsername(String username);
//}
