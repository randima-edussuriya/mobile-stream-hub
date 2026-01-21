import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import OrderStatusChart from "../components/OrderStatusChart";
import PaymentMethodChart from "../components/PaymentMethodChart";
import RevenueByOrderChart from "../components/RevenueByOrderChart";

function Home() {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    categories: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/admin/dashboard/stats`,
          { withCredentials: true },
        );
        setStats(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [backendUrl]);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="container-fluid mt-3">
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="p-3 bg-success-subtle shadow d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-3">{stats.customers}</h3>
                <span className="fs-5">Customers</span>
              </div>
              <i className="bi bi-people p-3 fs-1"></i>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="p-3 bg-danger-subtle shadow d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-3">{stats.products}</h3>
                <span className="fs-5">Products</span>
              </div>
              <i className="bi bi-diagram-3 p-3 fs-1"></i>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="p-3 bg-info-subtle shadow d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-3">{stats.categories}</h3>
                <span className="fs-5">Categories</span>
              </div>
              <i className="bi bi-bookmarks p-3 fs-1"></i>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="p-3 bg-white shadow d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-3">{stats.orders}</h3>
                <span className="fs-5">Orders</span>
              </div>
              <i className="bi bi-border-all p-3 fs-1"></i>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row g-3 mt-3">
          <div className="col-12 col-lg-6">
            <OrderStatusChart />
          </div>
          <div className="col-12 col-lg-6">
            <PaymentMethodChart />
          </div>
          <div className="col-12">
            <RevenueByOrderChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
