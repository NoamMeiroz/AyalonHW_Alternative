import React from "react";
import requireAuth from "../requireAuth"; //used to check if login successfull

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import randomColor from "randomcolor";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "דוח קשיי תנועה לפי חברה",
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    }
  }
};

export const labels = {
  "פקקי תנועה": "TRAFFIC_JAMS",
  "עלות נסיעה": "TRAVEL_COSTS",
  "חוסר בחניה": "LACK_OF_PARKING",
  "עלות חניה": "PARKING_COSTS",
  "אי יכולת לנצל זמן נסיעה": "WASTED_TRAVEL_TIME",
  "היעדר תחבורה\nציבורית למקום העבודה": "LACK_OF_PUBLIC_TRANSPORT",
  "תדירות תחבורה ציבורית": "PUBLIC_TRANSPORT_FREQUENCY",
  אחר: "OTHER",
};

function TrasnportDifficultiesGraphs({ data }) {
  const datasets = ceateDataset(data);
  const graphData = { labels: Object.keys(labels), datasets };
  return <Bar options={options} data={graphData} />;
}

function ceateDataset(data) {
  let colorList = randomColor({
    luminosity: "light",
    count: data.length,
    format: 'rgba',
    alpha: 0.5,
    seed: 1,
  });
  const datasets = [];
  data.forEach((site, index) => {
    let row = {
      label: `${site.COMPANY} - ${site.COMPOUND}`,
      backgroundColor: colorList[index],
    };
    let data = [];
    Object.entries(labels).forEach(([property, col], pos) => {
      data.push(site[col]);
    });
    row.data = data;
    datasets.push(row);
  });
  return datasets;
}

export default requireAuth(TrasnportDifficultiesGraphs);
