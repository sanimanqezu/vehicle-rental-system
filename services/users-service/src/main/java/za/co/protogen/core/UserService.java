package za.co.protogen.core;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import za.co.protogen.persistance.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface UserService {

    void addUser(User user);

    User loadUserByUsername(String username) throws UsernameNotFoundException;

    void removeUser(Long id);

    User getUserById(Long id);

    List<User> getAllUsers();

    void updateUser(Long id, User updatedUser);

    List<User> searchUsers(Long id, String firstName, String lastName, LocalDate dateOfBirth, String rsaId);
}
