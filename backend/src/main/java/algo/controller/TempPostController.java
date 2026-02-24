package algo.controller;

import algo.dto.TempPostRequestDto;
import algo.dto.TempPostResponseDto;
import algo.dto.PostTranslationDto;
import algo.module.Post;
import algo.module.PostTranslation;
import algo.module.PostType;
import algo.services.TempPostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/temp-posts")
public class TempPostController {

    private final TempPostService service;

    public TempPostController(TempPostService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TempPostResponseDto> create(@Valid @RequestBody TempPostRequestDto dto) {
        Post entity = Mapper.toEntity(dto);
        Post saved = service.save(entity);
        return ResponseEntity.ok(Mapper.toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TempPostResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody TempPostRequestDto dto
    ) {
        Post existing = service.getOne(id);
        Mapper.updateEntity(existing, dto);
        Post saved = service.update(id, existing);
        return ResponseEntity.ok(Mapper.toResponse(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TempPostResponseDto> get(@PathVariable Long id) {
        Post entity = service.getOne(id);
        return ResponseEntity.ok(Mapper.toResponse(entity));
    }

    @GetMapping
    public ResponseEntity<Page<TempPostResponseDto>> list(
            Pageable pageable,
            @RequestParam(value = "type", required = false) PostType type,
            @RequestParam(value = "active", defaultValue = "false") boolean onlyActive
    ) {
        Page<Post> page = service.list(pageable, type, onlyActive);
        return ResponseEntity.ok(page.map(Mapper::toResponse));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static class Mapper {

        static Post toEntity(TempPostRequestDto dto) {
            Post p = new Post();
            p.setPostType(dto.postType());
            p.setEventDate(dto.eventDate());
            p.setStartsAt(dto.startsAt());
            p.setExpiresAt(dto.expiresAt());
            p.setThumbnailUrl(dto.thumbnailUrl());
            p.setImageUrls(dto.imageUrls());
            p.setExternalLink(dto.externalLink());

            if (dto.translations() != null) {
                for (PostTranslationDto t : dto.translations()) {
                    PostTranslation pt = new PostTranslation();
                    pt.setLanguageCode(t.languageCode());
                    pt.setTitle(t.title());
                    pt.setShortDescription(t.shortDescription());
                    pt.setFullDescription(t.fullDescription());
                    p.addTranslation(pt);
                }
            }

            return p;
        }

        static void updateEntity(Post target, TempPostRequestDto dto) {
            target.setPostType(dto.postType());
            target.setEventDate(dto.eventDate());
            target.setStartsAt(dto.startsAt());
            target.setExpiresAt(dto.expiresAt());
            target.setThumbnailUrl(dto.thumbnailUrl());
            target.setImageUrls(dto.imageUrls());
            target.setExternalLink(dto.externalLink());

            target.getTranslations().clear();
            if (dto.translations() != null) {
                for (PostTranslationDto t : dto.translations()) {
                    PostTranslation pt = new PostTranslation();
                    pt.setLanguageCode(t.languageCode());
                    pt.setTitle(t.title());
                    pt.setShortDescription(t.shortDescription());
                    pt.setFullDescription(t.fullDescription());
                    target.addTranslation(pt);
                }
            }
        }

        static TempPostResponseDto toResponse(Post entity) {
            List<PostTranslationDto> translations = new ArrayList<>();

            if (entity.getTranslations() != null) {
                for (PostTranslation t : entity.getTranslations()) {
                    translations.add(new PostTranslationDto(
                            t.getId(),
                            t.getLanguageCode(),
                            t.getTitle(),
                            t.getShortDescription(),
                            t.getFullDescription()
                    ));
                }
            }

            return new TempPostResponseDto(
                    entity.getId(),
                    entity.getPostType(),
                    entity.getEventDate(),
                    entity.getStartsAt(),
                    entity.getExpiresAt(),
                    entity.getThumbnailUrl(),
                    entity.getImageUrls(),
                    entity.getExternalLink(),
                    translations
            );
        }
    }
}