import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Container, Table, Spinner, Form, Button } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LoyaltyManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  const settingLabels = {
    earning_points_ratio: "Earning Points Ratio",
    redeem_points_value: "Redeem Points Value",
    silver_points_threshold: "Silver Points Threshold",
    gold_points_threshold: "Gold Points Threshold",
    platinum_points_threshold: "Platinum Points Threshold",
    max_redemption_percentage: "Max Redemption Percentage",
    min_redeem_threshold: "Min Redeem Threshold",
  };

  /* -----------------------------------------------------------------
        Fetch loyalty settings from API
  --------------------------------------------------------------------*/
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");
      setSettings([]);

      const { data } = await axios.get(`${backendUrl}/api/admin/loyalty`);
      setSettings(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch loyalty settings. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Handle edit button click
  --------------------------------------------------------------------*/
  const handleEditClick = (setting) => {
    setEditingId(setting.loyalty_setting_id);
    setEditValue(setting.setting_value);
  };

  /* -----------------------------------------------------------------
        Handle cancel edit
  --------------------------------------------------------------------*/
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  /* -----------------------------------------------------------------
        Handle save edit
  --------------------------------------------------------------------*/
  const handleSaveEdit = async (loyaltySettingId) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/admin/loyalty`, {
        loyaltySettingId,
        settingValue: editValue,
      });

      if (data.success) {
        toast.success(data.message || "Loyalty setting updated successfully");
        setEditingId(null);
        setEditValue("");
        fetchSettings();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to update loyalty setting. Please try again later.";
      toast.error(message);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* -----------------------------------------------------------------
        Render settings data into table
  --------------------------------------------------------------------*/
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={4} className="text-center py-3">
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
          <td colSpan={4} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (settings.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="text-danger text-center">
            No loyalty settings found
          </td>
        </tr>
      );
    }

    return settings.map((setting) => (
      <tr key={setting.loyalty_setting_id}>
        <td className="fw-bold">{setting.loyalty_setting_id}</td>
        <td>{settingLabels[setting.setting_name] || setting.setting_name}</td>
        <td>
          {editingId === setting.loyalty_setting_id ? (
            <Form.Control
              type="number"
              step="0.01"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          ) : (
            setting.setting_value
          )}
        </td>
        <td>
          {editingId === setting.loyalty_setting_id ? (
            <>
              <Button
                variant="success"
                size="sm"
                className="me-2"
                onClick={() => handleSaveEdit(setting.loyalty_setting_id)}
              >
                Save
              </Button>
              <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          ) : (
            <i
              role="button"
              title="Edit Value"
              onClick={() => handleEditClick(setting)}
              className="bi bi-pencil-square actoin_icon text-primary"
            ></i>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Loyalty Settings Management</h4>
            <Button
              variant="none"
              size="sm"
              onClick={() => navigate("usage")}
              className="btn_main_light_outline"
            >
              <i className="bi bi-caret-right-square-fill me-1"></i>
              Go to Usage
            </Button>
          </div>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>ID</th>
                <th>Setting Name</th>
                <th>Setting Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </Container>
  );
}

export default LoyaltyManagement;
