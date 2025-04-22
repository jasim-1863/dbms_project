import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table } from 'react-bootstrap';
import { fetchMenu } from '../services/api';

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMenu = async () => {
      try {
        setLoading(true);
        const response = await fetchMenu();
        setMenu(response.data);
      } catch (err) {
        setError('Failed to load menu. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMenu();
  }, []);

  // Sort the menu by day of week
  const sortedMenu = [...menu].sort((a, b) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.indexOf(a.day) - days.indexOf(b.day);
  });

  return (
    <Container>
      <h1 className="text-center mb-4">Weekly Menu</h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : sortedMenu.length === 0 ? (
        <Alert variant="info">No menu items available yet.</Alert>
      ) : (
        <Row>
          {sortedMenu.map((item) => (
            <Col md={6} lg={4} className="mb-4" key={item._id}>
              <Card>
                <Card.Header as="h5">{item.day}</Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <th>Breakfast</th>
                        <td>{item.breakfast}</td>
                      </tr>
                      <tr>
                        <th>Lunch</th>
                        <td>{item.lunch}</td>
                      </tr>
                      <tr>
                        <th>Dinner</th>
                        <td>{item.dinner}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MenuPage; 