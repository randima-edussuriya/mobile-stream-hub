export const calculateDiscountedPrice = (sellPrice, discount) => {
  return discount > 0 ? sellPrice - (sellPrice * discount) / 100 : sellPrice;
};

export const calculateSubtotal = (sellPrice, discount, quantity) => {
  return calculateDiscountedPrice(sellPrice, discount) * quantity;
};

export const calculateTotal = (cartItems) => {
  return cartItems.reduce((total, cartItem) => {
    return (
      total +
      calculateSubtotal(
        Number(cartItem.sell_price),
        Number(cartItem.discount),
        Number(cartItem.item_quantity),
      )
    );
  }, 0);
};
