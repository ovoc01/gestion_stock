import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const LineGraph = () => {
  const options = {};
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Entrée",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        borderColor: "RGBA(238,116,2,100)",
        backgroundColor: "RGBA(238,116,2,100)",
        tension: 0.1,
      },
      {
        label: "Sortie",
        data: [30, 20, 10, 70, 16, 25, 50],
        fill: true,
        borderColor: "RGBA(107,74,116,100)",
        backgroundColor: "RGBA(107,74,116,100)",
        tension: 0.1,
      },
    ],
  };

  return <Line className="min-w-full" data={data} options={options} />;
};

export default LineGraph;
