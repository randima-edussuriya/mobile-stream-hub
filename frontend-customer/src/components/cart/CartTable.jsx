import { Table } from "react-bootstrap";
import CartTabelRow from "./CartTabelRow";

function CartTable({ cartItems }) {
  return (
    <div className="border border-body-secondary rounded overflow-hidden shadow-sm">
      <Table responsive hover size="sm" className="mb-0">
        <thead>
          <tr>
            <th colSpan={2} className="fw-medium ps-3">
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
    </div>
  );
}

export default CartTable;
