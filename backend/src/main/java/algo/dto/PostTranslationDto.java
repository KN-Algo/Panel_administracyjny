package algo.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record PostTranslationDto(
        Long id,
        @NotBlank @Size(max = 5) String languageCode,
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 400) String shortDescription,
        @NotBlank String fullDescription
) { }