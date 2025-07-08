import React from 'react'
import logo from '../../assets/icons/logo.png'
import { Container, Nav, Navbar, NavDropdown, Dropdown, Badge, Form, InputGroup, Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Header.css'
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

function Header() {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <>
      <Navbar expand="lg" className="bg_light sticky-top">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='fs-6' />
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
            <Nav className="me-auto">
              <NavDropdown className='navbar_link' title="Phones" id="basic-nav-dropdown">
                <NavDropdown.Item >Samsung</NavDropdown.Item>
                <NavDropdown.Item>Vivo</NavDropdown.Item>
                <NavDropdown.Item>Apple</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown className='navbar_link' title="Accessories" id="basic-nav-dropdown">
                <NavDropdown.Item>Action</NavDropdown.Item>
                <NavDropdown.Item>Action</NavDropdown.Item>
                <NavDropdown.Item>Action</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as={Link} to={'/coming_soon'} className='navbar_link'>Products</Nav.Link>
              <Nav.Link as={Link} to={'/coming_soon'} className='navbar_link'>Repairs</Nav.Link>
              <Nav.Link as={Link} to={'/coming_soon'} className='navbar_link'>About Us</Nav.Link>
              <Nav.Link as={Link} to={'/coming_soon'} className='navbar_link'>Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>

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
      <Container fluid className='p-3 search_container d-flex justify-content-center' >
        <Form className='col-10 col-sm-6 '>
          <InputGroup className='p-1 rounded-3 search_input_group'>
            <Form.Control
              placeholder="Search here"
            />
            <Button variant="dark" className='btn_main_dark'>
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Form>
      </Container>
    </>
  )
}

export default Header