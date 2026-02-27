package algo.controller;

import algo.dto.TempPostRequestDto;
import algo.dto.TempPostResponseDto;
import algo.module.PostType;
import algo.module.Posts;
import algo.services.TempPostMap;
import algo.services.TempPostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** REST controller for managing temporary posts. */
@RestController
@RequestMapping("/api/temp-posts")
public class TempPostController {

  /** Service for handling temporary post business logic. */
  private final TempPostService service;

  /** Mapper for converting between Post entities and DTOs. */
  private final TempPostMap mapper;

  /**
   * Constructs a TempPostController with required dependencies.
   *
   * @param pServ temporary post service
   * @param pMap temporary post mapper
   */
  public TempPostController(final TempPostService pServ, final TempPostMap pMap) {
    this.service = pServ;
    this.mapper = pMap;
  }

  /**
   * Creates a new temporary post.
   *
   * @param dto the post creation request data
   * @return response entity containing the created post
   */
  @PostMapping
  public ResponseEntity<TempPostResponseDto> create(
      @Valid @RequestBody final TempPostRequestDto dto) {
    final Posts entity = mapper.toEntity(dto);
    final Posts saved = service.save(entity);
    return ResponseEntity.ok(mapper.toResponse(saved));
  }

  /**
   * Updates an existing temporary post.
   *
   * @param postId the ID of the post to update
   * @param dto the post update request data
   * @return response entity containing the updated post
   */
  @PutMapping("/{id}")
  public ResponseEntity<TempPostResponseDto> update(
      @PathVariable("id") final Long postId, @Valid @RequestBody final TempPostRequestDto dto) {
    final Posts mergedEntity = mapper.toEntity(dto);
    final Posts saved = service.update(postId, mergedEntity);
    return ResponseEntity.ok(mapper.toResponse(saved));
  }

  /**
   * Retrieves a temporary post by ID.
   *
   * @param postId the post ID to retrieve
   * @return response entity containing the post
   */
  @GetMapping("/{id}")
  public ResponseEntity<TempPostResponseDto> get(@PathVariable("id") final Long postId) {
    final Posts entity = service.getOne(postId);
    return ResponseEntity.ok(mapper.toResponse(entity));
  }

  /**
   * Lists temporary posts with optional filtering.
   *
   * @param pageable pagination information
   * @param type optional post type filter
   * @param onlyActive whether to show only active posts
   * @return response entity containing page of posts
   */
  @GetMapping
  public ResponseEntity<Page<TempPostResponseDto>> list(
      final Pageable pageable,
      @RequestParam(value = "type", required = false) final PostType type,
      @RequestParam(value = "active", defaultValue = "false") final boolean onlyActive) {
    final Page<Posts> page = service.list(pageable, type, onlyActive);
    return ResponseEntity.ok(page.map(mapper::toResponse));
  }

  /**
   * Deletes a temporary post by ID.
   *
   * @param postId the post ID to delete
   * @return response entity with no content
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") final Long postId) {
    service.delete(postId);
    return ResponseEntity.noContent().build();
  }
}
