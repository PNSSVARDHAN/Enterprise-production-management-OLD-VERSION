import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Radar } from "react-chartjs-2";
import "chart.js/auto";

const EmployeeProductivityGraphs = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);  // 🚀 Track which order is expanded
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
                hourlyTrend: [],  // Placeholder for hourly data
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
            setLoading(false); // Set loading to false after data is fetched
        }
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId); // Expand/collapse the graphs
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Employee Productivity Analysis</h2>

            {loading ? (
                <p style={styles.noData}>Loading data...</p>
            ) : orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.order_id} style={styles.orderContainer}>
                        {/* ✅ Clickable Order Name */}
                        <h3
                            style={styles.orderHeading}
                            onClick={() => toggleOrder(order.order_id)}
                        >
                            {order.order_number} {expandedOrder === order.order_id ? "▲" : "▼"}
                        </h3>

                        {/* ✅ Show graphs only when expanded */}
                        {expandedOrder === order.order_id && (
                            <div style={styles.chartWrapper}>
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

                                <Line
                                    data={{
                                        labels: order.hourlyTrend?.map(d => d.hour_slot),
                                        datasets: [{
                                            label: "Hourly Productivity",
                                            data: order.hourlyTrend?.map(d => d.hourly_completed),
                                            borderColor: "lime",
                                            backgroundColor: "rgba(0, 255, 0, 0.5)",
                                            borderWidth: 2
                                        }]
                                    }}
                                />

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
                        )}
                    </div>
                ))
            ) : (
                <p style={styles.noData}>No orders found.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#f8f9fa",
        padding: "40px",
        color: "#000",
        maxWidth: "1000px",
        margin: "auto",
    },
    heading: {
        textAlign: "center",
        color: "#007bff",
        fontSize: "24px",
        marginBottom: "20px"
    },
    orderContainer: {
        marginBottom: "15px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)"
    },
    orderHeading: {
        textAlign: "center",
        color: "#333",
        fontSize: "20px",
        cursor: "pointer",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        borderRadius: "5px",
        transition: "background-color 0.3s",
        marginBottom: "10px"
    },
    chartWrapper: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        alignItems: "center",
        width: "45%",
        padding: "10px"
    },
    noData: {
        textAlign: "center",
        color: "red",
        fontSize: "18px"
    }
};

export default EmployeeProductivityGraphs;
