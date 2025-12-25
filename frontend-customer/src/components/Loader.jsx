import React from "react";
import { Container, Spinner } from "react-bootstrap";

function Loader({ fullScreen }) {
  return (
    <Container
      fluid
      className={`d-flex justify-content-center align-items-center ${
        fullScreen && "min-vh-100 bg-primary-subtle"
      }`}
    >
      <Spinner
        className={`${fullScreen && "p-3"}`}
        animation="border"
        role="status"
        variant={`${fullScreen ? "primary" : "secondary"}`}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
}

export default Loader;
