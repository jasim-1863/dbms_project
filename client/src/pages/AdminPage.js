import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table, Form, Button, Tab, Tabs } from 'react-bootstrap';
import { 
  fetchAllUsers, 
  fetchTodayMealCount, 
  fetchTodayBookings,
  fetchMenu,
  updateMenu,
  generateBill,
  fetchAllBills,
  markBillAsPaid
} from '../services/api';

const AdminPage = () => {
  // State for users tab
  const [users, setUsers] = useState([]);
  
  // State for bookings tab
  const [todayCount, setTodayCount] = useState(null);
  const [todayBookings, setTodayBookings] = useState([]);
  
  // State for menu tab
  const [menu, setMenu] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');

  // State for bills tab
  const [bills, setBills] = useState([]);
  const [billUserId, setBillUserId] = useState('');
  const [billMonth, setBillMonth] = useState('');
  const [billYear, setBillYear] = useState('');
  
  // Shared state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  // Tab switching handlers
  const handleTabSelect = (key) => {
    switch(key) {
      case 'users':
        loadUsers();
        break;
      case 'bookings':
        loadBookings();
        break;
      case 'menu':
        loadMenu();
        break;
      case 'bills':
        loadBills();
        break;
      default:
        break;
    }
  };

  // Load users data
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load today's bookings data
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [countResponse, bookingsResponse] = await Promise.all([
        fetchTodayMealCount(),
        fetchTodayBookings()
      ]);
      
      setTodayCount(countResponse.data);
      setTodayBookings(bookingsResponse.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load menu data
  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchMenu();
      setMenu(response.data);
      
      // Find the selected day in the menu
      const dayMenu = response.data.find(item => item.day === selectedDay);
      if (dayMenu) {
        setBreakfast(dayMenu.breakfast);
        setLunch(dayMenu.lunch);
        setDinner(dayMenu.dinner);
      } else {
        setBreakfast('');
        setLunch('');
        setDinner('');
      }
    } catch (err) {
      setError('Failed to load menu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle day change in menu tab
  const handleDayChange = (day) => {
    setSelectedDay(day);
    
    // Update form fields with selected day's menu
    const dayMenu = menu.find(item => item.day === day);
    if (dayMenu) {
      setBreakfast(dayMenu.breakfast);
      setLunch(dayMenu.lunch);
      setDinner(dayMenu.dinner);
    } else {
      setBreakfast('');
      setLunch('');
      setDinner('');
    }
  };

  // Handle menu update
  const handleMenuUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await updateMenu({
        day: selectedDay,
        breakfast,
        lunch,
        dinner
      });
      
      setSuccess('Menu updated successfully');
      loadMenu();
    } catch (err) {
      setError('Failed to update menu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load bills data
  const loadBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAllBills();
      setBills(response.data);
    } catch (err) {
      setError('Failed to load bills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle bill generation
  const handleGenerateBill = async (e) => {
    e.preventDefault();
    
    if (!billUserId || !billMonth || !billYear) {
      setError('Please fill all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await generateBill({
        userId: billUserId,
        month: parseInt(billMonth),
        year: parseInt(billYear)
      });
      
      setSuccess('Bill generated successfully');
      loadBills();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate bill');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle marking bill as paid
  const handleMarkAsPaid = async (billId) => {
    try {
      setLoading(true);
      setError(null);
      
      await markBillAsPaid(billId);
      
      setSuccess('Bill marked as paid');
      loadBills();
    } catch (err) {
      setError('Failed to update bill');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get month name
  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  return (
    <Container>
      <h1 className="text-center mb-4">Admin Panel</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Tabs
        defaultActiveKey="users"
        id="admin-tabs"
        className="mb-3"
        onSelect={handleTabSelect}
      >
        <Tab eventKey="users" title="Users">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : users.length === 0 ? (
            <Alert variant="info">No users found.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                    <td>{new Date(user.registeredDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
        
        <Tab eventKey="bookings" title="Today's Bookings">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row>
              <Col md={4} className="mb-4">
                <Card>
                  <Card.Header as="h5">Today's Summary</Card.Header>
                  <Card.Body>
                    {todayCount ? (
                      <Table striped bordered hover>
                        <tbody>
                          <tr>
                            <th>Breakfast</th>
                            <td>{todayCount.breakfastCount}</td>
                          </tr>
                          <tr>
                            <th>Lunch</th>
                            <td>{todayCount.lunchCount}</td>
                          </tr>
                          <tr>
                            <th>Dinner</th>
                            <td>{todayCount.dinnerCount}</td>
                          </tr>
                          <tr className="table-info">
                            <th>Total Bookings</th>
                            <th>{todayCount.totalBookings}</th>
                          </tr>
                        </tbody>
                      </Table>
                    ) : (
                      <Alert variant="info">No bookings for today.</Alert>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={8}>
                <Card>
                  <Card.Header as="h5">Booking Details</Card.Header>
                  <Card.Body>
                    {todayBookings.length === 0 ? (
                      <Alert variant="info">No bookings for today.</Alert>
                    ) : (
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Breakfast</th>
                            <th>Lunch</th>
                            <th>Dinner</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todayBookings.map((booking, index) => (
                            <tr key={booking._id}>
                              <td>{index + 1}</td>
                              <td>{booking.user.name}</td>
                              <td>{booking.breakfast ? '✅' : '❌'}</td>
                              <td>{booking.lunch ? '✅' : '❌'}</td>
                              <td>{booking.dinner ? '✅' : '❌'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>
        
        <Tab eventKey="menu" title="Manage Menu">
          {loading && menu.length === 0 ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row>
              <Col md={6}>
                <Card>
                  <Card.Header as="h5">Update Menu</Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleMenuUpdate}>
                      <Form.Group className="mb-3" controlId="day">
                        <Form.Label>Day</Form.Label>
                        <Form.Select 
                          value={selectedDay} 
                          onChange={(e) => handleDayChange(e.target.value)}
                        >
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="breakfast">
                        <Form.Label>Breakfast</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter breakfast menu" 
                          value={breakfast}
                          onChange={(e) => setBreakfast(e.target.value)}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="lunch">
                        <Form.Label>Lunch</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter lunch menu" 
                          value={lunch}
                          onChange={(e) => setLunch(e.target.value)}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="dinner">
                        <Form.Label>Dinner</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter dinner menu" 
                          value={dinner}
                          onChange={(e) => setDinner(e.target.value)}
                          required
                        />
                      </Form.Group>
                      
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" /> Updating...
                          </>
                        ) : 'Update Menu'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>
        
        <Tab eventKey="bills" title="Manage Bills">
          {loading && bills.length === 0 ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row>
              <Col md={5} className="mb-4">
                <Card>
                  <Card.Header as="h5">Generate Bill</Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleGenerateBill}>
                      <Form.Group className="mb-3" controlId="userId">
                        <Form.Label>User</Form.Label>
                        <Form.Select 
                          value={billUserId} 
                          onChange={(e) => setBillUserId(e.target.value)}
                          required
                        >
                          <option value="">Select User</option>
                          {users.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="month">
                        <Form.Label>Month</Form.Label>
                        <Form.Select 
                          value={billMonth} 
                          onChange={(e) => setBillMonth(e.target.value)}
                          required
                        >
                          <option value="">Select Month</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i+1} value={i+1}>{getMonthName(i+1)}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="year">
                        <Form.Label>Year</Form.Label>
                        <Form.Control 
                          type="number" 
                          placeholder="Enter year" 
                          value={billYear}
                          onChange={(e) => setBillYear(e.target.value)}
                          min="2020"
                          max="2030"
                          required
                        />
                      </Form.Group>
                      
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" /> Generating...
                          </>
                        ) : 'Generate Bill'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={7}>
                <Card>
                  <Card.Header as="h5">Recent Bills</Card.Header>
                  <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {bills.length === 0 ? (
                      <Alert variant="info">No bills available.</Alert>
                    ) : (
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Period</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bills.map((bill) => (
                            <tr key={bill._id}>
                              <td>{bill.user.name}</td>
                              <td>{getMonthName(bill.month)} {bill.year}</td>
                              <td>₹{bill.totalAmount}</td>
                              <td>{bill.isPaid ? 'Paid' : 'Unpaid'}</td>
                              <td>
                                {!bill.isPaid && (
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    onClick={() => handleMarkAsPaid(bill._id)}
                                    disabled={loading}
                                  >
                                    Mark as Paid
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminPage; 