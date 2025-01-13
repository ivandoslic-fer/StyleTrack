package hr.fer.styletrack.backend.controllers;



import hr.fer.styletrack.backend.dtos.AdvertiserDto;
import hr.fer.styletrack.backend.dtos.UserDto;
import hr.fer.styletrack.backend.entities.AdvertiserLocation;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.entities.AdvertiserProfile;

import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.repos.IAdvertiserProfileRepository;


import hr.fer.styletrack.backend.utils.StyleTrackConstants;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/advertisers")
public class AdvertisersController {

    private final IAdvertiserProfileRepository advertiserRepository;
    private final IUserRepository userRepository;

    @GetMapping("/")
    public ResponseEntity<List<AdvertiserDto>> getAdvertisers() {
        List<AdvertiserProfile> advertisers = advertiserRepository.findAll();
        List<AdvertiserDto> advertiserDtos = advertisers.stream().map(advertiser -> new AdvertiserDto(advertiser.getId(), advertiser.getCompanyAddress(), advertiser.getCompanyEmail(), advertiser.getLocations())).toList();
        return ResponseEntity.ok(advertiserDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdvertiserDto> getAdvertiserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            Optional<AdvertiserProfile> advertiser = advertiserRepository.findAdvertiserProfileByUser(user.get());
            if(advertiser.isPresent()){
                return ResponseEntity.ok(new AdvertiserDto(advertiser.get().getId(), advertiser.get().getCompanyAddress(), advertiser.get().getCompanyEmail(), advertiser.get().getLocations()));
            }
            else{
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<AdvertiserDto> getAdvertiserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username); // Assuming this method exists in the repository
        if (user.isPresent()) {
            Optional<AdvertiserProfile> advertiser = advertiserRepository.findAdvertiserProfileByUser(user.get());
            if(advertiser.isPresent()){
                return ResponseEntity.ok(new AdvertiserDto(advertiser.get().getId(), advertiser.get().getCompanyAddress(), advertiser.get().getCompanyEmail(), advertiser.get().getLocations()));
            }
            else{
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @RolesAllowed(StyleTrackConstants.ADVERTISER_USER_ROLE)
    @PreAuthorize("#id == principal.user.id") // Ovako provjeravati je li korisnik onaj za kojeg se predstavlja da je
    public ResponseEntity<AdvertiserDto> updateUser(@PathVariable Long id, @RequestBody AdvertiserDto advertiserDto) {

        Optional<User> user = userRepository.findById(id);
        Optional<AdvertiserProfile> advertiserData;
        if (user.isPresent()) {
            advertiserData =  advertiserRepository.findAdvertiserProfileByUser(userRepository.findById(id).get());
        } else {
            return ResponseEntity.notFound().build();
        }

        if (advertiserData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        AdvertiserProfile advertiserProfile = advertiserData.get();
       
        advertiserProfile.setCompanyAddress(advertiserDto.getCompanyAdress());
        advertiserProfile.setCompanyEmail(advertiserDto.getCompanyEmail());

        advertiserRepository.save(advertiserProfile);


        return ResponseEntity.ok(new AdvertiserDto(advertiserProfile.getId(), advertiserProfile.getCompanyAddress(), advertiserProfile.getCompanyEmail(), advertiserProfile.getLocations()));
    }

    @GetMapping("/{id}/locations")
    public ResponseEntity<List<AdvertiserLocation>> getLocations(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Optional<AdvertiserProfile> advertiserProfile = advertiserRepository.findAdvertiserProfileByUser(user.get());
        System.out.println(advertiserProfile.get().getUser().getUsername());
        return advertiserProfile.map(profile -> ResponseEntity.ok(profile.getLocations()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/locations")
    @RolesAllowed(StyleTrackConstants.ADVERTISER_USER_ROLE)
    @PreAuthorize("#id == principal.user.id")
    public ResponseEntity<AdvertiserLocation> addLocation(@PathVariable Long id, @RequestBody AdvertiserLocation location) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Optional<AdvertiserProfile> advertiserProfile = advertiserRepository.findAdvertiserProfileByUser(user.get());
        if (advertiserProfile.isPresent()) {
            AdvertiserProfile profile = advertiserProfile.get();
            profile.addLocation(location);
            advertiserRepository.save(profile);
            return ResponseEntity.ok(location);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/locations/{locationId}")
    @RolesAllowed(StyleTrackConstants.ADVERTISER_USER_ROLE)
    public ResponseEntity<AdvertiserLocation> updateLocation(@PathVariable Long locationId, @RequestBody AdvertiserLocation updatedLocation) {
        for (AdvertiserProfile profile : advertiserRepository.findAll()) {
            for (AdvertiserLocation location : profile.getLocations()) {
                if (location.getId().equals(locationId)) {
                    location.setName(updatedLocation.getName());
                    location.setLatitude(updatedLocation.getLatitude());
                    location.setLongitude(updatedLocation.getLongitude());
                    advertiserRepository.save(profile);
                    return ResponseEntity.ok(location);
                }
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/locations/{locationId}")
    @RolesAllowed(StyleTrackConstants.ADVERTISER_USER_ROLE)
    public ResponseEntity<Void> deleteLocation(@PathVariable Long locationId) {
        for (AdvertiserProfile profile : advertiserRepository.findAll()) {
            Optional<AdvertiserLocation> locationToRemove = profile.getLocations().stream()
                    .filter(location -> location.getId().equals(locationId))
                    .findFirst();

            if (locationToRemove.isPresent()) {
                profile.removeLocation(locationToRemove.get());
                advertiserRepository.save(profile);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}
