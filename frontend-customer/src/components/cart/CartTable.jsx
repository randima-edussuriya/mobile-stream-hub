import { Table } from "react-bootstrap";
import CartTabelRow from "./CartTabelRow";

function CartTable({ cartItems, calculateDiscountedPrice, calculateSubtotal }) {
  return (
    <div className="border border-body-secondary rounded overflow-hidden shadow-sm">
      <Table hover size="sm" className="mb-0">
        <thead>
          <tr>
            <th className="ps-3">Product</th>
            <th className="text-end">Price (Rs.)</th>
            <th className="text-center">Quantity</th>
            <th className="text-end pe-3">Subtotal (Rs.)</th>
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
