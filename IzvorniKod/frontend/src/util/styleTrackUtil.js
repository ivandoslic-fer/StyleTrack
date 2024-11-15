import axios from 'axios';
import { 
    createBrowserRouter,
    redirect
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
import OAuth2RedirectHandler from '../pages/OAuthRedirect';
import ClosetPage from '../pages/ClosetPage';
import ProfileSettingsPage from '../pages/ProfileSettingsPage';
import ClosetsPage from '../pages/ClosetsPage';
import CreateWardrobePage from '../pages/CreateWardrobePage';
import CreateSectionPage from '../pages/CreateSectionPage';
import SectionPage from '../pages/SectionPage';
import CreateItemPage from '../pages/CreateItemPage';


const BACKEND_URL = "https://styletrack-backend-stage.onrender.com/api";

export const styleTrackAuthProvider = {
    isAuthenticated: false,
    username: null,
    token: null,
    userData: null,
    signIn: async (username, password) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/login`, { username, password });
            
            styleTrackAuthProvider.isAuthenticated = true;
            styleTrackAuthProvider.username = response.data.username;
            styleTrackAuthProvider.token = response.data.token;

            styleTrackAuthProvider.userData = response.data.user;

            // Save token and username to localStorage for persistent login state
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('userData', JSON.stringify(response.data.user));

            return true; // Indicate success for manual redirect in component
        } catch (error) {
            console.error("Login failed", error);
            throw new Error("Login failed");
        }
    },
    signUp: async (username, email, password, isAdvertiser = false, displayName, address = "", website = "") => {
        try {
            await axios.post(`${BACKEND_URL}/register`, { username, email, password, advertiser: isAdvertiser, displayName, address, website });

            return true; // Indicate success for redirect in component
        } catch (error) {
            console.error("Registration failed", error);
            throw new Error("Registration failed");
        }
    },
    logOut: async () => {
        styleTrackAuthProvider.isAuthenticated = false;
        styleTrackAuthProvider.username = null;
        styleTrackAuthProvider.token = null;

        // Remove token and username from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userData');
    },
    githubLogin: async () => {
        location.replace("http://localhost:8080/oauth2/authorization/github");
    },
    loadToken: () => {
        const token = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');
        let userData;
        try {
            userData = JSON.parse(localStorage.getItem('userData'))
        } catch (e) {
            userData = "";
            console.error(e);
        }
        
        if (token && username) {
            styleTrackAuthProvider.isAuthenticated = true;
            styleTrackAuthProvider.token = token;
            styleTrackAuthProvider.username = username;
            styleTrackAuthProvider.userData = userData;
        }
    }
};

// Initialize authentication state by loading token and username from storage
styleTrackAuthProvider.loadToken();

export const requestHandler = {
    postRequest: async (url, payload) => {
        try {
            const response = await axios.post(`${BACKEND_URL}${url}`, payload, { headers: {
                "Content-type": "application/json",
                 "Authorization": `Bearer ${styleTrackAuthProvider.token}`,
            }});

            return response;
        } catch (error) {
            console.error("POST failed", error);
            throw new Error("POST failed");
        }
    },
    getRequest: async (url) => {
        try {
            while(!styleTrackAuthProvider.token);
            const response = await axios.get(`${BACKEND_URL}${url}`, { headers: {
                "Content-type": "application/json",
                 "Authorization": `Bearer ${styleTrackAuthProvider.token}`,
            }});

            return response;
        } catch (error) {
            console.error("GET failed", error);
            throw new Error("GET failed");
        }
    },
    putRequest: async (url, payload) => {
        try {
            const response = await axios.put(`${BACKEND_URL}${url}`, payload, { headers: {
                "Content-type": "application/json",
                 "Authorization": `Bearer ${styleTrackAuthProvider.token}`,
            }});

            return response;
        } catch (error) {
            console.error(error);
            throw new Error("PUT request failed (Probably unauthorized)"); // TODO: Handle this better
        }
    }
}

async function loginLoader() {
    if (styleTrackAuthProvider.isAuthenticated) {
      return redirect("/");
    }
    return null;
}

/*function protectedLoader({ request }) {
    if (!styleTrackAuthProvider.isAuthenticated) {
        let params = new URLSearchParams();
        params.set("from", new URL(request.url).pathname);
        return redirect("/login?" + params.toString());
    }
    return null;
}*/

async function profileLoader({ request }) {
    const url = new URL(request.url);
    if (!styleTrackAuthProvider.isAuthenticated) {
        // Redirect unauthenticated users to login
        const params = new URLSearchParams();
        params.set("from", url.pathname);
        return redirect(`/login?${params.toString()}`);
    }

    // If the current path is `/profile`, redirect to `/profile/:username`
    if (url.pathname === "/profile") {
        return redirect(`/profile/${styleTrackAuthProvider.username}`);
    }

    // Otherwise, allow navigation to the specific profile page
    return null;
}

async function loadProfile(username) {
    console.log("Returning data for username: " + username);
    const response = await (requestHandler.getRequest(`/users/username/${username}`));
    return response.data;
}

async function loadWardrobe(wardrobeId) {
    const response = await requestHandler.getRequest(`/wardrobes/${wardrobeId}`);
    return response.data;
}

async function loadSection(sectionId) {
    const response = await requestHandler.getRequest(`/sections/${sectionId}`);
    return response.data;
}

export const router = createBrowserRouter([
    {
        path: "/",
        Component: HomePage,
        loader: () => {
            return { user: styleTrackAuthProvider.username }
        }
    },
    {
        path: "/login",
        loader: loginLoader,
        Component: LoginPage
    },
    {
        path: "/register",
        loader: loginLoader,
        Component: RegisterPage
    },
    {
        path: "/profile",
        loader: profileLoader,
        children: [
            {
                path: ":username",
                loader: async ({ params }) => {
                    return loadProfile(params.username);
                },
                Component: ProfilePage,
            }
        ]
    },
    {
        path: "/profile/:username/settings",
        loader: async ({ params }) => {
            if (params.username !== styleTrackAuthProvider.username) return redirect(`/profile/${params.username}`);
            return loadProfile(params.username);
        },
        Component: ProfileSettingsPage
    },
    {
        path: "/wardrobes",
        Component: ClosetsPage,
    },
    {
        path: "/wardrobes/create",
        Component: CreateWardrobePage
    },
    {
        path: "/wardrobes/:wardrobeId",
        loader: async ({ params }) => {
            // We'll need to handle the public logic here
            return loadWardrobe(params.wardrobeId);
        },
        Component: ClosetPage,
    },
    {
        path: "/wardrobes/:wardrobeId/addSection",
        Component: CreateSectionPage
    },
    {
        path: "/wardrobes/:wardrobeId/:sectionId",
        loader: async ({ params }) => {
            return loadSection(params.sectionId);
        },
        Component: SectionPage
    },
    {
        path: "/wardrobes/:wardrobeId/:sectionId/addItem",
        Component: CreateItemPage
    },
    {
        path: "/oauth2/redirect",
        Component: OAuth2RedirectHandler
    },
    {
        path: "/closet",
        Component: ClosetPage
    }
]);

export const getRandomColor = () => {
    // Define an array of background colors
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A5", "#FFC300", "#DAF7A6", "#900C3F", "#581845"];
    // Pick a random color from the array
    return colors[Math.floor(Math.random() * colors.length)];
}