
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type StatsCardProps = {
   title: string,
   icon?: IconProp,
   percentage?: string,
   number: number,
}

const colors = {
   colaYellow: 'rgba(255, 242, 0, 1)',
   colaBlack: 'rgba(29, 29, 29, 1)',
   colaWhite: 'rgba(255, 255, 255, 1)',
   colaBlueF: 'rgba(10, 72, 102, 1)',
   colaBlueF20: 'rgba(10, 72, 102, 0.2)',
   colaBlueC: 'rgba(160, 200, 216, 1)',
   colaGreen: 'rgba(192, 206, 46, 1)',
   colaVioletF: 'rgba(107, 74, 116, 1)',
   colaTurquoise: 'rgba(0, 187, 187, 1)',
   colaPrune: 'rgba(192, 17, 111, 1)',
   colaOrange: 'rgba(238, 116, 2, 1)',
   colaGrayP: 'rgba(202, 202, 202, 1)',
};

export default function StatsCard({ title, percentage, number, icon }: StatsCardProps) {
   return (
      <div
         className="flex flex-col justify-around rounded-lg shadow-md w-[250px] h-[140px] p-8 cursor-pointer"
         style={{
            backgroundColor: colors.colaWhite,
            border: `1px solid ${colors.colaGrayP}`, // Example using a color from the palette
         }}
      >
         <div className="flex justify-between font-semibold text-xl items-center">
            <span className="text-colaBlueF">{title}</span>
            <button
               className="rounded-full p-2"
               style={{ backgroundColor: colors.colaBlueF20 }}
            >
               <FontAwesomeIcon icon={icon!} style={{ color: colors.colaBlueF }} />
            </button>
         </div>
         <div className="flex justify-between items-center mt-4">
            <span className="text-5xl font-bold text-colaBlueF italic">
               {number}
            </span>
            <span className="text-md text-colaBlueF mt-5 italic">
               {percentage}
            </span>
         </div>
      </div>
   );
}