package algo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSummary {
    private String email;
    private String name;
    private String role;
}