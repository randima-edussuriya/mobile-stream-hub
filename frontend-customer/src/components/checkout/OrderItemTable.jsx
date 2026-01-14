import { Table, Card } from "react-bootstrap";
import CartTabelRow from "./OrderItemTableRow";
import Loader from "../Loader";

function OrderItemTable({ cartItems, loading }) {
  const renderContent = () => {
    if (loading) return <Loader />;

    return (
      <Table responsive hover size="sm" className="mb-0">
        <thead>
          <tr>
            <th colSpan={2} className="fw-medium">
              Product
            </th>
            <th className="fw-medium text-end">Price (Rs.)</th>
            <th className="fw-medium text-center">Quantity</th>
            <th className="fw-medium text-end pe-3">Subtotal (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((cartItem) => (
            <CartTabelRow key={cartItem.cart_item_id} cartItem={cartItem} />
          ))}
        </tbody>
      </Table>
    );
  };
  return (
    <Card className="p-3 shadow-sm border-body-secondary">
      <h5 className="fw-bold mb-3">Order Items</h5>
      {renderContent()}
    </Card>
  );
}

export default OrderItemTable;
