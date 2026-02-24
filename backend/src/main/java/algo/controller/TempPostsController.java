package algo.controller;

import com.example.posts.dto.TempPostRequestDto;
import com.example.posts.dto.TempPostResponseDto;
import com.example.posts.module.PostType;
import com.example.posts.service.TempPostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/temp-posts")
public class TempPostController {
    private final TempPostService service;

    public TempPostController(TempPostService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TempPostResponseDto> create(@Valid @RequestBody
    TempPostRequestDto dto) {
        Post entity = TempPostMapper.toEntity(dto);
        Post saved = service.saveEntity(entity);
        return ResponseEntity.ok(TempPostMapper.toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TempPostResponseDto> update@PathVariable Long id;
    @Valid @RequestBody TempPostRequestDto dto){
        Post updated = service.updateEntity(id, dto);
        return ResponseEntity.ok(TempPostMapper.toResponse(updated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TempPostResponseDto> get(@PathVariable Long id){
        Post entity = service.getEntityById(id);
        return  ResponseEntity.ok(TempPostMapper.toResponse(entity));
    }
}