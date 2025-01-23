import { Container, Box, Typography, Button, CircularProgress } from '@mui/material';
import WardrobeCard from '../components/WardrobeCard';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { requestHandler } from '../util/styleTrackUtil';
import EmptyPage from './EmptyPage';
import InfoCard from '../components/InfoCard';
import { useSnackbar } from '../context/SnackbarContext';

export default function ClosetsPage() {
    const user = useLoaderData();
    const [wardrobes, setWardrobes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const { showSnackbar } = useSnackbar();

    const handleDeleteWardrobe = async (id) => {
        try {
            await requestHandler.deleteRequest(`/wardrobes/delete/${id}`);
            showSnackbar({
                severity: "success",
                message: "Successfully delete the wardrobe!",
                duration: 3000
            });
            const newWardrobeList = wardrobes.filter(wardrobe => wardrobe.wardrobeId != id);
            setWardrobes(newWardrobeList);
        } catch (e) {
            showSnackbar({
                severity: "error",
                message: "An error occured while deleting!",
                duration: 3000
            });
        }
    }

    useEffect(() => {
        const fetchWardrobes = async () => {
            setIsLoading(true); // Start loading
            try {
                const username = searchParams.get('user');
                const showPublic = searchParams.get('public');
                let response;

                if (username && username === user.username && !(showPublic === 'true')) {
                    response = await requestHandler.getRequest(`/wardrobes/?username=${username}&forSharing=false`);
                } else if (username && username !== user.username) {
                    response = await requestHandler.getRequest(`/wardrobes/?username=${username}&forSharing=true`);
                } else {
                    response = await requestHandler.getRequest(`/wardrobes/?username=&forSharing=true`);
                }

                console.log(response);

                setWardrobes(response.data); // Update the wardrobes state with fetched data
            } catch (error) {
                console.error('Error fetching wardrobes:', error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        fetchWardrobes();
    }, [searchParams, user.username]);

    const handleAddClosetClick = () => {
        location.assign("/wardrobes/create");
    };

    if (!wardrobes || wardrobes.length == 0) {
        return (
            <div>
                { user.advertiser && <InfoCard title="Notice advertiser" content="As an advertiser you create wardrobes that represent collections of items you offer to the customers." /> }
                <EmptyPage />
            </div>
        );
    }

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                marginLeft: '0px',
                minHeight: '100vh',
                width: '100svw',
                marginRight: 0,
                paddingTop: 0,
                marginTop: 0,
            }}
        >
            <Typography variant="h3" sx={{ marginBottom: "25px" }}>
                Wardrobes {searchParams.get("user") ? `of ${searchParams.get("user")}` : ""}
            </Typography> 

            <div className='flex w-[100svw] justify-center items-center'>
            { user.advertiser && <InfoCard title="Notice advertiser" content="As an advertiser you create wardrobes that represent collections of items you offer to the customers." /> }
            </div>

            {isLoading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)', // 1 column on extra-small screens (phones)
                            sm: 'repeat(2, 1fr)', // 2 columns on small screens (tablets)
                            md: 'repeat(4, 1fr)', // 4 columns on medium screens (desktops and larger)
                        },
                        gap: '30px',
                        width: '100%',
                    }}
                >
                    {/* Card for Creating New Wardrobe */}
                    { (searchParams.get('user') === user.username) && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f3f4f6',
                            border: '2px dashed #ccc',
                            borderRadius: '15px',
                            padding: '20px',
                            width: '100%',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            transition: '0.3s',
                            '&:hover': {
                                backgroundColor: '#e5e7eb',
                            },
                        }}
                        onClick={handleAddClosetClick}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: '20px',
                                fontWeight: 500,
                                textAlign: 'center',
                                marginBottom: '10px',
                            }}
                        >
                            Create a New Wardrobe
                        </Typography>
                        <Button
                            id='create-wardrobe-button'
                            variant="contained"
                            sx={{
                                borderRadius: '45px',
                                padding: '10px 20px',
                                textTransform: 'none',
                                fontSize: '15px',
                                fontWeight: 500,
                            }}
                        >
                            Create
                        </Button>
                    </Box>) }

                    {/* Existing Wardrobes */}
                    {wardrobes.map((closet, index) => (
                        <WardrobeCard
                            key={index}
                            wardrobe={closet}
                            onDelete={() => handleDeleteWardrobe(closet.wardrobeId)}
                        />
                    ))}
                </Box>
            )}
        </Container>
    );
}
