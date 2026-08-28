package algo.controller;

import algo.dto.ContactRequestDto;
import algo.services.RecaptchaService;
import algo.services.exceptions.InvalidRecaptchaException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final RecaptchaService recaptchaService;

    public ContactController(final RecaptchaService recaptchaService) {
        this.recaptchaService = recaptchaService;
    }

    @PostMapping
    public ResponseEntity<Void> sendMessage(@Valid @RequestBody final ContactRequestDto request) {

        final boolean isHuman = recaptchaService.verifyToken(request.recaptchaToken());

        if (!isHuman) {
            throw new InvalidRecaptchaException("Weryfikacja reCAPTCHA nie powiodła się. Spróbuj ponownie.");
        }

        return ResponseEntity.ok().build();
    }
}