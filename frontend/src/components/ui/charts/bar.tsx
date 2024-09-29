import { Bar } from "react-chartjs-2";

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   BarElement,
   Title,
   Tooltip,
   Legend
}
   from 'chart.js'

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   BarElement,
   Title,
   Tooltip,
   Legend
)

const BarGraph = () => {
   const options = {}
   const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
         {
            label: 'Entrée',
            data: [65, 59, 40, 81, 56, 55, 40],
            fill: true,
            borderColor: 'RGBA(0,187,187,100)',
            backgroundColor: 'RGBA(0,187,187,0.4)',
            tension: 0.1
         },
      ]
   }
   return (
      <Bar
         options={options}
         data={data}
         className="min-w-full"
      />
   )
}



export default BarGraph;