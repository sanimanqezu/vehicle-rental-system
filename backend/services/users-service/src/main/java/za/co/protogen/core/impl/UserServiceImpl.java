package za.co.protogen.core.impl;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.stereotype.Service;
import za.co.protogen.core.UserService;
import za.co.protogen.persistance.entity.User;
import za.co.protogen.persistance.repository.UserRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public void addUser(User user) {
        String hashedPassword = PasswordEncoderFactories.createDelegatingPasswordEncoder().encode(user.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
    }
    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Override
    public void removeUser(Long id) {
        if (!userRepository.existsById(id)) {
            System.out.println("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public User getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.orElseThrow(() -> new IllegalStateException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void updateUser(Long id, User updatedUser) {
        User existingUser = getUserById(id);
        if (existingUser != null) {
            existingUser.setId(updatedUser.getId());
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setDateOfBirth(updatedUser.getDateOfBirth());
            existingUser.setRsaId(updatedUser.getRsaId());
        }
    }

    @Override
    public List<User> searchUsers(Long id, String firstName, String lastName, LocalDate dateOfBirth, String rsaId) {
        List<User> users = new ArrayList<>();
        if (id != null) {
            users.add(userRepository.findById(id).get());
        }
        if (firstName != null && !firstName.isEmpty()) {
            users.addAll(userRepository.findByFirstName(firstName));
        }
        if (lastName != null && !lastName.isEmpty()) {
            users.addAll(userRepository.findByLastName(lastName));
        }
        if (dateOfBirth != null) {
            users.addAll(userRepository.findByDateOfBirth(dateOfBirth));
        }
        if (rsaId != null && !rsaId.isEmpty()) {
            users.add(userRepository.findByRsaId(rsaId));
        }
        return users;
    }

}
