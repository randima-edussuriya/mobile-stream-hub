import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function EmptyCart() {
  return (
    <Card className="p-3 text-center">
      <p className="mb-3">Your cart is empty</p>
      <Button as={Link} to="/products" variant="dark">
        Continue Shopping
      </Button>
    </Card>
  );
}

export default EmptyCart;
