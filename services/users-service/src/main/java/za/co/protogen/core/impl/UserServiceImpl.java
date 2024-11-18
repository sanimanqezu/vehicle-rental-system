package za.co.protogen.core.impl;

import org.springframework.stereotype.Service;
import za.co.protogen.adapter.UserMapper;
import za.co.protogen.core.UserService;
import za.co.protogen.domain.UserDTO;
import za.co.protogen.persistance.repository.UserRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void addUser(UserDTO userDTO) {
        String rsaId = userDTO.getRsaId();
        if (rsaId.length() != 13) {
            System.out.println("Enter valid Id");
        }
        userRepository.save(UserMapper.USER_MAPPER.userDTOToUser(userDTO));
    }

    @Override
    public void removeUser(Long id) {
        boolean user = userRepository.existsById(id);
        if (!user ) {
            System.out.println("Enter User Id");
        }
        userRepository.delete(UserMapper.USER_MAPPER.userDTOToUser(getUserById(id)));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<UserDTO> users = UserMapper.USER_MAPPER.usersToUserDTOs(userRepository.findAll());
        return users;
    }

    @Override
    public UserDTO getUserById(Long id) {
        UserDTO userOptional = UserMapper.USER_MAPPER.userToUserDTO(userRepository.findById(id).get());
        return userOptional;
    }

    @Override
    public void updateUser(Long id, UserDTO updatedUser) {
        UserDTO existingUser = getUserById(id);
        if (existingUser != null && updatedUser != null) {
            if (updatedUser.getFirstName() != null && !updatedUser.getFirstName().isEmpty()) {
                existingUser.setFirstName(updatedUser.getFirstName());
            }
            if (updatedUser.getLastName() != null && !updatedUser.getLastName().isEmpty()) {
                existingUser.setLastName(updatedUser.getLastName());
            }
            if (updatedUser.getRsaId() != null && !updatedUser.getRsaId().isEmpty()) {
                existingUser.setRsaId(updatedUser.getRsaId());
            }
            userRepository.save(UserMapper.USER_MAPPER.userDTOToUser(existingUser));
        }
    }

    @Override
    public List<UserDTO> searchUsers(Long id, String firstName, String lastName, LocalDate dateOfBirth, String rsaId) {
        List<UserDTO> users = new ArrayList<>();
        if (id != null) {
            users.add(UserMapper.USER_MAPPER.userToUserDTO(userRepository.findById(id).get()));
        }
        if (firstName != null && !firstName.isEmpty()) {
            users.addAll(UserMapper.USER_MAPPER.usersToUserDTOs(userRepository.findByFirstName(firstName)));
        }
        if (lastName != null && !lastName.isEmpty()) {
            users.addAll(UserMapper.USER_MAPPER.usersToUserDTOs(userRepository.findByLastName(lastName)));
        }
        if (dateOfBirth != null) {
            users.addAll(UserMapper.USER_MAPPER.usersToUserDTOs(userRepository.findByDateOfBirth(dateOfBirth)));
        }
        if (rsaId != null && !rsaId.isEmpty()) {
            users.add(UserMapper.USER_MAPPER.userToUserDTO(userRepository.findByRsaId(rsaId)));
        }
        return users;
    }
}
