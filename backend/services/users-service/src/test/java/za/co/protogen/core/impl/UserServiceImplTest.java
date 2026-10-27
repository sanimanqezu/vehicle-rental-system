package za.co.protogen.core.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import za.co.protogen.persistance.entity.User;
import za.co.protogen.persistance.repository.UserRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User(1L, "Thabo", "Mokoena",
                LocalDate.of(1990, 5, 20), "9005205000080", "thabo", "rawPassword");
    }

    @Test
    void addUser_hashesPasswordBeforeSaving() {
        userService.addUser(user);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        String stored = captor.getValue().getPassword();
        assertThat(stored).isNotEqualTo("rawPassword");
        assertThat(stored).startsWith("{"); // delegating encoder prefixes the algorithm id
    }

    @Test
    void loadUserByUsername_returnsUser_whenFound() {
        when(userRepository.findByUsername("thabo")).thenReturn(Optional.of(user));

        assertThat(userService.loadUserByUsername("thabo")).isSameAs(user);
    }

    @Test
    void loadUserByUsername_throws_whenNotFound() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.loadUserByUsername("ghost"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("ghost");
    }

    @Test
    void getUserById_returnsUser_whenFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThat(userService.getUserById(1L)).isSameAs(user);
    }

    @Test
    void getUserById_throws_whenNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void removeUser_deletesById_whenExists() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.removeUser(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void removeUser_throwsAndDoesNotDelete_whenMissing() {
        when(userRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> userService.removeUser(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("User not found");

        verify(userRepository, never()).deleteById(anyLong());
    }

    @Test
    void getAllUsers_delegatesToRepository() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        assertThat(userService.getAllUsers()).containsExactly(user);
    }

    @Test
    void updateUser_overwritesCoreProfileFields() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User patch = new User();
        patch.setId(1L);
        patch.setFirstName("Sipho");
        patch.setLastName("Dlamini");
        patch.setDateOfBirth(LocalDate.of(1988, 1, 1));
        patch.setRsaId("8801015000081");

        userService.updateUser(1L, patch);

        assertThat(user.getFirstName()).isEqualTo("Sipho");
        assertThat(user.getLastName()).isEqualTo("Dlamini");
        assertThat(user.getRsaId()).isEqualTo("8801015000081");
        assertThat(user.getDateOfBirth()).isEqualTo(LocalDate.of(1988, 1, 1));
    }

    @Test
    void updateUser_throws_whenUserMissing() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUser(1L, new User()))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void searchUsers_aggregatesByNameCriteria() {
        when(userRepository.findByFirstName("Thabo")).thenReturn(List.of(user));
        when(userRepository.findByLastName("Mokoena")).thenReturn(List.of(user));

        List<User> result = userService.searchUsers(null, "Thabo", "Mokoena", null, null);

        assertThat(result).containsExactly(user, user);
        verify(userRepository, org.mockito.Mockito.never()).findByDateOfBirth(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void searchUsers_byIdResolvesSingleUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThat(userService.searchUsers(1L, null, null, null, null)).containsExactly(user);
    }

    @Test
    void searchUsers_byMissingId_returnsEmpty() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThat(userService.searchUsers(99L, null, null, null, null)).isEmpty();
    }

    @Test
    void searchUsers_byRsaIdResolvesSingleUser() {
        when(userRepository.findByRsaId("9005205000080")).thenReturn(user);

        assertThat(userService.searchUsers(null, null, null, null, "9005205000080"))
                .containsExactly(user);
    }

    @Test
    void searchUsers_returnsEmpty_whenNoCriteria() {
        assertThat(userService.searchUsers(null, null, null, null, null)).isEmpty();
        verify(userRepository, org.mockito.Mockito.never()).findById(anyLong());
    }
}
