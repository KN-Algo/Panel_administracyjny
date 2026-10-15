package algo.dto;

import algo.module.TeamRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object for creating and updating a team member.
 *
 * @param firstName    the first name of the team member
 * @param lastName     the last name of the team member
 * @param role         the organizational role of the team member
 * @param translations list of localized translations for the displayed title and description
 * @param imageUrls    list of URLs pointing to the team member's images
 * @param socialLinks  map of social media links (e.g., "github" -> "link")
 */
@Schema(description = "Obiekt żądania używany do tworzenia lub aktualizacji danych członka zespołu", example = """
        {
          "firstName": "Adam",
          "lastName": "Kruszczyński",
          "role": "BOARD",
          "sortOrder": 1,
          "translations": [
            {
              "languageCode": "pl",
              "displayedTitle": "Programista Backend",
              "description": "Odpowiada za architekturę i logikę biznesową w Spring Boot."
            },
            {
              "languageCode": "en",
              "displayedTitle": "Backend Developer",
              "description": "Responsible for architecture and business logic in Spring Boot."
            },
            {
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
public record TeamMemberRequestDto(

        @NotBlank(message = "First name cannot be blank.")
        @Size(max = 100, message = "First name is too long.")
        @Schema(description = "Imię członka zespołu")
        String firstName,

        @NotBlank(message = "Last name cannot be blank.")
        @Size(max = 100, message = "Last name is too long.")
        @Schema(description = "Nazwisko członka zespołu")
        String lastName,

        @NotNull(message = "Role must be specified.")
        @Schema(description = "Przydzielona rola w zespole")
        TeamRole role,

        @Schema(description = "Kolejność wyświetlania na stronie")
        Integer sortOrder,

        @NotEmpty(message = "Translations must not be empty.")
        @Valid
        @Schema(description = "Lista tłumaczeń profilu na różne języki")
        List<TeamMemberTranslationDto> translations,

        @Schema(description = "Lista adresów URL do zdjęć profilowych")
        List<String> imageUrls,

        @Schema(description = "Linki do mediów społecznościowych w formie klucz-wartość")
        Map<String, String> socialLinks
) {}