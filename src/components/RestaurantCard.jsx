import { Card, Col } from "react-bootstrap";

export default function RestaurantCard({ restaurant }) {
    return (
        <Col sm={4} className="mb-4">
            <Card className="h-100 shadow-sm">
                <Card.Body>
                    <Card.Title>{restaurant.name}</Card.Title>
                    <Card.Text>
                        <strong>Cuisine:</strong> {restaurant.cuisine_type}
                    </Card.Text>
                    <Card.Text>
                        <strong>Location:</strong>{" "}

                        <a href={`https://www.google.com/maps/search/${restaurant.location}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {restaurant.location}
                        </a>
                    </Card.Text>
                    <Card.Text>
                        <strong>Capacity:</strong> {restaurant.capacity} guests
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}