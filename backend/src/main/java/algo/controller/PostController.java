package algo.controller;

import algo.dto.PostRequestDto;
import algo.dto.PostResponseDto;
import algo.services.PostService;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller handling post-related endpoints. */
@RestController
@RequestMapping("/api/posts")
@AllArgsConstructor
public class PostController {

  /** Service handling post-related operations. */
  private final PostService postService;

  /**
   * Retrieves all posts.
   *
   * @return list of all posts
   */
  @GetMapping
  public ResponseEntity<List<PostResponseDto>> getAllPosts() {
    return ResponseEntity.ok(postService.getAllPosts());
  }

  /**
   * Retrieves a single post by ID.
   *
   * @param postId the ID of the post
   * @return the post with the given ID
   */
  @GetMapping("/{postId}")
  public ResponseEntity<PostResponseDto> getPostById(@PathVariable final Long postId) {
    return ResponseEntity.ok(postService.getPostById(postId));
  }

  /**
   * Creates a new post.
   *
   * @param request the post data
   * @return the created post
   */
  @PostMapping
  public ResponseEntity<PostResponseDto> createPost(@RequestBody final PostRequestDto request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(request));
  }
}
