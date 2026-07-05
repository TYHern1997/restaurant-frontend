import { Form, Button, Row, Col, Alert } from "react-bootstrap";

export default function BookingForm({
    restaurants,
    handleSubmit,
    title, setTitle,
    description, setDescription,
    date, setDate,
    time, setTime,
    phoneNumber, setPhoneNumber,
    email, setEmail,
    restaurantId, setRestaurantId,
    editingId,
    handleCancelEdit,
    error,
    success
}) {

    const titleOptions = ["Gathering", "Birthday Celebration", "Anniversary Dinner", "Business Meeting", "Date Night"];
    const isCustomTitle = title && !titleOptions.includes(title);

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Formats to "2026-07-05"
    };

    function handleInputTitle(e) {

        if (e.target.value === "Other") {
            setTitle(""); // Clear to type custom title
        } else {
            setTitle(e.target.value);
        }
    }

    return (
        <>
            <h2 className="text-center mb-4">
                {editingId ? "Update Booking" : "Make a Booking"}
            </h2>
            <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
                {/* success and error messages */}
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title / occasion</Form.Label>
                            <Form.Select
                                value={isCustomTitle ? "Other" : title}
                                onChange={handleInputTitle}
                            >
                                <option value="">Select an occasion...</option>
                                {titleOptions.map((opt, idx) => (
                                    <option key={idx} value={opt}>{opt}</option>
                                ))}
                                <option value="Other">Other (Specify below)...</option>
                            </Form.Select>
                        </Form.Group>

                        {(isCustomTitle || title === "") && (
                            <Form.Group className="mb-3 animate-fade-in">
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify occasion"
                                    value={isCustomTitle ? title : ""}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>
                        )}
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Select Restaurant</Form.Label>
                            <Form.Select
                                value={restaurantId}
                                onChange={(e) => setRestaurantId(e.target.value)}
                            >
                                <option value="">Choose a restaurant...</option>
                                {restaurants.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Table for 2, window seat preferred"
                    />
                </Form.Group>

                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                required
                                min={getTodayDateString()}
                                value={date ? date.split('T')[0] : ""}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Time</Form.Label>

                            <Form.Control
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="e.g. +60123456789"
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                readOnly
                                disabled
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" variant="primary">
                    {editingId ? "Update" : "Book Now"}
                </Button>

                {editingId && (
                    <Button
                        variant="outline-secondary"
                        className="rounded-pill"
                        onClick={handleCancelEdit}
                    >
                        Cancel
                    </Button>
                )}
            </Form>
        </>
    );
}