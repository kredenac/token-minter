import React from 'react';
import { Col, Form, Row, Accordion, Container } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'dark-bootstrap-theme/dist/dark.min.css';
import { TokenInfo } from '@uniswap/token-lists';

export class TokenForm extends React.Component<{}, TokenInfo> {
  render() {
    return (
      <Container className="form-body col-lg-6 col-md-16 mx-auto">
        <Form>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Required Token Settings</Accordion.Header>
              <Accordion.Body> {this.basic()}</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Advanced Token Settings</Accordion.Header>
              <Accordion.Body>{this.advanced()}</Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Row className="d-none"></Row>
        </Form>
      </Container>
    );
  }

  basic = () => (
    <Row>
      <Col md>
        <Form.Group>
          <Form.Label>Token Symbol</Form.Label>
          <Form.Control type="text" placeholder="SOL" maxLength={21} />
        </Form.Group>
      </Col>
      <Col md>
        <Form.Label>Token Name</Form.Label>
        <Form.Control type="text" placeholder={'Solana Token'} maxLength={56} />
      </Col>
    </Row>
  );

  advanced = () => (
    <Row>
      <Col md>
        <Form.Group>
          <Form.Label>Token Symbol</Form.Label>
          <Form.Control type="text" placeholder="SOL" maxLength={21} />
        </Form.Group>
      </Col>
      <Col md>
        <Form.Label>Token Name</Form.Label>
        <Form.Control type="text" placeholder={'Solana Token'} maxLength={56} />
      </Col>
    </Row>
  );
}
