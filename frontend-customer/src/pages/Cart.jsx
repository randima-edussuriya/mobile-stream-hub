import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import ErrorProvider from "../components/ErrorProvider";
import Loader from "../components/Loader";
import EmptyCart from "../components/cart/EmptyCart";
import CartTable from "../components/cart/CartTable";
import CartSummary from "../components/cart/CartSummary";
import { calculateTotal } from "../utils/cartCalculation";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const { backendUrl } = useContext(AppContext);

  /*-------------------------------------------------
        fetch cart items
  --------------------------------------------------- */
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError("");
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

  useEffect(() => {
    fetchCartItems();
  }, []);

  const renderContent = () => {
    // handle loading
    if (loading) return <Loader />;

    // handle error
    if (error) return <ErrorProvider errorMessage={error} />;

    // handle empty cart
    if (cartItems.length === 0) return <EmptyCart />;

    /*-----------------------------------------------
          render cart items and summary
    ------------------------------------------------- */
    return (
      <Row className="g-3">
        <Col md={8}>
          <CartTable cartItems={cartItems} />
        </Col>

        <Col md={4}>
          <CartSummary total={calculateTotal(cartItems)} />
        </Col>
      </Row>
    );
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h3 className="fw-semibold">Shopping Cart</h3>
        </Col>
      </Row>

      {renderContent()}
    </Container>
  );
};

export default Cart;
