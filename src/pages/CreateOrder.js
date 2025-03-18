import { useState } from "react";
import axios from "axios";
import "./CreateOrder.css"; // ✅ Import CSS

const CreateOrder = () => {
    const [orderNumber, setOrderNumber] = useState("");
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [steps, setSteps] = useState([]);
    const [stepCount, setStepCount] = useState(0);

    const generateStepFields = () => {
        const newSteps = Array.from({ length: stepCount }, (_, i) => ({
            name: "",
            employees: [],
        }));
        setSteps(newSteps);
    };

    const handleStepChange = (index, key, value) => {
        const newSteps = [...steps];
        newSteps[index][key] = value;
        setSteps(newSteps);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newOrder = {
            order_number: orderNumber,
            product,
            quantity,
            steps,
        };

        axios.post(`${process.env.REACT_APP_API_URL}/api/orders/add`, newOrder)
            .then(() => {
                alert("Order created successfully!");
                setOrderNumber("");
                setProduct("");
                setQuantity("");
                setStepCount(0);
                setSteps([]);
            })
            .catch(error => console.error("Error creating order:", error));
    };

    return (
        <div className="create-order-container">
            <h1>Create Order</h1>
            <form onSubmit={handleSubmit} className="create-order-form">
                <input
                    type="text"
                    placeholder="Order Number"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Product Name"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Number of Steps"
                    value={stepCount}
                    onChange={(e) => setStepCount(parseInt(e.target.value) || 0)}
                    required
                />
                <button type="button" onClick={generateStepFields} className="create-order-button">
                    Generate Steps
                </button>

                {steps.map((step, index) => (
                    <div key={index} className="step-container">
                        <input
                            type="text"
                            placeholder={`Step ${index + 1} Name`}
                            value={step.name}
                            onChange={(e) => handleStepChange(index, "name", e.target.value)}
                            required
                        />
                    </div>
                ))}

                <button type="submit" className="create-order-button">Create Order</button>
            </form>
        </div>
    );
};

export default CreateOrder;
