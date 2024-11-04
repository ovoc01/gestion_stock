import { UserMagasinAccess } from "@/components/features/access/magasin";
import { UserServiceAccess } from "@/components/features/access/service";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useState } from "react";
export function UserAccessPage() {
   //state
   const [openItems, setOpenItems] = useState(["1"] as string[]); // Default open item

   const handleToggle = (key: string) => {
      setOpenItems((prev: string[]) =>
         prev.includes(key)
            ? prev.filter(item => item !== key) // Close the item if it's already open
            : [...prev, key] // Open the item
      );
   };
   //static data
   const chipClassName = [
      {
         key: 'active',
         class: 'bg-green-100 text-green-600'
      },
      {
         key: 'inactive',
         class: 'bg-red-100 text-red-600'
      },
      {
         key: 'pending',
         class: 'bg-yellow-100 text-yellow-600'
      }
   ]



   return <div className="mt-5 w-full p-5 ">
      <Accordion selectionMode="multiple" defaultValue={openItems} selectedKeys={openItems}>
         <AccordionItem key="1" aria-label="Modification accès magasin" title="Modification accès magasin" onPress={() => handleToggle("1")}>
            <UserMagasinAccess chipClassName={chipClassName} />

         </AccordionItem>
         <AccordionItem key="2" aria-label="Modification accès services" title="Modification accès servcies" onPress={() => handleToggle("2")}>
            <UserServiceAccess chipClassName={chipClassName} />
         </AccordionItem>
      </Accordion>

   </div >
}

