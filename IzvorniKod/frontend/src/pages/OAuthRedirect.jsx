import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { requestHandler, styleTrackAuthProvider } from '../util/styleTrackUtil';

export default function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const ulocation = useLocation();

    useEffect(() => {
        const fetchUserData = async (username) => {
            try {
              const response = await requestHandler.getRequest(`/users/username/${username}`);
              localStorage.setItem("userData", JSON.stringify(response.data))
              console.log(response);
            } catch (error) {
              console.error(error);
            }
          };
        // Extract token and username from the URL query parameters
        const urlParams = new URLSearchParams(ulocation.search);
        const token = urlParams.get('token');
        const username = urlParams.get('username');

        if (token && username) {
            // Store token and username in localStorage
            localStorage.setItem("authToken", token);
            localStorage.setItem("username", username);

            styleTrackAuthProvider.username = username;
            styleTrackAuthProvider.token = token;

            fetchUserData(username);
            // Redirect to the homepage
            location.replace("/");
        } else {
            // If token or username is missing, redirect to the login page
            location.replace("/login");
        }
    }, [ulocation, navigate]);

    return <div>Redirecting...</div>;
}
