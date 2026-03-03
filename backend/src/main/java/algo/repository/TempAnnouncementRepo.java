package algo.repository;

import algo.module.TempAnnouncementModule;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for temporary homepage announcements. */
@Repository
public interface TempAnnouncementRepo extends JpaRepository<TempAnnouncementModule, Long> {

  /**
   * Finds first currently active announcement based on current epoch millis.
   *
   * @param now current timestamp in epoch millis
   * @return active announcement if available
   */
  @Query(
      """
        SELECT a
        FROM TempAnnouncementModule a
        WHERE a.isActive = true
            AND a.startsDate <= :now
            AND a.expiresDate > :now
        ORDER BY a.expiresDate ASC
""")
  Optional<TempAnnouncementModule> findActiveNow(@Param("now") Long now);

  /**
   * Finds all announcements matching the active flag.
   *
   * @param isActive activity state
   * @return list of announcements
   */
  List<TempAnnouncementModule> findByIsActive(boolean isActive);
}
