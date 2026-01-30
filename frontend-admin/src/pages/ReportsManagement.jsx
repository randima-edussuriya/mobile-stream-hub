import { Form, Row, Col, Container, Button } from "react-bootstrap";
import OrderStatusChart from "../components/chart/OrderStatusChart";
import PaymentMethodChart from "../components/chart/PaymentMethodChart";
import OrderDistrictChart from "../components/chart/OrderDistrictChart";
import RevenueByOrderChart from "../components/chart/RevenueByOrderChart";
import RevenueByCategoryChart from "../components/chart/RevenueByCategoryChart";
import { useState } from "react";
import { toast } from "react-toastify";

function ReportsManagement() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applyDateRange, setApplyDateRange] = useState(false);

  const handleApplyRange = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both 'From' and 'To' dates");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const now = new Date();

    if (from > now || to > now) {
      toast.error("Future dates are not allowed");
      return;
    }
    if (from >= to) {
      toast.error("'To' date must be later than 'From' date");
      return;
    }
    setApplyDateRange(true);
  };

  /* -----------------------------------------------------------------
        Clear date range filters
  --------------------------------------------------------------------*/
  const handleClearRange = () => {
    setFromDate("");
    setToDate("");
    setApplyDateRange(false);
  };

  return (
    <Container className="mt-3">
      {/* Date Range Filter */}
      <Container className="d-flex justify-content-center">
        <Row className="g-3 align-items-end">
          <Col xs={12} md={6} lg="auto">
            <Form.Label className="mb-0 fw-medium text-light">From</Form.Label>
            <Form.Control
              type="datetime-local"
              value={fromDate}
              size="sm"
              readOnly={applyDateRange}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Col>
          <Col xs={12} md={6} lg="auto">
            <Form.Label className="mb-0 fw-medium text-light">To</Form.Label>
            <Form.Control
              type="datetime-local"
              value={toDate}
              size="sm"
              readOnly={applyDateRange}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Col>
          <Col xs={12} lg="auto">
            {applyDateRange ? (
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleClearRange}
              >
                Clear
              </Button>
            ) : (
              <Button
                variant="none"
                size="sm"
                onClick={handleApplyRange}
                className="btn_main_dark"
              >
                Apply
              </Button>
            )}
          </Col>
        </Row>
      </Container>

      {/* Charts Section */}
      <div className="row g-3 mt-3">
        <div className="col-12 col-lg-4">
          <OrderStatusChart
            formDate={fromDate}
            toDate={toDate}
            applyDateRange={applyDateRange}
          />
        </div>
        <div className="col-12 col-lg-4">
          <PaymentMethodChart
            formDate={fromDate}
            toDate={toDate}
            applyDateRange={applyDateRange}
          />
        </div>
        <div className="col-12 col-lg-4">
          <OrderDistrictChart
            formDate={fromDate}
            toDate={toDate}
            applyDateRange={applyDateRange}
          />
        </div>
        <div className="col-12">
          <RevenueByOrderChart
            formDate={fromDate}
            toDate={toDate}
            applyDateRange={applyDateRange}
          />
        </div>
        <div className="col-12">
          <RevenueByCategoryChart
            formDate={fromDate}
            toDate={toDate}
            applyDateRange={applyDateRange}
          />
        </div>
      </div>
    </Container>
  );
}

export default ReportsManagement;
