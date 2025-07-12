import React from 'react'
import logo from '../../assets/icons/logo.png'
import { Container, Nav, Navbar, NavDropdown, Dropdown, Badge } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import './Header.css'
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import SearchBar from './SearchBar';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function Header() {
  const { currentUser, logout } = useContext(AuthContext);
  const [categoriesPhone, setCategoriesPhone] = useState([]);

  /* ------------------------------------------------------------
        Fetch categories-phone from API
  --------------------------------------------------------------- */
  useEffect(() => {
    const getCategoriesPhone = async () => {
      setCategoriesPhone([])
      try {
        const res = await axios.get('http://localhost:5000/api/category/phone');
        if (res.data.success) {
          setCategoriesPhone(res.data.data);
        } else {
          console.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getCategoriesPhone();
  }, [])

  return (
    <>
      <Navbar expand="lg" className="bg_light sticky-top">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='fs-6' />
          {/* -------------------------------------------------------------------
                logo section
          ----------------------------------------------------------------------- */}
          <Navbar.Brand >
            <Link to={'/'}>
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
              <NavDropdown className='navbar_link' title="Phones" id="basic-nav-dropdown">
                {/* ------------------------------------------------
                      render categoris-phone into dropdown
                ---------------------------------------------------- */}
                {categoriesPhone.length === 0 ? (
                  <NavDropdown.Item>Not Available</NavDropdown.Item>
                ) : (
                  categoriesPhone.map(row => (
                    <NavDropdown.Item as={Link} to={`/products/?category=${row.category_name}`} key={row.category_id} >
                      {row.category_name}
                    </NavDropdown.Item>
                  ))
                )}
              </NavDropdown>
              <NavDropdown className='navbar_link' title="Accessories" id="basic-nav-dropdown">
                <NavDropdown.Item>Action</NavDropdown.Item>
                <NavDropdown.Item>Action</NavDropdown.Item>
                <NavDropdown.Item>Action</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as={NavLink} to={'/products'} className='navbar_link'>Products</Nav.Link>
              <Nav.Link as={Link} to={'/coming_soon'} className='navbar_link'>Repairs</Nav.Link>
              <Nav.Link as={Link} to={'/coming_soon'} className='navbar_link'>About Us</Nav.Link>
              <Nav.Link as={Link} to={'/coming_soon'} className='navbar_link'>Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          {/* -------------------------------------------------------------------
                Navbar right items section
          ----------------------------------------------------------------------- */}
          <div className='ms-auto d-flex align-items-center gap-3'>
            <Link to={'/cart'} className='text-reset position-relative me-3'>
              <i className="bi bi-cart3 navbar_icon"></i>
              {currentUser && <Badge pill bg="danger" className='position-absolute translate-middle top-0 start-100'>6</Badge>}
            </Link>

            {currentUser ? (
              <Dropdown className='me-auto'>
                <Dropdown.Toggle variant="none" id="dropdown-basic" className='border-0 hidden-arrow'>
                  <i className="bi bi-person-circle navbar_icon"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className='dropdown-menu-end'>
                  <Dropdown.Item>My Profle</Dropdown.Item>
                  <Dropdown.Item>Setting</Dropdown.Item>
                  <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Link to={'/signup'} className='btn btn_main_dark'>Sign Up</Link>
                <Link to={'/login'} className='btn btn_main_light_outline'>Log In</Link>
              </>
            )
            }
          </div>
        </Container>
      </Navbar>
      {/* -------------------------------------------------------------------
            Search bar section
      ----------------------------------------------------------------------- */}
      <Container fluid className='p-3 search_container d-flex justify-content-center' >
        <SearchBar />
      </Container>
    </>
  )
}

export default Header