package algo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for contact form requests.
 * Contains sender details, message content, and validation constraints.
 *
 * @param name           the name of the person sending the message.
 * @param replyTo        the email address of the sender.
 * @param message        the body of the message.
 * @param recaptchaToken the reCAPTCHA token provided by the client for verification.
 */
@Schema(description = "Obiekt żądania reprezentujący formularz kontaktowy", example = """
        {
          "name": "Jan Kowalski",
          "replyTo": "jan.kowalski@example.com",
          "message": "Dzień dobry, mam pytanie odnośnie rekrutacji do koła...",
          "recaptchaToken": "03AFcWeA4_przykladowy_token_google_recaptcha"
        }
        """)
public record ContactRequestDto(
        @NotBlank(message = "Name cannot be empty")
        @Size(max = 100, message = "Name is too long")
        String name,

        @NotBlank(message = "Email address cannot be empty")
        @Email(message = "Invalid email address format")
        String replyTo,

        @NotBlank(message = "Message content cannot be empty")
        @Size(max = 3000, message = "Message is too long")
        String message,

        @NotBlank(message = "reCAPTCHA token is required")
        String recaptchaToken
) {}