package algo.controller;

import algo.config.SwaggerExamples;
import algo.dto.PostRequestDto;
import algo.dto.PostResponseDto;
import algo.module.PostType;
import algo.module.Posts;
import algo.services.PostMap;
import algo.services.PostService;
import algo.services.exceptions.PostValidationException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** REST controller for managing posts. */
@RestController
@RequestMapping("/api/posts")
@Tag(name = "Zarządzanie Postami", description = "Endpointy do zarządzania aktualnościami, wydarzeniami oraz powiadomieniami")
public class PostController {

  /** Maximum allowed page size for pagination. */
  private static final int MAX_PAGE_SIZE = 100;

  /** Service for handling post business logic. */
  private final PostService service;

  /** Mapper for converting between Post entities and DTOs. */
  private final PostMap mapper;

  /**
   * Constructs a PostController with required dependencies.
   *
   * @param pServ post service
   * @param pMap post mapper
   */
  public PostController(final PostService pServ, final PostMap pMap) {
    this.service = pServ;
    this.mapper = pMap;
  }

  /**
   * Creates a new post.
   *
   * @param dto the post creation request data
   * @return response entity containing the created post
   */
  @Operation(summary = "Utwórz nowy post", description = "Tworzy nowy wpis (np. news, wydarzenie, modal). Endpoint wymaga zalogowania.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Pomyślnie utworzono post"),
          @ApiResponse(
                  responseCode = "400",
                  description = "Błąd walidacji danych (np. brak tytułu w jednym z języków)",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.POST_400))
          ),
          @ApiResponse(
                  responseCode = "404",
                  description = "Nie znaleziono posta",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.POST_404))
          )
  })
  @PostMapping
  public ResponseEntity<PostResponseDto> create(
          @Parameter(description = "Kompletny obiekt posta")
          @Valid @RequestBody final PostRequestDto dto) {
    validateRequest(dto);
    final Posts entity = mapper.toEntity(dto);
    final Posts saved = service.save(entity);
    return ResponseEntity.ok(mapper.toResponse(saved));
  }

  /**
   * Updates an existing post.
   *
   * @param postId the ID of the post to update
   * @param dto the post update request data
   * @return response entity containing the updated post
   */
  @Operation(summary = "Aktualizuj post", description = "Nadpisuje istniejący post o podanym ID. Endpoint wymaga zalogowania.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Pomyślnie zaktualizowano post"),
          @ApiResponse(
                  responseCode = "400",
                  description = "Błąd walidacji danych wejściowych",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.POST_400))
          ),
          @ApiResponse(
                  responseCode = "404",
                  description = "Nie znaleziono posta",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.POST_404))
          )
  })
  @PutMapping("/{id}")
  public ResponseEntity<PostResponseDto> update(
          @Parameter(description = "ID posta", example = "1") @PathVariable("id") final Long postId,
          @Valid @RequestBody final PostRequestDto dto) {
    validateRequest(dto);
    final Posts mergedEntity = mapper.toEntity(dto);
    final Posts saved = service.update(postId, mergedEntity);
    return ResponseEntity.ok(mapper.toResponse(saved));
  }

  /** Returns all posts excluding temporary modals. */
  @Operation(summary = "Pobierz zwykłe posty", description = "Zwraca wszystkie posty z wyłączeniem okien modalnych.")
  @ApiResponse(responseCode = "200", description = "Lista postów pobrana pomyślnie")
  @GetMapping("/content")
  public ResponseEntity<List<PostResponseDto>> getRegularContent() {
    return ResponseEntity.ok(service.getNonTempPosts().stream().map(mapper::toResponse).toList());
  }

  /** Returns only news articles. */
  @Operation(summary = "Pobierz newsy", description = "Zwraca listę postów będących wyłącznie aktualnościami (NEWS).")
  @ApiResponse(responseCode = "200", description = "Lista aktualności pobrana pomyślnie")
  @GetMapping("/news")
  public ResponseEntity<List<PostResponseDto>> getNews() {
    return ResponseEntity.ok(service.getNewsOnly().stream().map(mapper::toResponse).toList());
  }
  /** Returns all temporary/modal posts. */
  @Operation(summary = "Pobierz okna modalne", description = "Zwraca wszystkie posty skonfigurowane jako tymczasowe okna modalne.")
  @ApiResponse(responseCode = "200", description = "Lista modali pobrana pomyślnie")
  @GetMapping("/modals")
  public ResponseEntity<List<PostResponseDto>> getAllModals() {
    return ResponseEntity.ok(service.getAllTempPosts().stream().map(mapper::toResponse).toList());
  }

  /** Returns the currently active homepage modal, if any. */
  @Operation(summary = "Pobierz aktywny modal", description = "Zwraca jeden aktualnie aktywny modal na stronę główną, o ile taki istnieje.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Znaleziono aktywny modal"),
          @ApiResponse(responseCode = "204",
                    description = "Brak aktywnego modalu (brak zawartości)",
                    content = @Content)
  })
  @GetMapping("/active-modal")
  public ResponseEntity<PostResponseDto> getActiveModal() {
    return service
            .getActiveModal()
            .map(mapper::toResponse)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.noContent().build());
  }

  /**
   * Retrieves a post by ID.
   *
   * @param postId the post ID to retrieve
   * @return response entity containing the post
   */
  @Operation(summary = "Pobierz post po ID", description = "Zwraca pełne dane konkretnego posta/wydarzenia na podstawie ID.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Pomyślnie pobrano post"),
          @ApiResponse(
                  responseCode = "404",
                  description = "Nie znaleziono posta",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.POST_404))
          )
  })
  @GetMapping("/{id}")
  public ResponseEntity<PostResponseDto> get(
          @Parameter(description = "ID posta", example = "1") @PathVariable("id") final Long postId) {
    final Posts entity = service.getOne(postId);
    return ResponseEntity.ok(mapper.toResponse(entity));
  }

  /**
   * Lists posts with optional filtering.
   *
   * @param pageable pagination information
   * @param type optional post type filter
   * @param onlyActive whether to show only active posts
   * @return response entity containing page of posts
   */
  @Operation(summary = "Pobierz posty ze stronicowaniem", description = "Zwraca posty w formie paginowanej z opcją filtrowania po typie i statusie aktywności.")
  @ApiResponse(
          responseCode = "200",
          description = "Zwraca stronę wyników (oraz metadane stronicowania).",
          content = @Content(
                  mediaType = "application/json",
                  examples = @ExampleObject(value = SwaggerExamples.POSTS_PAGINATED_200)
          )
  )
  @GetMapping
  public ResponseEntity<Map<String, Object>> list(
          final HttpServletRequest request,
          @ParameterObject final Pageable pageable,
          @Parameter(description = "Filtrowanie po typie posta (np. NEWS, EVENT, TEMP_MODAL)") @RequestParam(value = "type", required = false) final PostType type,
          @Parameter(description = "Czy zwrócić tylko aktywne posty") @RequestParam(value = "active", defaultValue = "false") final boolean onlyActive) {
    validatePageable(request, pageable);
    final Page<Posts> page = service.list(pageable, type, onlyActive);
    final Page<PostResponseDto> mapped = page.map(mapper::toResponse);

    final Map<String, Object> response = new LinkedHashMap<>();
    response.put("items", mapped.getContent());

    if (!mapped.isEmpty()) {
      final Map<String, Object> pageInfo = new LinkedHashMap<>();
      pageInfo.put("page", mapped.getNumber());
      pageInfo.put("size", mapped.getSize());
      pageInfo.put("totalElements", mapped.getTotalElements());
      pageInfo.put("totalPages", mapped.getTotalPages());
      pageInfo.put("first", mapped.isFirst());
      pageInfo.put("last", mapped.isLast());
      response.put("page", pageInfo);
    }

    return ResponseEntity.ok(response);
  }

  /**
   * Deletes a post by ID.
   *
   * @param postId the post ID to delete
   * @return response entity with no content
   */
  @Operation(summary = "Usuń post", description = "Trwale usuwa wpis z bazy danych. Endpoint wymaga zalogowania.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "204", description = "Pomyślnie usunięto post"),
          @ApiResponse(
                  responseCode = "404",
                  description = "Nie znaleziono posta",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.POST_404))
          )
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
          @Parameter(description = "ID posta", example = "1") @PathVariable("id") final Long postId) {
    service.delete(postId);
    return ResponseEntity.noContent().build();
  }

  private void validateRequest(final PostRequestDto dto) {
    final Map<String, String> errors = new LinkedHashMap<>();

    validateCoreFields(dto, errors);
    validateTranslations(dto.translations(), errors);

    if (!errors.isEmpty()) {
      throw new PostValidationException(errors);
    }
  }

  private void validateCoreFields(final PostRequestDto dto, final Map<String, String> errors) {
    if (dto.postType() == null) {
      errors.put("postType", "must not be null");
    }
    if (dto.eventDate() == null) {
      errors.put("eventDate", "must not be null");
    }
  }

  private void validateTranslations(
      final List<algo.dto.PostTranslationDto> translations, final Map<String, String> errors) {

    if (translations == null || translations.isEmpty()) {
      errors.put("translations", "must not be empty");
      return;
    }

    for (int i = 0; i < translations.size(); i++) {
      validateSingleTranslation(translations.get(i), i, errors);
    }
  }

  private void validateSingleTranslation(
      final algo.dto.PostTranslationDto translation,
      final int index,
      final Map<String, String> errors) {

    final String prefix = "translations[" + index + "]";

    if (translation == null) {
      errors.put(prefix, "must not be null");
      return;
    }

    if (!hasText(translation.languageCode())) {
      errors.put(prefix + ".languageCode", "must not be blank");
    }
    if (!hasText(translation.title())) {
      errors.put(prefix + ".title", "must not be blank");
    }
    if (!hasText(translation.fullDescription())) {
      errors.put(prefix + ".fullDescription", "must not be blank");
    }
  }

  private boolean hasText(final String value) {
    return StringUtils.hasText(value);
  }

  private void validatePageable(final HttpServletRequest request, final Pageable pageable) {
    final String rawPage = request.getParameter("page");
    if (hasText(rawPage)) {
      final int parsedPage = Integer.parseInt(rawPage);
      if (parsedPage < 0) {
        throw new IllegalArgumentException("Parameter 'page' must be >= 0.");
      }
    }
    final String rawSize = request.getParameter("size");
    if (hasText(rawSize)) {
      final int parsedSize = Integer.parseInt(rawSize);
      if (parsedSize <= 0 || parsedSize > MAX_PAGE_SIZE) {
        throw new IllegalArgumentException(
            "Parameter 'size' must be between 1 and " + MAX_PAGE_SIZE + ".");
      }
    }
    final int page = pageable.getPageNumber();
    final int size = pageable.getPageSize();
    if (page < 0) {
      throw new IllegalArgumentException("Parameter 'page' must be >= 0.");
    }
    if (size <= 0 || size > MAX_PAGE_SIZE) {
      throw new IllegalArgumentException(
          "Parameter 'size' must be between 1 and " + MAX_PAGE_SIZE + ".");
    }
  }
}
