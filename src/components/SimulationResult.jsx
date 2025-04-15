import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import './SimulationResult.css'; // Make sure to import the CSS file

const SimulationResult = () => {
  const [selectedStrategy, setSelectedStrategy] = useState("round");
  const [resultData, setResultData] = useState(null);

  const strategyLabels = {
    round: "Round Robin",
    least: "Least Connection",
  };

  const fetchData = async (strategy) => {
    try {
      const response = await axios.get(
        `http://18.217.9.56:8081/api/simulate/${strategy}`
      );
      setResultData({
        strategyName: strategyLabels[strategy],
        makespan: response.data.makespan,
        avgExecTime: response.data.averageExecutionTime,
        cloudletLogs: response.data.cloudletLogs,
      });
    } catch (err) {
      console.error("Error fetching simulation data:", err);
    }
  };

  useEffect(() => {
    fetchData(selectedStrategy);
  }, [selectedStrategy]);

  const pieData = [
    { name: "Makespan", value: resultData?.makespan },
    { name: "Avg Exec Time", value: resultData?.avgExecTime },
  ];

  const COLORS = ["#facc15", "#10b981"]; // Yellow (Makespan), Green (Avg Exec Time)


  return (
    <div className="simulation-container">
      <div className="simulation-content">
        <h2 className="simulation-title">
          Simulation Viewer
        </h2>

        {/* Dropdown */}
        <div className="strategy-dropdown-wrapper">
          <select
            className="strategy-dropdown"
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
          >
            <option value="round">Round Robin</option>
            <option value="least">Least Connection</option>
          </select>
        </div>

        {/* Pie Chart */}
        {resultData && (
          <div className="chart-container">
            <h3 className="chart-heading">Performance Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Cloudlet Logs */}
        {resultData && (
          <div className="logs-container">
            <h3 className="logs-heading">{resultData.strategyName} - Cloudlet Logs</h3>
            <ul className="logs-list">
              {resultData.cloudletLogs.map((log, idx) => (
                <li key={idx} className="logs-list-item">
                  {log}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationResult;
