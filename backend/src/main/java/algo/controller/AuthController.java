package algo.controller;

import algo.dto.UserSummary;
import algo.module.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import algo.dto.RegisterRequest;
import algo.services.UserService;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // Na razie nie ma /login, ponieważ nie wiem jak to zrobić. Gemini proponuje mi jakiś kod ale go nie ogarniam,
    // natomiast za niedługo posatram się znaleźć sposób jak to porządnie zrobić. Zostawiłem domyślną stone logowania
    // aby sprawdzić czy kod i baza działa.

    @GetMapping("/me")
    public ResponseEntity<UserSummary> getCurrentUser(@AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        UserSummary userSummary = new UserSummary(
                user.getEmail(),
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity.ok(userSummary);
    }

}