package za.co.protogen.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import za.co.protogen.core.UserService;
import za.co.protogen.persistance.entity.User;
import za.co.protogen.usersService.models.UserDTO;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UsersApiController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, OAuth2ResourceServerAutoConfiguration.class})
@AutoConfigureMockMvc(addFilters = false)
class UsersApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    private User sample() {
        return new User(1L, "Thabo", "Mokoena",
                LocalDate.of(1990, 5, 20), "9005205000080", "thabo", "secret");
    }

    @Test
    void getAllUsers_returns200WithList() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(sample()));

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].firstName").value("Thabo"));

        verify(userService).getAllUsers();
    }

    @Test
    void getUserById_returns200() throws Exception {
        when(userService.getUserById(1L)).thenReturn(sample());

        mockMvc.perform(get("/users/id/{id}", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Mokoena"));

        verify(userService).getUserById(1L);
    }

    @Test
    void addUser_returns200AndDelegates() throws Exception {
        UserDTO dto = new UserDTO();
        dto.setId(1L);
        dto.setFirstName("Thabo");

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(userService).addUser(any(User.class));
    }

    @Test
    void updateUserById_returns200AndDelegates() throws Exception {
        UserDTO dto = new UserDTO();
        dto.setFirstName("Sipho");

        mockMvc.perform(put("/users/id/{id}", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(userService).updateUser(eq(1L), any(User.class));
    }

    @Test
    void removeUserById_returns200AndDelegates() throws Exception {
        mockMvc.perform(delete("/users/id/{id}", "1"))
                .andExpect(status().isOk());

        verify(userService).removeUser(1L);
    }

    @Test
    void searchUsers_passesQueryParams() throws Exception {
        when(userService.searchUsers(null, "Thabo", "Mokoena", null, null))
                .thenReturn(List.of(sample()));

        mockMvc.perform(get("/users/search")
                        .param("firstName", "Thabo")
                        .param("lastName", "Mokoena"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        verify(userService).searchUsers(null, "Thabo", "Mokoena", null, null);
    }
}
