import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

export class TokenForm extends React.Component {
  render() {
    return (
      <Form>
        <Row>
          <Col md>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="text" placeholder="LMAO"></Form.Control>
            </Form.Group>
          </Col>
          <Col md>
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="number" placeholder={'5'}></Form.Control>
          </Col>
        </Row>
      </Form>
    );
  }
}
