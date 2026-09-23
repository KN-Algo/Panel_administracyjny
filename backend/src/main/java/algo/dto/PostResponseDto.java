package algo.dto;

import algo.module.PostType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Obiekt żądania do tworzenia lub edycji posta/wydarzenia", example = """
        {
          "postId": 1,
          "postType": "NEWS",
          "eventDate": "2026-08-25T18:00:00",
          "startsAt": "2026-08-19T12:00:00",
          "expiresAt": "2026-09-01T23:59:59",
          "thumbnailUrl": "https://example.com/thumb.webp",
          "imageUrls": ["https://example.com/1.webp,https://example.com/2.webp"],
          "externalLink": "https://example.com/more-info",
          "translations": [
            {
              "languageCode": "PL",
              "title": "Nowe wydarzenie w KN Algo",
              "shortDescription": "Krótki zajawka naszego wydarzenia.",
              "fullDescription": "<b>Pełny, szczegółowy opis naszego nowego wpisu na blogu.</b> Tutaj może być dużo więcej tekstu."
            },
            {
              "languageCode": "EN",
              "title": "New event in KN Algo",
              "shortDescription": "Short teaser of our event.",
              "fullDescription": "<b>Full, detailed description of our new blog post.</b> Here can be much more text."
            },
            {
              "languageCode": "DE",
              "title": "New event in KN Algo",
              "shortDescription": "Short teaent.",
              "fullDescription": "<b>Full, deta<b>re can be much more text."
            }
          ]
        }
        """)
public record PostResponseDto(
        Long postId,
        PostType postType,
        LocalDateTime eventDate,
        LocalDateTime startsAt,
        LocalDateTime expiresAt,
        String thumbnailUrl,
        List<String> imageUrls,
        String externalLink,
        List<PostTranslationDto> translations) {}
