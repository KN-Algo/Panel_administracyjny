package algo.dto;

import algo.module.Project;
import algo.module.ProjectType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * @param status project status (completed/upcoming)
 * @param displayOrder optional ordering field for deterministic UI sorting
 * @param images ordered list of image URLs
 * @param translations localized project translations
 */
@ResponseBody
@Schema(description = "Obiekt żądania używany do tworzenia lub aktualizacji danych projektu", example = """
        {
          "status": "COMPLETED",
          "displayOrder": 1,
          "images": [
            "https://res.cloudinary.com/demo/image/upload/sample.jpg"
          ],
          "translations": [
            {
              "translationId": 2,
              "languageCode": "EN",
              "title": "KN Algo Web Application",
              "description": "<p>Detailed description of the project and technologies used.</p>"
            },
            {
              "translationId": 1,
              "languageCode": "PL",
              "title": "Aplikacja Webowa KN Algo",
              "description": "<p>Szczegółowy opis projektu i użytych technologii.</p>"
            },
            {
              "translationId": 3,
              "languageCode": "DE",
              "title": "KN Algo Webanwendung",
              "description": "<p>Detaillierte Beschreibung des Projekts und der verwendeten Technologien.</p>"
            }
          ]
        }
        """)
public record ProjectRequestDto(
    @NotNull ProjectType status,
    Integer displayOrder,
    @Size(max = MAX_IMAGES) List<@Size(max = Project.IMAGE_URL_L) String> images,
    @NotEmpty List<@NotNull @Valid ProjectTranslationDto> translations) {

  /** Soft limit for number of images per project to avoid overly large payloads. */
  public static final int MAX_IMAGES = 50;
}

