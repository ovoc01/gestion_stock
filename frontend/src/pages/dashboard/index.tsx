import { faChevronRight, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";

import ChartBar from "@/components/features/chart-bar";
import CSpinner from "@/components/features/spinner";
import PolarGraph from "@/components/ui/charts/polar";
import StatsCard from "@/components/ui/stats-card";
import { getUtilisateursActiveNumber } from "@/services/api/admin.service";

export default function DashboardPage() {
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUtilisateursActiveNumber()
      .then((data) => {
        setUserCount(data.utilisateurs);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const Index = () => {
    return (
      <div className="w-full flex  h-[100%]  gap-8 py-8">
        <div className=" p-8 border-solid flex flex-col gap-6 h-full w-4/6">
          <div className="w-full flex gap-5 ">
            <StatsCard
              icon={faUsers}
              number={userCount}
              percentage=""
              title="Utilisateur Active"
            />
          </div>
          <Tooltip
            content={
              <Button
                className="rounded-md border-solid border-primary text-primary"
                size="lg"
                variant="light"
              >
                Voirs les détails
              </Button>
            }
            delay={500}
          >
            <div className="w-full flex gap-5 mt-6 cursor-pointer ">
              <ChartBar />
            </div>
          </Tooltip>
          <div className="w-full flex flex-col gap-5 mt-6">
            <div className="w-full flex items-center justify-between">
              <h1 className="text-2xl text-gray-500">
                Historiques de mouvements{" "}
              </h1>
              <h1 className=" text-xl flex items-center text-gray-300 transition cursor-pointer hover:text-primary">
                Voir tout
                <span className="text-md ml-3">
                  <FontAwesomeIcon icon={faChevronRight} />
                </span>
              </h1>
            </div>
          </div>
        </div>
        <div className=" p-8 rounded-lg  w-2/6  flex justify-center ">
          <div className="border-solid border-1  border-gray-300 w-4/5 shadow-lg rounded-lg max-h-[400px]">
            <PolarGraph />
          </div>
        </div>
      </div>
    );
  };

  const renderPage = isLoading ? (
    <CSpinner label="Récuperation de donnée" />
  ) : (
    <Index />
  );

  return renderPage;
}
