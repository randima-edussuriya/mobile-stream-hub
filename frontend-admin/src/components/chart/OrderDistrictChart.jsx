import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AppContext } from "../../context/AppContext";
import Loader from "../Loader";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

function OrderDistrictChart() {
  const [orderDistrictData, setOrderDistrictData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/admin/dashboard/order-district`,
        );
        setOrderDistrictData(data.data);
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
    <div className="bg-white p-3 rounded shadow-sm">
      <span className="h5">Order Districts </span>
      <span className="text-muted h5">(Last 30 Days)</span>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={orderDistrictData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {orderDistrictData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OrderDistrictChart;
