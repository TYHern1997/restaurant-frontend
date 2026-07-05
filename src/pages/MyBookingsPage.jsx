import { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import AppNavBar from "../components/NavBar";
import BookingList from "../components/BookingList";
import { useNavigate } from "react-router-dom";

export default function MyBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([])
    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('token:', token);
            const res = await axios.get('https://restaurant-backend-production-3168.up.railway.app/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('bookings data:', res.data);
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://restaurant-backend-production-3168.up.railway.app/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBookings();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (booking) => {
        navigate('/bookings', { state: { editBooking: booking } });
    };

    return (
        <div style={{ backgroundColor: "#f8f4f0", minHeight: "100vh" }}>
            <AppNavBar />
            <Container className="my-5">
                <h2 className="text-center mb-4">My Bookings</h2>
                <BookingList
                    bookings={bookings}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </Container>
        </div>
    );
}
