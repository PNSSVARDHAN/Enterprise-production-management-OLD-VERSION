// components/StageBlock.jsx
import React from "react";

const StageBlock = ({ title, orders, startStage, completeStage }) => {
    return (
        <div className="border p-4 rounded shadow">
            <h3 className="font-semibold text-xl">{title}</h3>
            <p className="mb-4 text-gray-600">{startStage}</p>
            <p className="mb-4 text-gray-600">{completeStage}</p>

            {/* Display the orders for the stage */}
            {orders.length === 0 ? (
                <p>No orders in this stage.</p>
            ) : (
                <ul className="space-y-2">
                    {orders.map(order => (
                        <li key={order.id} className="border-b py-2">
                            <div>
                                <strong>Order ID:</strong> {order.id} <br />
                                <strong>Cloth ID:</strong> {order.cloth_id} <br />
                                <strong>Current Status:</strong> {order.status}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StageBlock;
  