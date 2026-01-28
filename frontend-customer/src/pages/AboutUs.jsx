import { Container, Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container className="mt-5">
      {/* Page Title */}
      <Row className="mb-4">
        <Col>
          <h4 className="fw-semibold">About Mobile Stream Hub</h4>
          <p className="text-muted">
            Your trusted mobile phone sales and repair partner in Colombo 3
          </p>
        </Col>
      </Row>

      {/* Introduction */}
      <Row className="mb-4">
        <Col md={8}>
          <p>
            <strong>Mobile Stream Hub</strong> is a reliable mobile phone sales
            and repair shop located in the heart of <strong>Colombo 3</strong>.
            We specialize in providing high-quality smartphones, genuine
            accessories, and professional mobile repair services to meet the
            needs of our customers.
          </p>

          <p>
            With a strong focus on customer satisfaction, our experienced
            technicians and sales team ensure that every customer receives
            honest advice, fair pricing, and dependable service.
          </p>
        </Col>
      </Row>

      {/* Mission & Vision */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Body>
              <Card.Title className="fw-bold">Our Mission</Card.Title>
              <Card.Text>
                To provide affordable, high-quality mobile phones, accessories,
                and reliable repair services while building long-term
                relationships based on trust and transparency.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Body>
              <Card.Title className="fw-bold">Our Vision</Card.Title>
              <Card.Text>
                To become one of the most trusted mobile phone sales and repair
                service providers in Sri Lanka by continuously improving service
                quality and customer experience.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Closing */}
      <Row>
        <Col>
          <p>
            Whether you are looking to purchase a new phone or need professional
            repair services, <strong>Mobile Stream Hub</strong> is here to help.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
