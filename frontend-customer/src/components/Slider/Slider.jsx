import React from "react";
import { Carousel, Image } from "react-bootstrap";
import banner1 from "../../assets/banners/slider1.png";
import banner2 from "../../assets/banners/slider2.png";
import { Link } from "react-router-dom";
import "./Slider.css";

function Slider() {
  return (
    <>
      <Carousel interval={5000} pause={false}>
        <Carousel.Item>
          <Image src={banner1} fluid />
          <Carousel.Caption className="carousel_caption">
            <h2>GET THE LATEST SMARTPHONES TODAY!</h2>
            <p className="text-muted">
              Discover unbeatable deals on top brands. Get experience with
              cutting-edge technology now.
            </p>
            <Link to={"/products"} className="btn btn-dark">
              Get Products
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src={banner2} fluid />
          <Carousel.Caption className="carousel_caption">
            <h2>CRACKED SCREEN OR WATER DAMAGE?</h2>
            <p className="text-muted">
              We repair all types of phone issues — from shattered screens to
              liquid damage. Trust our experts to restore your device quickly
              and affordably!
            </p>
            <Link to={"/coming-soon"} className="btn btn-dark">
              Get Repair
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default Slider;
