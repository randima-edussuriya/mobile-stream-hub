import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  calculateDiscountedPrice,
  calculateSubtotal,
} from "../../utils/cartCalculation";

function CartTabelRow({ cartItem }) {
  return (
    <tr>
      <td>
        <div>
          <Image
            src={cartItem.image}
            alt={cartItem.name}
            width={90}
            rounded
            className="object-fit-cover me-2"
          />
          <Link
            to={`/products/${cartItem.item_id}`}
            className="text-decoration-none fw-medium"
          >
            <span>{cartItem.name}</span>
          </Link>
        </div>
      </td>
      <td className="text-end">
        {calculateDiscountedPrice(
          Number(cartItem.sell_price),
          Number(cartItem.discount)
        ).toLocaleString()}
      </td>
      <td className="text-center">{Number(cartItem.item_quantity)}</td>
      <td className="text-end pe-3">
        {calculateSubtotal(
          Number(cartItem.sell_price),
          Number(cartItem.discount),
          Number(cartItem.item_quantity)
        ).toLocaleString()}
      </td>
    </tr>
  );
}

export default CartTabelRow;
