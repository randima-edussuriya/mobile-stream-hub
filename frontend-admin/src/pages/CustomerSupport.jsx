import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Container,
  Card,
  Spinner,
  Badge,
  Row,
  Col,
  Alert,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";

function CustomerSupport() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { backendUrl } = useContext(AppContext);

  /* -----------------------------------------------------------------
        Fetch all customer inquiries
  --------------------------------------------------------------------*/
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/inquiries`);
      setInquiries(data.data || []);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to fetch inquiries. Please try again later.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Handle reply modal
  --------------------------------------------------------------------*/
  const handleOpenReplyModal = (inquiry) => {
    setReplyingTo(inquiry);
    setReplyText(inquiry.reply || "");
    setShowModal(true);
  };

  const handleCloseReplyModal = () => {
    setShowModal(false);
    setReplyingTo(null);
    setReplyText("");
  };

  /* -----------------------------------------------------------------
        Submit reply
  --------------------------------------------------------------------*/
  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    if (!replyingTo?.inquiry_id) {
      toast.error("Invalid inquiry");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.put(
        `${backendUrl}/api/admin/inquiries/${replyingTo.inquiry_id}/reply`,
        { reply: replyText.trim() },
      );
      toast.success("Reply sent successfully");
      handleCloseReplyModal();
      setInquiries((prevInquiries) =>
        prevInquiries.map((inquiry) =>
          inquiry.inquiry_id === data.data.inquiry_id
            ? { ...inquiry, ...data.data }
            : inquiry,
        ),
      );
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to send reply. Please try again later.";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  /* -----------------------------------------------------------------
        Render content based on loading/error state
  --------------------------------------------------------------------*/
  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h4 className="fw-semibold text-light">
            Customer Support - Inquiries
          </h4>
        </Col>
      </Row>

      {inquiries.length === 0 ? (
        <Alert variant="info">No customer inquiries found.</Alert>
      ) : (
        <Row className="g-3">
          {inquiries.map((inquiry) => (
            <Col key={inquiry.inquiry_id} xs={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="mb-1">Inquiry #{inquiry.inquiry_id}</h6>
                      <small className="text-muted">
                        {dayjs(inquiry.inquired_at).format(
                          "YYYY-MM-DD HH:mm:ss",
                        )}
                      </small>
                    </div>
                    <Badge bg={inquiry.reply ? "success" : "warning"}>
                      {inquiry.reply ? "Replied" : "Pending"}
                    </Badge>
                  </div>

                  <Row className="mb-3">
                    <Col md={6}>
                      <strong className="text-muted">Customer:</strong>
                      <p className="mb-0">{inquiry.customer_name}</p>
                    </Col>
                    <Col md={6}>
                      <strong className="text-muted">Email:</strong>
                      <p className="mb-0">{inquiry.customer_email}</p>
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <strong className="text-muted">Customer Message:</strong>
                    <p className="mb-0 mt-1">{inquiry.message}</p>
                  </div>

                  {inquiry.reply ? (
                    <div className="border-top pt-3">
                      <strong className="text-muted">Staff Reply:</strong>
                      <p className="mb-1 mt-1">{inquiry.reply}</p>
                      <small className="text-muted">
                        Replied by: {inquiry.staff_id} -{" "}
                        {inquiry.staff_name || "Staff"} on{" "}
                        {dayjs(inquiry.replyed_at).format(
                          "YYYY-MM-DD HH:mm:ss",
                        )}
                      </small>
                    </div>
                  ) : (
                    <div className="border-top pt-3">
                      <p className="text-muted mb-2">
                        <i className="bi bi-clock me-2"></i>
                        No reply yet
                      </p>
                    </div>
                  )}

                  <div className="text-end mt-3">
                    <Button
                      variant="none"
                      size="sm"
                      onClick={() => handleOpenReplyModal(inquiry)}
                      className="btn_main_light_outline"
                    >
                      {inquiry.reply ? "Update Reply" : "Reply"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <Modal show={showModal} onHide={handleCloseReplyModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {replyingTo?.reply ? "Update Reply" : "Reply to Inquiry"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {replyingTo && (
              <>
                <div className="mb-3">
                  <strong>Customer:</strong> {replyingTo.customer_name}
                </div>
                <div className="mb-3">
                  <strong>Message:</strong>
                  <p className="text-muted mb-0">{replyingTo.message}</p>
                </div>
                <Form.Group>
                  <Form.Label className="fw-bold">Your Reply</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enter your reply..."
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCloseReplyModal}
            >
              Cancel
            </Button>
            <Button
              variant="none"
              size="sm"
              className="btn_main_dark"
              onClick={handleSubmitReply}
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Reply"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default CustomerSupport;
