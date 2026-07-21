import { useState, useRef } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios"
const API = "https://restaurant-backend-production-3168.up.railway.app"

export default function ReviewCard({ booking, existingReview, onSubmit, isEditing, onEditToggle, onImageUpload }) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const token = localStorage.getItem('token')

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(booking.id, booking.restaurant_id, rating, comment);
    };

    const imageInputRef = useRef(null)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            const storageRef = ref(storage, `reviews/${Date.now()}_${file.name}`)
            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)
            await axios.post(`${API}/reviews/${existingReview.id}/images`,
                { image_url: url },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (onImageUpload) await onImageUpload()
        } catch (err) {
            console.error(err)
        }
    }


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
                            borderRadius: "8px",
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            {existingReview?.image_url ? (
                                <img
                                    src={existingReview.image_url}
                                    alt="review"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%"
                                }}>
                                    🍽️
                                </div>
                            )}

                            {/* + button overlay */}
                            {existingReview && (
                                <div
                                    onClick={() => imageInputRef.current.click()}
                                    style={{
                                        position: "absolute",
                                        top: "4px",
                                        right: "4px",
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                        width: "24px",
                                        height: "24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        fontSize: "1rem",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
                                    }}
                                >
                                    +
                                </div>
                            )}
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

                                {/* Image upload button */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleImageUpload}
                                />

                                {/* Display uploaded image if exists */}
                                {/* {existingReview.image_url && (
                                    <div className="mt-2">
                                        <img
                                            src={existingReview.image_url}
                                            alt="review"
                                            style={{ width: "100%", borderRadius: "8px", maxHeight: "200px", objectFit: "cover" }}
                                        />
                                    </div>
                                )} */}
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