import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AppContext } from "../../context/AppContext";
import Loader from "../Loader";

function RevenueByOrderChart() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/admin/dashboard/revenue-by-order`,
        );
        setOrderData(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl]);

  if (loading) return <Loader type="chart" />;

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <span className="h5">Monthly Revenue Trend of Orders </span>
      <span className="text-muted h5">(Last 6 Months)</span>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={orderData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => `Rs. ${Number(value).toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueByOrderChart;
