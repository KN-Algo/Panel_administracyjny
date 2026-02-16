package stronaKNAlgo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import stronaKNAlgo.dto.RegisterRequest;
import stronaKNAlgo.services.UserService;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {

        try {
            userService.registerUser(request);
            return ResponseEntity.ok("Rejestracja udana");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd: " + e.getMessage());
        }
    }

    // Na razie nie ma /login, ponieważ nie wiem jak to zrobić. Gemini proponuje mi jakiś kod ale go nie ogarniam,
    // natomiast za niedługo posatram się znaleźć sposób jak to porządnie zrobić. Zostawiłem domyślną stone logowania
    // aby sprawdzić czy kod i baza działa.

}