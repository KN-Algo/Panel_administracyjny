package algo.module;

import jakarta.persistence.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Represents a team member, board member, or mascot for the "Team" tab. */
@Entity
@Table(name = "team_members")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TeamMember {
    /** Max length for role enum name persisted as string. */
    public static final int ROLE_L = 50;

    /** Primary key of the team member entity. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "member_id")
    private Long memberId;

    /** First name of the team member. */
    @Column(name = "first_name", nullable = false)
    private String firstName;

    /** Last name of the team member. */
    @Column(name = "last_name", nullable = false)
    private String lastName;

    /** Internal role used for grouping members into sections (e.g., BOARD vs MEMBER). */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = ROLE_L)
    private TeamRole role;

    @OneToMany(mappedBy = "teamMember", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    @Setter(lombok.AccessLevel.NONE)
    private final List<TeamMemberTranslation> translations = new java.util.ArrayList<>();

    /** Comma-separated list of image URLs (e.g., avatar, additional photos). */
    @Column(name = "image_urls", columnDefinition = "TEXT")
    private String imageUrls;

    /**
     * Adds a translation and sets the back-reference to this team member.
     *
     * @param translation the translation to add
     */
    public void addTranslation(final TeamMemberTranslation translation) {
        translations.add(translation);
        translation.setTeamMember(this);
    }

    /** Clears all translations from this team member. */
    public void clearTranslations() {
        translations.clear();
    }

    /** Dynamic map of social links (platform name -> URL). */
    @ElementCollection
    @CollectionTable(name = "team_member_socials", joinColumns = @JoinColumn(name = "member_id"))
    @MapKeyColumn(name = "platform")
    @Column(name = "url")
    private Map<String, String> socialLinks = new HashMap<>();

    /**
     * Converts the comma-separated string of image URLs into a List.
     *
     * @return a list of image URLs, or an empty list if no images are stored
     */
    public List<String> getImageUrlsAsList() {
        if (this.imageUrls == null || this.imageUrls.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.asList(this.imageUrls.split(","));
    }

    /**
     * Converts a List of image URLs into a comma-separated string and stores it.
     *
     * @param urlsList the list of image URLs to store
     */
    public void setImageUrlsFromList(final List<String> urlsList) {
        if (urlsList == null || urlsList.isEmpty()) {
            this.imageUrls = null;
        } else {
            this.imageUrls = String.join(",", urlsList);
        }
    }
}