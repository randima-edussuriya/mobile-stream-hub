import React from "react";
import { Container, Spinner } from "react-bootstrap";

function Loader() {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 bg-primary-subtle"
    >
      <Spinner
        className="p-4"
        animation="border"
        role="status"
        variant="primary"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
}

export default Loader;
