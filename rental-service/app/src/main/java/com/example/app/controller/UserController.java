package com.example.app.controller;

import com.example.app.dto.UserRegistrationRequest;
import com.example.app.entity.User;
import com.example.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

