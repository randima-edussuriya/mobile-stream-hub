import React from "react";
import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function CategoryAdd() {
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryType: "",
  });

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
      const res = await axios.post(
        "http://localhost:5000/api/category",
        formData
      );
      if (res.data.success) {
        toast.success(res.data.message, { position: "top-center" });
        navigate("/category-management");
      } else {
        toast.error(res.data.message, { position: "top-center" });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
      });
    }
  };
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center  mt-3 mb-5 py-0 rounded"
    >
      <Container className="col-10 col-sm-6 p-3  rounded bg-secondary-subtle shadow_white">
        <h3 className="text-center mb-3">Add Category</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              name="categoryName"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupCategoryType">
            <Form.Label>Category Type</Form.Label>
            <Form.Select
              value={formData.categoryType}
              name="categoryType"
              onChange={handleChange}
            >
              <option value="">Select category type</option>
              <option value="accessory">Accessory</option>
              <option value="phone">Phone</option>
              <option value="repair part">Repair part</option>
            </Form.Select>
          </Form.Group>

          <div className="mb-3">
            <Button className="btn_main_dark me-3 shadow" type="submit">
              Add
            </Button>
            <Button
              variant="outline-danger"
              className="btn_style me-3 border-2 shadow"
              onClick={handleReset}
              type="reset"
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
