package algo.module;

import algo.dto.ProjectTranslationDto;
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

/** Translation entity for a single project. */
@Entity
@Table(
    name = "project_translations",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"project_id", "language_code"})})
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ProjectTranslation {

  /** Primary key of translation. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long id;

  /** Back-reference to project. */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "project_id", nullable = false)
  private Project project;

  /** Language code like "pl", "en", "de". */
  @Column(name = "language_code", nullable = false, length = ProjectTranslationDto.LANG_CODE_LENGTH)
  private String languageCode;

  /** Translated title. */
  @Column(name = "title", nullable = false, length = ProjectTranslationDto.TITLE_LENGTH)
  private String title;

  /** Translated description (can include HTML). */
  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;
}

