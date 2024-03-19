import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Grid, TextField, Button, Typography, Paper } from '@mui/material'; // Make sure Paper is included here



const PropertyDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [error, setError] = useState('');
    const theme = useTheme(); // Access theme to use breakpoints
    const isXSmall = useMediaQuery(theme.breakpoints.down('md')); // Check if screen width is less than 1000px

    useEffect(() => {
        // Set the body overflow to scroll when the component mounts
        document.body.style.overflow = 'scroll';

        const getSiteQueryParam = () => {
            const queryParams = new URLSearchParams(location.search);
            return queryParams.get('site');
        };

        const siteDomain = getSiteQueryParam();
        if (id && siteDomain) {
            const apiUrl = 'http://ec2-3-142-154-120.us-east-2.compute.amazonaws.com:3000/api/rentals';
            const params = {
                listing_id: id,
                site: siteDomain
            };

            const fetchData = async () => {
                try {
                    const response = await axios.post(apiUrl, params);
                    console.log("API Response:", response.data);
                    setPropertyDetails(response.data);
                } catch (err) {
                    console.error('Error fetching property details:', err);
                    setError('Error fetching property details');
                }
            };

            fetchData();
        }

        // Cleanup function to reset the body overflow when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [id, location]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!propertyDetails) {
        return <div>Loading...</div>;
    }

    const columns = isXSmall ? 3 : 6;

    const renderListingDetails = (listing) => {
        return (
            <>
                <h1> ${listing.price} </h1>
                <h2>
                {listing.streetName}, {listing.city}
                </h2>
                <h2>
                     {listing.beds} BR, {listing.baths} BA
                </h2>
                {listing.unitFeatures && (
                    <List>
                        <ListItem>
                            <ListItemText primary="Features" secondary={listing.unitFeatures.join(", ")} />
                        </ListItem>
                    </List>
                )}
                <div>
                    <strong>Available Date:</strong> {listing.availableDate}
                </div>
                <div>
                    <strong>Heat Source:</strong> {listing.heatSource}
                </div>
                <div>
                    <strong>Laundry:</strong> {listing.laundry}
                </div>
                <div>
                    <strong>Pet Policy:</strong> {listing.pet}
                </div>
                <div>
                    <strong>Rent Includes:</strong> {listing.rentIncludes.join(", ")}
                </div>
                <div>
                    <strong>Student Policy:</strong> {listing.studentPolicy}
                </div>
                {listing.unitDescription && (
                    <div>
                        <strong>Unit Description:</strong> {listing.unitDescription}
                    </div>
                )}
            </>
        );
    };

    const listing = propertyDetails.listings[0];

    return (
        <div>

            {propertyDetails.listings && propertyDetails.listings[0].unitPhotos && (
                <Box
                    sx={{
                        width: '100%',
                        height: '20em', // Adjust based on the height of two rows of images
                        overflowX: 'auto'
                    }}
                >
                    <ImageList cols={columns} rowHeight={200} gap={8}>
                        {propertyDetails.listings[0].unitPhotos.map((item) => (
                            <ImageListItem key={item.id}>
                                <img
                                    src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.caption || 'Property Image'}
                                    loading="lazy"
                                    style={{
                                        width: '100%', // Ensure the image covers the full width of its container
                                        height: '100%', // Ensure the image covers the full height of its container
                                        objectFit: 'cover' // Ensure the image is scaled to maintain its aspect ratio while fitting within the element's content box
                                    }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            )}
        
            <div className='details-inquire'>
                <div className="listing-details">
                {renderListingDetails(listing)}
                </div>
                <Paper style={{ padding: 16 }}>
                    <Typography variant="h6">INQUIRE</Typography>
                    <form noValidate autoComplete="off">
                        <TextField
                            fullWidth
                            label="Name"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Phone"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Message"
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
                            Submit
                        </Button>
                    </form>
                </Paper>
            </div>
        </div>
        
    );
};

export default PropertyDetails;
