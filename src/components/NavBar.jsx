import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AppNavBar() {

    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const decoded = token ? jwtDecode(token) : null;

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">
                    🍽️ Sigma Serve
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-nacbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/">Home</Nav.Link>

                        {token && (
                            <>
                                {decoded?.role === 'admin' && (
                                    <Nav.Link href="/admin">Admin</Nav.Link>
                                )}
                                <Nav.Link href="/my-bookings">My Bookings</Nav.Link>
                                <Nav.Link href="/bookings">Book Now</Nav.Link>

                                <Button
                                    variant="outline-light"
                                    className="ms-2"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        )}

                        {!token && (
                            <>
                                <Nav.Link href="/auth">Sign In</Nav.Link>
                                <Nav.Link href="/signup">Sign Up</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}