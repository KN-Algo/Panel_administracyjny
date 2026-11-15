package algo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request payload for on-the-fly automatic translation of post content.
 *
 * @param title            the original post title to translate
 * @param shortDescription the original short description to translate
 * @param fullDescription  the original full description to translate
 */
@Schema(description = "Żądanie autotłumaczenia treści posta w locie", example = """
        {
          "title": "Nowa rekrutacja do KN Algo",
          "shortDescription": "Rozpoczynamy nabór na semestr letni.",
          "fullDescription": "<p>Pełny opis rekrutacji na nowy semestr...</p>"
        }
        """)
public record TranslationRequestDto(
        @NotBlank
        @Size(max = PostTranslationDto.TITLE_LENGTH)
        String title,

        @Size(max = PostTranslationDto.SHORT_DESC_LENGTH)
        String shortDescription,

        @NotBlank
        String fullDescription
) {}