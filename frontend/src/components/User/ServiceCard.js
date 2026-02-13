import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const ServiceCard = ({ category, items }) => (
  <Card className="mb-4">
    <Card.Header as="h3">{category.toUpperCase()}</Card.Header>
    <ListGroup variant="flush">
      {items.map((item, idx) => (
        <ListGroup.Item key={idx}>{item.name} - ₹{item.price}</ListGroup.Item>
      ))}
    </ListGroup>
  </Card>
);

export default ServiceCard;