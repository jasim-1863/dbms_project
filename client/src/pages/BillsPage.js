import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table, Badge } from 'react-bootstrap';
import { fetchUserBills } from '../services/api';

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserBills = async () => {
      try {
        setLoading(true);
        const response = await fetchUserBills();
        setBills(response.data);
      } catch (err) {
        setError('Failed to load bills. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUserBills();
  }, []);

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
      <h1 className="text-center mb-4">My Bills</h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : bills.length === 0 ? (
        <Alert variant="info">No bills available yet.</Alert>
      ) : (
        <Row>
          {bills.map((bill) => (
            <Col md={6} className="mb-4" key={bill._id}>
              <Card>
                <Card.Header as="h5">
                  {getMonthName(bill.month)} {bill.year}
                  <Badge 
                    bg={bill.isPaid ? 'success' : 'warning'} 
                    className="float-end"
                  >
                    {bill.isPaid ? 'Paid' : 'Unpaid'}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <th>Breakfast</th>
                        <td>{bill.breakfastCount} × ₹{bill.breakfastPrice}</td>
                        <td>₹{bill.breakfastCount * bill.breakfastPrice}</td>
                      </tr>
                      <tr>
                        <th>Lunch</th>
                        <td>{bill.lunchCount} × ₹{bill.lunchPrice}</td>
                        <td>₹{bill.lunchCount * bill.lunchPrice}</td>
                      </tr>
                      <tr>
                        <th>Dinner</th>
                        <td>{bill.dinnerCount} × ₹{bill.dinnerPrice}</td>
                        <td>₹{bill.dinnerCount * bill.dinnerPrice}</td>
                      </tr>
                      <tr className="table-info">
                        <th colSpan={2}>Total Amount</th>
                        <th>₹{bill.totalAmount}</th>
                      </tr>
                    </tbody>
                  </Table>
                  <div className="text-muted">
                    Generated on: {new Date(bill.generatedAt).toLocaleDateString()}
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

export default BillsPage; 