package algo.services;

import algo.dto.PostRequestDto;
import algo.dto.PostResponseDto;
import algo.dto.PostTranslationDto;
import algo.exceptions.PostNotFoundException;
import algo.module.PostEntity;
import algo.module.PostTranslation;
import algo.repository.PostRepository;
import jakarta.transaction.Transactional;
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
            .orElseThrow(() -> new PostNotFoundException(postId));
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
    applyRequest(postEntity, request);
    return toResponse(postRepository.save(postEntity));
  }

  /**
   * Updates an existing post.
   *
   * @param postId the ID of the post to update
   * @param request the updated post data
   * @return the updated post
   */
  @Transactional
  public PostResponseDto updatePost(final Long postId, final PostRequestDto request) {
    final PostEntity postEntity =
        postRepository
            .findWithTranslationsByPostId(postId)
            .orElseThrow(() -> new PostNotFoundException(postId));
    postEntity.getTranslations().clear();
    postRepository.saveAndFlush(postEntity);
    applyRequest(postEntity, request);
    return toResponse(postRepository.save(postEntity));
  }

  /**
   * Deletes a post by ID.
   *
   * @param postId the ID of the post to delete
   */
  public void deletePost(final Long postId) {
    if (!postRepository.existsById(postId)) {
      throw new PostNotFoundException(postId);
    }
    postRepository.deleteById(postId);
  }

  /**
   * Applies request data to a post entity.
   *
   * @param postEntity the post entity
   * @param request the request data
   */
  private void applyRequest(final PostEntity postEntity, final PostRequestDto request) {
    postEntity.setPostType(request.postType());
    postEntity.setEventDate(request.eventDate());
    postEntity.setThumbnailUrl(request.thumbnailUrl());
    postEntity.setImageUrls(request.imageUrls());
    postEntity.setExternalLink(request.externalLink());

    if (request.translations() != null) {
      request
          .translations()
          .forEach(
              dto -> {
                final PostTranslation translation = new PostTranslation();
                translation.setLanguageCode(dto.languageCode());
                translation.setTitle(dto.title());
                translation.setShortDescription(dto.shortDescription());
                translation.setFullDescription(dto.fullDescription());
                postEntity.addTranslation(translation);
              });
    }
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
                t ->
                    new PostTranslationDto(
                        t.getTranslationId(),
                        t.getLanguageCode(),
                        t.getTitle(),
                        t.getShortDescription(),
                        t.getFullDescription()))
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
