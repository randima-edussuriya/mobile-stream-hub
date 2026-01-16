import { Card, Button, Form, Row, Col, Container } from "react-bootstrap";
import Loader from "../Loader";

function OrderSummary({
  total,
  loading,
  shippingCost,
  couponData,
  setCouponData,
  handleApplyCoupon,
  handelCancelCoupon,
  handlePlaceOrder,
  setPaymentMethod,
}) {
  /*-------------------------------------------------
        render content
  --------------------------------------------------- */
  const renderContent = () => {
    if (loading) return <Loader />;

    return (
      <>
        {/* ----------------------------------------------
            Coupon code apply section
      -------------------------------------------------- */}
        <Form onSubmit={handleApplyCoupon}>
          <Row className="mb-3">
            <Col xs="auto" className="my-auto">
              <Form.Control
                type="text"
                value={couponData.code}
                placeholder="Enter coupon code"
                disabled={couponData.applied}
                onChange={(e) =>
                  setCouponData((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }))
                }
              />
            </Col>
            <Col className="text-end my-auto">
              {couponData.applied ? (
                <Button
                  type="button"
                  onClick={handelCancelCoupon}
                  size="sm"
                  variant="none"
                  className="btn_main_light_outline"
                >
                  Cancel Coupon
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  variant="none"
                  className="btn_main_light_outline"
                >
                  Apply
                </Button>
              )}
            </Col>
            {couponData.error && (
              <span className="text-danger fw-medium">{couponData.error}</span>
            )}
          </Row>
        </Form>
        {couponData.discountValue > 0 && (
          <Row className="mb-3">
            <Col>Coupon Discount</Col>
            <Col className="text-end">
              <span className="fw-bold text-success">
                - Rs. {couponData.discountValue}
              </span>
            </Col>
          </Row>
        )}

        {/* --------------------------------------------------------
              Shipping Cost, Total Amount
        ------------------------------------------------------------ */}
        <Row className="mb-3">
          <Col>Shipping Cost</Col>
          <Col className="text-end">
            {couponData.freeShipping ? (
              <span className="fw-medium text-success">Free Shipping</span>
            ) : (
              <span className="fw-bold">Rs. {shippingCost}</span>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>Total</Col>
          <Col className="text-end">
            <span className="fw-bold">Rs. {total.toLocaleString()}</span>
          </Col>
        </Row>

        {/* --------------------------------------------------------
              Payment Method Selection
        ------------------------------------------------------------ */}
        <h6 className="fw-bold">Payment Method</h6>
        <div className="mx-auto mb-3">
          <Form.Check
            name="paymentMethod"
            id="payment_online"
            type="radio"
            value="online"
            label="Online"
            onChange={(e) => setPaymentMethod(e.target.value)}
            inline
          />
          <Form.Check
            name="paymentMethod"
            id="payment_cod"
            type="radio"
            value="cod"
            label="Cash on Delivery (COD)"
            onChange={(e) => setPaymentMethod(e.target.value)}
            inline
          />
          <Form.Check
            name="paymentMethod"
            id="payment_pickup"
            type="radio"
            value="pickup"
            label="Pickup"
            onChange={(e) => setPaymentMethod(e.target.value)}
            inline
          />
        </div>

        <Button onClick={handlePlaceOrder} variant="dark">
          Place Order
        </Button>
      </>
    );
  };

  return (
    <Card className="p-3 shadow-sm border-body-secondary">
      <h5 className="fw-bold mb-3">Order Summary</h5>
      {renderContent()}
    </Card>
  );
}

export default OrderSummary;
