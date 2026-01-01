import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProudctCard({ item }) {
  /*---------------------------------------------
        render price with discount
  ----------------------------------------------- */
  const renderPrice = (sellPrice, discount) => {
    if (discount > 0) {
      const discountedPrice = sellPrice - (sellPrice * discount) / 100;
      return (
        <>
          <span className="text-muted text-decoration-line-through me-2">
            Rs. {sellPrice.toLocaleString()}
          </span>
          <span className="fw-bold text-danger">
            Rs. {discountedPrice.toLocaleString()}
          </span>
        </>
      );
    } else {
      return <span className="fw-bold">Rs. {sellPrice.toLocaleString()}</span>;
    }
  };

  /*---------------------------------------------
          render stock status
    ----------------------------------------------- */
  const renderStockStatus = (stock) => {
    if (stock > 0) {
      return <span className="text-success fw-semibold">In Stock</span>;
    } else {
      return <span className="text-danger fw-semibold">Out of Stock</span>;
    }
  };

  return (
    <Card className="shadow">
      {item.discount > 0 && (
        <Badge
          bg="success"
          className="position-absolute m-2"
          style={{ zIndex: 1 }}
        >
          -{Number(item.discount).toLocaleString()}%
        </Badge>
      )}
      <div className="ratio ratio-4x3">
        <Card.Img
          src={item.image}
          alt={item.name}
          className="object-fit-contain"
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6 mb-1">{item.name}</Card.Title>
        <Card.Subtitle className="text-muted mb-2">{item.brand}</Card.Subtitle>

        {renderStockStatus(Number(item.stock_quantity))}

        <div className="d-flex justify-content-between align-items-center">
          <div>
            {renderPrice(Number(item.sell_price), Number(item.discount))}
          </div>
          <Button
            as={Link}
            to={`/products/${item.item_id}`}
            size="sm"
            variant="none"
            className="btn_main_light_outline"
          >
            View
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProudctCard;
