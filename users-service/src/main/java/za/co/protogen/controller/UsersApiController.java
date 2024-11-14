package za.co.protogen.controller;

import za.co.protogen.domain.UserDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

import za.co.protogen.core.impl.UserServiceImpl;

@RequiredArgsConstructor
@Controller
@RequestMapping("rest/auth/users")
public class UsersApiController {

    private final Logger logger = LoggerFactory.getLogger(UsersApiController.class);

    private final UserServiceImpl usersService;

    @PostMapping(produces = "application/json")
    public ResponseEntity<Void> addUser(@RequestBody UserDTO user) {
        logger.info("Adding user: {}", user.toString());
        usersService.addUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        logger.info("Retrieving all users");
        return ResponseEntity.ok(usersService.getAllUsers());
    }

    @GetMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<UserDTO> getUserById(@PathVariable BigDecimal id) {
        logger.info("Retrieving a user by Id: {}", id);
        return ResponseEntity.ok(usersService.getUserById(id.longValue()));
    }

    @DeleteMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> removeUserById(@PathVariable BigDecimal id) {
        logger.info("Removing a user by Id: {}", id);
        usersService.removeUser(id.longValue());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> updateUserById(@PathVariable BigDecimal id, @RequestBody UserDTO updatedUser) {
        logger.info("Updating user identified by id: {}, with user: {}", id, updatedUser.toString());
        usersService.updateUser(id.longValue(), updatedUser);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(value = "/search", produces = "application/json")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam(value = "id", required = false) BigDecimal id,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "dateOfBirth", required = false) LocalDate dateOfBirth,
            @RequestParam(value = "rsaId", required = false) String rsaId) {
        logger.info("Searching user(s) by the following properties: \n Id: {} \n First Name: {} \n Last Name: {} \n Date Of Birth: {} \n RSA Id: {}",
                id, firstName, lastName, dateOfBirth, rsaId);
        return ResponseEntity.ok(usersService.searchUsers(id.longValue(), firstName, lastName, dateOfBirth, rsaId));
    }
}
