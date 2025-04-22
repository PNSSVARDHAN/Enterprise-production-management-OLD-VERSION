import { useState, useEffect } from "react";
import axios from "axios";
import AssignMachine from "./AssignMachine";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Orders.css"; // Custom CSS for Orders page

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF", "#FF4081"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSteps, setOrderSteps] = useState([]);
  const [assignStep, setAssignStep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [visualizeData, setVisualizeData] = useState(null); // New state for visualization

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/orders/progress`)
      .then((response) => {
        console.log("Orders Progress Fetched:", response.data);
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  };

  const fetchOrderSteps = async (orderId) => {
    setStepsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}/steps`);
      console.log("Steps fetched for Order", orderId, ":", response.data);

      const stepsWithQuantity = response.data.map((step) => ({
        ...step,
        quantity: orders.find((order) => order.id === orderId)?.quantity || 0,
      }));

      setOrderSteps(stepsWithQuantity);
      setSelectedOrder(orders.find((o) => o.id === orderId));
    } catch (error) {
      console.error("Error fetching order steps:", error);
      alert("Failed to fetch order steps!");
    }
    setStepsLoading(false);
  };

  const deleteOrder = (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this order?")) return;
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/orders/${id}`)
      .then((response) => {
        console.log(response.data.message);
        setOrders(orders.filter((order) => order.id !== id));
      })
      .catch((error) => {
        console.error("❌ Error deleting order:", error);
        alert("❌ Failed to delete order!");
      });
  };

  const visualizeOrder = async (orderId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}/steps`);
      console.log("Visualization Data for Order", orderId, ":", response.data);
      const graphData = response.data.map((step) => ({
        stepName: step.name,
        completed: step.completed,
        quantity: orders.find((order) => order.id === orderId)?.quantity || 0,
      }));
      setVisualizeData(graphData);
    } catch (error) {
      console.error("Error fetching visualization data:", error);
      alert("Failed to fetch data for visualization!");
    }
  };

  return (
    <div className="container-order mt-4">
      <h2 className="mb-4 text-center">Order Management</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Responsive Table */}
          <div className="table-responsive" style={{ minWidth: "800px" }}>
            <table className="table table-bordered table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Order Number</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Visualize</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="animated-row">
                    <td>{order.id}</td>
                    <td>{order.order_number}</td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>{order.current_stage}</td>
                    <td>
                      <button
                        onClick={() => fetchOrderSteps(order.id)}
                        className="btn btn-info btn-sm d-flex align-items-center gap-1"
                      >
                        <i className="bi bi-eye"></i> View
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => visualizeOrder(order.id)}
                        className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                      >
                        <i className="bi bi-bar-chart-line"></i> Visualize
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 delete-btn"
                        onClick={() => deleteOrder(order.id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Steps Section */}
          {selectedOrder && (
            <div className="steps-box mt-5">
              <h3 className="mb-3 text-center">
                🛠️ Steps for Order {selectedOrder.id} - {selectedOrder.order_number}
              </h3>
              <button
                className="btn btn-danger btn-sm ms-2"
                onClick={() => {
                  setSelectedOrder(null);
                  setOrderSteps([]);
                }}
              >
                Close
              </button>

              {stepsLoading ? (
                <div className="text-center">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading Steps...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover table-striped align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Step Name</th>
                        <th>Order Quantity</th>
                        <th>Completed Count</th>
                        <th>Assign Machine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderSteps.map((step, index) => (
                        <tr key={index} className="animated-row">
                          <td>{step.name}</td>
                          <td>{step.quantity}</td>
                          <td>{step.completed}</td>
                          <td>
                            <button
                              onClick={() => setAssignStep({ order_id: selectedOrder.id, step: step.name })}
                              className="btn btn-success btn-sm d-flex align-items-center gap-1"
                              disabled={step.completed >= step.quantity}
                            >
                              {step.completed >= step.quantity ? (
                                <>
                                  <i className="bi bi-check-circle"></i> Completed
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-gear"></i> Assign
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Assign Machine Modal */}
          {assignStep && (
            <AssignMachine
              stepId={{ order_id: assignStep.order_id, step: assignStep.step }}
              onClose={() => setAssignStep(null)}
            />
          )}

          {/* Visualization Modal */}
          {visualizeData && (
  <div className="visualize-modal">
    <div className="visualize-content">
      <h4 className="text-center mb-4">📊 Progress Visualization</h4>
      <button
        className="btn btn-danger btn-sm mb-3"
        onClick={() => setVisualizeData(null)}
      >
        Close
      </button>

      {/* Bar Chart */}
      <h5 className="text-center mb-2">Step-wise Progress</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={visualizeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stepName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" fill="#00c853" name="Completed" />
          <Bar dataKey="quantity" fill="#6200ea" name="Order Quantity" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart */}
      <h5 className="text-center mt-5 mb-2">Overall Progress</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={[
              { name: "Completed", value: visualizeData.reduce((acc, item) => acc + item.completed, 0) },
              { name: "Remaining", value: visualizeData.reduce((acc, item) => acc + (item.quantity - item.completed), 0) },
            ]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            <Cell fill="#00c853" />
            <Cell fill="#cfd8dc" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
)}

        </>
      )}
    </div>
  );
};

export default Orders;
