package algo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * @param translationId id of translated record
 * @param languageCode language translated code
 * @param displayedTitle translated title (e.g. "Prezes", "President")
 * @param description translated personal description
 */
@Schema(description = "Obiekt przechowujący tłumaczenia dla profilu członka zespołu")
public record TeamMemberTranslationDto(
        @Schema(description = "ID tłumaczenia", example = "1")
        Long translationId,

        @Schema(description = "Kod języka np. 'pl' lub 'en'", example = "pl")
        @NotBlank
        String languageCode,

        @NotBlank
        @Size(max = DISPLAYED_TITLE_LENGTH)
        @Schema(description = "Wyświetlany tytuł lub stanowisko w danym języku", example = "Członek koła")
        String displayedTitle,

        @Schema(description = "Szczegółowy opis członka zespołu w danym języku", example = "Robi wszystko a nawet więcej.")
        String description) {

    /** Max length of language code column. */
    public static final int LANG_CODE_LENGTH = 2;

    /** Max length of displayed title column. */
    public static final int DISPLAYED_TITLE_LENGTH = 150;
}