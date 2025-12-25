import axios, { formToJSON } from "axios";
import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNo: "",
    subject: "",
    message: "",
  });

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  const handeleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /*-----------------------------------------------
        Handle form submit
  ------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/customer/inquiries`, formData);
      toast.success("Your inquiry has been submitted successfully.");
      handleClear();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      address: "",
      phoneNo: "",
      subject: "",
      message: "",
    });
  };

  return (
    <Container fluid  className="mt-5">
      <Container className="col-lg-8 bg_light rounded shadow p-3">
        <Row>
          <Col>
            <h3>Contact Us</h3>
          </Col>
          <Col xs="auto">
            <Button
              className="border-2 shadow"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Col>
        </Row>
        <hr className="border-1" />

        {/* -----------------------------------------------------
              Contact form section
        --------------------------------------------------------- */}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handeleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name="address"
                  value={formData.address}
                  onChange={handeleChange}
                  as="textarea"
                  rows={1}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={formData.email}
                  onChange={handeleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Phone number</Form.Label>
                <Form.Control
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handeleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Container className="px-0">
            <Form.Group className="mb-2">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                name="subject"
                value={formData.subject}
                onChange={handeleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Type your message here...</Form.Label>
              <Form.Control
                name="message"
                value={formData.message}
                onChange={handeleChange}
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Container>
          <Container className="mt-3 d-flex gap-2 justify-content-center align-items-center">
            <Button
              type="submit"
              variant="none"
              className="btn_main_dark shadow w-auto"
            >
              Submit Inquiry
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              className="shadow"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Container>
        </Form>
      </Container>
    </Container>
  );
}

export default ContactUs;
