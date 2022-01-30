import { Col, Container, Row, Form } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import { explorerLink, UxState } from './types';

export function Results(props: {
  mintAddr?: string;
  associatedAccount?: string;
  prLink?: string;
  uxState: UxState;
}) {
  if (props.uxState === 'initial') return null;
  return (
    <Container className="col-lg-6 col-md-16 mx-auto">
      <Row>
        <Col md>
          <InfoLink label="Token Mint" value={props.mintAddr} />
          <InfoLink label="Associated Account" value={props.mintAddr} />

          <PullRequest prLink={props.prLink} />
          {props.uxState === 'done' ? <Congrats /> : <Loading />}
        </Col>
      </Row>
    </Container>
  );
}

function PullRequest(props: { prLink?: string }) {
  if (!props.prLink) return null;
  return (
    <>
      <InfoLink label="Pull Request to list your token" value={props.prLink} />
      <p>
        Your token is active immediately. Pull request is for discoverability.
      </p>
    </>
  );
}

function Congrats() {
  return (
    <div className="alert alert-success" role="alert">
      Congratulations, you minted a new token! Save the above links.
    </div>
  );
}

function Loading() {
  return (
    <>
      <ReactLoading type="bars" color="#888" className="mx-auto" />
      <p>
        {
          'Creating your token, please wait for 20 seconds. Do not close this page. '
        }
      </p>
    </>
  );
}

function InfoLink(props: { label: string; value?: string | number }) {
  const { label, value } = props;
  if (!value) return null;

  return (
    <div>
      {
        <Form.Label htmlFor={label}>
          <ExplorerLabel address={value as string} label={label} />
        </Form.Label>
      }
      {/* <Form.Control type="text" name={label} value={value} readOnly={true} /> */}
    </div>
  );
}

function ExplorerLabel(props: { address: string; label: string }) {
  return (
    <a
      className="App-link"
      href={explorerLink(props.address)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.label}
    </a>
  );
}
