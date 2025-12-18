import { useContext, useState } from "react";
import {
  Container,
  Form,
  Button,
  Image,
  Col,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import uploadImage from "../../assets/images/upload_image.svg";
import ErrorProvider from "../ErrorProvider";

function ItemAdd() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [itemFormData, setItemFormData] = useState({
    name: "",
    brand: "",
    description: "",
    sellPrice: "",
    costPrice: "",
    stockQuantity: "",
    discountPercentage: 0,
    warrantyMonths: 0,
    reorderPoint: "",
    supplierId: "",
    categoryId: "",
  });
  const [image, setImage] = useState(null);

  //   const [imagePreview, setImagePreview] = useState(null);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Handle form input changes 
  --------------------------------------------------------------------*/
  const handleChange = (e) => {
    setItemFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* -----------------------------------------------------------------
        Handle form reset
  --------------------------------------------------------------------*/
  const handleReset = () => {
    setItemFormData({
      name: "",
      brand: "",
      description: "",
      sellPrice: "",
      costPrice: "",
      stockQuantity: "",
      discountPercentage: 0,
      warrantyMonths: 0,
      reorderPoint: "",
      supplierId: "",
      categoryId: "",
    });
    setImage(null);
  };

  /* -----------------------------------------------------------------
        Fetch categories from API
  --------------------------------------------------------------------*/
  const fetchCategories = async () => {
    setError("");
    setCategories([]);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/categories`);
      setCategories(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
    }
  };

  /* -----------------------------------------------------------------
        Fetch suppliers from API
  --------------------------------------------------------------------*/
  const fetchSuppliers = async () => {
    setError("");
    setCategories([]);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/suppliers`);
      setSuppliers(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
    }
  };

  /* -----------------------------------------------------------------
         Handle form submit
   --------------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("itemData", JSON.stringify(itemFormData));
      // Add item API call
      await axios.post(`${backendUrl}/api/admin/items`, formData);
      toast.success("Item added successfully");
      navigate("/item-management");
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
  const loadData = async () => {
    setLoading(true);

    try {
      await Promise.all([fetchCategories(), fetchSuppliers()]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
    <Container
      fluid
      className="d-flex justify-content-center align-items-center mt-3 mb-5 py-0 rounded"
    >
      <Container className="col-10 col-sm-10 p-4 rounded bg-secondary-subtle shadow">
        <h3 className="text-center mb-4">Add Item</h3>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={12} md={7}>
              {/* Image Upload */}
              <Form.Group className="mb-2">
                <Form.Label>Item Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Form.Group>
              {/* Item Name */}
              <Form.Group className="mb-2">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  value={itemFormData.name}
                  placeholder="Enter item name"
                  onChange={handleChange}
                />
              </Form.Group>
              {/* Brand */}
              <Form.Group className="mb-2">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  name="brand"
                  type="text"
                  value={itemFormData.brand}
                  placeholder="Enter brand name"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={5} className="text-center">
              <div>
                <Image
                  src={image ? URL.createObjectURL(image) : uploadImage}
                  alt="Item Preview"
                  rounded
                  className="object-fit-contain mb-2 bg-primary-subtle"
                  width={250}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              {/* Category */}
              <Form.Group className="mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={itemFormData.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {
                    /* ---------------------------------------------------------
                      Render categories to UI
                    --------------------------------------------------------------*/
                    categories.length === 0 ? (
                      <option value="" className="text-danger">
                        Not available Categories
                      </option>
                    ) : (
                      categories.map((category) => (
                        <option
                          value={category.category_id}
                          key={category.category_id}
                        >
                          {`${category.category_name} - (${category.category_type})`}
                        </option>
                      ))
                    )
                  }
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              {/* Warranty Months */}
              <Form.Group className="mb-2" controlId="formGroupWarranty">
                <Form.Label>Warranty Months</Form.Label>
                <Form.Control
                  name="warrantyMonths"
                  type="number"
                  value={itemFormData.warrantyMonths}
                  placeholder="Enter warranty months"
                  min="0"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Form.Group className="mb-2" controlId="formGroupDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={3}
              value={itemFormData.description}
              placeholder="Enter item description"
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col>
              {/* Sell Price */}
              <Form.Group className="mb-2" controlId="formGroupSellPrice">
                <Form.Label>Sell Price (Rs.)</Form.Label>
                <Form.Control
                  name="sellPrice"
                  type="number"
                  value={itemFormData.sellPrice}
                  placeholder="Enter sell price"
                  min="0"
                  step="0.01"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              {/* Cost Price */}
              <Form.Group className="mb-2" controlId="formGroupCostPrice">
                <Form.Label>Cost Price (Rs.)</Form.Label>
                <Form.Control
                  name="costPrice"
                  type="number"
                  value={itemFormData.costPrice}
                  placeholder="Enter cost price"
                  min="0"
                  step="0.01"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              {/* Discount Percentage */}
              <Form.Group className="mb-2" controlId="formGroupDiscount">
                <Form.Label>Discount Percentage (%)</Form.Label>
                <Form.Control
                  name="discountPercentage"
                  type="number"
                  value={itemFormData.discountPercentage}
                  placeholder="Enter discount percentage"
                  min="0"
                  max="100"
                  step="0.01"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              {/* Stock Quantity */}
              <Form.Group className="mb-2" controlId="formGroupStockQuantity">
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                  name="stockQuantity"
                  type="number"
                  value={itemFormData.stockQuantity}
                  placeholder="Enter stock quantity"
                  min="0"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              {/* Reorder Point */}
              <Form.Group className="mb-2" controlId="formGroupReorderPoint">
                <Form.Label>Reorder Point</Form.Label>
                <Form.Control
                  name="reorderPoint"
                  type="number"
                  value={itemFormData.reorderPoint}
                  placeholder="Enter reorder point"
                  min="0"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Supplier */}
          <Form.Group className="mb-2">
            <Form.Label>Supplier Information</Form.Label>
            <Form.Select
              name="supplierId"
              value={itemFormData.supplierId}
              onChange={handleChange}
            >
              <option value="">Select Supplier</option>

              {
                /* ---------------------------------------------------------
                      Render Suppliers to UI
                    --------------------------------------------------------------*/
                suppliers.length === 0 ? (
                  <option value="" className="text-danger">
                    Not available Suppliers
                  </option>
                ) : (
                  suppliers.map((supplier) => (
                    <option
                      value={supplier.supplier_id}
                      key={supplier.supplier_id}
                    >
                      {`${supplier.name} - (${supplier.email}) - ${supplier.address} - (${supplier.phone_number})`}
                    </option>
                  ))
                )
              }
            </Form.Select>
          </Form.Group>

          {/* Buttons */}
          <div className="my-3">
            <Button className="btn_main_dark me-3 shadow" type="submit">
              Add Item
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

export default ItemAdd;
