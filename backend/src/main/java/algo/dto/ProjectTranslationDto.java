package algo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * @param translationId id of translated record
 * @param languageCode language translated code
 * @param title translated title
 * @param description translated description (HTML allowed)
 */
public record ProjectTranslationDto(
    Long translationId,
    @NotBlank @Size(max = LANG_CODE_LENGTH) String languageCode,
    @NotBlank @Size(max = TITLE_LENGTH) String title,
    @NotBlank String description) {

  /** Max length of language code column. */
  public static final int LANG_CODE_LENGTH = 5;

  /** Max length of title column. */
  public static final int TITLE_LENGTH = 200;
}

