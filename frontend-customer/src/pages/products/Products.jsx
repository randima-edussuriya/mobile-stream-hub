import { useContext, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Form,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { AppContext } from "../../context/AppContext";
import ErrorProvider from "../../components/ErrorProvider";

function Products() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("created_at_desc");

  const { backendUrl } = useContext(AppContext);

  /*---------------------------------------------
        fetch items from API
  ----------------------------------------------- */
  const fetchItems = async () => {
    try {
      setLoading(true);
      setItems([]);
      setError("");

      // Clone existing search params
      const params = new URLSearchParams(searchParams);

      // Always set sortBy explicitly
      params.set("sortBy", sortBy);

      const { data } = await axios.get(
        `${backendUrl}/api/customer/items?${params.toString()}`
      );
      setItems(data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const renderStockStatus = (stock) => {
    if (stock > 0) {
      return <span className="text-success fw-semibold">In Stock</span>;
    } else {
      return <span className="text-danger fw-semibold">Out of Stock</span>;
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchParams, sortBy]);

  return (
    <Container className="py-4">
      <h2 className="mb-3">Products</h2>

      <Row className="mb-3 justify-content-end">
        <Col xs={12} md={3}>
          <Form.Select
            name="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="sell_price_asc">Price: Low to High</option>
            <option value="sell_price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="created_at_asc">Oldest Arrivals</option>
            <option value="created_at_desc">Newest Arrivals</option>
          </Form.Select>
        </Col>
      </Row>

      {loading && (
        <Container className="text-center mt-5 py-3">
          <Spinner animation="border" role="status" variant="secondary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      )}

      {!loading && error && <ErrorProvider errorMessage={error} />}

      {!loading && !error && items.length === 0 && (
        <ErrorProvider errorMessage={"No products found."} />
      )}

      <Row className="g-3">
        {items.map((item) => (
          <Col key={item.item_id} xs={12} sm={6} md={4} lg={3}>
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
                <Card.Subtitle className="text-muted mb-2">
                  {item.brand}
                </Card.Subtitle>

                {renderStockStatus(Number(item.stock_quantity))}

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {renderPrice(
                      Number(item.sell_price),
                      Number(item.discount)
                    )}
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
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;
