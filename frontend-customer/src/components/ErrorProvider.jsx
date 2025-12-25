import { Alert, Container } from "react-bootstrap";

function ErrorProvider({ errorMessage }) {
  return (
    <Alert
      variant="danger"
      className="d-flex justify-content-between align-items-center mb-0"
    >
      {errorMessage}
    </Alert>
  );
}

export default ErrorProvider;
