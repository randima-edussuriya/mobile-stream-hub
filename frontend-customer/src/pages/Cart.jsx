import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Card,
  Spinner,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ErrorProvider from "../components/ErrorProvider";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const { backendUrl } = useContext(AppContext);

  // fetch cart items from API
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError("");
      setCartItems([]);
      const { data } = await axios.get(`${backendUrl}/api/customer/cart`);
      setCartItems(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscountedPrice = (sellPrice, discount) => {
    if (discount > 0) {
      return sellPrice - (sellPrice * discount) / 100;
    }
    return sellPrice;
  };

  const calculateSubtotal = (sellPrice, discount, quantity) => {
    const discountedPrice = calculateDiscountedPrice(sellPrice, discount);
    return discountedPrice * quantity;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, cartItem) => {
      return (
        total +
        calculateSubtotal(
          cartItem.sell_price,
          cartItem.discount,
          cartItem.item_quantity
        )
      );
    }, 0);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h3 className="fw-bold">Shopping Cart</h3>
        </Col>
      </Row>
      {loading && (
        <Container className="text-center">
          <Spinner animation="border" role="status" variant="secondary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      )}

      {!loading && error && <ErrorProvider errorMessage={error} />}

      {!loading && !error && cartItems.length === 0 && (
        <Card className="p-4 text-center">
          <p className="mb-3">Your cart is empty</p>
          <Button as={Link} to="/products" variant="dark">
            Continue Shopping
          </Button>
        </Card>
      )}

      {!loading && !error && cartItems.length > 0 && (
        <Row>
          {/* Cart Items */}
          <Col md={8}>
            <Table hover striped size="sm" className="shadow" bordered>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price (Rs.)</th>
                  <th>Quantity</th>
                  <th>Subtotal (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cartItem) => (
                  <tr key={cartItem.cart_item_id}>
                    <td>
                      <div>
                        <Image
                          src={cartItem.image}
                          alt={cartItem.name}
                          width={90}
                          rounded
                          className="object-fit-cover me-2"
                        />
                        <Link
                          to={`/products/${cartItem.item_id}`}
                          className="text-decoration-none fw-medium"
                        >
                          <span>{cartItem.name}</span>
                        </Link>
                      </div>
                    </td>
                    <td className="text-end">
                      {calculateDiscountedPrice(
                        Number(cartItem.sell_price),
                        Number(cartItem.discount)
                      ).toLocaleString()}
                    </td>
                    <td className="text-center">
                      {Number(cartItem.item_quantity)}
                    </td>
                    <td className="text-end">
                      {calculateSubtotal(
                        Number(cartItem.sell_price),
                        Number(cartItem.discount),
                        Number(cartItem.item_quantity)
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          {/* Cart Summary */}
          <Col md={4}>
            <Card className="p-3 shadow-sm">
              <h5 className="fw-bold mb-3">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Total</span>
                <span className="fw-bold">
                  Rs. {calculateTotal().toLocaleString()}
                </span>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
