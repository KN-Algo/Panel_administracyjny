package algo.repository;

import algo.module.TeamMember;
import algo.module.TeamRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing {@link TeamMember} entities.
 */
@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    @Query("SELECT t FROM TeamMember t WHERE " +
            "(:role IS NULL OR t.role = :role) AND " +
            "(:search = '' OR " +
            "LOWER(t.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(t.lastName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY t.sortOrder ASC")
    List<TeamMember> findAllWithFilters(@Param("role") TeamRole role, @Param("search") String search);

}