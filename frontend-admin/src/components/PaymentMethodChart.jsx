import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AppContext } from "../context/AppContext";
import Loader from "./Loader";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function PaymentMethodChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/admin/dashboard/payment-methods`,
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
      <h5 className="mb-3">Payment Methods</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PaymentMethodChart;
