import { Row, Col, Card, Button } from "react-bootstrap"

export default function BookingList({ bookings, handleEdit, handleDelete }) {
    return (
        <Row>
            {bookings.map((booking) => (
                <Col sm={4} key={booking.id} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>{booking.title}</Card.Title>
                            <Card.Text>
                                <strong>Description:</strong> {booking.description}
                            </Card.Text>
                            <Card.Text>
                                <strong>Date:</strong> {booking.date.slice(0, 10)}
                            </Card.Text>
                            <Card.Text>
                                <strong>Time:</strong> {booking.time.slice(0, 5)}
                            </Card.Text>
                            <Card.Text>
                                <strong>Phone:</strong> {booking.phone_number}
                            </Card.Text>
                            <Card.Text>
                                <strong>Email:</strong> {booking.email}
                            </Card.Text>
                            <Card.Text>
                                <strong>Restaurant:</strong> {booking.restaurant_name}
                            </Card.Text>
                            <Card.Text>
                                <strong>Location:</strong>{" "}

                                <a href={`https://www.google.com/maps/search/${booking.restaurant_location}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {booking.restaurant_location}
                                </a>
                            </Card.Text>
                            <Button
                                variant="outline-primary"
                                className="me-2 rounded-pill"
                                onClick={() => handleEdit(booking)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline-danger"
                                className="rounded-pill"
                                onClick={() => handleDelete(booking.id)}
                            >
                                Delete
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}