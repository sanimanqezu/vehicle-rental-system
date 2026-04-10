package za.co.protogen.persistance.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {
    @Id
    @Column(name = "id")
    private Long id;
    @Column(name = "firstName")
    private String firstName;
    @Column(name = "lastName")
    private String lastName;
    @Column(name = "dateOfBirth")
    private LocalDate dateOfBirth;
    @Column(name = "rsaId")
    private String rsaId;
    @Column(name="username")
    private String username;
    @Column(name="password")
    private String password;
}
