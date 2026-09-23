package algo.dto;

import algo.module.PostType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
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
@Schema(description = "Obiekt żądania do tworzenia lub edycji posta/wydarzenia", example = """
        {
          "postType": "NEWS",
          "eventDate": "2026-10-01T12:00:00",
          "startsAt": "2026-09-20T08:00:00",
          "expiresAt": "2026-10-02T23:59:59",
          "thumbnailUrl": "https://example.com/thumb.jpg",
          "imageUrls": [
            "https://example.com/img1.jpg",
            "https://example.com/img2.jpg"
          ],
          "externalLink": "https://pwr.edu.pl",
          "translations": [
            {
              "languageCode": "pl",
              "title": "Nowa rekrutacja do KN Algo",
              "shortDescription": "Dołącz do nas!",
              "fullDescription": "<p>Pełny opis rekrutacji na nowy semestr...</p>"
            },
            {
              "languageCode": "en",
              "title": "New recruitment for KN Algo",
              "shortDescription": "Join us!",
              "fullDescription": "<p>Full description of the recruitment process...</p>"
            },
            {
              "languageCode": "de",
              "title": "Neue Rekrutierung für KN Algo",
              "shortDescription": "Mach mit!",
              "fullDescription": "<p>Vollständige Beschreibung des Rekrutierungsprozesses...</p>"
            }
          ]
        }
        """)
public record PostRequestDto(
    @NotNull PostType postType,
    @NotNull LocalDateTime eventDate,
    LocalDateTime startsAt,
    LocalDateTime expiresAt,
    @Size(max = THUMBNAIL_URL_L) String thumbnailUrl,
    @Size(max = IMAGE_URLS_L) List<String> imageUrls,
    @Size(max = EXTERNAL_LINK_L) String externalLink,
    @NotEmpty List<@Valid PostTranslationDto> translations) {

  /** Max length of thumbnail URL. */
  public static final int THUMBNAIL_URL_L = 500;

  /** Max length of image URLs field. */
  public static final int IMAGE_URLS_L = 2000;

  /** Max length of external link. */
  public static final int EXTERNAL_LINK_L = 500;
}
