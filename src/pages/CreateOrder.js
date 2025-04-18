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
        <div className="container-fluid create-order-container">
            <div className="border p-5 rounded shadow mb-5">
                <h1 className="text-center mb-4">Create Order</h1>
                <form onSubmit={handleSubmit} className="create-order-form row g-3">
                    <div className="col-12 col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Order Number"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Product Name"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Number of Steps"
                            value={stepCount}
                            onChange={(e) => setStepCount(parseInt(e.target.value) || 0)}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <button
                            type="button"
                            onClick={generateStepFields}
                            className="btn btn-primary w-100"
                        >
                            Generate Steps
                        </button>
                    </div>

                    {steps.length > 0 && (
                        <div className="col-12">
                            <div className="border p-4 rounded shadow-sm mb-4">
                            <h5 className="text-center mb-4">Step Details</h5>
                            <div className="row">
                                {steps.map((step, index) => (
                                <div key={index} className="col-12 col-md-4 mb-3">
                                    <div className="border p-3 rounded shadow-sm h-100">
                                    <h6 className="text-center mb-3">Step {index + 1}</h6>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Enter Step Name`}
                                        value={step.name}
                                        onChange={(e) => handleStepChange(index, "name", e.target.value)}
                                        required
                                    />
                                    </div>
                                </div>
                                ))}
                            </div>
                            </div>
                        </div>
                        )}


                    <div className="col-12">
                        <button type="submit" className="btn btn-success w-100">
                            Create Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrder;
