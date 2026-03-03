package algo.module;

import static jakarta.persistence.GenerationType.IDENTITY;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DB entity for temporary homepage announcements. */
@Entity
@Table(name = "announcements")
@Data
@NoArgsConstructor
public class TempAnnouncementModule {

  /**
   * @param announcementId id of announcement
   */
  @Id
  @GeneratedValue(strategy = IDENTITY)
  private Long announcementId;

  /**
   * @param linkUrl full link URL
   */
  @Column(name = "link_url", nullable = false)
  private String linkUrl;

  /**
   * @param imageUrl full iamge URL
   */
  @Column(name = "image_url", nullable = false)
  private String imageUrl;

  /**
   * @param isActive variable returns is the announcement is active currently
   */
  @Column(name = "is_active", nullable = false)
  private boolean isActive;

  /**
   * @param startsDate the day that announcement starts
   */
  @Column(name = "starts_date", nullable = false)
  private Long startsDate;

  /**
   * @param expiressDate the day that announcement ends
   */
  @Column(name = "expires_date", nullable = false)
  private Long expiresDate;
}
