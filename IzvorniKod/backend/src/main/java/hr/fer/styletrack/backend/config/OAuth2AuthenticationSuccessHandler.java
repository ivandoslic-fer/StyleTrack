package hr.fer.styletrack.backend.config;

import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.utils.JwtUtil;
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
import java.util.concurrent.atomic.AtomicReference;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;
    private final IUserRepository userRepository;

    public OAuth2AuthenticationSuccessHandler(JwtUtil jwtUtil, IUserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
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
            String principalEmail = attributes.getOrDefault("email", "").toString();
            String name = attributes.getOrDefault("login", "").toString();

            userRepository.findByEmail(principalEmail)
                    .ifPresentOrElse(user -> {
                        setUserRole(jwtToken, authToken, attributes, user);
                        username.set(user.getUsername());
                    }, () -> {
                        User user = new User();
                        user.setEmail(email);
                        user.setUsername(name);
                        username.set(user.getUsername());
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
        // Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority("user"), authToken.getAuthorizedClientRegistrationId()));
        // SecurityContextHolder.getContext().setAuthentication(securityAuth);
        jwtToken.set(jwtUtil.generateToken(user.getUsername(), user));
    }
}
