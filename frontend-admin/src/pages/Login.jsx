import { useContext, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import logo from "../assets/icons/logo.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // get context values
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `${backendUrl}/api/admin/auth/login`,
        formData
      );
      toast.success(data.message);
      setIsLoggedIn(true);
      navigate("/home");
      getUserData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, Please try again later"
      );
      console.error(error);
    }
  };

  return (
    <Container
      fluid
      className="bg-secondary-subtle min-vh-100 d-flex align-items-center justify-content-center"
    >
      <Container className="col-10 col-sm-4 p-3 bg-white rounded-2 shadow">
        <Container className="text-center">
          <img src={logo} className="img-fluid" width="210px" />
          <h4 className="my-3">Log In to Admin Side</h4>
        </Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              name="email"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              onChange={handleChange}
            />
          </Form.Group>

          <div className="mb-3">
            <Button
              variant="none"
              className="btn_main_dark w-100 shadow"
              type="submit"
            >
              Log In
            </Button>
          </div>
        </Form>
      </Container>
    </Container>
  );
}

export default Login;
