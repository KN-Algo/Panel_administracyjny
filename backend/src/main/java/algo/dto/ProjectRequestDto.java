package algo.dto;

import algo.module.Project;
import algo.module.ProjectType;
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
public record ProjectRequestDto(
    @NotNull ProjectType status,
    Integer displayOrder,
    @Size(max = MAX_IMAGES) List<@Size(max = Project.IMAGE_URL_L) String> images,
    @NotEmpty List<@Valid ProjectTranslationDto> translations) {

  /** Soft limit for number of images per project to avoid overly large payloads. */
  public static final int MAX_IMAGES = 50;
}

