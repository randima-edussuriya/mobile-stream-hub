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
import { AppContext } from "../../context/AppContext";
import Loader from "../Loader";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function PaymentMethodChart({
  formDate = "",
  toDate = "",
  applyDateRange = false,
}) {
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params =
          applyDateRange && formDate && toDate
            ? { fromDate: formDate, toDate: toDate }
            : undefined;

        const { data } = await axios.get(
          `${backendUrl}/api/admin/dashboard/payment-methods`,
          { params },
        );
        setPaymentMethodData(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [applyDateRange, backendUrl]);

  if (loading) return <Loader type="chart" />;

  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <span className="h5">Order Pay Methods </span>
      {!applyDateRange && <span className="text-muted h5">(Last 30 Days)</span>}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={paymentMethodData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {paymentMethodData.map((entry, index) => (
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

export default PaymentMethodChart;
