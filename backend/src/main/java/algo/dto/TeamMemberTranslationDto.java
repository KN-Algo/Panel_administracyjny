package algo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * @param translationId id of translated record
 * @param languageCode language translated code
 * @param displayedTitle translated title (e.g. "Prezes", "President")
 * @param description translated personal description
 */
public record TeamMemberTranslationDto(
        Long translationId,
        @NotBlank String languageCode,
        @NotBlank @Size(max = DISPLAYED_TITLE_LENGTH) String displayedTitle,
        String description) {

    /** Max length of language code column. */
    public static final int LANG_CODE_LENGTH = 2;

    /** Max length of displayed title column. */
    public static final int DISPLAYED_TITLE_LENGTH = 150;
}