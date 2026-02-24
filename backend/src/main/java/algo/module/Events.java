package algo.module;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import lombok.*;

public enum PostType{
    STANDARD,
    NEWS,
    TEMP_STANDARD,
    TEMP_NEWS
}

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Posts {

    @Id
    @GeneratedV
}