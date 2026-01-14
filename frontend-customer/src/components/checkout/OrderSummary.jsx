import { Card, Button, Form, Row, Col } from "react-bootstrap";
import Loader from "../Loader";
import { useState } from "react";

function OrderSummary({ total, loading, shippingCost, setShippingCost }) {
  const [couponCode, setCouponCode] = useState("");

  /*-------------------------------------------------
        handle apply coupon
  --------------------------------------------------- */
  const handelApplyCoupon = (e) => {
    e.preventDefault();
    console.log("Apply coupon code:", couponCode);
  };

  /*-------------------------------------------------
        render content
  --------------------------------------------------- */
  const renderContent = () => {
    if (loading) return <Loader />;

    return (
      <>
        <Form onSubmit={handelApplyCoupon}>
          <Row className="mb-3">
            <Col xs="auto" className="my-auto">
              <Form.Control
                type="text"
                placeholder="Enter coupon code"
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </Col>
            <Col className="text-end my-auto">
              <Button
                size="sm"
                type="submit"
                variant="none"
                className="btn_main_light_outline"
              >
                Apply
              </Button>
            </Col>
          </Row>
        </Form>
        {/* <span className="text-danger mb-3 text-center">Coupon code not match</span> */}

        <Row className="mb-3">
          <Col>Shipping Cost</Col>
          <Col className="text-end">
            <span className="fw-bold">Rs. {shippingCost}</span>
            {/* <span className="fw-bold text-success">Free Shipping</span> */}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>Total</Col>
          <Col className="text-end">
            <span className="fw-bold">Rs. {total.toLocaleString()}</span>
          </Col>
        </Row>

        <Button variant="dark">Place Order</Button>
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
