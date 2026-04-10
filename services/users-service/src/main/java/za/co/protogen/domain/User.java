package za.co.protogen.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {

    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String rsaId;
}