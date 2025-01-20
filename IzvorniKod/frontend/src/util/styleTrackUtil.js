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
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ItemPage from '../pages/ItemPage';
import ItemSearchPage from '../pages/ItemSearchPage';
import AdvertiserLocationPage from '../pages/AdvertiserLocationsPage'
import NotificationsPage from '../pages/NotificationsPage';
import CreateOutfitPage from '../pages/CreateOutfitPage';
import OutfitsPage from '../pages/OutfitsPage';
import OutfitPage from '../pages/OutfitPage';

const SHARING_ICON = "https://img.icons8.com/?size=100&id=tu1zRqb5NUud&format=png&color=000000";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const styleTrackAuthProvider = {
    isAuthenticated: false,
    token: null,
    signIn: async (username, password) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/login`, { username, password });
            
            styleTrackAuthProvider.isAuthenticated = true;
            styleTrackAuthProvider.token = response.data.token;

            // Save token to localStorage for persistent login state
            localStorage.setItem('authToken', response.data.token);

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
    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error("No token found");
            }

            const response = await axios.get(`${BACKEND_URL}/users/current`, {
                headers: { "Authorization": `Bearer ${token}`},
            });

            return response.data;
        } catch (e) {
            console.error("Could not fetch the user", e);
            handleAuthError(e, true);
        }
    },
    logOut: async () => {
        styleTrackAuthProvider.isAuthenticated = false;
        styleTrackAuthProvider.token = null;

        // Remove token and username from localStorage
        localStorage.removeItem('authToken');
    },
    githubLogin: async () => {
        location.replace("https://styletrack-backend-stage.onrender.com/oauth2/authorization/github");
    },
    googleLogin: async () => {
        location.replace("https://styletrack-backend-stage.onrender.com/oauth2/authorization/google");
    },
    loadToken: () => {
        const token = localStorage.getItem('authToken');
        
        if (token) {
            styleTrackAuthProvider.isAuthenticated = true;
            styleTrackAuthProvider.token = token;
        }
    }
};

// Initialize authentication state by loading token and username from storage
styleTrackAuthProvider.loadToken();

export const requestHandler = {
    postRequest: async (url, payload) => {
        try {
            const response = await axios.post(`${BACKEND_URL}${url}`, payload, { headers: getHeaders() });
            return response;
        } catch (error) {
            handleAuthError(error, false);
        }
    },
    getRequest: async (url) => {
        try {
            const response = await axios.get(`${BACKEND_URL}${url}`, { headers: getHeaders() });
            return response;
        } catch (error) {
            handleAuthError(error, false);
        }
    },
    putRequest: async (url, payload) => {
        try {
            const response = await axios.put(`${BACKEND_URL}${url}`, payload, { headers: getHeaders() });
            return response;
        } catch (error) {
            handleAuthError(error, false);
        }
    },
    deleteRequest: async (url) => {
        try {
            const response = await axios.delete(`${BACKEND_URL}${url}`, { headers: getHeaders() });
            return response;
        } catch (error) {
            handleAuthError(error, false);
        }
    },
    imagePostRequest: async (url, payload) => {
        try {
            const response = await axios.post(`${BACKEND_URL}${url}`, payload, { headers: getMultipartHeaders() });
            return response;
        } catch (error) {
            handleAuthError(error, false);
        }
    }
};

// Helper function to get headers
const getHeaders = () =>  {
    return styleTrackAuthProvider.isAuthenticated ? ({
        "Content-type": "application/json",
        "Authorization": `Bearer ${styleTrackAuthProvider.token}`,
    }) : ({
        "Content-type": "application/json",
    })
};

const getMultipartHeaders = () => {
    return styleTrackAuthProvider.isAuthenticated ? ({
        "Content-type": "multipart/form-data",
        "Authorization": `Bearer ${styleTrackAuthProvider.token}`,
    }) : ({
        "Content-type": "multipart/form-data",
    })
};

// Handle authentication-related errors
const handleAuthError = (error, gettingUser) => {
    if (error.response && error.response.status === 401) {
        console.error("JWT token expired or unauthorized access", error);
        styleTrackAuthProvider.isAuthenticated = false;
        styleTrackAuthProvider.token = null;

        // Remove token from localStorage
        if (gettingUser) {
            localStorage.removeItem('authToken');

            location.assign("/login"); // Ensure this is the correct login URL
        } else {
            location.assign("/unauthorized");
        }
    } else {
        console.error(error);
        throw new Error(error.response?.data?.message || "Request failed");
    }
};

async function loadItemById(itemId) {
    try {
        const response = await requestHandler.getRequest(`/items/${itemId}`);
        const sectionId = response.data.sectionId;
        const response2 = await requestHandler.getRequest(`/sections/${sectionId}`);
        const wardrobeId = response2.data.wardrobeId;
        return {sectionId, wardrobeId};
    } catch (error) {
        console.error("Failed to load item:", error);
        throw new Error("Item not found");
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

async function authorizedLoader() {
    try {
        const user = await styleTrackAuthProvider.getCurrentUser();
        return user;
    } catch {
        return redirect("/login");
    }
}

async function profileLoader({ request }) {
    const url = new URL(request.url);

    // If the current path is `/profile`, redirect to `/profile/:username`
    if (url.pathname === "/profile") {
        const user = await styleTrackAuthProvider.getCurrentUser();

        if (!user) return redirect("/login");

        return redirect(`/profile/${user.username}`);
    }

    // Otherwise, allow navigation to the specific profile page
    return null;
}

async function profileSettingsLoader(args) {
    let user;
    try {
        user = await styleTrackAuthProvider.getCurrentUser();
    } catch (e) {
        return handleAuthError(e);
    }

    if (!user) return handleAuthError({ response: { status: 401 }});

    if (args.params.username !== user.username) return redirect(`/profile/${user.username}/settings`);

    return user;
}

async function loadProfile(username) {
    const response = await (requestHandler.getRequest(`/users/username/${username}`));
    return response.data;
}

async function loadItem(wardrobeId, sectionId, itemId) {
    const response = await requestHandler.getRequest(`/items/${itemId}`);
    return response.data;
}

async function loadWardrobe(wardrobeId) {
    const response = await requestHandler.getRequest(`/wardrobes/${wardrobeId}`);
    return response.data;
}

async function loadOutfit(outfitId) {
    const response = await requestHandler.getRequest(`/outfits/${outfitId}`);
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
        loader: (args) => profileSettingsLoader(args),
        Component: ProfileSettingsPage
    },
    {
        path: "/search/items",
        Component: ItemSearchPage
    },
    {
        path: "/wardrobes",
        loader: authorizedLoader,
        Component: ClosetsPage,
    },
    {
        path: "/wardrobes/create",
        loader: authorizedLoader,
        Component: CreateWardrobePage
    },
    {
        path: "/notifications",
        loader: authorizedLoader,
        Component: NotificationsPage
    },
    {
        path: "/items/:itemId",
        loader: async ({ params }) => {
            const {sectionId, wardrobeId} = await loadItemById(params.itemId);
            return redirect(`/wardrobes/${wardrobeId}/${sectionId}/item/${params.itemId}`);
        },
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
        path: "/outfits",
        loader: authorizedLoader,
        Component: OutfitsPage
    },
    {
        path: "/outfits/:outfitId",
        loader: async ({ params }) => {
            return loadOutfit(params.outfitId);
        },
        Component: OutfitPage
    },
    {
        path: "/outfits/create",
        loader: authorizedLoader,
        Component: CreateOutfitPage
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
        path: "/wardrobes/:wardrobeId/:sectionId/item/:itemId",
        loader: async ({ params }) => {
            return loadItem(params.wardrobeId, params.sectionId, params.itemId);
        },
        Component: ItemPage
    },
    {
        path: "/oauth2/redirect",
        Component: OAuth2RedirectHandler
    },
    {
        path: "/closet",
        Component: ClosetPage
    },
    {
        path: "/unauthorized",
        Component: UnauthorizedPage
    }, {
        path: "/advertiser/locations",
        Component: AdvertiserLocationPage
    }
]);

export const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const address = response.data.display_name;
      return address;
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Address not available";
    }
  };  

export const getRandomColor = () => {
    // Define an array of background colors
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A5", "#FFC300", "#DAF7A6", "#900C3F", "#581845"];
    // Pick a random color from the array
    return colors[Math.floor(Math.random() * colors.length)];
}