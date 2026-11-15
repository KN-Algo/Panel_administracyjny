package algo.services;

import algo.dto.PostTranslationDto;
import algo.dto.TranslationRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * Service handling the automatic translation of post content using the MyMemory API.
 */
@Slf4j
@Service
public class AutoTranslationService {

    /** The base URL for the MyMemory Translation API. */
    private static final String MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";

    /** The RestTemplate used to execute HTTP requests. */
    private final RestTemplate restTemplate;

    /** The registered email address for higher MyMemory API limits. */
    private final String email;

    /**
     * Constructs the service with the required email configuration.
     *
     * @param email the email address used to authenticate for higher translation limits.
     */
    public AutoTranslationService(@Value("${mymemory.api.email:}") final String email) {
        this.restTemplate = new RestTemplate();
        this.email = email;
    }

    /**
     * Translates the working draft of a post into English and German.
     *
     * @param source the request payload containing the original Polish text.
     * @return a list of translated post objects for English and German, or an empty list if translation fails.
     */
    public List<PostTranslationDto> translatePostInFly(final TranslationRequestDto source) {
        try {
            log.info("Rozpoczynam autotłumaczenie wpisu przez MyMemory API...");
            final PostTranslationDto enTranslation = translateTo("en", source);
            final PostTranslationDto deTranslation = translateTo("de", source);

            return List.of(enTranslation, deTranslation);

        } catch (final Exception e) {
            log.error("Błąd podczas tłumaczenia MyMemory API. Zwracam pustą listę.", e);
            return List.of();
        }
    }

    /**
     * Translates all fields of a single post to a specified target language.
     *
     * @param targetLang the target language code (e.g., "en", "de").
     * @param source     the original translation request data.
     * @return a mapped translation DTO for the target language.
     */
    private PostTranslationDto translateTo(final String targetLang, final TranslationRequestDto source) {
        final String translatedTitle = fetchTranslation(source.title(), targetLang);

        final String translatedShortDesc = (source.shortDescription() != null && !source.shortDescription().isBlank())
                ? fetchTranslation(source.shortDescription(), targetLang)
                : null;

        final String translatedFullDesc = fetchTranslation(source.fullDescription(), targetLang);

        return new PostTranslationDto(
                null,
                targetLang,
                translatedTitle,
                translatedShortDesc,
                translatedFullDesc
        );
    }

    /**
     * Fetches the translation for a single text string from the external API.
     *
     * @param text       the original text to translate.
     * @param targetLang the target language code.
     * @return the translated text, or the original text if the translation fails.
     */
    private String fetchTranslation(final String text, final String targetLang) {
        if (text == null || text.isBlank()) {
            return text;
        }

        try {
            final boolean hasEmail = email != null && !email.isBlank();

            final String url = hasEmail
                    ? MYMEMORY_API_URL + "?q={q}&langpair={langpair}&de={email}"
                    : MYMEMORY_API_URL + "?q={q}&langpair={langpair}";

            final MyMemoryResponse response = hasEmail
                    ? restTemplate.getForObject(url, MyMemoryResponse.class, text, "pl|" + targetLang, email)
                    : restTemplate.getForObject(url, MyMemoryResponse.class, text, "pl|" + targetLang);

            if (response != null && response.responseData() != null && response.responseData().translatedText() != null) {
                return response.responseData().translatedText();
            }
        } catch (final Exception ex) {
            log.warn("Nie udało się przetłumaczyć fragmentu: '{}'. Przyczyna: {}", text, ex.getMessage());
        }

        return text;
    }

    /**
     * Internal record mapping the root JSON response from MyMemory API.
     *
     * @param responseData   the data object containing translation details.
     * @param responseStatus the HTTP-like status code returned by the API.
     */
    private record MyMemoryResponse(ResponseData responseData, Integer responseStatus) {}

    /**
     * Internal record mapping the translation data object.
     *
     * @param translatedText the resulting translated string.
     * @param match          the confidence or match score of the translation.
     */
    private record ResponseData(String translatedText, Double match) {}
}