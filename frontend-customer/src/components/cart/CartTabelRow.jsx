import { Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  calculateDiscountedPrice,
  calculateSubtotal,
} from "../../utils/cartCalculation";
import { confirmAction } from "../../utils/confirmAction";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

function CartTabelRow({
  cartItem,
  originalCartItems,
  fetchCartItems,
  handleQuantityChange,
}) {
  const { backendUrl } = useContext(AppContext);

  /*-------------------------------------------
        handle remove cart item
  --------------------------------------------- */
  const handleRemoveCartItem = async (cartItemId) => {
    try {
      const result = await confirmAction();
      if (!result.isConfirmed) return;

      const { data } = await axios.delete(
        `${backendUrl}/api/customer/cart/${cartItemId}`
      );
      toast.success(data.message);
      fetchCartItems();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
    }
  };

  return (
    <tr>
      <td>
        <i
          className="bi bi-x-lg action_icon fs-6 text-danger"
          onClick={() => handleRemoveCartItem(cartItem.cart_item_id)}
        ></i>
      </td>
      <td>
        <Image
          src={cartItem.image}
          alt={cartItem.name}
          width={90}
          rounded
          className="object-fit-cover"
        />
      </td>
      <td>
        <Link
          to={`/products/${cartItem.item_id}`}
          className="text-decoration-none fw-medium"
        >
          <span>{cartItem.name}</span>
        </Link>
      </td>
      <td className="text-end">
        {calculateDiscountedPrice(
          Number(cartItem.sell_price),
          Number(cartItem.discount)
        ).toLocaleString()}
      </td>
      <td>
        <Form.Control
          type="number"
          min={1}
          max={
            cartItem.stock_quantity +
            originalCartItems.find(
              (item) => item.cart_item_id === cartItem.cart_item_id
            ).item_quantity
          }
          value={cartItem.item_quantity}
          onChange={(e) =>
            handleQuantityChange(cartItem.cart_item_id, e.target.value)
          }
          className="w-auto px-0 text-center mx-auto"
        />
      </td>
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
