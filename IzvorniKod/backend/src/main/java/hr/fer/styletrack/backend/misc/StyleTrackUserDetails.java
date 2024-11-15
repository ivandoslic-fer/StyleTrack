package hr.fer.styletrack.backend.misc;

import hr.fer.styletrack.backend.entities.Role;
import hr.fer.styletrack.backend.entities.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class StyleTrackUserDetails extends org.springframework.security.core.userdetails.User implements UserDetails {
    public final User user;

    public StyleTrackUserDetails(final User user) {
        super(user.getUsername(), user.getPassword() == null ? "" : user.getPassword(), getAuthorities(user.getRoles()));
        this.user = user;
    }

    private static Collection<? extends GrantedAuthority> getAuthorities(final Collection<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .toList();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
