package za.co.protogen.core;

import za.co.protogen.persistance.User;

import java.time.LocalDate;
import java.util.List;

public interface UserService {

    void addUser(User user);

    void removeUser(Long id);

    User getUserById(Long id);

    List<User> getAllUsers();

    void updateUser(Long id, User updatedUser);

    List<User> searchUsers(Long id, String firstName, String lastName, LocalDate dateOfBirth, String rsaId);
}
