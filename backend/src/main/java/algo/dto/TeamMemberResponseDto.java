package algo.dto;

import algo.module.TeamRole;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object for returning team member details to the client.
 */
@Schema(description = "Obiekt zwracany przez serwer, zawierający pełne dane członka zespołu", example = """
        {
          "memberId": 14,
          "firstName": "Adam",
          "lastName": "Kruszczyński",
          "role": "BOARD",
          "sortOrder": 1,
          "translations": [
            {
              "translationId": 101,
              "languageCode": "pl",
              "displayedTitle": "Programista Backend",
              "description": "Odpowiada za architekturę i logikę biznesową w Spring Boot."
            },
            {
              "translationId": 102,
              "languageCode": "en",
              "displayedTitle": "Backend Developer",
              "description": "Responsible for architecture and business logic in Spring Boot."
            },
            {
              "translationId": 103,
              "languageCode": "de",
              "displayedTitle": "Backend-Entwickler",
              "description": "Verantwortlich für Architektur und Geschäftslogik in Spring Boot."
            }
          ],
          "imageUrls": [
            "https://example.com/avatar.jpg"
          ],
          "socialLinks": {
            "github": "https://github.com/AdamKruszczynski",
            "linkedin": "https://linkedin.com/in/adam"
          }
        }
        """)
public record TeamMemberResponseDto(
        Long memberId,
        String firstName,
        String lastName,
        TeamRole role,
        Integer sortOrder,
        List<TeamMemberTranslationDto> translations,
        List<String> imageUrls,
        Map<String, String> socialLinks
) {}