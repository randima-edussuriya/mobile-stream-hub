import { useState, useEffect } from "react";
import { Container, Table, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");
      setSuppliers([]);

      const { data } = await axios.get(`${backendUrl}/api/admin/suppliers`);

      if (data.success) {
        setSuppliers(data.data);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch suppliers. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Render suppliers data into table
  --------------------------------------------------------------------*/
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className="text-center py-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={7} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (suppliers.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="text-danger text-center">
            No suppliers found
          </td>
        </tr>
      );
    }

    return suppliers.map((supplier) => (
      <tr key={supplier.supplier_id}>
        <td className="fw-bold">{supplier.supplier_id}</td>
        <td className="fw-medium">{supplier.name}</td>
        <td className="text-muted">{supplier.email}</td>
        <td>{supplier.phone_number}</td>
        <td className="fw-medium">{supplier.address}</td>
        <td className="fw-bold">
          <Badge pill>{supplier.item_count}</Badge>
        </td>
        <td>
          <Link to={`profile/${supplier.supplier_id}`}>
            <i
              role="button"
              className="bi-arrow-up-right-square text-primary action_icon"
              title="View Details"
            ></i>
          </Link>
        </td>
      </tr>
    ));
  };

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Supplier Management</h4>
          </div>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Supplier ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Item Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </Container>
  );
}

export default SupplierManagement;
