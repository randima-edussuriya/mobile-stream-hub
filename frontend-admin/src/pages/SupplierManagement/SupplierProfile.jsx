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
  Table,
  Badge,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";

function SupplierProfile() {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [supplier, setSupplier] = useState(null);
  const [items, setItems] = useState([]);

  const fetchSupplierDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/suppliers/${supplierId}`,
      );

      if (data.success) {
        setSupplier(data.data.supplier);
        setItems(data.data.items || []);
      } else {
        setError("Failed to load supplier");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch supplier. Please try again later.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierDetail();
  }, [supplierId]);

  if (loading) {
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
  }

  if (error || !supplier) {
    return (
      <Container className="mt-5">
        <Card className="border-danger">
          <Card.Body className="text-danger text-center">
            <p className="mb-3">{error || "Supplier not found"}</p>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Supplier #{supplier.supplier_id}</h4>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Supplier Details
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <p className="mb-2">
                    <strong>Name:</strong> {supplier.name}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {supplier.email}
                  </p>
                  <p className="mb-2">
                    <strong>Phone:</strong> {supplier.phone_number}
                  </p>
                </Col>
                <Col md={4} className="mb-3">
                  <p className="mb-2">
                    <strong>Address:</strong> {supplier.address}
                  </p>
                  <p className="mb-2">
                    <strong>Item Count:</strong>{" "}
                    <Badge bg="primary">{supplier.item_count}</Badge>
                  </p>
                </Col>
                <Col md={4} className="mb-3">
                  <p className="mb-2">
                    <strong>Supplier ID:</strong> {supplier.supplier_id}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold d-flex justify-content-between align-items-center">
              <span>Items from this Supplier</span>
              <Badge bg="primary">{items.length} items</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive" style={{ maxHeight: "65vh" }}>
                <Table hover striped size="sm" className="mb-0">
                  <thead
                    className="position-sticky top-0 bg-white"
                    style={{ zIndex: 20 }}
                  >
                    <tr className="fw-bold">
                      <th>Item ID</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Stock</th>
                      <th>Sell Price</th>
                      <th>Cost Price</th>
                      <th>Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-3 text-muted">
                          No items for this supplier
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.item_id}>
                          <td className="fw-bold">{item.item_id}</td>
                          <td>{item.name}</td>
                          <td className="text-muted">{item.brand}</td>
                          <td>{item.stock_quantity}</td>
                          <td>
                            Rs. {Number(item.sell_price).toLocaleString()}
                          </td>
                          <td>
                            Rs. {Number(item.cost_price).toLocaleString()}
                          </td>
                          <td>
                            {Number(item.discount).toLocaleString()}%
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SupplierProfile;
