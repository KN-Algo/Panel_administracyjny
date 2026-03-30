package algo.module;

import algo.dto.PostRequestDto;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Represents a post with metadata, timing, and language translations. */
@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Posts {
  /** Max length for post type enum name persisted as string. */
  public static final int POST_TYPE_L = 50;

  /** Primary key of the post entity. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long postId;

  /** Type/category of the post. */
  @Enumerated(EnumType.STRING)
  @Column(name = "post_type", nullable = false, length = POST_TYPE_L)
  private PostType postType;

  /** Business/event date associated with the post. */
  @Column(name = "event_date", nullable = false)
  private LocalDateTime eventDate;

  /** Start datetime when the post becomes active. */
  @Column(name = "starts_at")
  private LocalDateTime startsAt;

  /** Expiration datetime when the post is no longer active (optional). */
  @Column(name = "expires_at")
  private LocalDateTime expiresAt;

  /** URL of the thumbnail image. */
  @Column(name = "thumbnail_url", nullable = false, length = PostRequestDto.THUMBNAIL_URL_L)
  private String thumbnailUrl;

  /** Comma-separated list of image URLs (if applicable). */
  @Column(name = "image_urls", length = PostRequestDto.IMAGE_URLS_L)
  private String imageUrls;

  /** External link related to the post content. */
  @Column(name = "external_link", nullable = false, length = PostRequestDto.EXTERNAL_LINK_L)
  private String externalLink;

  /** Localized translations of this post. */
  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
  @Setter(AccessLevel.NONE)
  private final List<PostTranslation> translations = new ArrayList<>();

  /**
   * Adds a translation and sets the back-reference to this post.
   *
   * @param translation the translation to add
   */
  public void addTranslation(final PostTranslation translation) {
    translations.add(translation);
    translation.setPost(this);
  }

  /** Clears all translations from this post. */
  public void clearTranslations() {
    translations.clear();
  }
}
