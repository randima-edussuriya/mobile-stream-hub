import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { hasPermission } from "../../utils/permissions";

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

    return categories.map((categoey) => (
      <tr key={categoey.category_id}>
        <td>{categoey.category_id}</td>
        <td>{categoey.category_name}</td>
        <td>{categoey.category_type}</td>
        {hasPermission(userData.userRole, "category:delete") && (
          <td>
            <Button variant="outline-danger" className="border-0 px-2 py-1">
              <i className="bi bi-trash-fill"></i>
            </Button>
          </td>
        )}
      </tr>
    ));
  };

  return (
    <>
      <Container className="bg-secondary-subtle rounded shadow_white py-3 mt-3">
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
                {hasPermission(userData.userRole, "category:delete") && (
                  <th>Action</th>
                )}
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </>
  );
}

export default CategoryManagement;
