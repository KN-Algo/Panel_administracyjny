package algo.services;

import algo.dto.RecaptchaResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * Service responsible for verifying Google reCAPTCHA tokens.
 * Communicates with the external Google API to validate human interaction.
 */
@Service
public class RecaptchaService {

    /** The secret key used to authenticate with the Google reCAPTCHA API. */
    @Value("${google.recaptcha.secret}")
    private String recaptchaSecret;

    /** The URL of the Google reCAPTCHA verification endpoint. */
    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    /**
     * Verifies the provided token against Google's reCAPTCHA API.
     *
     * @param token the reCAPTCHA response token provided by the client.
     * @return true if verification is successful, false otherwise.
     */
    public boolean verifyToken(final String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        final RestTemplate restTemplate = new RestTemplate();

        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        final MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("secret", recaptchaSecret);
        map.add("response", token);

        final HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            final RecaptchaResponse response =
                    restTemplate.postForObject(VERIFY_URL, request, RecaptchaResponse.class);
            return response != null && response.success();
        } catch (Exception e) {
            return false;
        }
    }
}