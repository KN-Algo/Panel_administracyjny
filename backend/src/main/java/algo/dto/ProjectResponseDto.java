package algo.dto;

import algo.module.ProjectType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/** Full admin-facing DTO (includes id and all translations). */
@Schema(description = "Obiekt zwracany przez serwer, zawierający pełne dane projektu", example = """
        {
          "projectId": 1,
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
public record ProjectResponseDto(
    Long projectId,
    ProjectType status,
    Integer displayOrder,
    List<String> images,
    List<ProjectTranslationDto> translations) {}

