import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import "./ProductionFlow.css";

const roleStageMapping = {
  cutting: {
    stages: ["Cutting should be started", "Cutting Started"],
    actions: ["Cutting Started", "Cutting Completed"],
  },
  sewing: {
    stages: ["Cutting Completed", "Sewing is in progress"],
    actions: ["Sewing is in progress", "Sewing Completed"],
  },
  quality: {
    stages: ["Sewing Completed", "Quality Check in progress"],
    actions: ["Quality Check in progress", "Quality Check Completed"],
  },
  packing: {
    stages: ["Quality Check Completed", "Packing is in progress"],
    actions: ["Packing is in progress", "Packing Completed"],
  },
  dispatch: {
    stages: ["Packing Completed", "Ready for Dispatch"],
    actions: [null, "Ready for Dispatch"],
  },
};

const stageEnumMap = {
  "Cutting should be started": "Cutting should be started",
  "Cutting Started": "Cutting Started",
  "Cutting Completed": "Cutting Completed",
  "Sewing is in progress": "Sewing is in progress",
  "Sewing Completed": "Sewing Completed",
  "Quality Check in progress": "Quality Check in progress",
  "Quality Check Completed": "Quality Check Completed",
  "Packing is in progress": "Packing is in progress",
  "Packing Completed": "Packing Completed",
  "Ready for Dispatch": "Ready for Dispatch",
  "Dispatched": "Dispatched",
};

const ProductionFlow = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionData, setActionData] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // Assuming you store role in localStorage
    setUserRole(storedRole?.toLowerCase()); // Example: "cutting", "sewing", etc.
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/orders/progress`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders", err);
        setLoading(false);
      });
  };

  const updateStage = (orderId, newStage) => {
    const mappedStage = stageEnumMap[newStage] || newStage;
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/orders/update-stage`, {
        id: orderId,
        current_stage: mappedStage,
      })
      .then(() => {
        fetchOrders();
        setShowModal(false);
      })
      .catch((err) => console.error("Error updating order stage", err));
  };

  const getFilteredOrders = () => {
    if (!userRole) return [];
    if (userRole === "admin") {
      return orders;  
    }
    const allowedStages = roleStageMapping[userRole]?.stages || [];
    return orders.filter((order) => allowedStages.includes(order.current_stage));
  };

  const getActions = () => {
    return roleStageMapping[userRole]?.actions || [null, null];
  };

  const handleAction = (orderId, action) => {
    setActionData({ orderId, action });
    setShowModal(true);
  };

  const filteredOrders = getFilteredOrders();
  const [startAction, completeAction] = getActions();

  return (
    <div className="production-flow-container bg-light p-4 rounded shadow-lg border border-primary">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="orders-container">
          <h2 className="mb-4 text-center text-primary">{userRole?.toUpperCase()} Section Orders</h2>

          {filteredOrders.length === 0 ? (
            <p>No orders available for your section.</p>
          ) : (
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Number</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Start</th>
                  <th>Complete</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.order_number}</td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>
                      {startAction && (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleAction(order.id, startAction)}
                          disabled={order.current_stage === startAction || order.current_stage === completeAction}
                        >
                          Start
                        </button>
                      )}
                    </td>
                    <td>
                      {completeAction && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAction(order.id, completeAction)}
                          disabled={order.current_stage === completeAction}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Stage Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to move this order to the next stage?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => updateStage(actionData.orderId, actionData.action)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductionFlow;
