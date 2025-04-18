import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap CSS import
import "./OfficeDashboard.css"; // ✅ Custom CSS import


const OfficeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/dashboard/office`)
      .then((response) => setDashboardData(response.data))
      .catch((error) => console.error("❌ Error fetching office dashboard data:", error));
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Production Overview</h1>

      {dashboardData ? (
        <>
          {/* ✅ Stats Section */}
          <div className="row g-4 mb-3">
            {[
              { title: "Total Orders", value: dashboardData.totalOrders },
              { title: "Active Orders", value: dashboardData.activeOrders },
              { title: "Completed Orders", value: dashboardData.completedOrders },
              { title: "Total Employees", value: dashboardData.totalEmployees },
              { title: "Employees Working", value: dashboardData.employeesWorking },
              { title: "Machines In Use", value: dashboardData.inUseMachines },
            ].map((stat, index) => (
              <div className="col-12 col-md-4 col-lg-6" key={index}>
                <div className="card shadow-sm text-center h-100">
                  <div className="card-body">
                    <h5 className="card-title">{stat.title}</h5>
                    <p className="card-text fs-4 fw-bold">{stat.value || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Live Task Progress Table */}
          <h3 className="mb-3">Live Task Progress:</h3>
          {dashboardData.tasks.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Order ID</th>
                    <th>Step Name</th>
                    <th>Employee</th>
                    <th>Completed</th>
                    <th>Target</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.tasks.map((task, index) => (
                    <tr key={index}>
                      <td>{task.order_id || "N/A"}</td>
                      <td>{task.step_name || "N/A"}</td>
                      <td>{task.employee_name || "N/A"}</td>
                      <td>{task.completed || 0}</td>
                      <td>{task.target || 0}</td>
                      <td>
                        <span
                          className={`badge ${
                            task.status.toLowerCase().includes("completed")
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">No active tasks.</div>
          )}
        </>
      ) : (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading data...</p>
        </div>
      )}
    </div>
  );
};

export default OfficeDashboard;
