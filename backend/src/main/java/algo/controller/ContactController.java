package algo.controller;

import algo.dto.ContactRequestDto;
import algo.services.exceptions.InvalidRecaptchaException;
import algo.services.EmailService;
import algo.services.RecaptchaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for handling contact form submissions. Verifies reCAPTCHA
 * and triggers email notifications to the organization.
 */
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    /** The service responsible for verifying Google reCAPTCHA tokens. */
    private final RecaptchaService recaptchaService;

    /** The service handling the construction and transmission of email messages. */
    private final EmailService emailService;

    /**
     * Constructs the controller with the required reCAPTCHA and email services.
     *
     * @param recaptchaService the service used to validate human interaction.
     * @param emailService the service used to send the contact email.
     */
    public ContactController(
            final RecaptchaService recaptchaService,
            final EmailService emailService) {
        this.recaptchaService = recaptchaService;
        this.emailService = emailService;
    }

    /**
     * Processes incoming contact messages, verifies the reCAPTCHA token, and sends an email.
     *
     * @param request the validated contact request data containing sender details and the message.
     * @return a response with an empty body and HTTP 200 OK status on success.
     * @throws InvalidRecaptchaException if the provided reCAPTCHA token is rejected by Google.
     */
    @PostMapping
    public ResponseEntity<Void> sendMessage(
            @Valid @RequestBody final ContactRequestDto request) {

        final boolean isHuman = recaptchaService.verifyToken(request.recaptchaToken());

        if (!isHuman) {
            throw new InvalidRecaptchaException("ReCAPTCHA verification failed. Please try again..");
        }

        emailService.sendContactEmail(request.name(), request.replyTo(), request.message());

        return ResponseEntity.ok().build();
    }
}