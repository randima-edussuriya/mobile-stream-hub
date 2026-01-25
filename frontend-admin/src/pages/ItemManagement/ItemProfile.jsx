import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Image,
  Badge,
} from "react-bootstrap";
import ErrorProvider from "../ErrorProvider";
import { hasPermission } from "../../utils/permissions";
import { toast } from "react-toastify";
import dayjs from "dayjs";

function ItemProfile() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { itemId } = useParams();
  const [editing, setEditing] = useState(false);
  const [item, setItem] = useState({});
  const [itemFormData, setItemFormData] = useState({});
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const { backendUrl, userData } = useContext(AppContext);

  const navigate = useNavigate();

  /*---------------------------------------------------------
        fetch item profile data
  ------------------------------------------------------------*/
  const fetchItemProfile = async () => {
    try {
      setItem({});
      setItemFormData({});
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/items/${itemId}`,
      );
      setItem(data.data);
      setItemFormData({
        name: data.data.name,
        brand: data.data.brand,
        description: data.data.description,
        sellPrice: data.data.sell_price,
        costPrice: data.data.cost_price,
        stockQuantity: data.data.stock_quantity,
        discountPercentage: data.data.discount,
        warrantyMonths: data.data.warranty_months,
        reorderPoint: data.data.reorder_point,
        supplierId: data.data.supplier_id,
        categoryId: data.data.category_id,
      });
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      console.error(error);
    }
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
          "Something went wrong. Please try again later.",
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
          "Something went wrong. Please try again later.",
      );
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setItemFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /*--------------------------------------------------
        handle save updated item data
  ---------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("itemData", JSON.stringify(itemFormData));
      const { data } = await axios.put(
        `${backendUrl}/api/admin/items/${itemId}`,
        formData,
      );
      toast.success(data.message || "Item updated successfully.");
      setEditing(false);
      loadData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
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

  /*-----------------------------------
        load all data
  ------------------------------------- */
  const loadData = async () => {
    setLoading(true);

    try {
      await Promise.all([
        fetchItemProfile(),
        fetchCategories(),
        fetchSuppliers(),
      ]);
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
    <Container>
      <Container className="bg-secondary-subtle rounded shadow p-3 mt-3">
        <Row>
          <Col className="d-flex gap-2 align-items-center">
            <h4>{item.name}</h4>
            <h4>{getStockStatus(item)}</h4>
          </Col>
          <Col xs="auto">
            {(item.stock_quantity === 0 ||
              item.stock_quantity <= item.reorder_point) && (
              <Button
                className="me-2 shadow"
                variant="warning"
                onClick={() =>
                  navigate(`/item-management/reorder/${item.item_id}`)
                }
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Reorder
              </Button>
            )}
            <Button
              className="me-2 border-2 shadow"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            {hasPermission(userData.userRole, "item:edit") && (
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

        {/* ------------------------------------------------
            item details section
            ---------------------------------------------------- */}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={12} lg={4}>
              {/* -------------------------------------
                  item image
            ----------------------------------------- */}
              <Form.Group className="mb-2">
                <Form.Label
                  htmlFor="image-upload"
                  className="position-relative"
                >
                  <Image
                    src={image ? URL.createObjectURL(image) : item.image}
                    alt={itemFormData.name}
                    rounded
                    fluid
                    className="object-fit-cover"
                  />
                  {editing && (
                    <Badge
                      role="button"
                      bg="dark"
                      pill
                      className="position-absolute end-0 p-2 m-1"
                    >
                      <i className="bi bi-pencil-square fs-4 "></i>
                    </Badge>
                  )}
                </Form.Label>
                <Form.Control
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                  disabled={!editing}
                  className="d-none"
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={8}>
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Item ID</Form.Label>
                    <Form.Control value={item.item_id} disabled />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      type="text"
                      value={itemFormData.name}
                      placeholder="Enter item name"
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="categoryId"
                      value={itemFormData.categoryId}
                      onChange={handleChange}
                      disabled={!editing}
                    >
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
                  <Form.Group className="mb-2">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      name="brand"
                      type="text"
                      value={itemFormData.brand}
                      placeholder="Enter brand name"
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Stock Quantity</Form.Label>
                    <Form.Control
                      name="stockQuantity"
                      type="number"
                      value={itemFormData.stockQuantity}
                      placeholder="Enter stock quantity"
                      min="0"
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Reorder Point</Form.Label>
                    <Form.Control
                      name="reorderPoint"
                      type="number"
                      value={itemFormData.reorderPoint}
                      placeholder="Enter reorder point"
                      min="0"
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Warranty Months</Form.Label>
                    <Form.Control
                      name="warrantyMonths"
                      type="number"
                      value={itemFormData.warrantyMonths}
                      placeholder="Enter warranty months"
                      min="0"
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Sell Price</Form.Label>
                    <Form.Control
                      name="sellPrice"
                      type="number"
                      value={itemFormData.sellPrice}
                      placeholder="Enter sell price"
                      min="0"
                      step="0.01"
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Cost Price</Form.Label>
                    <Form.Control
                      name="costPrice"
                      type="number"
                      value={itemFormData.costPrice}
                      placeholder="Enter cost price"
                      min="0"
                      step="0.01"
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Discount (%)</Form.Label>
                    <Form.Control
                      name="discountPercentage"
                      type="number"
                      value={itemFormData.discountPercentage}
                      placeholder="Enter discount percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="text-muted mt-2">
                <Col xs="auto">
                  <p>
                    Created:{" "}
                    {dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </Col>
                <Col>
                  <p>
                    Updated:{" "}
                    {dayjs(item.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="mt-2">
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                as="textarea"
                rows={2}
                value={itemFormData.description}
                onChange={handleChange}
                disabled={!editing}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Supplier Information</Form.Label>
              <Form.Select
                name="supplierId"
                value={itemFormData.supplierId}
                onChange={handleChange}
                disabled={!editing}
              >
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
          </div>
          {editing && (
            <div className="mt-3 text-center">
              <Button
                variant="none"
                type="submit"
                className="me-2 btn_main_dark shadow px-5"
              >
                Update
              </Button>
            </div>
          )}
        </Form>
      </Container>
    </Container>
  );
}

export default ItemProfile;
