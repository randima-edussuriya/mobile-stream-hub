import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image, Badge, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { AppContext } from "../../context/AppContext";
import ErrorProvider from "../../components/ErrorProvider";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

function ProductDetails() {
  const { itemId } = useParams();
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { backendUrl, isLoggedIn, fetchCartItemCount } = useContext(AppContext);

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
        `${backendUrl}/api/customer/items/${itemId}`,
      );
      setItem(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------------------
        render price with discount if applicable
  ------------------------------------------------------ */
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

  /*-------------------------------------------------------
        handle add to cart action
  --------------------------------------------------------- */
  const handleAddtoCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      const { data } = await axios.post(`${backendUrl}/api/customer/cart/add`, {
        itemId: item.item_id,
        quantity: Number(quantity),
      });
      toast.success(data.message);
      fetchCartItemCount(); // Update cart count in header
      navigate("/cart");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, []);

  // check item stock availability
  const isInStock = Number(item?.stock_quantity) > 0;

  return (
    <Container className="mt-5 py-3 bg_light rounded">
      {loading && <Loader />}

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
            <h4 className="mb-1 fw-semibold">{item.name}</h4>
            <div className="text-muted mb-3">{item.brand}</div>
            {item.discount > 0 && (
              <Badge bg="success" className="mb-3 fs-6 p-1">
                -{Number(item.discount).toLocaleString()}%
              </Badge>
            )}
            <div className="mb-3">
              {renderPrice(Number(item.sell_price), Number(item.discount))}
            </div>

            {/* -------------------------------------------------------
                  stock avalabiity section
            -----------------------------------------------------------*/}
            <div className="mb-3 d-flex align-items-center gap-2">
              <span
                className={`fw-semibold ${
                  isInStock ? "text-success" : "text-danger"
                }`}
              >
                {isInStock ? "In stock" : "Out of stock"}
              </span>
              {isInStock && (
                <span className="text-muted small">
                  {Number(item.stock_quantity).toLocaleString()} available
                </span>
              )}
            </div>

            {/* -------------------------------------------------------
                  quantity input section
            -----------------------------------------------------------*/}
            <Form onSubmit={handleAddtoCart}>
              <Form.Group className="mb-4 d-flex align-items-center gap-2">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  name="quantity"
                  type="number"
                  min={1}
                  max={Number(item.stock_quantity) || 1}
                  value={quantity}
                  disabled={!isInStock}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-auto"
                />
              </Form.Group>

              {/* ---------------------------------------
                  Add to cart, back buttons section
            ------------------------------------------- */}
              <div className="my-4 d-flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  variant="none"
                  className="btn_main_dark"
                  disabled={!isInStock}
                >
                  <i className="bi bi-cart-plus me-1" /> Add to Cart
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => navigate("/products")}
                  className="fw-medium"
                >
                  Back to Products
                </Button>
              </div>
            </Form>

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
