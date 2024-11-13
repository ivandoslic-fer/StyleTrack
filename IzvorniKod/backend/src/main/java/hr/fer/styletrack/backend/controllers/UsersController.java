package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.ItemDto;
import hr.fer.styletrack.backend.dtos.SectionDto;
import hr.fer.styletrack.backend.dtos.UserDto;
import hr.fer.styletrack.backend.dtos.WardrobeDto;
import hr.fer.styletrack.backend.entities.Section;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.entities.Wardrobe;
import hr.fer.styletrack.backend.repos.IItemRepository;
import hr.fer.styletrack.backend.repos.ISectionRepository;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.repos.IWardrobeRepository;
import hr.fer.styletrack.backend.utils.StyleTrackConstants;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/users")
public class UsersController {

    private final IUserRepository userRepository;
    private final IWardrobeRepository wardrobeRepository;
    private final ISectionRepository sectionRepository;
    private final IItemRepository itemRepository;

    @GetMapping("/")
    public ResponseEntity<List<UserDto>> getUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream().map(user -> new UserDto(user.getId(), user.getUsername(), user.getEmail())).toList();
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(new UserDto(user.get().getId(), user.get().getUsername(), user.get().getEmail()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username); // Assuming this method exists in the repository
        return user.map(value -> ResponseEntity.ok(new UserDto(value.getId(), value.getUsername(), value.getEmail())))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#id == principal.user.id") // Ovako provjeravati je li korisnik onaj za kojeg se predstavlja da je
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        user.get().setEmail(userDto.getEmail());

        userRepository.save(user.get());

        if (user.isPresent()) {
            return ResponseEntity.ok(new UserDto(user.get().getId(), user.get().getUsername(), user.get().getEmail()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{username}/wardrobes")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#username == principal.user.username")
    public ResponseEntity<Collection<WardrobeDto>> getUserWardrobesByUserId(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getWardrobes().stream()
            .map(wardrobe -> new WardrobeDto(
                wardrobe.getWardrobeId(),
                wardrobe.getWardrobeName(),
                wardrobe.getTags()
            )).collect(Collectors.toList())
            );
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{username}/wardrobes/{id}/sections")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#username == principal.user.username")
    public ResponseEntity<Collection<SectionDto>> getUsersSpecificWardrobeSections(@PathVariable String username, @PathVariable Long id) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            Optional<Wardrobe> wardrobe = wardrobeRepository.findByWardrobeId(id);
            if(wardrobe.isPresent()){
                return ResponseEntity.ok(wardrobe.get().getSections().stream()
                .map(section -> new SectionDto(
                    section.getSectionId(),
                    section.getSectionName()
                )).collect(Collectors.toList())
                );
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{username}/wardrobes/{id}/sections/{sectionId}/items")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#username == principal.user.username")
    public ResponseEntity<Collection<ItemDto>> getUsersWardrobeSpecificSection(@PathVariable String username, @PathVariable Long id, @PathVariable Long sectionId){
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            Optional<Wardrobe> wardrobe = wardrobeRepository.findByWardrobeId(id);
            if(wardrobe.isPresent()){
                Optional<Section> section = sectionRepository.findBySectionId(sectionId);
                if(section.isPresent()){
                    return ResponseEntity.ok(section.get().getItems().stream()
                    .map(item -> new ItemDto(
                        item.getItemId(),
                        item.getItemName(),
                        item.getItemTags()
                        )).collect(Collectors.toList())
                    );
                } else {
                    return ResponseEntity.notFound().build();
                }
            } else{
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{username}/wardrobes/new")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#username == principal.user.username")
    public ResponseEntity<String> addNewWardrobe(@RequestBody WardrobeDto usersWardrobeDto, @PathVariable String username){

        Wardrobe newWardrobe = new Wardrobe();
        newWardrobe.setWardrobeName(usersWardrobeDto.getWardrobeName());
        newWardrobe.setTags(usersWardrobeDto.getTags());
        if(!userRepository.findByUsername(username).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        newWardrobe.setUser(userRepository.findByUsername(username).get());
    
        return ResponseEntity.status(HttpStatus.CREATED).body(newWardrobe.toString());
    }

    @PutMapping("/{username}/wardrobes/{wardrobeId}/sections/new")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#username == principal.user.username")
    public ResponseEntity<String> addNewSection(@RequestBody SectionDto usersSectionDto, @PathVariable Long wardrobeId,  @PathVariable String username){
        if(wardrobeRepository.findByWardrobeId(wardrobeId).get().getUser().getUsername() != username){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("You cannot edit outher user's wardrobes");
        }

        Section newSection = new Section();
        newSection.setSectionName(usersSectionDto.getSectionName());
        if(!userRepository.findByUsername(username).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        if(!wardrobeRepository.findByWardrobeId(wardrobeId).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        newSection.setWardrobe(wardrobeRepository.findByWardrobeId(wardrobeId).get());

        return ResponseEntity.status(HttpStatus.CREATED).body(newSection.toString());
    }

    @PutMapping("/{username}/wardrobes/{wardrobeId}/sections/{sectionId}/items/new/{itemId}")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#username == principal.user.username")
    public ResponseEntity<String> addNewItem(@PathVariable Long itemId, @PathVariable Long wardrobeId, @PathVariable String username, @PathVariable Long sectionId){
        if((wardrobeRepository.findByWardrobeId(wardrobeId).get().getUser().getUsername() != username) || (sectionRepository.findBySectionId(sectionId).get().getWardrobe().getUser().getUsername() != username) ){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("You cannot edit outher user's sections");
        }
        
        if(!userRepository.findByUsername(username).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        if(!wardrobeRepository.findByWardrobeId(wardrobeId).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        if(!sectionRepository.findBySectionId(sectionId).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");

        sectionRepository.findBySectionId(sectionId).get().getItems().add(itemRepository.findByItemId(itemId).get());

        return ResponseEntity.status(HttpStatus.ACCEPTED).body("added item: " + itemRepository.findByItemId(itemId).get().toString());
    }

    @DeleteMapping("/{username}/wardrobes/delete/{wardrobeId}")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#username == principal.user.username")
    public ResponseEntity<String> deleteWardrobe(@PathVariable String username, @PathVariable Long wardrobeId){
        if(wardrobeRepository.findByWardrobeId(wardrobeId).get().getUser().getUsername() != username){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("You cannot edit outher user's wardrobes");
        }

        if(!userRepository.findByUsername(username).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        if(!wardrobeRepository.findByWardrobeId(wardrobeId).isPresent())return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("That wardrobe doesn't exist");
    
        wardrobeRepository.delete(wardrobeRepository.findByWardrobeId(wardrobeId).get());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("deleted wardrobe");
    }

    @DeleteMapping("/{username}/wardrobes/{wardrobeId}/sections/delete/{sectionId}")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#username == principal.user.username")
    public ResponseEntity<String> deleteSection(@PathVariable String username, @PathVariable Long wardrobeId, @PathVariable Long sectionId){
        if((wardrobeRepository.findByWardrobeId(wardrobeId).get().getUser().getUsername() != username) || (sectionRepository.findBySectionId(sectionId).get().getWardrobe().getUser().getUsername() != username) ){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("You cannot edit outher user's sections");
        }
        if(!userRepository.findByUsername(username).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        if(!wardrobeRepository.findByWardrobeId(wardrobeId).isPresent()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("That wardrobe doesn't exist");
        if(!sectionRepository.findBySectionId(sectionId).isPresent())return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("That section doesn't exist");
        
        sectionRepository.delete(sectionRepository.findBySectionId(sectionId).get());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("deleted section");
    }

    @DeleteMapping("/{username}/wardrobes/{wardrobeId}/sections/{sectionId}/items/remove/{itemId}")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#username == principal.user.username")
    public ResponseEntity<String> remmoveItemFromSection(@PathVariable String username, @PathVariable Long wardrobeId, @PathVariable Long sectionId, @PathVariable Long itemId){
        if((wardrobeRepository.findByWardrobeId(wardrobeId).get().getUser().getUsername() != username) || (sectionRepository.findBySectionId(sectionId).get().getWardrobe().getUser().getUsername() != username) ){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("You cannot edit outher user's sections");
        }
        if(!userRepository.findByUsername(username).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        if(!wardrobeRepository.findByWardrobeId(wardrobeId).isPresent()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("That wardrobe doesn't exist");
        if(!sectionRepository.findBySectionId(sectionId).isPresent()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("That section doesn't exist");
        if(!itemRepository.findByItemId(itemId).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");

        if(!sectionRepository.findBySectionId(sectionId).get().getItems().contains(itemRepository.findByItemId(itemId).get())) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No such item in section");
        
        sectionRepository.findBySectionId(sectionId).get().getItems().remove(itemRepository.findByItemId(itemId).get());

        return ResponseEntity.status(HttpStatus.ACCEPTED).body("removed requested item from section");
    }

    @PostMapping("/{username}/wardrobes/{wardrobeId}/edit")
    public ResponseEntity<String> postMethodName(@PathVariable String username, @PathVariable Long wardrobeId, @RequestBody Collection<String> tagList) {
        if(wardrobeRepository.findById(wardrobeId).get().getUser().getUsername() != username){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("You cannot edit outher user's wardrobes");
        }
        wardrobeRepository.findByWardrobeId(wardrobeId).get().setTags(tagList);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("changed wardrobe's tag list");
    }
    
}
