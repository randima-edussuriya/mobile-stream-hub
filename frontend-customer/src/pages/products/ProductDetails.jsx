import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image, Spinner, Badge } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { AppContext } from "../../context/AppContext";
import ErrorProvider from "../../components/ErrorProvider";

function ProductDetails() {
  const { itemId } = useParams();
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /*-------------------------------------------------------
        fetch item details from API
  --------------------------------------------------------- */
  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      setError("");
      setItem({});
      const { data } = await axios.get(
        `${backendUrl}/api/customer/items/${itemId}`
      );
      setItem(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPrice = (sellPrice, discount) => {
    if (discount > 0) {
      const discountedPrice = sellPrice - (sellPrice * discount) / 100;
      return (
        <>
          <span className="text-muted text-decoration-line-through me-2 h5">
            Rs. {sellPrice.toLocaleString()}
          </span>
          <span className="fw-bold text-danger h5">
            Rs. {discountedPrice.toLocaleString()}
          </span>
        </>
      );
    } else {
      return (
        <span className="fw-bold h5">Rs. {sellPrice.toLocaleString()}</span>
      );
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  return (
    <Container className="mt-5 py-3 bg_light rounded">
      {loading && (
        <Container className="text-center">
          <Spinner animation="border" role="status" variant="secondary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      )}

      {!loading && error && <ErrorProvider errorMessage={error} />}

      {!loading && !error && item && (
        <Row>
          <Col md={6} className="text-center">
            <Image
              src={item.image}
              alt={item.name}
              fluid
              rounded
              className="object-fit-cover"
            />
          </Col>
          <Col md={6}>
            <h3 className="mb-1">{item.name}</h3>
            <div className="text-muted mb-3">{item.brand}</div>
            {item.discount > 0 && (
              <Badge bg="success" className="mb-3 fs-6 p-1">
                -{Number(item.discount).toLocaleString()}%
              </Badge>
            )}
            <div className="mb-3">
              {renderPrice(Number(item.sell_price), Number(item.discount))}
            </div>

            <div className="my-4 d-flex gap-2">
              <Button variant="none" className="btn_main_dark">
                <i className="bi bi-cart-plus me-1" /> Add to Cart
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/products")}
              >
                Back to Products
              </Button>
            </div>

            <div>
              <h6>Description</h6>
              <p>{item.description}</p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default ProductDetails;
