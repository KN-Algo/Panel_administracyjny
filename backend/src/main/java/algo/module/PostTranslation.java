package algo.module;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity representing a translation of a post. */
@Entity
@Table(
    name = "post_translations",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"post_id", "language_code"})})
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PostTranslation {

  /** Max length of language code column. */
  private static final int LANG_CODE_LENGTH = 5;

  /** Max length of title column. */
  private static final int TITLE_LENGTH = 200;

  /** Max length of short description column. */
  private static final int SHORT_DESC_LENGTH = 400;

  /** Unique identifier. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long translationId;

  /** The post this translation belongs to. */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private PostEntity post;

  /** Language code of the translation. */
  @Column(name = "language_code", nullable = false, length = LANG_CODE_LENGTH)
  private String languageCode;

  /** Title of the post in this language. */
  @Column(name = "title", nullable = false, length = TITLE_LENGTH)
  private String title;

  /** Short description of the post in this language. */
  @Column(name = "short_description", nullable = false, length = SHORT_DESC_LENGTH)
  private String shortDescription;

  /** Full description of the post in this language. */
  @Column(name = "full_description", nullable = false, columnDefinition = "TEXT")
  private String fullDescription;
}
