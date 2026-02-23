package com.example.app.controller;

import com.example.app.dto.CheckAuthResponse;
import com.example.app.dto.LoginRequest;
import com.example.app.dto.LoginResponse;
import com.example.app.dto.UserRegistrationRequest;
import com.example.app.entity.User;
import com.example.app.service.UserService;
import com.example.app.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @GetMapping("/login")
    public CheckAuthResponse checkAuth(@RequestAttribute("currentUser") User user) {
        String token = jwtService.createToken(user.getId());
        return CheckAuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .isPro(user.getUserType() == com.example.app.entity.UserType.pro)
                .token(token)
                .build();
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public User register(
            @RequestPart("username") String username,
            @RequestPart("email") String email,
            @RequestPart("password") String password,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername(username);
        request.setEmail(email);
        request.setPassword(password);

        String avatarPath = null;

        if (avatar != null && !avatar.isEmpty()) {
            try {
                Path uploadDir = Path.of("uploads", "avatars");
                Files.createDirectories(uploadDir);

                String ext = "";
                String originalName = avatar.getOriginalFilename();
                if (originalName != null && originalName.contains(".")) {
                    ext = originalName.substring(originalName.lastIndexOf('.'));
                }

                String fileName = UUID.randomUUID() + ext;
                Path target = uploadDir.resolve(fileName);
                Files.copy(avatar.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

                avatarPath = "/uploads/avatars/" + fileName;
            } catch (IOException e) {
                throw new IllegalStateException("Не удалось сохранить аватар", e);
            }
        }

        return userService.register(request, avatarPath);
    }
}

