package algo.module;

import algo.dto.PostTranslationDto;
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

/** Represents a single translation entry for a Post. */
@Entity
@Table(
    name = "post_translations",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"post_id", "language_code"})})
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PostTranslation {

  /** Primary key of the translation entity. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  @EqualsAndHashCode.Include
  private Long id;

  /** Parent Post entity this translation belongs to. */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Posts post;

  /** Language code of the translation (e.g. "en", "pl"). */
  @Column(name = "language_code", nullable = false, length = PostTranslationDto.LANG_CODE_LENGTH)
  private String languageCode;

  /** Translated title of the post. */
  @Column(name = "title", nullable = false, length = PostTranslationDto.TITLE_LENGTH)
  private String title;

  /** Short translated description. */
  @Column(
      name = "short_description",
      length = PostTranslationDto.SHORT_DESC_LENGTH)
  private String shortDescription;

  /** Full translated content. */
  @Column(name = "full_description", nullable = false, columnDefinition = "TEXT")
  private String fullDescription;
}
