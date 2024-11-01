package za.co.protogen.core;

import za.co.protogen.domain.UserDTO;

import java.time.LocalDate;
import java.util.List;

public interface UserService {

    void addUser(UserDTO userDTO);

    void removeUser(Long id);

    UserDTO getUserById(Long id);

    List<UserDTO> getAllUsers();

    void updateUser(Long id, UserDTO updatedUser);

    List<UserDTO> searchUsers(Long id, String firstName, String lastName, LocalDate dateOfBirth, String rsaId);
}
