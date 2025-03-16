# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



import { useState, useEffect } from "react";
import axios from "axios";
import "./OfficeDashboard.css"; // ✅ Import the new CSS file

const OfficeDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/api/dashboard/office")
            .then((response) => setDashboardData(response.data))
            .catch((error) => console.error("❌ Error fetching office dashboard data:", error));
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard - Production Overview</h1>
            
            {dashboardData ? (
                <div className="dashboard-content">
                    {/* ✅ Summary Section */}
                    <div className="dashboard-summary">
                        <div className="summary-card">Total Orders: <span>{dashboardData.totalOrders}</span></div>
                        <div className="summary-card">Active Orders: <span>{dashboardData.activeOrders}</span></div>
                        <div className="summary-card">Completed Orders: <span>{dashboardData.completedOrders}</span></div>
                        <div className="summary-card">Total Employees: <span>{dashboardData.totalEmployees}</span></div>
                        <div className="summary-card">Employees Working: <span>{dashboardData.employeesWorking}</span></div>
                        <div className="summary-card">Available Machines: <span>{dashboardData.availableMachines}</span></div>
                        <div className="summary-card">Machines In Use: <span>{dashboardData.inUseMachines}</span></div>
                    </div>

                    {/* ✅ Live Task Progress Table */}
                    <h2 className="table-title">Live Task Progress</h2>
                    <table className="task-table">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Task Completed</th>
                                <th>Target</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.tasks.map(task => (
                                <tr key={task.id}>
                                    <td>{task.Employee.name}</td>
                                    <td>{task.completed}</td>
                                    <td>{task.target}</td>
                                    <td>
                                        <progress value={task.completed} max={task.target}></progress>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="loading-text">Loading data...</p>
            )}
        </div>
    );
};

export default OfficeDashboard;
