package za.co.protogen.persistance;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "users")
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

    public User() {
    }

    public User(Long id, String firstName, String lastName, LocalDate dateOfBirth, String rsaId, String username, String password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.rsaId = rsaId;
        this.username = username;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getRsaId() {
        return rsaId;
    }

    public void setRsaId(String rsaId) {
        this.rsaId = rsaId;
    }

    public String getUsername() {return username; }

    public void setUsername(String username) {this.username = username;}

    public String getPassword() {return password;}

    public void setPassword(String password) {this.password = password;}
}
