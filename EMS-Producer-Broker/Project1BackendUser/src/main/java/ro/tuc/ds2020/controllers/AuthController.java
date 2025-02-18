package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.services.AuthService;
import ro.tuc.ds2020.services.PersonService;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PersonService userService;

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

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequest request, HttpSession session) {
        boolean success = authService.login(request.getUsername(), request.getPassword());

        if (success) {
            String role = authService.getRole(request.getUsername());
            UUID id = authService.getId(request.getUsername());

            session.setAttribute("userId", id);
            session.setAttribute("userRole", role);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("userId", id);
            response.put("userRole", role);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<PersonDetailsDTO> getUserData(@PathVariable UUID id, HttpSession session) {
        UUID loggedInUserId = (UUID) session.getAttribute("userId");
        String userRole = (String) session.getAttribute("userRole");

        if (loggedInUserId == null || !id.equals(loggedInUserId) && !"admin".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        PersonDetailsDTO personDetails = userService.findPersonById(id);

        if (personDetails != null) {
            return ResponseEntity.ok(personDetails);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
