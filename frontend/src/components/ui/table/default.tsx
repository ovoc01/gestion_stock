import { Button, ButtonGroup } from "@nextui-org/button";
import { Chip } from "@nextui-org/react";

type Header = {
   key: string;
   label: string;
   isChip?: boolean
};

type DefaultTableProps = {
   headers: Header[];
   data?: Record<string, any>[];
   chipClassName?: Record<string, string>[];
   isWithPagination?: boolean;
   onNextBtnPress?: () => void;
   onPreviousBtnPress?: () => void;
};

export function DefaultTable({
   headers,
   data,
   isWithPagination,
   chipClassName,
   onNextBtnPress,
   onPreviousBtnPress,
}: DefaultTableProps) {
   return (
      <>
         <table className="min-w-full bg-white border border-gray-300 rounded-lg text-sm">
            <thead className="bg-primary text-white">
               <tr className="text-sm">
                  {headers.map(({ key, label }) => (
                     <th key={key} className="py-3 px-4 text-left">
                        {label}
                     </th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {data?.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                     {headers.map(({ key, isChip }) => (
                        <td key={key} className="py-2 px-4 border-b  text-gray-500" onClick={record.onClick}>
                           {isChip ? (
                              <Chip className={
                                 chipClassName!.find
                                    (chip => chip.key.toLowerCase() === record[key].toLowerCase())?.class || "bg-gray-200 text-gray-700"
                              } size="sm">
                                 {record[key]}
                              </Chip>
                           ) : (
                              record[key]
                           )}
                        </td>
                     ))}
                  </tr>
               ))}
            </tbody>
            {isWithPagination && (
               <tfoot>
                  <tr>
                     <td colSpan={headers.length}>
                        <div className="flex justify-between py-2 px-4">
                           <Button
                              size="sm"
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                              onClick={onPreviousBtnPress}
                           >
                              Précédent
                           </Button>
                           <Button
                              size="sm"
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                              onClick={onNextBtnPress}
                           >
                              Suivant
                           </Button>
                        </div>
                     </td>
                  </tr>
               </tfoot>
            )}
         </table>
         <ButtonGroup className="mt-3" color="primary" variant="flat" size="sm">
            <Button> {'<<'} </Button>
            <Button>Précédent</Button>
            <Button>Suivant</Button>
            <Button> {'>>'} </Button>
         </ButtonGroup>
      </>
   );
}
