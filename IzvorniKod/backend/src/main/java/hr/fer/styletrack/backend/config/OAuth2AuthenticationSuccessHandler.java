package hr.fer.styletrack.backend.config;

import hr.fer.styletrack.backend.entities.Role;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.repos.IRoleRepository;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.utils.JwtUtil;
import hr.fer.styletrack.backend.utils.StyleTrackConstants;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;

    public OAuth2AuthenticationSuccessHandler(JwtUtil jwtUtil, IUserRepository userRepository, IRoleRepository roleRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        var oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        AtomicReference<String> username = new AtomicReference<>("");
        AtomicReference<String> jwtToken = new AtomicReference<>();

        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        if ("github".equals(authToken.getAuthorizedClientRegistrationId())) {
            DefaultOAuth2User principal = (DefaultOAuth2User) authToken.getPrincipal();
            Map<String, Object> attributes = principal.getAttributes();
            System.out.println(attributes);
            Object principalEmail = attributes.get("email");
            String name = attributes.getOrDefault("login", "").toString();

            String emailString;
            if (principalEmail == null) emailString = "";
            else emailString = principalEmail.toString();

            if (!emailString.isEmpty()) {
                userRepository.findByEmail(emailString)
                        .ifPresentOrElse(user -> {
                            setUserRole(jwtToken, authToken, attributes, user);
                            username.set(user.getUsername());
                        }, () -> {
                            User user = new User();
                            user.setEmail(email);
                            user.setUsername(name);
                            username.set(user.getUsername());

                            // Get User role and assign it to the user
                            try {
                                Role role = roleRepository.findByName(StyleTrackConstants.PERSONAL_USER_ROLE).get();
                                user.setRoles(List.of(role));
                            } catch (NoSuchElementException e) {
                                throw e;
                            }

                            userRepository.save(user);
                            jwtToken.set(jwtUtil.generateToken(user.getUsername(), user));
                            setUserRole(jwtToken, authToken, attributes, user);
                        });
            } else {
                userRepository.findByUsername(name)
                        .ifPresentOrElse(user -> {
                            setUserRole(jwtToken, authToken, attributes, user);
                            username.set(user.getUsername());
                        }, () -> {
                            User user = new User();
                            user.setEmail(email);
                            user.setUsername(name);
                            username.set(user.getUsername());

                            // Get User role and assign it to the user
                            try {
                                Role role = roleRepository.findByName(StyleTrackConstants.PERSONAL_USER_ROLE).get();
                                user.setRoles(List.of(role));
                            } catch (NoSuchElementException e) {
                                throw e;
                            }

                            userRepository.save(user);
                            jwtToken.set(jwtUtil.generateToken(user.getUsername(), user));
                            setUserRole(jwtToken, authToken, attributes, user);
                        });
            }
        } else if ("google".equals(authToken.getAuthorizedClientRegistrationId())) {
            DefaultOAuth2User principal = (DefaultOAuth2User) authToken.getPrincipal();
            Map<String, Object> attributes = principal.getAttributes();

            System.out.println(attributes);

            userRepository.findByEmail(email)
                    .ifPresentOrElse(user -> {
                        Map<String, Object> extendedAttributes = new java.util.HashMap<>(Map.copyOf(attributes));
                        extendedAttributes.put("id", user.getId());
                        setUserRole(jwtToken, authToken, extendedAttributes, user);
                        username.set(user.getUsername());
                    }, () -> {
                        User user = new User();
                        user.setEmail(email);
                        assert email != null;
                        user.setUsername(email.split("@")[0]);
                        username.set(user.getUsername());

                        // Get User role and assign it to the user
                        try {
                            Role role = roleRepository.findByName(StyleTrackConstants.PERSONAL_USER_ROLE).get();
                            user.setRoles(List.of(role));
                        } catch (NoSuchElementException e) {
                            throw e;
                        }

                        userRepository.save(user);
                        jwtToken.set(jwtUtil.generateToken(user.getUsername(), user));
                        setUserRole(jwtToken, authToken, attributes, user);
                    });
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Couldn't find your account or provider");
        }

        String redirectUrl = "http://localhost:5173/oauth2/redirect?token=" + jwtToken.get() + "&username=" + username.get();
        response.sendRedirect(redirectUrl);
    }


    private void setUserRole(AtomicReference<String> jwtToken, OAuth2AuthenticationToken authToken, Map<String, Object> attributes, User user) {
        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority("user")), attributes, "id");
        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(StyleTrackConstants.PERSONAL_USER_ROLE)), authToken.getAuthorizedClientRegistrationId());
        SecurityContextHolder.getContext().setAuthentication(securityAuth);
        jwtToken.set(jwtUtil.generateToken(user.getUsername(), user));
    }
}
