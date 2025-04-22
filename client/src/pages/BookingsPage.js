import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table, Button } from 'react-bootstrap';
import { fetchUserBookings, createOrUpdateBooking } from '../services/api';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      try {
        setLoading(true);
        const response = await fetchUserBookings();
        setBookings(response.data);
      } catch (err) {
        setError('Failed to load bookings. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container>
      <h1 className="text-center mb-4">My Meal Bookings</h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : bookings.length === 0 ? (
        <Alert variant="info">You haven't made any bookings yet.</Alert>
      ) : (
        <Row>
          {bookings.map((booking) => (
            <Col md={6} className="mb-4" key={booking._id}>
              <Card>
                <Card.Header as="h5">{formatDate(booking.date)}</Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <th>Breakfast</th>
                        <td>{booking.breakfast ? 'Booked' : 'Skipped'}</td>
                      </tr>
                      <tr>
                        <th>Lunch</th>
                        <td>{booking.lunch ? 'Booked' : 'Skipped'}</td>
                      </tr>
                      <tr>
                        <th>Dinner</th>
                        <td>{booking.dinner ? 'Booked' : 'Skipped'}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <div className="text-muted">
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default BookingsPage; 