import { Card, Button, Form, Row, Col } from "react-bootstrap";
import Loader from "../Loader";
import { useState } from "react";

function OrderSummary({
  total,
  loading,
  shippingCost,
  couponData,
  setCouponData,
  handleApplyCoupon,
  handelCancelCoupon,
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
