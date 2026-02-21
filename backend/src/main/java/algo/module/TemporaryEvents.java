package algo.module;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.*;

@Entity
@Table(name = "temporary_events")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA wymaga bezargumentowego konstruktora
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TemporaryEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Lob
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "event_date")
    private LocalDateTime eventDate;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "thumbnail", nullable = false, length = 500)
    private String thumbnail;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "images", nullable = false, length = 2000)
    private String images;

    @Column(name = "short_description", nullable = false, length = 400)
    private String shortDescription;

    @Column(name = "link", nullable = false, length = 500)
    private String link;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "starts_at")
    private LocalDateTime startsAt;
}