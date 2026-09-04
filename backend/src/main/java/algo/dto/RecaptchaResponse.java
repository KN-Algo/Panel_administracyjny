package algo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Maps the JSON response from the Google reCAPTCHA verification API.
 *
 * @param success true if the reCAPTCHA token was successfully verified, false otherwise.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record RecaptchaResponse(boolean success) {
}