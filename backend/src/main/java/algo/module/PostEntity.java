package algo.module;

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
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity representing a post in the database. */
@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PostEntity {

  /** Max length of post type column. */
  private static final int POST_TYPE_LENGTH = 50;

  /** Max length of URL columns. */
  private static final int URL_LENGTH = 500;

  /** Max length of image URLs column. */
  private static final int IMAGE_URLS_LENGTH = 2000;

  /** Unique identifier. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long postId;

  /** Type of the post. */
  @Enumerated(EnumType.STRING)
  @Column(name = "post_type", nullable = false, length = POST_TYPE_LENGTH)
  private PostType postType;

  /** Date of the event. */
  @Column(name = "event_date", nullable = false)
  private LocalDateTime eventDate;

  /** Date when the post becomes active. */
  @Column(name = "starts_at")
  private LocalDateTime startsAt;

  /** Date when the post expires. */
  @Column(name = "expires_at")
  private LocalDateTime expiresAt;

  /** URL of the thumbnail image. */
  @Column(name = "thumbnail_url", nullable = false, length = URL_LENGTH)
  private String thumbnailUrl;

  /** URLs of additional images. */
  @Column(name = "image_urls", length = IMAGE_URLS_LENGTH)
  private String imageUrls;

  /** External link associated with the post. */
  @Column(name = "external_link", nullable = false, length = URL_LENGTH)
  private String externalLink;

  /** List of translations for this post. */
  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<PostTranslation> translations = new ArrayList<>();

  /**
   * Adds a translation to this post.
   *
   * @param translation the translation to add
   */
  public void addTranslation(final PostTranslation translation) {
    translations.add(translation);
    translation.setPost(this);
  }
}
