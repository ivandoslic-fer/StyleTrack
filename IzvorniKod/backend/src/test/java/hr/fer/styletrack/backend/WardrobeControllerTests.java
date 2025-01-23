package hr.fer.styletrack.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import hr.fer.styletrack.backend.controllers.WardrobesController;
import hr.fer.styletrack.backend.dtos.WardrobeDetailedDto;
import hr.fer.styletrack.backend.dtos.WardrobeDto;
import hr.fer.styletrack.backend.entities.Role;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.entities.Wardrobe;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.repos.IWardrobeRepository;
import hr.fer.styletrack.backend.misc.StyleTrackUserDetails;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@TestPropertySource(locations = "classpath:application-integrationtest.properties")
@SpringBootTest
@AutoConfigureMockMvc
class WardrobeControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IUserRepository userRepository;

    @MockBean
    private IWardrobeRepository wardrobeRepository;

    @Test
    @WithMockUser(username = "testUser")
    void shouldGetWardrobesForUser() throws Exception {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");

        Wardrobe wardrobe = new Wardrobe();
        wardrobe.setWardrobeId(1L);
        wardrobe.setWardrobeName("Test Wardrobe");
        wardrobe.setUser(user);
        wardrobe.setSections(new ArrayList<>());

        user.setWardrobes(List.of(wardrobe));

        Mockito.when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));
        Mockito.when(wardrobeRepository.findAll()).thenReturn(new ArrayList<>() {{
            add(wardrobe);
        }});

        StyleTrackUserDetails authenticatedPrincipal = Mockito.mock(StyleTrackUserDetails.class);
        Mockito.when(authenticatedPrincipal.getUsername()).thenReturn("testUser");

        // Act & Assert
        mockMvc.perform(get("/api/wardrobes/")
                        .param("username", "testUser")
                        .param("forSharing", "false")
                        .with(user(authenticatedPrincipal))// Inject principal directly
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].wardrobeName").value("Test Wardrobe"));
    }

    @Test
    void shouldGetWardrobeById() throws Exception {
        // Arrange
        Wardrobe wardrobe = new Wardrobe();
        wardrobe.setWardrobeId(1L);
        wardrobe.setWardrobeName("Test Wardrobe");
        wardrobe.setUser(new User());
        wardrobe.getUser().setUsername("testUser");
        wardrobe.setSections(new ArrayList<>());
        wardrobe.setPublic(true);

        Mockito.when(wardrobeRepository.findById(1L)).thenReturn(Optional.of(wardrobe));

        // Mock authenticated principal in Spring Security context
        StyleTrackUserDetails authenticatedPrincipal = Mockito.mock(StyleTrackUserDetails.class);
        Mockito.when(authenticatedPrincipal.getUsername()).thenReturn("testUser");

        // Act & Assert
        mockMvc.perform(get("/api/wardrobes/1")
                        .with(user(authenticatedPrincipal))// Inject principal directly
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wardrobeName").value("Test Wardrobe"));
    }


    @Test
    @WithMockUser(username = "testUser")
    void shouldReturnNotFoundForInvalidWardrobeId() throws Exception {
        // Arrange
        Mockito.when(wardrobeRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/wardrobes/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "testUser")
    void shouldCreateNewWardrobe() throws Exception {
        // Arrange
        WardrobeDto newWardrobeDto = new WardrobeDto(1L, null, "New Wardrobe", "A new wardrobe description", false, null, null);

        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setRoles(List.of(new Role("PERSONAL_USER")));

        StyleTrackUserDetails authenticatedPrincipal = new StyleTrackUserDetails(user);

        Wardrobe savedWardrobe = new Wardrobe();
        savedWardrobe.setWardrobeId(1L);
        savedWardrobe.setWardrobeName("New Wardrobe");
        savedWardrobe.setUser(user);

        Mockito.when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));
        Mockito.when(wardrobeRepository.save(any(Wardrobe.class))).thenReturn(savedWardrobe);

        // Act & Assert
        mockMvc.perform(post("/api/wardrobes/new")
                        .with(user(authenticatedPrincipal))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newWardrobeDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.wardrobeName").value("New Wardrobe"));
    }

    @Test
    @WithMockUser(username = "testUser")
    void shouldReturnUnauthorizedWhenCreatingWardrobeForAnotherUser() throws Exception {
        // Arrange
        WardrobeDto newWardrobeDto = new WardrobeDto(2L, null, "New Wardrobe", "Description", false, null, null);

        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setRoles(List.of(new Role("PERSONAL_USER")));

        StyleTrackUserDetails authenticatedPrincipal = new StyleTrackUserDetails(user);

        // Act & Assert
        mockMvc.perform(post("/api/wardrobes/new")
                        .with(user(authenticatedPrincipal))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newWardrobeDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "testUser")
    void shouldDeleteWardrobe() throws Exception {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");

        Wardrobe wardrobe = new Wardrobe();
        wardrobe.setWardrobeId(1L);
        wardrobe.setUser(user);

        Mockito.when(wardrobeRepository.findByWardrobeId(1L)).thenReturn(Optional.of(wardrobe));

        StyleTrackUserDetails authenticatedPrincipal = Mockito.mock(StyleTrackUserDetails.class);
        Mockito.when(authenticatedPrincipal.getUsername()).thenReturn("testUser");
        Mockito.when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        // Act & Assert
        mockMvc.perform(delete("/api/wardrobes/delete/1")
                        .with(user(authenticatedPrincipal))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isAccepted())
                .andExpect(content().string("deleted wardrobe"));
    }

    @Test
    @WithMockUser(username = "testUser")
    void shouldNotDeleteWardrobeOwnedByAnotherUser() throws Exception {
        // Arrange
        User user = new User();
        user.setId(2L);
        user.setUsername("anotherUser");

        Wardrobe wardrobe = new Wardrobe();
        wardrobe.setWardrobeId(1L);
        wardrobe.setUser(user);

        Mockito.when(wardrobeRepository.findByWardrobeId(1L)).thenReturn(Optional.of(wardrobe));

        // Mock authenticated principal in Spring Security context
        StyleTrackUserDetails authenticatedPrincipal = Mockito.mock(StyleTrackUserDetails.class);
        Mockito.when(authenticatedPrincipal.getUsername()).thenReturn("testUser");

        // Act & Assert
        mockMvc.perform(delete("/api/wardrobes/delete/1")
                    .with(user(authenticatedPrincipal))// Inject principal directly
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(content().string("You cannot edit outher user's wardrobes"));
    }

    @Test
    void shouldUpdateWardrobe() throws Exception {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setRoles(List.of(new Role("PERSONAL_USER")));

        StyleTrackUserDetails authenticatedPrincipal = new StyleTrackUserDetails(user);

        Wardrobe wardrobe = new Wardrobe();
        wardrobe.setWardrobeId(1L);
        wardrobe.setWardrobeName("Old Wardrobe");
        wardrobe.setUser(user);
        wardrobe.setSections(new ArrayList<>());

        WardrobeDto updatedWardrobeDto = new WardrobeDto(1L, 1L, "Updated Wardrobe", "Updated Description", true, null, null);

        Mockito.when(wardrobeRepository.findByWardrobeId(1L)).thenReturn(Optional.of(wardrobe));
        Mockito.when(wardrobeRepository.save(Mockito.any(Wardrobe.class))).thenReturn(wardrobe);

        // Act & Assert
        mockMvc.perform(put("/api/wardrobes/1")
                        .with(user(authenticatedPrincipal)) // Pass the real object as principal
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedWardrobeDto)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.wardrobeName").value("Updated Wardrobe"));
    }

    @Test
    @WithMockUser(username = "testUser")
    void shouldReturnNotFoundWhenUpdatingNonexistentWardrobe() throws Exception {
        // Arrange
        Mockito.when(wardrobeRepository.findByWardrobeId(1L)).thenReturn(Optional.empty());

        WardrobeDto updatedWardrobeDto = new WardrobeDto(1L, 1L, "Updated Wardrobe", "Updated description", true, null, null);

        // Act & Assert
        mockMvc.perform(put("/api/wardrobes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedWardrobeDto)))
                .andExpect(status().isNotFound());
    }
}
