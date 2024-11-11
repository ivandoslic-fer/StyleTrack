import { useEffect } from "react";
import { requestHandler, styleTrackAuthProvider } from "../util/styleTrackUtil";

export default function ProfilePage() {
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await requestHandler.getRequest(`/users/username/${styleTrackAuthProvider.username}`);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100vh', // Full viewport height
      fontSize: '2rem',
      fontWeight: 'bold',
    }}>
      <h1>ProfilePage</h1>
      <h2>{styleTrackAuthProvider.username}</h2>
    </div>
  )
}
