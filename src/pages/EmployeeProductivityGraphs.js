import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Radar } from "react-chartjs-2";
import "chart.js/auto";
import { Accordion, Card, Button } from "react-bootstrap"; // Import React Bootstrap components

const EmployeeProductivityGraphs = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProductivityData();
    }, []);

    const fetchProductivityData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/orders-productivity`);
            const formattedOrders = response.data.map(order => ({
                order_id: order.id,
                order_number: order.order_number,
                timePerPiece: order.MachineAllocations.flatMap(machine =>
                    machine.EmployeeTasks.map(task => ({
                        employee_id: task.employee_id,
                        time_per_piece: task.total_completed ? (8 * 60) / task.total_completed : 0
                    }))
                ),
                totalPieces: order.MachineAllocations.flatMap(machine =>
                    machine.EmployeeTasks.map(task => ({
                        employee_id: task.employee_id,
                        total_completed: Number(task.total_completed) || 0
                    }))
                ),
                hourlyTrend: [],
                employeePerformance: order.MachineAllocations.flatMap(machine =>
                    machine.EmployeeTasks.map(task => ({
                        employee_id: task.employee_id,
                        total_completed: Number(task.total_completed) || 0
                    }))
                )
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error("❌ Error fetching productivity data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center text-primary mb-4">Employee Productivity Analysis</h2>

            {loading ? (
                <p className="text-center text-danger">Loading data...</p>
            ) : orders.length > 0 ? (
                <Accordion defaultActiveKey="0">
                    {orders.map((order, index) => (
                        <Card key={order.order_id}>
                            <Accordion.Item eventKey={String(index)}>
                                <Accordion.Header>Order ID: {order.order_id} - {order.order_number}</Accordion.Header>
                                <Accordion.Body>
                                    <div className="row g-4 justify-content-center">
                                        <div className="col-12 col-md-6">
                                            <div className="card shadow-sm p-3">
                                                <Line
                                                    data={{
                                                        labels: order.timePerPiece?.map(d => `Emp ${d.employee_id}`),
                                                        datasets: [{
                                                            label: "Avg. Time Taken per Piece (Minutes)",
                                                            data: order.timePerPiece?.map(d => parseFloat(d.time_per_piece) || 0),
                                                            borderColor: "cyan",
                                                            backgroundColor: "rgba(0, 255, 255, 0.5)",
                                                            borderWidth: 2
                                                        }]
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="card shadow-sm p-3">
                                                <Bar
                                                    data={{
                                                        labels: order.totalPieces?.map(d => `Emp ${d.employee_id}`),
                                                        datasets: [{
                                                            label: "Total Pieces Completed",
                                                            data: order.totalPieces?.map(d => d.total_completed),
                                                            backgroundColor: "orange"
                                                        }]
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="card shadow-sm p-3">
                                                <Radar
                                                    data={{
                                                        labels: order.employeePerformance?.map(d => `Emp ${d.employee_id}`),
                                                        datasets: [{
                                                            label: "Performance",
                                                            data: order.employeePerformance?.map(d => d.total_completed),
                                                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                                                            borderColor: "rgba(255, 99, 132, 1)"
                                                        }]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Card>
                    ))}
                </Accordion>
            ) : (
                <p className="text-center text-danger">No orders found.</p>
            )}
        </div>
    );
};

export default EmployeeProductivityGraphs;
