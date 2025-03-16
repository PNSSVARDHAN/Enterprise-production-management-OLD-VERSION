import { useState, useEffect } from "react";
import axios from "axios";
import AssignMachine from "./AssignMachine";
import "./Orders.css"; // ✅ Import CSS

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderSteps, setOrderSteps] = useState([]);
    const [assignStep, setAssignStep] = useState(null);

    // ✅ Fetch all orders with progress
    useEffect(() => {
        axios.get("http://localhost:5000/api/orders/progress") 
            .then((response) => {
                console.log("📦 Orders Progress Fetched:", response.data);
                setOrders(response.data);
            })
            .catch((error) => console.error("❌ Error fetching orders:", error));
    }, []);

    // ✅ Fetch steps for a selected order
    const fetchOrderSteps = (orderId) => {
        console.log("🔍 Fetching steps for Order ID:", orderId);
        const order = orders.find(o => o.id === orderId);

        if (order) {
            // ✅ Ensure every step has a completed count (default to 0 if missing)
            const stepsWithDefaults = order.steps.map(step => ({
                ...step,
                completed: step.completed || 0, // Default to 0 if undefined
                quantity: order.quantity, // ✅ Use order quantity for all steps
            }));

            setOrderSteps(stepsWithDefaults);
            setSelectedOrder(order);
        }
    };

    const deleteOrder = (id) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this order?")) return;

        axios.delete(`http://localhost:5000/api/orders/${id}`)
            .then(response => {
                console.log(response.data.message);
                setOrders(orders.filter(order => order.id !== id)); // ✅ Remove from UI
            })
            .catch(error => {
                console.error("❌ Error deleting order:", error);
                alert("❌ Failed to delete order!");
            });
    };


    return (
        <div className="orders-container">
            <h1>Orders</h1>
            <div className="orders-box">
                <h2>Order Details</h2>
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Action</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.product}</td>
                                <td>{order.quantity}</td>
                                <td>
                                    <button onClick={() => fetchOrderSteps(order.id)} className="view-steps-button">
                                        View Steps
                                    </button>
                                </td>
                                <td>
                                <button className="delete-button" onClick={() => deleteOrder(order.id)}>Delete</button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedOrder && (
    <div className="steps-box">
        <h2>Steps for Order {selectedOrder.id} - {selectedOrder.order_number}</h2>
        {orderSteps.length === 0 ? (
            <p>Loading steps...</p>
        ) : (
            <table className="steps-table">
                <thead>
                    <tr>
                        <th>Step Name</th>
                        <th>Order Quantity</th>
                        <th>Completed Count</th>
                        <th>Assign Machine</th>
                    </tr>
                </thead>
                <tbody>
                    {orderSteps.map((step, index) => (
                        <tr key={index}>
                            <td>{step.step}</td>
                            <td>{step.quantity}</td>
                            <td>{step.completed}</td>
                            <td>
                                <button 
                                    onClick={() => setAssignStep({ order_id: selectedOrder.id, step: step.step })} 
                                    className="assign-button"
                                    disabled={step.completed >= step.quantity}
                                >
                                    {step.completed >= step.quantity ? "Completed" : "Assign Machine"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
)}


                {assignStep && (
                    <AssignMachine 
                        stepId={{ order_id: assignStep.order_id, step: assignStep.step }} 
                        onClose={() => setAssignStep(null)} 
                    />
                )}
            </div>
        </div>
    );
};

export default Orders;
