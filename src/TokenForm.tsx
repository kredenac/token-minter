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
  onSubmit: (token: TokenInfo) => void;
};

export type BonusTokenInfo = {
  symbol: string;
  name: string;
  decimals: number;
  imageUrl: string;
  imageFile: string;
  website: string;
  twitter: string;
  tags: string[];
  supply: number;
};

interface TokenFormState extends BonusTokenInfo {
  showImgUpload: boolean;
}

export class TokenForm extends React.Component<
  TokenFormPropos,
  TokenFormState
> {
  constructor(props: TokenFormPropos) {
    super(props);
    this.state = {
      showImgUpload: false,
      symbol: '',
      name: '',
      decimals: 6,
      imageUrl:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      imageFile: '',
      website: '',
      twitter: '',
      tags: [],
      supply: 1000_000,
    };
  }

  render() {
    return (
      <Container className="form-body col-lg-6 col-md-16 mx-auto">
        <Form onSubmit={() => console.log('called only on success')}>
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
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => console.log('state', this.state)}
          >
            Create Your New Token!
          </button>
        </Form>
      </Container>
    );
  }

  onSymbol = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ symbol: e.target.value });
  onName = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ name: e.target.value });
  onDecimals = (e: React.ChangeEvent<HTMLInputElement>) =>
    Number(e.target.value) &&
    this.setState({ decimals: Number(e.target.value) });
  onwebsite = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ website: e.target.value });
  ontwitter = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ twitter: e.target.value });
  onSupply = (e: React.ChangeEvent<HTMLInputElement>) =>
    Number(e.target.value) && this.setState({ supply: Number(e.target.value) });
  onimageUrl = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ imageUrl: e.target.value });
  ontag = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ tags: e.target.value.split(',').map((tag) => tag.trim()) });
  getTagValue() {
    return this.state.tags.join(',');
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
              onChange={this.onSymbol}
              value={this.state.symbol}
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
            onChange={this.onName}
            value={this.state.name}
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
              onChange={this.onSupply}
              value={this.state.supply}
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
            onChange={this.onwebsite}
            value={this.state.website}
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
              value={this.getTagValue()}
              onChange={this.ontag}
              maxLength={88}
            />
          </Form.Group>
        </Col>
        <Col md>
          <Form.Label>Decimals [0-10]</Form.Label>
          <Form.Control
            type="number"
            placeholder={'6'}
            onChange={this.onDecimals}
            value={this.state.decimals}
          />
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
            value={this.state.twitter}
            onChange={this.ontwitter}
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
          maxLength={56}
          onChange={this.onimageUrl}
          value={this.state.imageUrl}
        />
      );
    }
    // TODO revive this
    return <TokenInput></TokenInput>;
  }
}
