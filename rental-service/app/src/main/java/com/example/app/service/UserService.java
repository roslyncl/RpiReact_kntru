package com.example.app.service;

import com.example.app.dto.LoginRequest;
import com.example.app.dto.LoginResponse;
import com.example.app.dto.UserRegistrationRequest;
import com.example.app.entity.User;
import com.example.app.entity.UserType;
import com.example.app.exception.UnauthorizedException;
import com.example.app.repository.UserRepository;
import com.example.app.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Transactional
    public User register(UserRegistrationRequest request, String avatarPath) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Пользователь с таким email уже существует");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : ""));
        user.setUserType(UserType.normal);
        user.setAvatar(avatarPath);

        return userRepository.save(user);
    }

    @Transactional
    public User register(UserRegistrationRequest request) {
        return register(request, null);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Пользователь не найден"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Неверный пароль");
        }

        String token = jwtService.createToken(user.getId());
        return new LoginResponse(token);
    }
}

