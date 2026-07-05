import { Container, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export default function HeroSection() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    return (
        <div className="d-flex align-items-center justify-content-center text-white text-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "500px"
            }}
        >
            <Container>
                <h1 className="fw-bold text-uppercase">
                    Make a Reservation
                </h1>
                <p className="fs-5" style={{ color: 'black' }}>
                    Book your perfect dining experience today
                </p>
                <Button
                    variant="danger"
                    size="lg"
                    className="mt-3 rounded-pill"
                    onClick={() => token ? navigate("/bookings") : navigate("/auth")}
                >
                    Reserve Now
                </Button>
            </Container>
        </div>
    )
}