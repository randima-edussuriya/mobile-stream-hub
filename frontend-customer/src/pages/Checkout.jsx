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
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [loadingOrderSummary, setLoadingOrderSummary] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const { backendUrl, fetchCartItemCount } = useContext(AppContext);

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

  const [loyaltyInfo, setLoyaltyInfo] = useState({});
  const [loyaltyUsage, setLoyaltyUsage] = useState({
    applied: false,
    pointsToRedeem: 0,
    discountAmount: 0,
  });

  const navigate = useNavigate();

  /*-------------------------------------------------
        fetch cart items
  --------------------------------------------------- */
  const fetchCartItems = async () => {
    try {
      setError("");
      const { data } = await axios.get(`${backendUrl}/api/customer/cart`);
      setCartItems(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
      console.error(error);
    }
  };

  /*-------------------------------------------------
        fetch loyalty program info
  --------------------------------------------------- */
  const fetchLoyaltyInfo = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/customer/loyalty`);
      setLoyaltyInfo({
        redeemPointsValue: Number(data.data.redeemPointsValue),
        maxRedemptionPercentage: Number(data.data.maxRedemptionPercentage),
        minRedeemThreshold: Number(data.data.minRedeemThreshold),
        userCurrentPoints: Number(data.data.userCurrentPoints),
      });
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
      console.error(error);
    }
  };

  const applyLoyaltyDiscount = () => {
    if (
      Object.keys(loyaltyInfo).length === 0 ||
      loyaltyInfo.userCurrentPoints === 0 ||
      loyaltyInfo.userCurrentPoints < loyaltyInfo.minRedeemThreshold
    ) {
      return setLoyaltyUsage({
        applied: false,
        pointsToRedeem: 0,
        discountAmount: 0,
      });
    }
    const cartTotal = calculateTotal(cartItems);
    const maxRedeemableAmount =
      (cartTotal * loyaltyInfo.maxRedemptionPercentage) / 100;
    const maxRedeemablePoints =
      maxRedeemableAmount / loyaltyInfo.redeemPointsValue;
    const pointsToRedeem = Math.min(
      loyaltyInfo.userCurrentPoints,
      Math.floor(maxRedeemablePoints),
    );
    const discountAmount = pointsToRedeem * loyaltyInfo.redeemPointsValue;
    setLoyaltyUsage({
      applied: true,
      pointsToRedeem,
      discountAmount,
    });
  };

  /*-------------------------------------------------
        load all data
  --------------------------------------------------- */
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchCartItems(), fetchLoyaltyInfo()]);
    } catch (error) {
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
      setLoadingOrderSummary(true);
      const { data } = await axios.get(
        `${backendUrl}/api/customer/orders/delivery-cost?district=${district}`,
      );
      setShippingCost(Number(data.data.shipping_cost));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
      console.error(error);
    } finally {
      setLoadingOrderSummary(false);
    }
  };

  /*-------------------------------------------------
        apply coupon code
  --------------------------------------------------- */
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponData.code) return;
    try {
      setLoadingOrderSummary(true);
      const { data } = await axios.post(
        `${backendUrl}/api/customer/coupons/apply`,
        {
          code: couponData.code,
        },
      );
      setCouponData((prev) => ({
        ...prev,
        applied: true,
        discountValue: Number(data.data.discountValue),
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
    } finally {
      setLoadingOrderSummary(false);
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
  const handlePlaceOrder = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/customer/orders`, {
        ...shippingData,
        couponCode: couponData.applied ? couponData.code : null,
        paymentMethod,
      });

      fetchCartItemCount(); // Update cart count in header

      // redirect to payment if required
      if (data.isPaymentRequired && data.url) {
        window.location.replace(data.url);
      } else {
        toast.success(data.message);
        navigate("/my-orders", { replace: true });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
      console.error(error);
    }
  };

  useEffect(() => {
    loadAllData();
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

  useEffect(() => {
    applyLoyaltyDiscount();
  }, [cartItems]);

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
              shippingCost -
              couponData.discountValue -
              loyaltyUsage.discountAmount
            }
            loading={loading}
            loadingOrderSummary={loadingOrderSummary}
            shippingCost={shippingCost}
            setShippingCost={setShippingCost}
            couponData={couponData}
            setCouponData={setCouponData}
            handleApplyCoupon={handleApplyCoupon}
            handelCancelCoupon={handelCancelCoupon}
            handlePlaceOrder={handlePlaceOrder}
            setPaymentMethod={setPaymentMethod}
            loyaltyUsage={loyaltyUsage}
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
