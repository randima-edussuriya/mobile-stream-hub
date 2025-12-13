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
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const { backendUrl, userData } = useContext(AppContext);

  const navigate = useNavigate();

  /*---------------------------------------------------------
        fetch item user profile data
  ------------------------------------------------------------*/
  const fetchItemProfile = async () => {
    try {
      setItem({});
      setFormData({});
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/items/${itemId}`
      );
      setItem(data.data);
      //   setFormData({
      //     categoryName: data.data.category_name,
      //     categoryType: data.data.category_type,
      //   });
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
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

  const handeleChange = (e) => {
    // setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /*--------------------------------------------------
        handle save updated staff user data
  ---------------------------------------------------- */
  const handleSave = async () => {
    // try {
    //   await axios.put(
    //     `${backendUrl}/api/admin/categories/${categoryId}`,
    //     formData
    //   );
    //   toast.success("Category is updated successfully");
    //   setEditing(false);
    //   fetchItemProfile();
    // } catch (error) {
    //   toast.error(
    //     error?.response?.data?.message ||
    //       "Something went wrong. Please try again."
    //   );
    //   console.error(error);
    // }
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
        <hr className="mt-3 border-1" />

        {/* ------------------------------------------------
            item details section
      ---------------------------------------------------- */}
        <Row>
          <Col xs={12} lg={4}>
            <Image
              src={item.image}
              alt={item.name}
              rounded
              fluid
              className="object-fit-cover"
            />
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
                  <Form.Label>Brand</Form.Label>
                  <Form.Control value={item.brand} disabled={!editing} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="categoryType"
                    onChange={handeleChange}
                    value={item.category_id}
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
                  <Form.Label>Warranty Months</Form.Label>
                  <Form.Control
                    value={item.warranty_months}
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
                    value={item.stock_quantity}
                    disabled={!editing}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Reorder Point</Form.Label>
                  <Form.Control
                    value={item.reorder_point}
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
                    value={Number(item.sell_price).toLocaleString("en-LK", {
                      currency: "LKR",
                      style: "currency",
                    })}
                    disabled={!editing}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Cost Price</Form.Label>
                  <Form.Control
                    value={Number(item.cost_price).toLocaleString("en-LK", {
                      currency: "LKR",
                      style: "currency",
                    })}
                    disabled={!editing}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control value={item.discount} disabled={!editing} />
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
              name="address"
              onChange={handeleChange}
              as="textarea"
              rows={2}
              value={item.description}
              disabled={!editing}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Supplier Information</Form.Label>
            <Form.Select
              name="categoryType"
              onChange={handeleChange}
              value={item.supplier_id}
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

export default ItemProfile;
