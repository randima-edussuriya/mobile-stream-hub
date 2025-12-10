import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ErrorProvider({ errorMessage = "Error" }) {
  const navigate = useNavigate();
  return (
    <Container className="bg-danger-subtle text-danger h5 rounded p-3 d-flex justify-content-between align-items-center mt-3">
      <span>{errorMessage} !</span>
      <Button
        className="border-2 shadow"
        variant="secondary"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    </Container>
  );
}

export default ErrorProvider;
