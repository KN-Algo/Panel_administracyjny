package algo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequestDto(
        @NotBlank(message = "Imię nie może być puste")
        @Size(max = 100, message = "Imię jest za długie")
        String name,

        @NotBlank(message = "Adres email nie może być pusty")
        @Email(message = "Niepoprawny format adresu email")
        String replyTo,

        @NotBlank(message = "Treść wiadomości nie może być pusta")
        @Size(max = 3000, message = "Wiadomość jest za długa")
        String message,

        @NotBlank(message = "Token reCAPTCHA jest wymagany")
        String recaptchaToken
) {}