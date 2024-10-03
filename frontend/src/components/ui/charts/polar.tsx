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
      labels: [
         'Divers Informatique',
         'Imprimantes',
         'Consommables',
         'Papier',
      ],
      datasets: [
         {
            label: 'Entrée',
            data: [65, 59, 40, 51],
            fill: true,
            borderColor: [
               'rgba(255, 242, 0, 0.3)',
               'rgba(238, 116, 2, 0.3)',
               'rgba(107, 74, 116, 0.4)',
               'rgba(10, 72, 102, 0.5)'
            ],
            backgroundColor: [
               'rgba(255, 242, 0, 0.3)',
               'rgba(238, 116, 2, 0.3)',
               'rgba(107, 74, 116, 0.4)',
               'rgba(10, 72, 102, 0.5)'
            ],
            tension: 0.4
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