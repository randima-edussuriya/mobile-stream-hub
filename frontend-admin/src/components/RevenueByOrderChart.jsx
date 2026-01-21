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
import { AppContext } from "../context/AppContext";
import Loader from "./Loader";

function RevenueByOrderChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/admin/dashboard/revenue-by-order`,
          { withCredentials: true },
        );
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl]);

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h5 className="mb-3">Monthly Revenue Trend</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
