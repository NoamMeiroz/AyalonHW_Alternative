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
      text: "מספר עובדים מתאימים לכל פתרון",
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
  "מיקרומוביליטי"   : "BICYCLE",
  "שאטל פנים מתחמי": "COMPOUND_SHUTTLE",
  "שאטלים מטעם העבודה": "WORK_SHUTTLE",
  "Carpool/Vanpool": "CARPOOL",
  "תחבורה ציבורית": "PUBLIC_TRANSPORT",
  "הגעה רגלית": "WALKING",
  "עבודה מרחוק": "WORKING_FROM_HOME",
};

function MatchingSolutionGraphs({ data }) {
  const datasets = countMatchingSolution(data);
  const graphData = { labels: Object.keys(labels), datasets };
  return <Bar options={options} data={graphData} />;
}

export function countMatchingSolution(data) {
  const datasets = [
    {
      label: "פתרון ניידות חלופי",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ];
  data.forEach((employee) => {
    let index = 0;
    for (const property in labels) {
      let solution = `FINAL_${labels[property]}_GRADE`;
      if (employee[solution] && employee[solution] >= 0) {
        datasets[0].data[index] = datasets[0].data[index] + 1;
      }
      index++;
    }
  });
  return datasets;
}



export default requireAuth(MatchingSolutionGraphs);
