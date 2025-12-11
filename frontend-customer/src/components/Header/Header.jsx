import logo from "../../assets/icons/logo.png";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Dropdown,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useContext, useEffect } from "react";
import SearchBar from "./SearchBar";
import { useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

function Header() {
  const [categories, setCategories] = useState([]);

  const { backendUrl, isLoggedIn, setIsLoggedIn, setUserData } =
    useContext(AppContext);
  const navigate = useNavigate();

  // filter categories for phones
  const categoriesPhone = categories.filter(
    (category) => category.category_type === "phone"
  );

  // filter categories for accessories
  const categoriesAccessories = categories.filter(
    (category) => category.category_type === "accessory"
  );

  const handelLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/customer/auth/logout`);
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, Please try again later"
      );
      console.error(error);
    }
  };

  /* ------------------------------------------------------------
        Fetch categories from API
  --------------------------------------------------------------- */
  const fetchCategories = async () => {
    try {
      setCategories([]);
      const { data } = await axios.get(`${backendUrl}/api/customer/categories`);
      setCategories(data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar expand="lg" className="bg_light sticky-top">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="fs-6" />
          {/* -------------------------------------------------------------------
                logo section
          ----------------------------------------------------------------------- */}
          <Navbar.Brand>
            <Link to={"/"}>
              <img
                src={logo}
                height="50"
                className="object-fit-contain px-3"
                alt="logo"
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            {/* -------------------------------------------------------------------
                  Navbar left items section
            ----------------------------------------------------------------------- */}
            <Nav className="me-auto">
              <NavDropdown
                className="navbar_link"
                title="Phones"
                id="basic-nav-dropdown"
              >
                {/* ------------------------------------------------
                      render categoris-phone into dropdown
                ---------------------------------------------------- */}
                {categoriesPhone.length === 0 ? (
                  <NavDropdown.Item>Not Available</NavDropdown.Item>
                ) : (
                  categoriesPhone.map((row) => (
                    <NavDropdown.Item
                      as={Link}
                      to={`/products/?categoryName=${row.category_name}`}
                      key={row.category_id}
                      className="overflow-y-auto"
                    >
                      {row.category_name}
                    </NavDropdown.Item>
                  ))
                )}
              </NavDropdown>
              <NavDropdown
                className="navbar_link"
                title="Accessories"
                id="basic-nav-dropdown"
              >
                {/* ------------------------------------------------
                      render categoris-phone into dropdown
                ---------------------------------------------------- */}
                {categoriesAccessories.length === 0 ? (
                  <NavDropdown.Item>Not Available</NavDropdown.Item>
                ) : (
                  categoriesAccessories.map((row) => (
                    <NavDropdown.Item
                      as={Link}
                      to={`/products/?categoryName=${row.category_name}`}
                      key={row.category_id}
                    >
                      {row.category_name}
                    </NavDropdown.Item>
                  ))
                )}
              </NavDropdown>

              <Nav.Link as={Link} to={"/products"} className="navbar_link">
                Products
              </Nav.Link>
              <Nav.Link as={Link} to={"/coming_soon"} className="navbar_link">
                Repairs
              </Nav.Link>
              <Nav.Link as={Link} to={"/coming_soon"} className="navbar_link">
                About Us
              </Nav.Link>
              <Nav.Link as={Link} to={"/coming_soon"} className="navbar_link">
                Contact Us
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>

          {/* -------------------------------------------------------------------
                Navbar right items section
          ----------------------------------------------------------------------- */}
          <div className="ms-auto d-flex align-items-center gap-3">
            <Link to={"/cart"} className="text-reset position-relative me-3">
              <i className="bi bi-cart3 navbar_icon"></i>
              {isLoggedIn && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute translate-middle top-0 start-100"
                >
                  6
                </Badge>
              )}
            </Link>

            {isLoggedIn ? (
              <Dropdown className="me-auto">
                <Dropdown.Toggle
                  variant="none"
                  id="dropdown-basic"
                  className="border-0 hidden-arrow"
                >
                  <i className="bi bi-person-circle navbar_icon"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    My Profle
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handelLogout}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Link to={"/signup"} className="btn btn_main_dark">
                  Sign Up
                </Link>
                <Link to={"/login"} className="btn btn_main_light_outline">
                  Log In
                </Link>
              </>
            )}
          </div>
        </Container>
      </Navbar>
      {/* -------------------------------------------------------------------
            Search bar section
      ----------------------------------------------------------------------- */}
      <SearchBar />
    </>
  );
}

export default Header;
