package algo.repository;

import algo.module.PostType;
import algo.module.Posts;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** Repository for Post entity with basic CRUD operations. */
public interface PostRepository extends JpaRepository<Posts, Long> {
  /**
   * Loads a post with its translations to avoid N+1 queries.
   *
   * @param postId id of the post
   * @return optional post with initialized translations
   */
  @EntityGraph(attributePaths = "translations")
  Optional<Posts> findWithTranslationsByPostId(Long postId);

  /**
   * Returns posts whose type is in the provided list.
   *
   * @param types allowed post types
   * @param pageable paging configuration
   * @return page of posts matching the given types
   */
  Page<Posts> findAllByPostTypeIn(Collection<PostType> types, Pageable pageable);

  /**
   * @param types allowed post types
   * @param now reference time used to check activity window
   * @param pageable paging configuration
   * @return page of active posts
   */
  @Query(
      """
      select p from Posts p
      where p.postType in :types
      and (p.startsAt is null or p.startsAt <= :now)
      and (p.expiresAt is null or p.expiresAt >= :now)
      """)
  Page<Posts> findActivePosts(Collection<PostType> types, LocalDateTime now, Pageable pageable);
}
