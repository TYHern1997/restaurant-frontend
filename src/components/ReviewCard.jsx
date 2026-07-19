import { useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";

export default function ReviewCard({ booking, existingReview, onSubmit, isEditing, onEditToggle }) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(booking.id, booking.restaurant_id, rating, comment);
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <Row>
                    {/* placeholder image */}
                    <Col sm={3}>
                        <div style={{
                            width: "100%",
                            height: "100px",
                            backgroundColor: "#e0e0e0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px"
                        }}>
                            🍽️
                        </div>
                    </Col>

                    <Col sm={9}>
                        <div className="d-flex justify-content-between">
                            <h5>{booking.restaurant_name}</h5>
                            {existingReview && (
                                <Button variant="link" size="sm" onClick={onEditToggle}>
                                    ✏️
                                </Button>
                            )}
                        </div>
                        <p className="text-muted small">{booking.date?.slice(0, 10)}</p>

                        {/* star rating display */}
                        {existingReview && !isEditing && (
                            <div>
                                <p>
                                    {"⭐".repeat(existingReview.rating)}{"☆".repeat(5 - existingReview.rating)}
                                </p>
                                <p>{existingReview.comment}</p>
                            </div>
                        )}

                        {/* review form — show if no review yet OR editing */}
                        {(!existingReview || isEditing) && (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Rating</Form.Label>
                                    <div>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                style={{ cursor: "pointer", fontSize: "1.5rem" }}
                                                onClick={() => setRating(star)}
                                            >
                                                {star <= rating ? "⭐" : "☆"}
                                            </span>
                                        ))}
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Review</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write your review..."
                                    />
                                </Form.Group>
                                <Button type="submit" variant="danger" size="sm" className="rounded-pill">
                                    {existingReview ? "Update Review" : "Submit Review"}
                                </Button>
                                {isEditing && (
                                    <Button variant="link" size="sm" onClick={onEditToggle}>
                                        Cancel
                                    </Button>
                                )}
                            </Form>
                        )}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}