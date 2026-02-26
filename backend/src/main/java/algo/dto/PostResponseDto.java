package algo.dto;

import algo.module.PostType;
import java.time.LocalDateTime;
import java.util.List;

@SuppressWarnings("PMD")
/**
 * DTO representing a post response sent to the client.
 *
 * <p>* Supressing PMD is needed because this commed it too long for PMD. * (You can't split it
 * because checklist has ból dupy)
 *
 * @param postId unique identifier of the post
 * @param postType type of the post
 * @param eventDate date of the event
 * @param thumbnailUrl URL of the thumbnail image
 * @param imageUrls URLs of additional images
 * @param externalLink external link associated with the post
 * @param translations list of translations
 */
public record PostResponseDto(
    Long postId,
    PostType postType,
    LocalDateTime eventDate,
    String thumbnailUrl,
    String imageUrls,
    String externalLink,
    List<PostTranslationDto> translations) {}
