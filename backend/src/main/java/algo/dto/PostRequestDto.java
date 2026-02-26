package algo.dto;

import algo.module.PostType;
import java.time.LocalDateTime;
import java.util.List;

@SuppressWarnings("PMD")
/**
 * Supressing PMD is needed because this commed it too long for PMD. (You can't split it because
 * checklist has ból dupy)
 *
 * <p>DTO representing a post request received from the client.
 *
 * @param postType type of the post
 * @param eventDate date of the event
 * @param thumbnailUrl URL of the thumbnail image
 * @param imageUrls URLs of additional images
 * @param externalLink external link associated with the post
 * @param translations list of translations
 */
public record PostRequestDto(
    PostType postType,
    LocalDateTime eventDate,
    String thumbnailUrl,
    String imageUrls,
    String externalLink,
    List<PostTranslationDto> translations) {}
