import { DefaultTable } from "@/components/ui/table/default";
import { DEFAULT_CHIP } from "@/config/chip";
import { SIMPLE_USR_MAGASIN } from "@/config/table-column";

export function MagasinPage() {
   //static data
   const chipClassName = DEFAULT_CHIP;
   const columns = SIMPLE_USR_MAGASIN
   return <>
      <DefaultTable
         chipClassName={chipClassName as any}
         headers={columns.map(({ key, label }) => ({
            key,
            label,
            isChip: key === "roleLi", // Assuming roles should be displayed as chips
         }))}
         data={[]}
         isWithPagination={true} // Enable pagination
         onNextBtnPress={() => {
            // Handle next page logic
         }}
         onPreviousBtnPress={() => {
            // Handle previous page logic
         }}
      />
   </>
}