package za.co.protogen.controller;

import za.co.protogen.usersService.api.UsersApi;
import za.co.protogen.usersService.models.UserDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import za.co.protogen.adapter.UserMapper;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import za.co.protogen.core.UserService;

@RequiredArgsConstructor
@Controller
@RequestMapping("users")
public class UsersApiController implements UsersApi {

    private final Logger logger = LoggerFactory.getLogger(UsersApiController.class);

    private final UserService userService;

    @PostMapping(produces = "application/json")
    public ResponseEntity<Void> addUser(@RequestBody UserDTO user) {
        userService.addUser(UserMapper.USER_MAPPER.userDTOToUser(user));
        logger.info("adding user");
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        logger.info("Retrieving all users");
        List<UserDTO> userDTOS = UserMapper.USER_MAPPER.usersToUserDTOs(userService.getAllUsers());
        return ResponseEntity.ok(userDTOS);
    }

    @GetMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<UserDTO> getUserById(@PathVariable BigDecimal id) {
        logger.info("Retrieving a user by Id: {}", id);
        UserDTO userDTO = UserMapper.USER_MAPPER.userToUserDTO(userService.getUserById(id.longValue()));
        return ResponseEntity.ok(userDTO);
    }

    @DeleteMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> removeUserById(@PathVariable BigDecimal id) {
        logger.info("Removing a user by Id: {}", id);
        userService.removeUser(id.longValue());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> updateUserById(@PathVariable BigDecimal id, @RequestBody UserDTO updatedUser) {
        logger.info("Updating user identified by id: {}, with user: {}", id, updatedUser.toString());
        userService.updateUser(id.longValue(), UserMapper.USER_MAPPER.userDTOToUser(updatedUser));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(value = "/search", produces = "application/json")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam(value = "id", required = false) BigDecimal id,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "dateOfBirth", required = false) LocalDate dateOfBirth,
            @RequestParam(value = "rsaId", required = false) String rsaId) {
        logger.info("Searching user(s) by the following properties: \n Id: {} \n First Name: {} \n Last Name: {} \n Date Of Birth: {} \n RSA Id: {}",
                id, firstName, lastName, dateOfBirth, rsaId);
        Long idValue = (id != null) ? id.longValue() : null;
        return ResponseEntity.ok(UserMapper.USER_MAPPER.usersToUserDTOs(userService.searchUsers(idValue, firstName, lastName, dateOfBirth, rsaId)));

    }

}
