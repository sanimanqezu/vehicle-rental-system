package za.co.protogen.adapter;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import za.co.protogen.domain.UserDTO;
import za.co.protogen.persistance.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    UserMapper USER_MAPPER = Mappers.getMapper(UserMapper.class);

    UserDTO userToUserDTO(User user);

    User userDTOToUser(UserDTO userDTO);

    List<UserDTO> usersToUserDTOs(List<User> users);

    List<User> userDTOsToUsers(List<UserDTO> userDTOS);
}
