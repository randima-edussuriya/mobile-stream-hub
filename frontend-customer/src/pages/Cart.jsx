import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import ErrorProvider from "../components/ErrorProvider";
import Loader from "../components/Loader";
import EmptyCart from "../components/cart/EmptyCart";
import CartTable from "../components/cart/CartTable";
import CartSummary from "../components/cart/CartSummary";
import { calculateTotal } from "../utils/cartCalculation";
import { toast } from "react-toastify";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [originalCartItems, setOriginalCartItems] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

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
      setOriginalCartItems(data.data);
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

  /*-------------------------------------------------
        handle quantity change
  --------------------------------------------------- */
  const handleQuantityChange = (cartItemId, newQuantity) => {
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.cart_item_id === cartItemId
          ? { ...cartItem, item_quantity: Number(newQuantity) }
          : cartItem
      )
    );
    setIsUpdated(true);
  };

  /*-------------------------------------------------
        handle update cart
  --------------------------------------------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${backendUrl}/api/customer/cart`, {
        cartItems: cartItems.map((item) => ({
          cartItemId: item.cart_item_id,
          newQuantity: item.item_quantity,
        })),
      });
      setIsUpdated(false);
      toast.success(data.message);
      fetchCartItems();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
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
    if (originalCartItems.length === 0) return <EmptyCart />;

    /*-----------------------------------------------
          render cart items and summary
    ------------------------------------------------- */
    return (
      <Row className="g-3">
        <Col md={8}>
          <Form onSubmit={handleUpdate}>
            <CartTable
              cartItems={cartItems}
              originalCartItems={originalCartItems}
              fetchCartItems={fetchCartItems}
              handleQuantityChange={handleQuantityChange}
            />
            <div className="text-end mt-3">
              <Button
                type="submit"
                variant="none"
                className="btn_main_dark"
                disabled={!isUpdated}
              >
                Update
              </Button>
            </div>
          </Form>
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
