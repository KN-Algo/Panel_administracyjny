package algo.repository;

import algo.module.TeamMember;
import algo.module.TeamRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing {@link TeamMember} entities.
 */
@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    /**
     * Retrieves a list of team members filtered by their role.
     *
     * @param role the role to filter by
     * @return a list of team members with the specified role
     */
    List<TeamMember> findAllByRole(TeamRole role);
}