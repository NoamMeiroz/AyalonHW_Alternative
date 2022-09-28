import React from "react";
import requireAuth from "../requireAuth"; //used to check if login successfull
import Paper from "@mui/material/Paper";

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
      text: "מספר הפעמים בהן כל פתרון הופיע באחד מחמשת הדירוגים המובילים",
    },
    scales: {
        y: {
            type: 'linear',
            min: 0
        }
    }
  },
};

export const labels = {
  "מיקרומוביליטי"   : 0,
  "שאטל פנים מתחמי": 1,
  "שאטלים מטעם העבודה": 2,
  "Carpool/Vanpool": 3,
  "תחבורה ציבורית": 4,
  "הגעה רגלית": 5,
  "עבודה מרחוק": 6,
};

function TopFiveGraphs({ data }) {
  const datasets = countTopSolutions(data);
  const graphData = { labels: Object.keys(labels), datasets };
  return <Paper sx={{width: 700, marginRight: "auto", marginLeft: "auto"}}>
            <Bar options={options} data={graphData} />
        </Paper>
}

export function countTopSolutions(data) {
  const datasets = [
    {
      label: "מקום 1",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "מקום 2",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "מקום 3",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(99, 99, 132, 0.5)",
    },
    {
      label: "מקום 4",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(132, 255, 53, 0.5)",
    },
    {
      label: "מקום 5",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(162, 99, 20, 0.5)",
    },
  ];
  data.forEach((employee) => {
    for (let index = 1; index < 6; index++) {
      let topSolution = `TOP_SOLUTION_${index}`;
      if (employee[topSolution]) {
        datasets[index - 1].data[labels[employee[topSolution]]] =
          datasets[index - 1].data[labels[employee[topSolution]]] + 1;
      }
    }
  });
  return datasets;
}



export default requireAuth(TopFiveGraphs);
