package ro.tuc.ds2020.controllers;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.services.AuthService;
import ro.tuc.ds2020.services.PersonService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PersonService userService;

    private static final String SECRET_KEY = "f7a26d7c2be2d7eada68f44004b1706608ec5bbebdecb7d5f95f61ec34b3de4b";

    // Custom class for login request
    public static class AuthRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // Login handler
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequest request) {
        boolean success = authService.login(request.getUsername(), request.getPassword());

        if (success) {
            String role = authService.getRole(request.getUsername());
            UUID id = authService.getId(request.getUsername());

            String token = Jwts.builder()
                    .setSubject(request.getUsername())
                    .claim("role", role)
                    .claim("userId", id.toString())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour validity
                    .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                    .compact();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("userId", id.toString()); // Add userId
            response.put("userRole", role); // Add userRole

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<PersonDetailsDTO> getUserData(@PathVariable UUID id, HttpServletRequest request) {

        System.out.println("good");
        System.out.println(request.toString());

        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String token = authorizationHeader.substring(7);
        try {
            // Decode the JWT token using Spring Security's JwtDecoder
            Jwt jwt = jwtDecoder.decode(token);

            String userId = jwt.getClaim("userId");
            String userRole = jwt.getClaim("role");

            // Validate the user ID and role for access control
            if (!id.toString().equals(userId) && !"admin".equals(userRole)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            PersonDetailsDTO personDetails = userService.findPersonById(id);
            if (personDetails != null) {
                return ResponseEntity.ok(personDetails);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @Autowired
    private JwtDecoder jwtDecoder;

    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> checkSession(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        String userRole = (String) session.getAttribute("userRole");

        if (userId != null && userRole != null) {
            Map<String, Object> sessionData = new HashMap<>();
            sessionData.put("userId", userId);
            sessionData.put("userRole", userRole);
            return ResponseEntity.ok(sessionData);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
