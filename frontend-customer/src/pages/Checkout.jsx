import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import ErrorProvider from "../components/ErrorProvider";
import { calculateTotal } from "../utils/cartCalculation";
import OrderSummary from "../components/checkout/OrderSummary";
import OrderItemTable from "../components/checkout/OrderItemTable";
import ShippingDetails from "../components/checkout/ShippingDetails";

const Checkout = () => {
  const [shippingData, setShippingData] = useState({
    contactName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    province: "",
    district: "",
    zipCode: "",
  });
  const [shippingCost, setShippingCost] = useState(0);

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

  /*-------------------------------------------------
        get shipping cost based on district
  --------------------------------------------------- */
  const getShippingCost = async (district) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/orders/delivery-cost?district=${district}`
      );
      setShippingCost(data.data.shipping_cost);
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

  useEffect(() => {
    if (!shippingData.district) return setShippingCost(0);
    getShippingCost(shippingData.district);
  }, [shippingData.district]);

  /*-------------------------------------------------
         render content
    --------------------------------------------------- */
  const renderContent = () => {
    // handle error
    if (error) return <ErrorProvider errorMessage={error} />;

    /*-----------------------------------------------
          render order items and summary
    ------------------------------------------------- */
    return (
      <Row className="g-3">
        <Col md={7}>
          <ShippingDetails setShippingData={setShippingData} />
          <OrderItemTable cartItems={cartItems} loading={loading} />
        </Col>

        <Col md={5}>
          <OrderSummary
            total={calculateTotal(cartItems) + Number(shippingCost)}
            loading={loading}
            shippingCost={shippingCost}
            setShippingCost={setShippingCost}
          />
        </Col>
      </Row>
    );
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h3 className="fw-semibold">Checkout</h3>
        </Col>
      </Row>

      {renderContent()}
    </Container>
  );
};

export default Checkout;
