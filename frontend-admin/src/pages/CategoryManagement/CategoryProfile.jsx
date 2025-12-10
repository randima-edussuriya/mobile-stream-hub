import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import ErrorProvider from "../ErrorProvider";
import { hasPermission } from "../../utils/permissions";
import { toast } from "react-toastify";

function CategoryProfile() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { categoryId } = useParams();
  const [editing, setEditing] = useState(false);
  const [category, setCategory] = useState({});
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryType: "",
  });

  const { backendUrl, userData } = useContext(AppContext);

  const navigate = useNavigate();

  /*---------------------------------------------------------
        fetch category user profile data
  ------------------------------------------------------------*/
  const fetchCategoryProfile = async () => {
    try {
      setLoading(true);
      setCategory({});
      setFormData({
        categoryName: "",
        categoryType: "",
      });
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/categories/${categoryId}`
      );
      setCategory(data.data);
      setFormData({
        categoryName: data.data.category_name,
        categoryType: data.data.category_type,
      });
    } catch (error) {
      console.log(categoryId);
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handeleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /*--------------------------------------------------
        handle save updated staff user data
  ---------------------------------------------------- */
  const handleSave = async () => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/categories/${categoryId}`,
        formData
      );
      toast.success("Category is updated successfully");
      setEditing(false);
      fetchCategoryProfile();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  /*-----------------------------------
        load all data
  ------------------------------------- */

  useEffect(() => {
    fetchCategoryProfile();
  }, []);

  /*----------------------------------------------------------------
        Render loading state
  ------------------------------------------------------------------*/
  if (Loading) {
    return (
      <Container className="text-center mt-3">
        <Spinner animation="border" role="status" variant="light">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  /*---------------------------------------------------
        Render error state
  ----------------------------------------------------- */
  if (error) {
    return <ErrorProvider errorMessage={error} />;
  }

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow p-3 mt-3">
        <Row>
          <Col>
            <h4>{category.category_name}</h4>
          </Col>
          <Col xs="auto">
            <Button
              className="me-2 border-2 shadow"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            {hasPermission(userData.userRole, "category:edit") && (
              <Button
                variant="none"
                className="btn_main_light_outline shadow"
                onClick={() => setEditing((prev) => !prev)}
              >
                {editing ? "Cancel" : "Edit"}
              </Button>
            )}
          </Col>
        </Row>
        <hr className="mt-3 border-1" />

        {/* ------------------------------------------------
            Category details section
      ---------------------------------------------------- */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Category ID</Form.Label>
              <Form.Control value={category.category_id} disabled />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category name</Form.Label>
              <Form.Control
                name="categoryName"
                onChange={handeleChange}
                value={formData.categoryName}
                disabled={!editing}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Catgory Type</Form.Label>
              <Form.Select
                name="categoryType"
                onChange={handeleChange}
                value={formData.categoryType}
                disabled={!editing}
              >
                <option value="phone">phone</option>
                <option value="accessory">accessory</option>
                <option value="repair part">repair part</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {editing && (
          <div className="mt-3 text-center">
            <Button
              variant="none"
              onClick={handleSave}
              className="me-2 btn_main_dark shadow px-5"
            >
              Update
            </Button>
          </div>
        )}
      </Container>
    </Container>
  );
}

export default CategoryProfile;
