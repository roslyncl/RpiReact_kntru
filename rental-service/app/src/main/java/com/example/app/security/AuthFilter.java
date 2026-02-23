package com.example.app.security;

import com.example.app.entity.User;
import com.example.app.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@Order(1)
public class AuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AuthFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    private boolean isProtectedPath(String path, String method) {
        if ("GET".equals(method) && "/api/auth/login".equals(path)) {
            return true;
        }
        if ("POST".equals(method) && path.startsWith("/api/offers/favorite/")) {
            return true;
        }
        if ("POST".equals(method) && path.matches("/api/reviews/\\d+")) {
            return true;
        }
        return false;
    }

    private void send401(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        Map<String, Object> body = new HashMap<>();
        body.put("status", 401);
        body.put("error", "Unauthorized");
        body.put("message", message);
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (!isProtectedPath(path, method)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            send401(response, "Нет токена");
            return;
        }

        String token = authHeader.substring(7);
        if (!jwtService.isValid(token)) {
            send401(response, "Недействительный токен");
            return;
        }

        Long userId = jwtService.getUserIdFromToken(token);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            send401(response, "Пользователь не найден");
            return;
        }

        request.setAttribute("currentUser", user);
        filterChain.doFilter(request, response);
    }
}
