package algo.repository;

import algo.module.PostEntity;
import algo.module.PostType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** JPA Repository for Post entity. Handles database operations. */
@Repository
public interface PostRepository extends JpaRepository<PostEntity, Long> {

  /**
   * Finds a post by ID with translations eagerly loaded.
   *
   * @param postId the ID of the post
   * @return optional post with translations
   */
  @EntityGraph(attributePaths = "translations")
  Optional<PostEntity> findWithTranslationsById(Long postId);

  /**
   * Finds all posts by post type.
   *
   * @param types collection of post types
   * @return list of posts
   */
  List<PostEntity> findAllByPostTypeIn(Collection<PostType> types);
}
