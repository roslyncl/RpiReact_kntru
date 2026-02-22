package com.example.app.service;

import com.example.app.dto.UserRegistrationRequest;
import com.example.app.entity.User;
import com.example.app.entity.UserType;
import com.example.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User register(UserRegistrationRequest request, String avatarPath) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Пользователь с таким email уже существует");
        }

        var passwordEncoder = new BCryptPasswordEncoder();

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(UserType.normal);
        user.setAvatar(avatarPath);

        return userRepository.save(user);
    }

    @Transactional
    public User register(UserRegistrationRequest request) {
        return register(request, null);
    }
}

