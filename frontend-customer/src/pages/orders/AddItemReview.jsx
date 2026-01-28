import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

function AddItemReview() {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { backendUrl } = useContext(AppContext);
  const { orderId, itemId } = useParams();
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Handle form submission
  --------------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (rating === "") {
      toast.error("Please enter a rating");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${backendUrl}/api/customer/feedback/order-item`, {
        message: message.trim(),
        rating: Number(rating),
        orderId,
        itemId,
      });
      toast.success("Review submitted successfully");
      navigate(`/my-orders/${orderId}`);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to submit review. Please try again later.";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h3 className="fw-semibold">Add Review</h3>
        </Col>
        <Col xs="auto">
          <Button
            variant="none"
            className="btn_main_dark"
            onClick={() => navigate(`/my-orders/${orderId}`)}
          >
            Back to Order
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Header className="bg-light">
          <h5 className="mb-0">Review Details</h5>
        </Card.Header>
        <Card.Body>
          <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            <div>
              <span>Item ID: </span>
              <span className="fw-semibold">{itemId}</span>
            </div>

            <Form.Group controlId="rating">
              <Form.Label>Rating (0 - 5)</Form.Label>
              <Form.Control
                type="number"
                step="0.5"
                min="0"
                max="5"
                placeholder="Enter rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your feedback"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button
                variant="none"
                type="submit"
                size="sm"
                disabled={submitting}
                className="btn_main_light_outline"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddItemReview;
