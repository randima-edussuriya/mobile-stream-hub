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
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";

function InquiryLIsting() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      const { data } = await axios.get(`${backendUrl}/api/customer/inquiries`);
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
          <h4 className="fw-semibold">My Inquiries</h4>
        </Col>
      </Row>

      {inquiries.length === 0 ? (
        <Alert variant="info">
          No inquiries found. Submit an inquiry to get started.
        </Alert>
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
                    <Badge bg={inquiry.reply ? "success" : "warning text-dark"}>
                      {inquiry.reply ? "Replied" : "Pending"}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <strong className="text-muted">Your Message:</strong>
                    <p className="mb-0 mt-1">{inquiry.message}</p>
                  </div>

                  {inquiry.reply ? (
                    <div className="border-top pt-3">
                      <strong className="text-muted">Staff Reply:</strong>
                      <p className="mb-1 mt-1">{inquiry.reply}</p>
                      <small className="text-muted">
                        Replied on:{" "}
                        {dayjs(inquiry.replyed_at).format(
                          "YYYY-MM-DD HH:mm:ss",
                        )}
                      </small>
                    </div>
                  ) : (
                    <div className="border-top pt-3">
                      <p className="text-muted mb-0">
                        <i className="bi bi-clock me-2"></i>
                        Waiting for staff response...
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default InquiryLIsting;
