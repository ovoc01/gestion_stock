import { PolarArea } from "react-chartjs-2";

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   PolarAreaController,
   Title,
   Tooltip,
   Legend
}
   from 'chart.js/auto'


ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   PolarAreaController,
   Title,
   Tooltip,
   Legend
)

const PolarGraph = () => {
   
   const options = {}
   const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
         {
            label: 'Entrée',
            data: [65, 59, 40, 81, 56, 55, 40],
            fill: true,
            borderColor: 'RGBA(255,242,0,100)',
            backgroundColor: 'RGBA(255,242,0,0.6)',
            tension: 0.1
         },
         {
            label: 'Entrée',
            data: [65, 59, 80, 81, 30, 55, 40],
            fill: true,
            borderColor: 'RGBA(10,72,102,1)',
            backgroundColor: 'RGBA(10,72,102,0.6)',
            tension: 0.1
         },
      ]
   }
   return (
      <PolarArea id="polar"
         options={options}
         data={data}
         className="min-w-full"
      />
   )
}



export default PolarGraph;