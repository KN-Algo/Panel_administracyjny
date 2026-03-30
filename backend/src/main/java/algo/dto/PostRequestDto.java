package algo.dto;

import algo.module.PostType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @param postType type of the post
 * @param eventDate business/event datetime of the post
 * @param startsAt datetime when the post becomes active
 * @param expiresAt datetime when the post expires
 * @param thumbnailUrl thumbnail URL
 * @param imageUrls comma-separated image URLs
 * @param externalLink external link for the post
 * @param translations localized post translations
 */
public record PostRequestDto(
    @NotNull PostType postType,
    @NotNull LocalDateTime eventDate,
    @NotNull LocalDateTime startsAt,
    @NotNull LocalDateTime expiresAt,
    @NotBlank @Size(max = THUMBNAIL_URL_L) String thumbnailUrl,
    @Size(max = IMAGE_URLS_L) String imageUrls,
    @NotBlank @Size(max = EXTERNAL_LINK_L) String externalLink,
    @NotEmpty List<@Valid PostTranslationDto> translations) {

  /** Max length of thumbnail URL. */
  public static final int THUMBNAIL_URL_L = 500;

  /** Max length of image URLs field. */
  public static final int IMAGE_URLS_L = 2000;

  /** Max length of external link. */
  public static final int EXTERNAL_LINK_L = 500;
}
