package algo.module;


import com.example.posts.module.PostType;
import java.time.LocalDateTime;
import java.util.List;

public record TempPostResponseDto(
        Long id,
        PostType postType,
        LocalDateTime eventDate,
        LocalDateTime startsAt,
        LocalDateTime expiresAt,
        String thumbnailUrl,
        String imageUrls, // int imageId
        String externalLink,
        List<PostTranslationDto> translations
) { }