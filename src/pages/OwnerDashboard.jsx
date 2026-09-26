import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, Badge } from 'react-bootstrap';
import AppNavBar from '../components/NavBar';

const API = "https://restaurant-backend-jv5m.onrender.com"

export default function OwnerDashboardPage() {
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;

    const [restaurant, setRestaurant] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [name, setName] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyRestaurant = async () => {
            try {
                const res = await axios.get(`${API}/restaurants/mine`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRestaurant(res.data);
                if (res.data) {
                    setName(res.data.name);
                    setCuisineType(res.data.cuisine_type);
                    setCapacity(res.data.capacity);
                    setLocation(res.data.location);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (decoded) {
            fetchMyRestaurant();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            let res;
            if (restaurant) {
                // update existing restaurant
                res = await axios.put(`${API}/restaurants/mine`,
                    { name, cuisine_type: cuisineType, capacity, location },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess('Restaurant updated successfully!');
            } else {
                // submit new restaurant request
                res = await axios.post(`${API}/restaurants/request`,
                    { name, cuisine_type: cuisineType, capacity, location },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess('Restaurant submitted for approval!');
            }
            setRestaurant(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to save restaurant');
        }
    };


    return (
        <div style={{ backgroundColor: "#f8f4f0", minHeight: "100vh" }}>
            <AppNavBar />
            <Container className="my-5">
                <h2 className="text-center mb-4">My Restaurant</h2>
                {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
                {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

                {restaurant && (
                    <Alert variant={
                        restaurant.status === 'approved' ? 'success' :
                            restaurant.status === 'pending' ? 'warning' : 'danger'
                    }>
                        Status: <strong>{restaurant.status}</strong>
                    </Alert>
                )}

                <h4 className="mt-4">
                    {restaurant ? 'Edit Your Restaurant' : 'Submit Your Restaurant'}
                </h4>

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Restaurant name" />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cuisine Type</Form.Label>
                                <Form.Control value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} placeholder="e.g. Italian" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Capacity</Form.Label>
                                <Form.Control type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="e.g. 50" />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Location</Form.Label>
                                <Form.Control value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. KLCC, Kuala Lumpur" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button type="submit" variant="danger" className="rounded-pill">
                        {restaurant ? 'Update Restaurant' : 'Submit Restaurant'}
                    </Button>
                </Form>
            </Container>
        </div>
    );

}