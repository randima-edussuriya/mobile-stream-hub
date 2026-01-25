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
  const [isEditing, setIsEditing] = useState(false);
  const [editedSupplier, setEditedSupplier] = useState(null);
  const [updating, setUpdating] = useState(false);

  /*--------------------------------------------
        Fetch supplier details
  ---------------------------------------------- */
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

  /*--------------------------------------------
        Edit supplier handlers
  ---------------------------------------------- */
  const handleEditClick = () => {
    setEditedSupplier({
      name: supplier.name,
      email: supplier.email,
      phone_number: supplier.phone_number,
      address: supplier.address,
    });
    setIsEditing(true);
  };

  /*--------------------------------------------
        Cancel edit
  ---------------------------------------------- */
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedSupplier(null);
  };

  /*--------------------------------------------
        Handle input change
  ---------------------------------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*--------------------------------------------
        Save changes
  ---------------------------------------------- */
  const handleSaveChanges = async () => {
    try {
      setUpdating(true);
      setError("");
      const { data } = await axios.put(
        `${backendUrl}/api/admin/suppliers/${supplierId}`,
        editedSupplier,
      );

      if (data.success) {
        setSupplier(data.data);
        setIsEditing(false);
        setEditedSupplier(null);
      } else {
        setError("Failed to update supplier");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to update supplier. Please try again later.";
      setError(message);
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

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
            <Card.Header className="bg-secondary-subtle fw-semibold d-flex justify-content-between align-items-center">
              <span>Supplier Details</span>
              {!isEditing && (
                <Button
                  variant="none"
                  size="sm"
                  onClick={handleEditClick}
                  className="btn_main_dark"
                >
                  Edit
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {error && (
                <div className="alert alert-danger mb-3" role="alert">
                  {error}
                </div>
              )}
              {isEditing ? (
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Name:</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={editedSupplier.name}
                        onChange={handleInputChange}
                        disabled={updating}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Email:</strong>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={editedSupplier.email}
                        onChange={handleInputChange}
                        disabled={updating}
                      />
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Phone:</strong>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone_number"
                        value={editedSupplier.phone_number}
                        onChange={handleInputChange}
                        disabled={updating}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Address:</strong>
                      </label>
                      <textarea
                        className="form-control"
                        name="address"
                        value={editedSupplier.address}
                        onChange={handleInputChange}
                        rows="2"
                        disabled={updating}
                      />
                    </div>
                  </Col>
                  <Col xs={12} className="d-flex gap-2 justify-content-end">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleSaveChanges}
                      disabled={updating}
                      className="fw-medium"
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="fw-medium"
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              ) : (
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
              )}
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
                          <td>{Number(item.discount).toLocaleString()}%</td>
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
