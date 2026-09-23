package algo.controller;

import algo.config.SwaggerExamples;
import algo.dto.ContactRequestDto;
import algo.services.exceptions.InvalidRecaptchaException;
import algo.services.EmailService;
import algo.services.RecaptchaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Kontakt", description = "Endpoint do obsługi formularza kontaktowego zabezpieczonego przez Google reCAPTCHA")
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
    @Operation(summary = "Wyślij wiadomość", description = "Przyjmuje dane z formularza, weryfikuje token reCAPTCHA po stronie serwera i wysyła wiadomość email na adres koła.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Wiadomość została pomyślnie przetworzona i wysłana (zwraca pusty status 200)"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Błąd walidacji danych (np. niepoprawny email) lub odrzucony token reCAPTCHA",
                    content = @Content(
                            mediaType = "application/json",
                            examples = {
                                    @ExampleObject(name = "Błąd walidacji formularza", value = SwaggerExamples.CONTACT_400_VALIDATION),
                                    @ExampleObject(name = "Błąd weryfikacji reCAPTCHA", value = SwaggerExamples.CONTACT_400_RECAPTCHA)
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Wewnętrzny błąd serwera (brak konfiguracji maila)",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.CONTACT_500))
            )
    })
    @PostMapping
    public ResponseEntity<Void> sendMessage(
            @Parameter(description = "Obiekt z danymi nadawcy i tokenem")
            @Valid @RequestBody final ContactRequestDto request) {

        final boolean isHuman = recaptchaService.verifyToken(request.recaptchaToken());

        if (!isHuman) {
            throw new InvalidRecaptchaException("ReCAPTCHA verification failed. Please try again..");
        }

        emailService.sendContactEmail(request.name(), request.replyTo(), request.message());

        return ResponseEntity.ok().build();
    }
}