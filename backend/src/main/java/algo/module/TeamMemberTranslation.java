package algo.module;

import algo.dto.TeamMemberTranslationDto;
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

/** Represents a single translation entry for a Team Member. */
@Entity
@Table(
        name = "team_member_translations",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"member_id", "language_code"})})
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TeamMemberTranslation {

    /** Primary key of the translation entity. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Long id;

    /** Parent TeamMember entity this translation belongs to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private TeamMember teamMember;

    /** Language code of the translation (e.g. "en", "pl"). */
    @Column(name = "language_code", nullable = false, length = TeamMemberTranslationDto.LANG_CODE_LENGTH)
    private String languageCode;

    /** Translated title of the team member. */
    @Column(name = "displayed_title", nullable = false, length = TeamMemberTranslationDto.DISPLAYED_TITLE_LENGTH)
    private String displayedTitle;

    /** Translated personal description. */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}