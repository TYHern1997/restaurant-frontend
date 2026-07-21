import { useState, useEffect, useRef } from "react"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { Container, Image, Form, Row, Col } from "react-bootstrap"
import AppNavBar from "../components/NavBar"
import ReviewCard from "../components/ReviewCard";
import Footer from "../components/Footer";

const API = "https://restaurant-backend-production-3168.up.railway.app"

export default function ProfilePage() {
    const [profilePic, setProfilePic] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [visitedBookings, setVisitedBookings] = useState([]);
    const [reviews, setReviews] = useState({});
    const [editingReview, setEditingReview] = useState(null);

    const token = localStorage.getItem('token')
    const decoded = token ? jwtDecode(token) : null;
    const fileInputRef = useRef(null)


    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API}/users/${decoded.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPreviewUrl(res.data.profile_pic || '');
        } catch (err) {
            console.error(err);
        }
    };


    const fetchVisitedBookings = async () => {
        try {
            const res = await axios.get(`${API}/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const visited = res.data.filter(b => b.visited === true);
            setVisitedBookings(visited);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API}/reviews/user/${decoded.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // convert to object keyed by booking_id for easy lookup
            const reviewMap = {};
            res.data.forEach(r => {
                reviewMap[r.booking_id] = r;
            });
            setReviews(reviewMap);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (decoded) {
            fetchUser();
            fetchVisitedBookings();
            fetchReviews();
        }
    }, []);


    const handlePencilClick = () => {
        fileInputRef.current.click()
    }



    const handleReviewSubmit = async (bookingId, restaurantId, rating, comment) => {
        try {
            if (reviews[bookingId]) {
                // update  review
                await axios.put(`${API}/reviews/${reviews[bookingId].id}`,
                    { rating, comment },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // make new review
                await axios.post(`${API}/reviews`,
                    {
                        booking_id: bookingId,
                        user_id: decoded.id,
                        restaurant_id: restaurantId,
                        rating,
                        comment
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            //refresh
            const res = await axios.get(`${API}/reviews/user/${decoded.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const reviewMap = {};
            res.data.forEach(r => {
                reviewMap[r.booking_id] = r;
            });
            setReviews(reviewMap);
            setEditingReview(null);
        } catch (err) {
            console.error(err);
            setError('Failed to submit review');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfilePic(file)
            await handleUpload(file)
        }
    }

    const handleUpload = async (file) => {

        if (!file) return;
        setLoading(true)
        setError('')
        setSuccess('');

        try {
            const storageRef = ref(storage, `profiles/${decoded.id}_${Date.now()}`)
            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)
            await axios.put(`${API}/users/${decoded.id}`,
                { profile_pic: url },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setPreviewUrl(url)
            setSuccess('Profile picture updated successfully!')
            setTimeout(() => setSuccess(''), 3000)

        } catch (err) {
            console.error(err)
            setError(`Upload failed. Please try again.`)
            setTimeout(() => setError(''), 3000)
        } finally {
            setLoading(false)
        }

    }



    return (
        <div style={{
            backgroundColor: "#f8f4f0",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            <AppNavBar />
            <Container className="my-5" style={{ flex: 1 }}>
                <Row>


                    {/*Profile info */}
                    <Col xs={12} sm={4} className="text-center">
                        <Form onSubmit={handleUpload}>
                            <div style={{ position: "relative", display: "inline-block" }}>

                                {/* Profile picture or placeholder */}
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        roundedCircle
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div style={{
                                        width: "120px",
                                        height: "120px",
                                        borderRadius: "50%",
                                        backgroundColor: "#ddd",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto"
                                    }}>
                                        <span>No Photo</span>
                                    </div>
                                )}

                                {/* Hidden file input */}
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                />

                                {/* Pencil icon overlay */}
                                <div
                                    onClick={handlePencilClick}
                                    style={{
                                        position: "absolute",
                                        bottom: "0px",
                                        right: "0px",
                                        cursor: "pointer",
                                        backgroundColor: "white",
                                        borderRadius: "50%",
                                        padding: "4px",
                                        fontSize: "1rem"
                                    }}
                                >
                                    ✏️
                                </div>
                            </div>

                            <h5 className="mt-3">{decoded?.email}</h5>
                            <p className="text-muted">
                                {decoded?.role === 'admin' ? '👑 Admin' : '👤 User'}
                            </p>

                            {success && <p style={{ color: "green" }}>{success}</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            {loading && <p style={{ color: "gray" }}>Uploading...</p>}

                        </Form>
                    </Col>

                    {/* My Places */}
                    <Col xs={12} sm={8}>
                        <h3 className="mb-4">My Places</h3>
                        {visitedBookings.length === 0 ? (
                            <p className="text-muted">No visited restaurants yet — mark a booking as visited to see it here!</p>
                        ) : (
                            visitedBookings.map((booking) => (
                                <div key={booking.id}>
                                    {!reviews[booking.id] && (
                                        <p className="text-muted small mb-1">⏳ Pending Review</p>
                                    )}
                                    {reviews[booking.id] && (
                                        <p className="text-success small mb-1">✅ Reviewed</p>
                                    )}
                                    <ReviewCard
                                        key={booking.id}
                                        booking={booking}
                                        existingReview={reviews[booking.id]}
                                        onSubmit={handleReviewSubmit}
                                        isEditing={editingReview === booking.id}
                                        onEditToggle={() => setEditingReview(
                                            editingReview === booking.id ? null : booking.id
                                        )}
                                        onImageUpload={fetchReviews}
                                    />
                                </div>
                            ))
                        )}
                    </Col>

                </Row>
            </Container>
            <Footer />
        </div>
    );

}