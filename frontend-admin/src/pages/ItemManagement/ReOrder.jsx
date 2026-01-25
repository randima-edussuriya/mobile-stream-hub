import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

function ReOrder() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [item, setItem] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ neededQuantity: "" });

  /* -----------------------------------------------------------------
        Fetch Item and Supplier Details
  --------------------------------------------------------------------*/
  const fetchItemAndSupplier = async () => {
    try {
      setLoading(true);
      setError("");
      const { data: itemData } = await axios.get(
        `${backendUrl}/api/admin/items/${itemId}`,
      );
      if (itemData.success) {
        setItem(itemData.data);
        const { data: supplierData } = await axios.get(
          `${backendUrl}/api/admin/suppliers/${itemData.data.supplier_id}`,
        );
        if (supplierData.success) setSupplier(supplierData.data.supplier);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemAndSupplier();
  }, [itemId]);

  /* -----------------------------------------------------------------    
        Handle Form Submit
  --------------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.neededQuantity || formData.neededQuantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/items/reorder/${itemId}`,
        {
          neededQuantity: Number(formData.neededQuantity),
        },
      );
      if (data.success) {
        toast.success(data.message || "Reorder request sent successfully");
        navigate(`/item-management/profile/${itemId}`);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to send reorder request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );

  if (error || !item || !supplier)
    return (
      <Container className="mt-5">
        <Card className="border-danger">
          <Card.Body className="text-danger text-center">
            <p className="mb-3">{error || "Failed to load reorder page"}</p>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Reorder Item - {item.name}</h4>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>
      <Row className="g-3">
        <Col xs={12} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Item Details
            </Card.Header>
            <Card.Body>
              <p className="mb-2">
                <strong>Item ID:</strong> {item.item_id}
              </p>
              <p className="mb-2">
                <strong>Name:</strong> {item.name}
              </p>
              <p className="mb-2">
                <strong>Brand:</strong> {item.brand}
              </p>
              <p className="mb-2">
                <strong>Current Stock:</strong> {item.stock_quantity}
              </p>
              <p className="mb-0">
                <strong>Reorder Point:</strong> {item.reorder_point}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Supplier Details
            </Card.Header>
            <Card.Body>
              <p className="mb-2">
                <strong>Supplier ID:</strong> {supplier.supplier_id}
              </p>
              <p className="mb-2">
                <strong>Name:</strong> {supplier.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {supplier.email}
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> {supplier.phone_number}
              </p>
              <p className="mb-0">
                <strong>Address:</strong> {supplier.address}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Reorder Request Form
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="neededQuantity">
                    <strong>Needed Quantity</strong>
                  </Form.Label>
                  <Form.Control
                    id="neededQuantity"
                    type="number"
                    name="neededQuantity"
                    value={formData.neededQuantity}
                    onChange={(e) =>
                      setFormData({ neededQuantity: e.target.value })
                    }
                    placeholder="Enter quantity needed"
                    min="1"
                    disabled={submitting}
                  />
                  <Form.Text className="text-success">
                    Current stock is {item.stock_quantity} units. Reorder point
                    is {item.reorder_point} units.
                  </Form.Text>
                </Form.Group>
                <Alert variant="info" className="py-1">
                  <strong>Note:</strong> A reorder email will be sent to the
                  supplier with the quantity and item details.
                </Alert>
                <Button
                  variant="success"
                  size="sm"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>Send Reorder Request
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ReOrder;
