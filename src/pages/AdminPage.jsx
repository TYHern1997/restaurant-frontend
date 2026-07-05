
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Row, Col, Alert } from "react-bootstrap";
import AppNavBar from "../components/NavBar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API = "https://restaurant-backend-production-3168.up.railway.app";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [name, setName] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // redirect if not admin
        const token = localStorage.getItem('token');
        if (!token) { navigate('/auth'); return; }
        const decoded = jwtDecode(token);
        if (decoded.role !== 'admin') { navigate('/'); return; }

        fetchUsers();
        fetchRestaurants();
    }, []);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API}/admin/users`, { headers });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRestaurants = async () => {
        try {
            const res = await axios.get(`${API}/restaurants`);
            setRestaurants(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddRestaurant = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/restaurants`, {
                name, cuisine_type: cuisineType, capacity, location
            }, { headers });
            setSuccess('Restaurant added successfully!');
            setTimeout(() => setSuccess(''), 3000);
            setName(''); setCuisineType(''); setCapacity(''); setLocation('');
            fetchRestaurants();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteRestaurant = async (id) => {
        try {
            await axios.delete(`${API}/restaurants/${id}`, { headers });
            setSuccess('Restaurant deleted!');
            setTimeout(() => setSuccess(''), 3000);
            fetchRestaurants();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div style={{ backgroundColor: "#f8f4f0", minHeight: "100vh" }}>
            <AppNavBar />
            <Container className="my-5">
                <h2 className="text-center mb-4">Admin Panel</h2>

                {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
                {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

                {/* Add Restaurant */}
                <h4 className="mt-4">Add New Restaurant</h4>
                <Form onSubmit={handleAddRestaurant}>
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
                    <Button type="submit" variant="danger" className="rounded-pill">Add Restaurant</Button>
                </Form>

                {/* Restaurants Table */}
                <h4 className="mt-5">All Restaurants</h4>
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Cuisine</th>
                            <th>Capacity</th>
                            <th>Location</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.name}</td>
                                <td>{r.cuisine_type}</td>
                                <td>{r.capacity}</td>
                                <td>{r.location}</td>
                                <td>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteRestaurant(r.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Users Table */}
                <h4 className="mt-5">All Users</h4>
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </Container>
        </div>
    );
}