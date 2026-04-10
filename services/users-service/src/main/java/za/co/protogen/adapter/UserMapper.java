package za.co.protogen.adapter;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import za.co.protogen.usersService.models.UserDTO;
import za.co.protogen.persistance.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper USER_MAPPER = Mappers.getMapper(UserMapper.class);

    UserDTO userToUserDTO(User user);

    User userDTOToUser(UserDTO userDTO);

    List<UserDTO> usersToUserDTOs(List<User> users);

    List<User> userDTOsToUsers(List<UserDTO> userDTOS);
}
