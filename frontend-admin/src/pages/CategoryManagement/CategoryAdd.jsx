import { useContext, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

function CategoryAdd() {
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryType: "",
  });

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Handle form input changes 
  --------------------------------------------------------------------*/
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* -----------------------------------------------------------------
        Handle form reset
  --------------------------------------------------------------------*/
  const handleReset = () => {
    setFormData({
      categoryName: "",
      categoryType: "",
    });
  };

  /* -----------------------------------------------------------------
         Handle form submit
   --------------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // add category API call
      await axios.post(`${backendUrl}/api/admin/categories`, formData);
      toast.success("Category added successfully");
      navigate("/category-management");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center  mt-3 mb-5 py-0 rounded"
    >
      <Container className="col-10 col-sm-6 p-3 rounded bg-secondary-subtle shadow">
        <h3 className="text-center mb-3">Category Add</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupFirstName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              name="categoryName"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Catgory Type</Form.Label>
            <Form.Select name="categoryType" onChange={handleChange}>
              <option value="">Select Category Type</option>
              <option value="phone">phone</option>
              <option value="accessory">accessory</option>
              <option value="repair part">repair part</option>
            </Form.Select>
          </Form.Group>

          <div className="mb-3">
            <Button className="btn_main_dark me-3 shadow" type="submit">
              Add Category
            </Button>
            <Button
              variant="outline-danger"
              className="btn_style me-3 border-2 shadow"
              type="reset"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </Form>
      </Container>
    </Container>
  );
}

export default CategoryAdd;
