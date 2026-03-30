package algo.dto;

import algo.module.PostType;
import java.time.LocalDateTime;
import java.util.List;

public record PostResponseDto(
    Long postId,
    PostType postType,
    LocalDateTime eventDate,
    LocalDateTime startsAt,
    LocalDateTime expiresAt,
    String thumbnailUrl,
    String imageUrls, // int imageId
    String externalLink,
    List<PostTranslationDto> translations) {}
