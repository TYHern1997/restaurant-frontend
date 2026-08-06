import { useState, useRef, useEffect } from "react";
import { FaPencilAlt, FaCamera, FaImages, FaCheck, FaTrash } from 'react-icons/fa'
import { Card, Button, Form, Row, Col, Carousel, Modal } from "react-bootstrap";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios"
const API = "https://restaurant-backend-jv5m.onrender.com"

export default function ReviewCard({ booking, existingReview, onSubmit, isEditing, onEditToggle, onImageUpload }) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const token = localStorage.getItem('token')
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [reviewImages, setReviewImages] = useState([])
    const [selectedImageIndex, setSelectedImageIndex] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(booking.id, booking.restaurant_id, rating, comment);
    };

    const imageInputRef = useRef(null)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!existingReview?.id) {
            alert("Please save your review first before uploading an image.");
            return;
        }

        try {
            const storageRef = ref(storage, `reviews/${Date.now()}_${file.name}`)
            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)
            await axios.post(`${API}/reviews/${existingReview.id}/images`,
                { image_url: url },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (onImageUpload) await onImageUpload()
            await fetchReviewImages()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteImage = async (imageId) => {
        try {
            await axios.delete(`${API}/review_images/${imageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchReviewImages()
        } catch (err) {
            console.error(err)
        }
    }

    const fetchReviewImages = async () => {
        if (!existingReview) return
        try {
            const res = await axios.get(`${API}/reviews/${existingReview.id}/images`)
            setReviewImages(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchReviewImages()
    }, [existingReview])

    const handleCorrectText = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setIsCorrecting(true);
        try {
            const response = await axios.post(`${API}/ai/correct-review`, { comment });
            if (response.data.corrected) {
                setComment(response.data.corrected);
            }
        } catch (err) {
            console.error("AI correction error:", err.response?.data || err.message);
            alert(err.response?.data?.error || "Failed to fix review. Check backend logs.");
        } finally {
            setIsCorrecting(false);
        }
    };
    return (
        <>
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        {/* review image */}
                        <Col sm={3}>
                            {/* 2x2 Image Grid */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "4px",
                                borderRadius: "8px",
                                overflow: "hidden"
                            }}>
                                {reviewImages.slice(0, 3).map((img, index) => (
                                    <div
                                        key={img.id}
                                        onClick={() => setSelectedImageIndex(index)}
                                        style={{
                                            height: "60px",
                                            cursor: "pointer",
                                            overflow: "hidden",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        <img
                                            src={img.image_url}
                                            alt="review"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                ))}

                                {/* 4th slot — more images icon or empty */}
                                <div
                                    onClick={() => reviewImages.length > 0 && setSelectedImageIndex(0)}
                                    style={{
                                        height: "60px",
                                        backgroundColor: "#e0e0e0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "4px",
                                        cursor: reviewImages.length > 0 ? "pointer" : "default"
                                    }}
                                >
                                    {reviewImages.length > 3 ? (
                                        <span style={{ fontSize: "12px", color: "#555" }}>+{reviewImages.length - 3}</span>
                                    ) : reviewImages.length === 0 ? (
                                        <span style={{ fontSize: "24px" }}>🍽️</span>
                                    ) : (
                                        <FaImages size={20} color="#555" />
                                    )}
                                </div>
                            </div>

                            {/* Upload Button */}
                            {existingReview && (
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="w-100 mt-2"
                                    onClick={() => imageInputRef.current.click()}
                                >
                                    <FaCamera size={12} className="me-1" /> Add Photo
                                </Button>
                            )}

                            {/* Hidden file input */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={imageInputRef}
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                            />
                        </Col>

                        <Col sm={9}>
                            <div className="d-flex justify-content-between">
                                <h5>{booking.restaurant_name}</h5>
                                {existingReview && (
                                    <Button variant="link" size="sm" onClick={onEditToggle}>
                                        <FaPencilAlt />
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
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            className="mt-1"
                                            onClick={handleCorrectText}
                                        >
                                            {isCorrecting ? "✨ Improving..." : "✨ Improve with AI"}
                                        </Button>
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
            <Modal
                show={selectedImageIndex !== null}
                onHide={() => setSelectedImageIndex(null)}
                centered
                size='md'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Photos</Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-0">
                    {reviewImages.length > 0 && (
                        <Carousel
                            activeIndex={selectedImageIndex}
                            onSelect={(index) => setSelectedImageIndex(index)}
                            interval={null}
                        >
                            {reviewImages.map((img) => (
                                <Carousel.Item key={img.id}>
                                    <img
                                        src={img.image_url}
                                        alt="review"
                                        style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                                    />
                                </Carousel.Item>
                            ))}

                        </Carousel>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                            if (reviewImages[selectedImageIndex]) {
                                handleDeleteImage(reviewImages[selectedImageIndex].id)
                                setSelectedImageIndex(null)
                            }
                        }}
                    >
                        <FaTrash />
                    </Button>
                    <Button variant="secondary" onClick={() => setSelectedImageIndex(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}