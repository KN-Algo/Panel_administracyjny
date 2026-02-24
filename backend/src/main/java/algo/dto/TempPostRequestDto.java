package algo.dto;


import com.example.posts.module.PostType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.ut

 public record TempPostRequestDto(
         @NotNull PostType postType,
         @NotNull LocalDateTime eventDate,
         @NotNull LocalDateTime startsAt,
         @NotNull LocalDateTime expiresAt
         @NotBlank @Size(max = 500) String thumnailUrl, // or Id
         @Size(max = 2000) String imageUrls, // or Id
         @NotBlank @Size(max = 500) String externalLink,
         @NotEmpty List<@Valid PostTranslationDto> translations
 ) { }