import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import "./ProductionFlow.css";

const stages = [
  { title: "Cutting", statusList: ["Cutting should be started", "Cutting Started"] },
  { title: "Sewing", statusList: ["Cutting Completed", "Sewing is in progress"] },
  { title: "Quality Check", statusList: ["Sewing Completed", "Quality Check in progress"] },
  { title: "Packing", statusList: ["Quality Check Completed", "Packing is in progress"] },
  { title: "Dispatch", statusList: ["Packing Completed", "Ready for Dispatch"] },
];

const stageEnumMap = {
  "Cutting is in progress": "Cutting Started",
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

const stageActions = {
  Cutting: ["Cutting Started", "Cutting Completed"],
  Sewing: ["Sewing is in progress", "Sewing Completed"],
  QualityCheck: ["Quality Check in progress", "Quality Check Completed"],
  Packing: ["Packing is in progress", "Packing Completed"],
  Dispatch: [null, "Ready for Dispatch"],
};

const ProductionFlow = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionData, setActionData] = useState(null);

  useEffect(() => {
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
    const mappedStage = stageEnumMap[newStage] || newStage; // map to valid ENUM
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

  const filteredOrders = selectedStage
    ? orders.filter((o) => selectedStage.statusList.includes(o.current_stage))
    : [];

  const getActions = (stageTitle) => {
    switch (stageTitle) {
      case "Cutting":
        return stageActions.Cutting;
      case "Sewing":
        return stageActions.Sewing;
      case "Quality Check":
        return stageActions.QualityCheck;
      case "Packing":
        return stageActions.Packing;
      case "Dispatch":
        return stageActions.Dispatch;
      default:
        return [null, null];
    }
  };

  const handleAction = (orderId, action) => {
    setActionData({ orderId, action });
    setShowModal(true);
  };

  return (
    <div className="production-flow-container bg-light p-4 rounded shadow-lg border border-primary">
      {/* Stage Selector (Using Bootstrap pills) */}
      <ul className="nav nav-pills mb-3">
        {stages.map((stage) => (
          <li className="nav-item" key={stage.title}>
            <button
              className={`nav-link ${selectedStage?.title === stage.title ? "active" : ""}`}
              onClick={() => setSelectedStage(stage)}
            >
              {stage.title}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        selectedStage && (
          <div className="orders-container">
            <h2 className="mb-4">{selectedStage.title} Orders</h2>
            {filteredOrders.length === 0 ? (
              <p>No orders in this stage.</p>
            ) : (
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Order Number</th>
                    <th>Quantity</th>
                    <th>Product</th>
                    <th>Start</th>
                    <th>Complete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const [startAction, completeAction] = getActions(selectedStage.title);
                    return (
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
                              disabled={
                                order.current_stage === startAction || order.current_stage === completeAction
                              }
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
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )
      )}

      {/* Modal for Confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Stage Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to move this order to the next stage? This action cannot be undone.
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
