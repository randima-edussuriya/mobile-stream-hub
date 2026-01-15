import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import ErrorProvider from "../components/ErrorProvider";
import { calculateTotal } from "../utils/cartCalculation";
import OrderSummary from "../components/checkout/OrderSummary";
import OrderItemTable from "../components/checkout/OrderItemTable";
import ShippingDetails from "../components/checkout/ShippingDetails";
import { toast } from "react-toastify";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const { backendUrl } = useContext(AppContext);

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

  const [couponData, setCouponData] = useState({
    applied: false,
    code: "",
    discountValue: 0,
    freeShipping: false,
    error: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");

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

  /*-------------------------------------------------
        apply coupon code
  --------------------------------------------------- */
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponData.code) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/customer/coupons/apply`,
        {
          code: couponData.code,
        }
      );
      setCouponData((prev) => ({
        ...prev,
        applied: true,
        discountValue: data.data.discountValue,
        freeShipping: data.data.freeShipping,
        error: "",
      }));
    } catch (error) {
      setCouponData((prev) => ({
        ...prev,
        discountValue: 0,
        freeShipping: false,
        error:
          error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      }));
      console.error(error);
    }
  };

  /*-------------------------------------------------
        cancel coupon code
  --------------------------------------------------- */
  const handelCancelCoupon = () => {
    setCouponData((prev) => ({
      ...prev,
      applied: false,
      code: "",
      discountValue: 0,
      freeShipping: false,
      error: "",
    }));
  };

  /*-------------------------------------------------
        handle place order
  --------------------------------------------------- */
  const handlePlaceOrder = () => {
    try {
      const { data } = axios.post(`${backendUrl}/api/customer/orders`, {
        ...shippingData,
        couponCode: couponData.applied ? couponData.code : null,
        paymentMethod,
      });
      toast.success(data.message);
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
    if (!shippingData.district || couponData.freeShipping)
      return setShippingCost(0);
    getShippingCost(shippingData.district);
  }, [shippingData.district, couponData.freeShipping]);

  useEffect(() => {
    // reset shipping cost if free shipping applied
    if (couponData.freeShipping) {
      setShippingCost(0);
    }
  }, [couponData.freeShipping]);

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
            total={
              calculateTotal(cartItems) +
              Number(shippingCost) -
              Number(couponData.discountValue)
            }
            loading={loading}
            shippingCost={shippingCost}
            setShippingCost={setShippingCost}
            couponData={couponData}
            setCouponData={setCouponData}
            handleApplyCoupon={handleApplyCoupon}
            handelCancelCoupon={handelCancelCoupon}
            handlePlaceOrder={handlePlaceOrder}
            setPaymentMethod={setPaymentMethod}
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
