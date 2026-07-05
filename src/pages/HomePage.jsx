import AppNavBar from "../components/NavBar"
import HeroSection from "../components/HeroSection"
import { Container, Row, Col, Card } from "react-bootstrap"
import { useEffect, useState } from "react"
import axios from "axios"

export default function HomePage() {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurants()
    }, [])


    const fetchRestaurants = async () => {
        try {
            const res = await axios.get("https://restaurant-backend-production-3168.up.railway.app/restaurants");
            setRestaurants(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <AppNavBar />
            <HeroSection />

            <Container className="my-5">
                <h2 className="text-center mb-4">Our Restaurants</h2>
                {loading ? (
                    <p className="text-center">Loading restaurants...</p>
                ) : (
                    <Row>
                        {restaurants.map((restaurant) => (
                            <Col sm={4} key={restaurant.id} className="mb-4">
                                <Card className="h-100 shadow-sm">
                                    <Card.Body>
                                        <Card.Title>
                                            {restaurant.name}
                                        </Card.Title>
                                        <Card.Text>
                                            <strong>Cuisine:</strong> {restaurant.cuisine_type}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Location:</strong>{" "}
                                            <a href={`https://www.google.com/maps/search/${restaurant.location}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >{restaurant.location}
                                            </a>
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Capacity:</strong>{restaurant.capacity} guests
                                        </Card.Text>
                                    </Card.Body>
                                </Card>

                            </Col>
                        ))}
                    </Row>
                )}

            </Container>
        </div>
    )
}