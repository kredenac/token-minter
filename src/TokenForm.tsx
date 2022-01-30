import React from 'react';
import {
  Col,
  Form,
  Row,
  Accordion,
  Container,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import 'dark-bootstrap-theme/dist/dark.min.css';
import { TokenInfo } from '@uniswap/token-lists';
import { TokenInput } from './TokenInput';

type TokenFormPropos = {
  onSumbmit: (token: TokenInfo) => void;
};

interface TokenFormState extends TokenInfo {
  showImgUpload: boolean;
}

export class TokenForm extends React.Component<
  TokenFormPropos,
  TokenFormState
> {
  constructor(props: TokenFormPropos) {
    super(props);
    this.state = { showImgUpload: false } as any;
  }

  // accordionRef = React.createRef<typeofAccordion>();

  render() {
    return (
      <Container className="form-body col-lg-6 col-md-16 mx-auto">
        <Form action={'#'} onSubmit={() => console.log('form.onsubmit')}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Required Token Settings</Accordion.Header>
              <Accordion.Body> {this.basic()}</Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Advanced Token Settings</Accordion.Header>
              <Accordion.Body>{this.advanced()}</Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <button type="submit" className="btn btn-primary">
            Create Your New Token!
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
            <Form.Control
              type="text"
              placeholder="SOL"
              maxLength={21}
              required
            />
          </Form.Group>
        </Col>
        <Col md>
          <Form.Label>Token Name</Form.Label>
          <Form.Control
            type="text"
            placeholder={'Solana Token'}
            maxLength={56}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col md>
          <Form.Group>
            <Form.Label>Token Supply</Form.Label>
            <Form.Control
              type="number"
              placeholder="1000"
              defaultValue={1000000}
            />
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
            <Form.Label>Tags - Comma Separated</Form.Label>
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
          <DropdownButton
            title={
              this.state.showImgUpload
                ? 'Select Token Icon Via Image Upload'
                : 'Select Token Icon Via ULR'
            }
            className="mt-2"
          >
            <Dropdown.Item
              onClick={() => this.setState({ showImgUpload: false })}
            >
              Select Token Icon Via ULR
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => this.setState({ showImgUpload: true })}
            >
              Select Token Icon Via Image Upload
            </Dropdown.Item>
          </DropdownButton>
          {this.imageInput()}
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

  imageInput() {
    if (!this.state.showImgUpload) {
      return (
        <Form.Control
          type="url"
          pattern="https://.*"
          placeholder={'https://website.com/logo.svg'}
          defaultValue={
            'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
          }
          maxLength={56}
        />
      );
    }
    return <TokenInput></TokenInput>;
  }
}
