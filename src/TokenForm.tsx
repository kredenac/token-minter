import React from 'react';
import {
  Col,
  Form,
  Row,
  Accordion,
  Container,
  DropdownButton,
  Dropdown,
  Tooltip,
} from 'react-bootstrap';
import 'dark-bootstrap-theme/dist/dark.min.css';
import { TokenInfo } from '@uniswap/token-lists';
import { TokenInput } from './TokenInput';

type TokenFormPropos = {
  onSumbmit: (token: TokenInfo) => void;
};

export class TokenForm extends React.Component<TokenFormPropos, TokenInfo> {
  render() {
    return (
      <Container className="form-body col-lg-6 col-md-16 mx-auto">
        <Form>
          <Accordion defaultActiveKey="1">
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
          <button type="submit" className="btn btn-primary">
            Create Your Token
          </button>
        </Form>
      </Container>
    );
  }

  basic = () => (
    <>
      <Row>
        <Col md>
          <Form.Group>
            <Form.Label>Token Symbol</Form.Label>
            <Form.Control type="text" placeholder="SOL" maxLength={21} />
          </Form.Group>
        </Col>
        <Col md>
          <Form.Label>Token Name</Form.Label>
          <Form.Control
            type="text"
            placeholder={'Solana Token'}
            maxLength={56}
          />
        </Col>
      </Row>
      <Row>
        <Col md>
          <Form.Group>
            <Form.Label>Token Supply</Form.Label>
            <Form.Control type="number" placeholder="1000" />
          </Form.Group>
        </Col>
        <Col md>
          <Form.Label>Homepage URL</Form.Label>
          <Form.Control
            type="url"
            pattern="https://.*"
            placeholder={'https://streamflow.finance'}
            maxLength={56}
            required={true}
          />
        </Col>
      </Row>
    </>
  );

  advanced = () => (
    <>
      <Row>
        <Col md>
          <Form.Group>
            <Form.Label>Tags - Comma Separated Words</Form.Label>
            <Form.Control
              type="text"
              placeholder="tokenized-stock, DeFi"
              maxLength={21}
            />
          </Form.Group>
        </Col>
        <Col md>
          <Form.Label>Decimals [0-10]</Form.Label>
          <Form.Control type="number" placeholder={'6'} min={'1'} max={'5'} />
        </Col>
      </Row>
      <Row>
        <Col md>
          <DropdownButton title="Select Token Icon Via ULR" className="mt-2">
            <Dropdown.Item>Select Token Icon Via ULR</Dropdown.Item>
            <Dropdown.Item>Select Token Icon Via Image Upload</Dropdown.Item>
          </DropdownButton>

          <Form.Control
            type="url"
            pattern="https://.*"
            placeholder={'https://website.com/logo.svg'}
            defaultValue={
              'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
            }
            maxLength={56}
          />

          <TokenInput></TokenInput>
        </Col>
        <Col md>
          <Form.Label className="mt-3">Twitter Profile</Form.Label>
          <Form.Control
            type="url"
            pattern="https://.*"
            placeholder={'https://twitter.com/streamflow_fi'}
          />
        </Col>
      </Row>
    </>
  );
}
