package hr.fer.styletrack.backend.services;

import hr.fer.styletrack.backend.misc.StyleTrackUserDetails;
import hr.fer.styletrack.backend.repos.IUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class StyleTrackUserDetailsService implements UserDetailsService {
    private final IUserRepository userRepository;

    public StyleTrackUserDetailsService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public StyleTrackUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .map(StyleTrackUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
