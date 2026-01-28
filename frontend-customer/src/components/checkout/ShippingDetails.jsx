import { Row, Form, Card, Col } from "react-bootstrap";

function ShippingDetails({ setShippingData }) {
  const provinces = [
    "Western Province",
    "Central Province",
    "Southern Province",
    "Northern Province",
    "Eastern Province",
    "North Western Province",
    "North Central Province",
    "Uva Province",
    "Sabaragamuwa Province",
  ];

  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
  ];

  /*-------------------------------------------
        handle input change
  --------------------------------------------- */
  const handleChange = (e) => {
    setShippingData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Card className="p-3 mb-3 shadow-sm border-body-secondary">
      <h5 className="fw-semibold mb-3">Shipping Details</h5>
      {/*-------------------------------------------------
            contact name & phone number
    --------------------------------------------------- */}
      <Row className="mb-2">
        <Col>
          <Form.Control
            name="contactName"
            type="text"
            placeholder="Contact name"
            onChange={handleChange}
            className="py-0"
          />
        </Col>
        <Col>
          <Form.Control
            name="phoneNumber"
            type="text"
            placeholder="Phone number"
            onChange={handleChange}
            className="py-0"
          />
        </Col>
      </Row>

      {/*-------------------------------------------------
            address details
    --------------------------------------------------- */}
      <Row className="mb-2">
        <Col>
          <Form.Control
            name="streetAddress"
            type="text"
            placeholder="Street address"
            onChange={handleChange}
            className="py-0"
          />
        </Col>
        <Col>
          <Form.Control
            name="city"
            type="text"
            placeholder="City"
            onChange={handleChange}
            className="py-0"
          />
        </Col>
      </Row>

      {/*-------------------------------------------------
            province, district & zip code
    --------------------------------------------------- */}
      <Row className="mb-2">
        <Col>
          <Form.Select name="province" onChange={handleChange} className="py-0">
            <option value="">Select province</option>
            {provinces.map((province, index) => (
              <option key={index} value={province}>
                {province}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select name="district" onChange={handleChange} className="py-0">
            <option value="">Select district</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Control
            name="zipCode"
            type="text"
            placeholder="Zip code"
            onChange={handleChange}
            className="py-0"
          />
        </Col>
      </Row>
    </Card>
  );
}

export default ShippingDetails;
