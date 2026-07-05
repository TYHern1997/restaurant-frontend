import { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ startAsSignup = false }) {
    const [isLogin, setIsLogin] = useState(!startAsSignup);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Inline styles for a clean, non-intrusive full-screen image wrapper
    const pageWrapperStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '20px 0'
    };

    const formCardStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/login' : '/signup';

        const payload = isLogin
            ? { email, password }
            : {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                birthday,
                phone_number: phoneNumber
            };

        try {
            const res = await axios.post(`https://restaurant-backend-production-3168.up.railway.app${endpoint}`, payload);

            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                navigate('/my-bookings');;
            } else {
                setFirstName('');
                setLastName('');
                setBirthday('');
                setPhoneNumber('');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication Failed');
        }
    };

    return (
        <div style={pageWrapperStyle}>
            <Container style={{ maxWidth: "550px" }}>
                <div style={formCardStyle}>
                    <h2 className="mb-4 text-center fw-bold">{isLogin ? 'Login' : 'Sign Up'}</h2>
                    <Form onSubmit={handleSubmit}>

                        {!isLogin && (
                            <>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="First Name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Last Name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Birthday</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={birthday}
                                        onChange={(e) => setBirthday(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="e.g. +60111111111"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {error && <p style={{ color: 'red' }} className="text-center">{error}</p>}

                        <Button type="submit" variant="primary" className="w-100 py-2 fw-bold">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </Button>
                    </Form>

                    <p className="mt-4 mb-0 text-center text-muted">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <Button variant="link" className="p-0 align-baseline fw-bold" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                            {isLogin ? 'Sign Up' : 'Login'}
                        </Button>
                    </p>
                </div>
            </Container>
        </div>
    );
}