import { useState, useEffect } from "react"
import axios from "axios"
import { Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import AppNavBar from "../components/NavBar"
import BookingList from "../components/BookingList";
import BookingForm from "../components/BookingForm";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";

export default function BookingsPage() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);

    const [bookings, setBookings] = useState([])
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [description, setDescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [restaurantId, setRestaurantId] = useState('')

    const [editingId, setEditingId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')


    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        setEmail(decoded.email);


        const editingBooking = localStorage.getItem('editingBooking');
        if (editingBooking) {
            const booking = JSON.parse(editingBooking);
            setEditingId(booking.id);
            setTitle(booking.title);
            setDescription(booking.description);
            setDate(booking.date);
            setTime(booking.time);
            setPhoneNumber(booking.phone_number);
            setRestaurantId(booking.restaurant_id);
            localStorage.removeItem('editingBooking');
        }

        fetchBookings();
        fetchRestaurants();
    }, []);
    const fetchRestaurants = async () => {
        try {
            const res = await axios.get('https://restaurant-backend-production-3168.up.railway.app/restaurants');
            setRestaurants(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('https://restaurant-backend-production-3168.up.railway.app/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setBookings(res.data)
        } catch (err) {
            console.error(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setSuccess('')
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);

        if (!title.trim() || !restaurantId || !date || !time || !phoneNumber.trim() || !email.trim()) {
            setError("Please fill out all required fields before booking.");
            setTimeout(() => setError(''), 3000);
            return; // Stops the execution immediately
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            setError("You cannot pick a date in the past.");
            setTimeout(() => setError(''), 3000);
            return;
        }



        try {
            const formattedDate = new Date(date).toISOString().split('T')[0];
            if (editingId) {
                console.log('Sending PUT with:', {
                    title, description, date, time,
                    phone_number: phoneNumber,
                    email, restaurant_id: restaurantId,
                    user_id: decoded.id
                });

                await axios.put(`https://restaurant-backend-production-3168.up.railway.app/bookings/${editingId}`, {
                    title, description, date: formattedDate, time,
                    phone_number: phoneNumber,
                    email, restaurant_id: restaurantId,
                    user_id: decoded.id
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess("Booking updated successfully!");
                setTimeout(() => setSuccess(''), 3000);
                navigate('/my-bookings');
            } else {

                await axios.post("https://restaurant-backend-production-3168.up.railway.app/bookings", {
                    title, description, date: formattedDate, time,
                    phone_number: phoneNumber,
                    email, restaurant_id: restaurantId,
                    user_id: decoded.id
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess("Booking created successfully!");
                setTimeout(() => setSuccess(''), 3000);
            }

            setTitle("");
            setDescription("");
            setDate("");
            setTime("");
            setPhoneNumber("");
            setEmail("");
            setRestaurantId("");
            setEditingId(null);


            const freshDecoded = jwtDecode(localStorage.getItem('token'));
            setEmail(freshDecoded.email);

            fetchBookings(); // refresh
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://restaurant-backend-production-3168.up.railway.app/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSuccess('Booking deleted successfully')
            setTimeout(() => setSuccess(''), 3000)
            fetchBookings()
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.")
            setTimeout(() => setError(''), 3000)
        }
    }

    const handleEdit = (booking) => {
        setEditingId(booking.id)
        setTitle(booking.title)
        setDescription(booking.description)
        setDate(booking.date)
        setTime(booking.time)
        setPhoneNumber(booking.phone_number)
        setEmail(booking.email)
        setRestaurantId(booking.restaurant_id)
        localStorage.removeItem('editingBooking')

    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setTitle(""); setDescription("");
        setTime(''); setPhoneNumber(''); setEmail('')
        setRestaurantId("");
        setError(""); setSuccess("")
        navigate('/my-bookings');
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


                <BookingForm
                    handleSubmit={handleSubmit}
                    title={title} setTitle={setTitle}
                    description={description} setDescription={setDescription}
                    date={date} setDate={setDate}
                    time={time} setTime={setTime}
                    phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
                    email={email} setEmail={setEmail}
                    restaurantId={restaurantId} setRestaurantId={setRestaurantId}
                    editingId={editingId}
                    handleCancelEdit={handleCancelEdit}
                    error={error}
                    success={success}
                    restaurants={restaurants}
                />


            </Container>
            <Footer />
        </div>
    );
}