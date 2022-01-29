import React from 'react';
import { Col, Form, Row, Accordion, Container } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'dark-bootstrap-theme/dist/dark.min.css';

export class TokenForm extends React.Component {
  render() {
    return (
      <Container className="form-body">
        {/*  */}
        <Row className="col-lg-6 col-md-12 mx-auto">
          {/* <Row className="mx-auto" style={{ maxWidth: '696px' }}> */}
          {/* <Col> */}
          {/* <Container className="mb-4"> */}
          {/* <Form className="form-control-sm"> */}
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Accordion Item #1</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Accordion Item #2</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Row className="d-none">
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
          {/* </Form> */}
          {/* </Container> */}
          {/* </Col> */}
        </Row>
      </Container>
    );
  }
}
