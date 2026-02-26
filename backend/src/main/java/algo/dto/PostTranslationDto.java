package algo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * @param postId id of translated record
 * @param languageCode language translated code
 * @param title translated title
 * @param shortDescription short translated description
 * @param fullDescription full translated description
 */
public record PostTranslationDto(
    Long postId,
    @NotBlank @Size(max = LANG_CODE_LENGTH) String languageCode,
    @NotBlank @Size(max = TITLE_LENGTH) String title,
    @NotBlank @Size(max = SHORT_DESC_LENGTH) String shortDescription,
    @NotBlank String fullDescription) {

  /** Max length of language code column. */
  public static final int LANG_CODE_LENGTH = 5;

  /** Max length of title column. */
  public static final int TITLE_LENGTH = 200;

  /** Max length of short description column. */
  public static final int SHORT_DESC_LENGTH = 400;
}
