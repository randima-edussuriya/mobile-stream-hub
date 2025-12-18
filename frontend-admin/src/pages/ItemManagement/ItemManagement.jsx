import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Table,
  Spinner,
  Form,
  Image,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { hasPermission } from "../../utils/permissions";
import { confirmAction } from "../../utils/confirmAction";
import { toast } from "react-toastify";

function CategoryManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const { backendUrl, userData } = useContext(AppContext);

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch items from API
  --------------------------------------------------------------------*/
  const fetchItems = async () => {
    setLoading(true);
    setError("");
    setItems([]);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/items`);
      setItems(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Handle Item delete
  --------------------------------------------------------------------*/
  const handleDelete = async (itemId) => {
    const result = await confirmAction(
      "Are you sure you want to delete this item?"
    );
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${backendUrl}/api/admin/items/${itemId}`);
      toast.success("Item deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
    }
  };

  /* ---------------------------------------------
      Stock status handler
  ----------------------------------------------*/
  const getStockStatus = (item) => {
    if (item.stock_quantity === 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    }
    if (item.stock_quantity <= item.reorder_point) {
      return (
        <Badge bg="warning" text="dark">
          Low Stock
        </Badge>
      );
    }
    return <Badge bg="success">In Stock</Badge>;
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* -----------------------------------------------------------------
        Render items data into table
  --------------------------------------------------------------------*/
  const renderTableBody = () => {
    if (Loading) {
      return (
        <tr>
          <td colSpan={11} className="text-center py-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={11} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (items.length === 0) {
      return (
        <tr>
          <td colSpan={11} className="text-danger text-center">
            No items found
          </td>
        </tr>
      );
    }

    return items.map((item) => (
      <tr key={item.item_id}>
        <td style={{ maxWidth: "80px" }} className="text-center">
          <Image
            src={item.image}
            width={90}
            alt={item.name}
            rounded
            className="object-fit-cover"
          />
        </td>
        <td>{item.item_id}</td>
        <td style={{ maxWidth: "200px" }}>{item.name}</td>
        <td className="text-muted fw-semibold" style={{ maxWidth: "70px" }}>
          {item.brand}
        </td>
        <td style={{ maxWidth: "90px" }}>{item.category_name}</td>
        <td className="text-end fw-medium" style={{ maxWidth: "50px" }}>
          {Number(item.sell_price).toLocaleString()}
        </td>
        <td className="text-center">{item.stock_quantity}</td>
        <td className="text-center">
          {Number(item.discount) > 0 ? (
            <Badge bg="success" pill>
              {item.discount}%
            </Badge>
          ) : (
            <span className="text-muted">
              <i className="bi bi-dash-lg"></i>
            </span>
          )}
        </td>
        <td className="text-center">{getStockStatus(item)}</td>
        <td>
          <div className="d-flex gap-3 align-items-center">
            {hasPermission(userData.userRole, "item:delete") && (
              <i
                role="button"
                className="bi bi-trash text-danger action_icon"
                onClick={() => handleDelete(item.item_id)}
              ></i>
            )}
            <Link to={`profile/${item.item_id}`}>
              <i
                role="button"
                className="bi-arrow-up-right-square text-primary action_icon"
              ></i>
            </Link>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="d-flex justify-content-between mb-3">
          <h4>Items</h4>
          {hasPermission(userData.userRole, "item:add") && (
            <Button
              onClick={() => navigate("add")}
              className="btn_main_dark shadow"
            >
              <i className="bi bi-plus-circle me-2 fs-6"></i>
              Add New
            </Button>
          )}
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow" bordered>
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Image</th>
                <th>ID</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th className="text-end">Sell Price (LKR)</th>
                <th className="text-center">Stock</th>
                <th className="text-center">Discount</th>
                <th className="text-center">Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </Container>
  );
}

export default CategoryManagement;
