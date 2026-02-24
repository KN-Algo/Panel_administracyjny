package algo.module;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_translations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"post_id", "language_code"})
})
@Getter @Setter @NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PostTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(name = "language_code", nullable = false, length = 5)
    private String languageCode;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "short_description", nullable = false, length = 400)
    private String shortDescription;

    @Column(name = "full_description", nullable = false, columnDefinition = "TEXT")
    private String fullDescription;
}