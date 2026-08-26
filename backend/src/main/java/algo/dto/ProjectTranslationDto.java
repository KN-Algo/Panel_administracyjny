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
    @NotBlank @Size(max = DESCRIPTION_LENGTH) String description) {

  /** Max length of language code column. */
  public static final int LANG_CODE_LENGTH = 5;

  /** Max length of title column. */
  public static final int TITLE_LENGTH = 200;

  /** Soft max length for translated description payload (HTML allowed). */
  public static final int DESCRIPTION_LENGTH = 50_000;
}
