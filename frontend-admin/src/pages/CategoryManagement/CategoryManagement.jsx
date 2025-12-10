import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { hasPermission } from "../../utils/permissions";
import { confirmAction } from "../../utils/confirmAction";
import { toast } from "react-toastify";

function CategoryManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  const { backendUrl, userData } = useContext(AppContext);

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch categories from API
  --------------------------------------------------------------------*/
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    setCategories([]);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/categories`);
      // filter out logged in user from the list
      setCategories(data.data);
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
        Handle category delete
  --------------------------------------------------------------------*/
  const handleDelete = async (categoryId) => {
    const result = await confirmAction(
      "Are you sure you want to delete this category?"
    );
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${backendUrl}/api/admin/categories/${categoryId}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* -----------------------------------------------------------------
        Render categories data into table
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

    if (categories.length === 0) {
      return (
        <tr>
          <td colSpan={11} className="text-danger text-center">
            No categories found
          </td>
        </tr>
      );
    }

    return categories.map((category) => (
      <tr key={category.category_id}>
        <td>{category.category_id}</td>
        <td>{category.category_name}</td>
        <td>{category.category_type}</td>
        <td>
          <div className="d-flex gap-3 align-items-center">
            {hasPermission(userData.userRole, "category:delete") && (
              <i
                role="button"
                className="bi bi-trash text-danger action_icon"
                onClick={() => handleDelete(category.category_id)}
              ></i>
            )}
            <i
              role="button"
              className="bi-arrow-up-right-square text-primary action_icon"
              onClick={() => navigate(`profile/${category.category_id}`)}
            ></i>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="d-flex justify-content-between mb-3">
          <h4>Categories</h4>
          {hasPermission(userData.userRole, "category:add") && (
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
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Category ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Action</th>
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
