import { Button } from "@nextui-org/react";

import BarGraph from "../ui/charts/bar";

export default function ChartBar() {
  return (
    <div className="border-solid border-1  border-gray-300 flex flex-col gap-8 w-full shadow-lg  p-4 rounded-md">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl text-gray-500">Statistiques de mouvements </h1>
        <div className="flex gap-5">
          <Button
            className="rounded-md border-solid border-primary text-primary"
            size="lg"
            variant="ghost"
          >
            Semaine
          </Button>
          <Button
            className="rounded-md text-background"
            color="primary"
            size="lg"
          >
            Mois
          </Button>
          <Button
            className="rounded-md border-solid border-primary text-primary"
            size="lg"
            variant="ghost"
          >
            Trimestre
          </Button>
        </div>
      </div>
      <div className=" rounded-md flex w-4/5 ">
        <BarGraph />
      </div>
    </div>
  );
}
