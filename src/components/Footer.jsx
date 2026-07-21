import { Container } from "react-bootstrap";

export default function Footer() {
    return (
        <footer style={{ backgroundColor: "#212529", color: "white", padding: "20px 0" }}>
            <Container className="text-center">
                <p className="mb-1">🍽️ Sigma Serve &copy; 2026</p>
                <p className="text-muted small">Built with React, Express.js, PostgreSQL, Firebase & OpenStreetMap</p>
            </Container>

        </footer>
    )
}