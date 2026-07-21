import { Card, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://restaurant-backend-production-3168.up.railway.app";

export default function RestaurantCard({ restaurant, onSelect }) {
    const [showModal, setShowModal] = useState(false);
    const [reviews, setReviews] = useState([]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API}/reviews/restaurant/${restaurant.id}`);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCardClick = async () => {
        await fetchReviews();
        setShowModal(true);
    };

    return (
        <Col sm={4} className="mb-4">
            <Card className="h-100 shadow-sm" style={{ cursor: "pointer" }} onClick={() => onSelect(restaurant)}>
                <Card.Body>
                    <Card.Title>{restaurant.name}</Card.Title>
                    <Card.Text>
                        <strong>Cuisine:</strong> {restaurant.cuisine_type}
                    </Card.Text>
                    {restaurant.menu_url && (
                        <a href={restaurant.menu_url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View Menu
                        </a>
                    )}
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
                    <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCardClick(); }}>
                        View Reviews
                    </a>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{restaurant.name} — Reviews</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {reviews.length === 0 ? (
                        <p className="text-muted">No reviews yet for this restaurant.</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="mb-3 border-bottom pb-3">
                                <strong>{review.first_name}</strong>
                                <p>{"⭐".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                                <p>{review.comment}</p>
                                {review.image_url && (
                                    <img
                                        src={review.image_url}
                                        alt="review"
                                        style={{ width: "100%", borderRadius: "8px", maxHeight: "150px", objectFit: "cover" }}
                                    />
                                )}
                            </div>
                        ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    );
}