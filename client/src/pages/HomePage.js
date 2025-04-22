import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner, Table } from 'react-bootstrap';
import { fetchTodayMenu, fetchTodayUserBooking, createOrUpdateBooking } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [todayMenu, setTodayMenu] = useState(null);
  const [userBooking, setUserBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingUpdated, setBookingUpdated] = useState(false);
  const { user } = useContext(AuthContext);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const menuResponse = await fetchTodayMenu();
      setTodayMenu(menuResponse.data);

      if (user) {
        try {
          const bookingResponse = await fetchTodayUserBooking();
          setUserBooking(bookingResponse.data);
        } catch (err) {
          if (err.response?.status !== 404) {
            throw err;
          }
          // It's okay if there's no booking yet
        }
      }
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleMealToggle = async (meal) => {
    try {
      setLoading(true);

      let bookingData = {
        date: today
      };

      if (userBooking) {
        // Update existing booking - toggle the meal
        bookingData[meal] = !userBooking[meal];
      } else {
        // Create new booking - all meals are true by default except the one being toggled if it's false
        bookingData = {
          date: today,
          breakfast: meal === 'breakfast' ? false : true,
          lunch: meal === 'lunch' ? false : true,
          dinner: meal === 'dinner' ? false : true
        };
      }

      await createOrUpdateBooking(bookingData);
      
      // Refresh booking data
      const bookingResponse = await fetchTodayUserBooking();
      setUserBooking(bookingResponse.data);
      
      setBookingUpdated(true);
      setTimeout(() => setBookingUpdated(false), 3000);
    } catch (err) {
      setError('Failed to update booking');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Welcome to the Mess Management System</h1>
          {!user && (
            <Alert variant="info" className="text-center mt-3">
              Please <Link to="/login">login</Link> to book meals
            </Alert>
          )}
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          {bookingUpdated && (
            <Alert variant="success">Booking updated successfully!</Alert>
          )}

          <Row>
            <Col md={6} className="mb-4">
              <Card>
                <Card.Header as="h5">Today's Menu</Card.Header>
                <Card.Body>
                  {todayMenu ? (
                    <Table striped bordered hover>
                      <tbody>
                        <tr>
                          <th>Breakfast</th>
                          <td>{todayMenu.breakfast}</td>
                        </tr>
                        <tr>
                          <th>Lunch</th>
                          <td>{todayMenu.lunch}</td>
                        </tr>
                        <tr>
                          <th>Dinner</th>
                          <td>{todayMenu.dinner}</td>
                        </tr>
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="warning">No menu available for today</Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {user && (
              <Col md={6}>
                <Card>
                  <Card.Header as="h5">Today's Meal Booking</Card.Header>
                  <Card.Body>
                    <Table striped bordered hover>
                      <tbody>
                        <tr>
                          <th>Breakfast</th>
                          <td>
                            {userBooking ? (
                              userBooking.breakfast ? 'Booked' : 'Skipped'
                            ) : (
                              'Not booked yet'
                            )}
                          </td>
                          <td>
                            <Button
                              variant={
                                userBooking && userBooking.breakfast
                                  ? 'danger'
                                  : 'success'
                              }
                              size="sm"
                              onClick={() => handleMealToggle('breakfast')}
                              disabled={loading}
                            >
                              {userBooking && userBooking.breakfast
                                ? 'Skip'
                                : 'Book'}
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <th>Lunch</th>
                          <td>
                            {userBooking ? (
                              userBooking.lunch ? 'Booked' : 'Skipped'
                            ) : (
                              'Not booked yet'
                            )}
                          </td>
                          <td>
                            <Button
                              variant={
                                userBooking && userBooking.lunch
                                  ? 'danger'
                                  : 'success'
                              }
                              size="sm"
                              onClick={() => handleMealToggle('lunch')}
                              disabled={loading}
                            >
                              {userBooking && userBooking.lunch
                                ? 'Skip'
                                : 'Book'}
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <th>Dinner</th>
                          <td>
                            {userBooking ? (
                              userBooking.dinner ? 'Booked' : 'Skipped'
                            ) : (
                              'Not booked yet'
                            )}
                          </td>
                          <td>
                            <Button
                              variant={
                                userBooking && userBooking.dinner
                                  ? 'danger'
                                  : 'success'
                              }
                              size="sm"
                              onClick={() => handleMealToggle('dinner')}
                              disabled={loading}
                            >
                              {userBooking && userBooking.dinner
                                ? 'Skip'
                                : 'Book'}
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default HomePage; 