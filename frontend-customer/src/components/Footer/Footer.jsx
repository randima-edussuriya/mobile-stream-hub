import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer className="text-center footer_main mt-5">
        <Container className="text-start mt-5 pt-1">
          <Row className="mt-3">
            {/* ----------------------------------------------------------------
                  Brand name, about, social icons links section
            -------------------------------------------------------------------- */}
            <Col className="mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Mobile Stream Hub</h6>
              <p>
                Sales. Repairs. Accessories. Trusted service for all your mobile
                needs.
              </p>
              <p>
                <a
                  href={
                    "https://web.facebook.com/search/top/?q=Mobile%20Stream%20Hub"
                  }
                  target="_blank"
                  className="text-reset me-4 social_icon"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href={
                    "https://www.messenger.com/search/top/?q=Mobile%20Stream%20Hub"
                  }
                  target="_blank"
                  className="text-reset me-4 social_icon"
                >
                  <i className="bi bi-messenger"></i>
                </a>
                <a
                  href={"https://wa.me/071-2178596"}
                  target="_blank"
                  className="text-reset me-4 social_icon"
                >
                  <i className="bi bi-whatsapp"></i>
                </a>
              </p>
            </Col>
            {/* ----------------------------------------------------------------
                  Quick links section
            -------------------------------------------------------------------- */}
            <Col className="mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Qucik Links</h6>
              <p>
                <Link
                  to={"/products"}
                  className="text-reset text-decoration-none quick_link"
                >
                  Products
                </Link>
              </p>
              <p>
                <Link
                  to={"/coming-soon"}
                  className="text-reset text-decoration-none quick_link"
                >
                  Repairs
                </Link>
              </p>
              <p>
                <Link
                  to={"/about-us"}
                  className="text-reset text-decoration-none quick_link"
                >
                  About Us
                </Link>
              </p>
            </Col>
            {/* ----------------------------------------------------------------
                  Contact details section
            -------------------------------------------------------------------- */}
            <Col className="mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <i className="bi bi-geo-alt me-3"></i>
                42B, Ananda Mawatha, Colombo 03
              </p>
              <p>
                <i className="bi bi-envelope me-3"></i>
                mobilestreamhub.gmail.com
              </p>
              <p>
                <i className="bi bi-telephone me-3"></i>
                011-1252325
              </p>
            </Col>
          </Row>
          {/* Copyright */}
        </Container>
        {/* ----------------------------------------------------------------
                  footer bottom section
            -------------------------------------------------------------------- */}
        <div className="p-4 footer_copyright text-bg-dark">
          © 2025 Copyright: Mobile Stream Hub
        </div>
      </footer>
    </>
  );
}

export default Footer;
