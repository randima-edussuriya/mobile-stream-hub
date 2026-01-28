import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import ErrorProvider from "../../components/ErrorProvider";
import Loader from "../../components/Loader";
import ProudctCard from "../../components/ProudctCard";

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

  useEffect(() => {
    fetchItems();
  }, [sortBy, searchParams]);

  return (
    <Container className="mt-5">
      <Row className="fw-semibold mb-3">
        <Col>
          <h4 className="fw-semibold">Products</h4>
        </Col>

        <Col xs="auto">
          <Form.Select
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

      {loading && <Loader />}

      {!loading && error && <ErrorProvider errorMessage={error} />}

      {!loading && !error && items.length === 0 && (
        <ErrorProvider errorMessage={"No products found."} />
      )}

      <Row className="g-3">
        {items.map((item) => (
          <Col key={item.item_id} xs={12} sm={6} md={4} lg={3}>
            <ProudctCard item={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;
