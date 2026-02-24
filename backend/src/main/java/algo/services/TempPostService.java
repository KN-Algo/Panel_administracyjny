package algo.security;

import com.example.module.Post;
import com.example.module.PostType;
import com.example.repository.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class TempPostService {

    private static final List<PostType> TEMP_TYPES =
            List.of(PostType.TEMP_STANDARD, PostType.TEMP_NEWS);

    private final PostRepository postRepository;
    private final Clock clock;

    public TempPostService(PostRepository postRepository) {
        this(postRepository, Clock.systemDefaultZone());
    }

    public TempPostService(PostRepository postRepository, Clock clock) {
        this.postRepository = postRepository;
        this.clock = clock;
    }


    @Transactional
    public Post save(Post entity) {
        ensureTemp(entity.getPostType());
        validateTempDates(entity);
        return postRepository.save(entity);
    }


    @Transactional
    public Post update(Long id, Post mergedEntity) {
        Post existing = postRepository.findWithTranslationsById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));

        ensureTemp(existing.getPostType());
        validateTempDates(mergedEntity);

        mergedEntity.setId(id);

        return postRepository.save(mergedEntity);
    }


    @Transactional
    public Post getOne(Long id) {
        Post entity = postRepository.findWithTranslationsById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));

        ensureTemp(entity.getPostType());
        return entity;
    }


    @Transactional
    public void delete(Long id) {
        Post entity = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));

        ensureTemp(entity.getPostType());
        postRepository.delete(entity);
    }


    @Transactional
    public Page<Post> list(Pageable pageable, PostType type, boolean onlyActive) {

        if (type != null) {
            ensureTemp(type);
        }

        List<PostType> types = (type == null) ? TEMP_TYPES : List.of(type);

        if (!onlyActive) {
            return postRepository.findAllByPostTypeIn(types, pageable);
        }


        LocalDateTime now = LocalDateTime.now(clock);

        return postRepository.findActiveTempPosts(types, now, pageable);
    }


    private void ensureTemp(PostType type) {
        if (!TEMP_TYPES.contains(type)) {
            throw new IllegalArgumentException("Only TEMP posts are allowed here.");
        }
    }

    private void validateTempDates(Post entity) {
        if (entity.getStartsAt() == null || entity.getExpiresAt() == null) {
            throw new IllegalArgumentException("TEMP posts must have startsAt and expiresAt dates.");
        }
        if (entity.getExpiresAt().isBefore(entity.getStartsAt())) {
            throw new IllegalArgumentException("expiresAt must be >= startsAt.");
        }
    }
}