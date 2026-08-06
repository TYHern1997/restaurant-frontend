import { Card, Col, Button, Modal, Row, Carousel } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MdRestaurantMenu } from 'react-icons/md'
import { BsMap } from 'react-icons/bs'
import { FaMapMarkerAlt } from 'react-icons/fa'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API = "https://restaurant-backend-jv5m.onrender.com";

export default function RestaurantCard({ restaurant, onSelect }) {
    const [showModal, setShowModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [showMap, setShowMap] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [viewerImages, setViewerImages] = useState([])
    const [viewerIndex, setViewerIndex] = useState(null)

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

    const handleBookNow = (e) => {
        e.stopPropagation()
        if (!token) {
            alert('Log in to book a table')
            navigate('/auth')
        } else {
            navigate(`/bookings?restaurant=${restaurant.id}`)
        }
    }

    return (
        <Col sm={4} className="mb-4">
            <Card className="h-100 shadow-sm" style={{ cursor: "pointer" }} onClick={() => onSelect(restaurant)}>

                {restaurant.image_url && (
                    <Card.Img
                        variant='top'
                        src={restaurant.image_url}
                        style={{ height: "150px", objectFit: "cover" }}
                    />
                )}
                <Card.Body>

                    <Card.Title>{restaurant.name}</Card.Title>

                    <Card.Text>
                        {restaurant.avg_rating ? (
                            <>
                                {"⭐".repeat(Math.round(restaurant.avg_rating))}
                                {"☆".repeat(5 - Math.round(restaurant.avg_rating))}
                                {" "}<strong>{restaurant.avg_rating}</strong>
                                {" "}<span className="text-muted small">({restaurant.review_count} reviews)</span>
                            </>
                        ) : (
                            <span className="text-muted small">No reviews yet</span>
                        )}
                    </Card.Text>

                    <div className="d-flex justify-content-between alighn-itmes-center mb-2">
                        <span><strong>Cuisine:</strong> {restaurant.cuisine_type}</span>
                        {restaurant.price_range && (
                            <span className="text-muted small">
                                {restaurant.price_range === '$' && '$ · Under RM50'}
                                {restaurant.price_range === '$$' && '$$ · RM50–RM150'}
                                {restaurant.price_range === '$$$' && '$$$ · Above RM150'}
                            </span>
                        )}
                    </div>


                    {restaurant.menu_url && (
                        <Button
                            variant="outline-success"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                window.open(restaurant.menu_url, '_blank')
                            }}
                        >
                            <MdRestaurantMenu /> View Menu
                        </Button>
                    )}
                    <Card.Text>
                        <strong>Location:</strong> {restaurant.location}{" "}

                        <a href={`https://www.google.com/maps/search/${restaurant.location}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaMapMarkerAlt />
                        </a>
                    </Card.Text>
                    <Card.Text>
                        <strong>Capacity:</strong> {restaurant.capacity} guests
                    </Card.Text>
                    <div className="d-flex gap-3 mt-2">
                        <Button
                            variant='outline-primary'
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleCardClick() }}
                        >
                            View Reviews
                        </Button>
                        <Button
                            variant='outline-primary'
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); setShowMap(true); }}
                        >
                            <BsMap /> Show on Map
                        </Button>
                    </div>
                    <Button
                        variant="danger"
                        size="sm"
                        className="rounded-pill mt-2 w-100"
                        onClick={handleBookNow}
                    >
                        🍽️ Book a Table
                    </Button>

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


                                {review.images && review.images.length > 0 && (
                                    <div style={{
                                        display: "flex",
                                        gap: "8px",
                                        overflowX: 'auto',
                                        paddingBottom: '8px'
                                    }}>
                                        {review.images.map((img, index) => (
                                            <img
                                                key={img.id}
                                                src={img.image_url}
                                                alt="review"
                                                onClick={() => {
                                                    setViewerImages(review.images)
                                                    setViewerIndex(index)
                                                }}
                                                style={{
                                                    height: "80px",
                                                    width: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    flexShrink: 0,
                                                    cursor: "pointer"
                                                }}
                                            />
                                        ))}

                                    </div>
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

            <Modal
                show={viewerIndex !== null}
                onHide={() => setViewerIndex(null)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Photos</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {viewerImages.length > 0 && (
                        <Carousel
                            activeIndex={viewerIndex}
                            onSelect={(i) => setViewerIndex(i)}
                            interval={null}
                        >
                            {viewerImages.map((img) => (
                                <Carousel.Item key={img.id}>
                                    <img
                                        src={img.image_url}
                                        alt='review'
                                        style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setViewerIndex(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showMap} onHide={() => setShowMap(false)} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{restaurant.name} - Location</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "400px", padding: 0 }}>
                    {restaurant.lat && restaurant.lng ? (
                        <MapContainer
                            center={[parseFloat(restaurant.lat), parseFloat(restaurant.lng)]}
                            zoom={16}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                            />
                            <Marker position={[parseFloat(restaurant.lat), parseFloat(restaurant.lng)]}>
                                <Popup>
                                    <strong>{restaurant.name}</strong><br />
                                    {restaurant.cuisine_type}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <p className="text-center mt-3">No location available for this restaurant.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMap(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Col>
    );
}