import { useState } from "react";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/products?search=${encodeURIComponent(search)}`);
  };
  return (
    <Container
      fluid
      className="p-3 search_container d-flex justify-content-center"
    >
      <Form onSubmit={handleSearch} className="col-10 col-sm-6 ">
        <InputGroup className="rounded-3 search_input_group">
          <Form.Control
            placeholder="Search products here"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="dark" className="btn_main_dark">
            <i className="bi bi-search"></i>
          </Button>
        </InputGroup>
      </Form>
    </Container>
  );
}

export default SearchBar;
