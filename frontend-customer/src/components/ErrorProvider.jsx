import { Alert, Container } from "react-bootstrap";

function ErrorProvider({ errorMessage }) {
  return (
    <Container className="py-5">
      <Alert
        variant="danger"
        className="d-flex justify-content-between align-items-center"
      >
        {errorMessage}
      </Alert>
    </Container>
  );
}

export default ErrorProvider;
