package algo.services;

import algo.dto.PostTranslationDto;
import algo.dto.PostRequestDto;
import algo.dto.PostResponseDto;
import algo.module.PostTranslation;
import algo.module.Posts;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

/** Maps post DTOs to and from the Posts entity. */
@Component
public class PostMap {
  /** Default no-arg constructor required by Spring for dependency injection. */
  public PostMap() {
    // Intentionally empty constructor required by Spring DI
  }

  /**
   * Maps request DTO to a new {@link Posts} entity.
   *
   * @param dto request payload
   * @return new post entity filled with request values
   */
  public Posts toEntity(final PostRequestDto dto) {
    final Posts post = new Posts();
    applyToEntity(post, dto);
    return post;
  }

  /**
   * Applies DTO values to an existing {@link Posts} entity.
   *
   * @param target entity to update
   * @param dto source DTO with updated values
   */
  public void applyToEntity(final Posts target, final PostRequestDto dto) {
    target.setPostType(dto.postType());
    target.setEventDate(dto.eventDate());
    target.setStartsAt(dto.startsAt());
    target.setExpiresAt(dto.expiresAt());
    target.setThumbnailUrl(dto.thumbnailUrl());
    target.setImageUrls(dto.imageUrls());
    target.setExternalLink(dto.externalLink());

    final Map<String, Long> existingIdsByLang = new HashMap<>();
    if (target.getTranslations() != null) {
      for (final PostTranslation existingTranslation : target.getTranslations()) {
        existingIdsByLang.put(existingTranslation.getLanguageCode(), existingTranslation.getId());
      }
    }

    target.clearTranslations();
    if (dto.translations() != null) {
      for (final PostTranslationDto translationDto : dto.translations()) {
        final PostTranslation postTranslation =
            createPostTranslation(translationDto, existingIdsByLang);
        target.addTranslation(postTranslation);
      }
    }
  }

  /**
   * Creates a PostTranslation entity from a PostTranslationDto.
   *
   * @param dto the translation DTO
   * @return the created PostTranslation entity
   */
  private PostTranslation createPostTranslation(
      final PostTranslationDto dto, final Map<String, Long> existingIdsByLang) {
    final PostTranslation postTranslation = new PostTranslation();
    if (dto.translationId() != null) {
      postTranslation.setId(dto.translationId());
    } else if (existingIdsByLang.containsKey(dto.languageCode())) {
      postTranslation.setId(existingIdsByLang.get(dto.languageCode()));
    }
    postTranslation.setLanguageCode(dto.languageCode());
    postTranslation.setTitle(dto.title());
    postTranslation.setShortDescription(dto.shortDescription());
    postTranslation.setFullDescription(dto.fullDescription());
    return postTranslation;
  }

  /**
   * Maps a {@link Posts} entity to a {@link PostResponseDto}.
   *
   * @param entity source post entity
   * @return mapped response DTO
   */
  public PostResponseDto toResponse(final Posts entity) {
    final List<PostTranslationDto> translations = new ArrayList<>();
    if (entity.getTranslations() != null) {
      for (final PostTranslation postTranslation : entity.getTranslations()) {
        translations.add(
            new PostTranslationDto(
                postTranslation.getId(),
                postTranslation.getLanguageCode(),
                postTranslation.getTitle(),
                postTranslation.getShortDescription(),
                postTranslation.getFullDescription()));
      }
    }

    return new PostResponseDto(
        entity.getPostId(),
        entity.getPostType(),
        entity.getEventDate(),
        entity.getStartsAt(),
        entity.getExpiresAt(),
        entity.getThumbnailUrl(),
        entity.getImageUrls(),
        entity.getExternalLink(),
        translations);
  }
}
