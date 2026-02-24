package algo.module;

import com.example.posts.module.Post;
import com.example.posts.module.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;


public  interface PostRepository extends JpaRepository<Post, Long> {

    @EntityGraph(attributesPaths = "translations")
    Optional<Post> findWithTranslationsById(Long Id);

    Page<Post> fingAllByPostTypeIN(Collection<PostType> types, Pageable pageable);

    @Query("""
            select p from Post p
            where p.postType in :types
            and (p.starts.at is null or p.startsAt <= :now)
            and (p.end.At is null or p.end.At >= :now)
            """)
    Page<Post> finActiveTempPosts(Collection<PostType> types, LocalDateTime now, Pageable pageable);
}