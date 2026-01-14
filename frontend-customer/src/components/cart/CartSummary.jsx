import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CartSummary({ total }) {
  const navigate = useNavigate();

  return (
    <Card className="p-3 shadow-sm border-body-secondary">
      <h5 className="fw-bold mb-3">Cart Summary</h5>

      <div className="d-flex justify-content-between mb-2">
        <span>Total</span>
        <span className="fw-bold">Rs. {total.toLocaleString()}</span>
      </div>
      <Button variant="dark" onClick={() => navigate("/checkout")}>
        Checkout
      </Button>
    </Card>
  );
}

export default CartSummary;
