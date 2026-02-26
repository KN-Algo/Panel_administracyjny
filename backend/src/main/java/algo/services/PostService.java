package algo.services;

import algo.dto.PostRequestDto;
import algo.dto.PostResponseDto;
import algo.dto.PostTranslationDto;
import algo.module.PostEntity;
import algo.module.PostTranslation;
import algo.repository.PostRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/** Service handling post-related operations. */
@Service
public class PostService {

  /** Repository for post-related database operations. */
  private final PostRepository postRepository;

  /**
   * Constructor for PostService.
   *
   * @param repository the post repository
   */
  public PostService(final PostRepository repository) {
    this.postRepository = repository;
  }

  /**
   * Retrieves all posts.
   *
   * @return list of all posts
   */
  public List<PostResponseDto> getAllPosts() {
    return postRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
  }

  /**
   * Retrieves a single post by ID.
   *
   * @param postId the ID of the post
   * @return the post with the given ID
   */
  public PostResponseDto getPostById(final Long postId) {
    final PostEntity postEntity =
        postRepository
            .findWithTranslationsByPostId(postId)
            .orElseThrow(() -> new RuntimeException("Post nie znaleziony: " + postId));
    return toResponse(postEntity);
  }

  /**
   * Creates a new post.
   *
   * @param request the post data
   * @return the created post
   */
  public PostResponseDto createPost(final PostRequestDto request) {
    final PostEntity postEntity = new PostEntity();
    postEntity.setPostType(request.postType());
    postEntity.setEventDate(request.eventDate());
    postEntity.setThumbnailUrl(request.thumbnailUrl());
    postEntity.setImageUrls(request.imageUrls());
    postEntity.setExternalLink(request.externalLink());

    if (request.translations() != null) {
      request
          .translations()
          .forEach(
              translationDto -> {
                final PostTranslation translation = new PostTranslation();
                translation.setLanguageCode(translationDto.languageCode());
                translation.setTitle(translationDto.title());
                translation.setShortDescription(translationDto.shortDescription());
                translation.setFullDescription(translationDto.fullDescription());
                postEntity.addTranslation(translation);
              });
    }

    return toResponse(postRepository.save(postEntity));
  }

  /**
   * Converts a Post entity to a PostResponseDto.
   *
   * @param postEntity the post entity
   * @return the post response DTO
   */
  private PostResponseDto toResponse(final PostEntity postEntity) {
    final List<PostTranslationDto> translations =
        postEntity.getTranslations().stream()
            .map(
                translation ->
                    new PostTranslationDto(
                        translation.getTranslationId(),
                        translation.getLanguageCode(),
                        translation.getTitle(),
                        translation.getShortDescription(),
                        translation.getFullDescription()))
            .collect(Collectors.toList());

    return new PostResponseDto(
        postEntity.getPostId(),
        postEntity.getPostType(),
        postEntity.getEventDate(),
        postEntity.getThumbnailUrl(),
        postEntity.getImageUrls(),
        postEntity.getExternalLink(),
        translations);
  }
}
