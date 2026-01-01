import { Table } from "react-bootstrap";
import CartTabelRow from "./CartTabelRow";

function CartTable({
  cartItems,
  originalCartItems,
  fetchCartItems,
  handleQuantityChange,
}) {
  return (
    <div className="border border-body-secondary rounded overflow-hidden shadow-sm">
      <Table responsive hover size="sm" className="mb-0">
        <thead>
          <tr>
            <th></th>
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
            <CartTabelRow
              key={cartItem.cart_item_id}
              cartItem={cartItem}
              originalCartItems={originalCartItems}
              fetchCartItems={fetchCartItems}
              handleQuantityChange={handleQuantityChange}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CartTable;
