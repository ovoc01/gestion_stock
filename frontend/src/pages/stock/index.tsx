
import { getAllEmplacements, getAllMagasins } from "@/services/api/batiment.service"
import { getValorisationStock } from "@/services/api/stock.service"
import { EmplacementDataProps, MagasinDataProps } from "@/types/types"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@nextui-org/button"
import { Input, Select, SelectItem, Selection } from "@nextui-org/react"
import { useEffect, useState } from "react"

export default function ValorisationStock() {
   const [magasins, setMagasins] = useState<MagasinDataProps[] | null>([])
   const [emplacements, setEmplacements] = useState<EmplacementDataProps[] | null>([])
   const [magId, setMagId] = useState<number | null>(null)
   const [emplId, setEmplId] = useState<number | null>(null)
   const [codeArticle, setCodeArticle] = useState<string | null>(null)

   const [valorisationStock, setValorisationStock] = useState<number | null>(null)

   useEffect(() => {
      getAllMagasins({ page: 1, size: 5 }).then((response) => {
         setMagasins(response.magasins)
      }).catch((err) => {
         console.log(err)
      })

      getAllEmplacements({ page: 1, size: 5 })
         .then((response) => {
            setEmplacements(response.emplacements)
         }).catch((err) => {
            console.log(err)
         })
   }, [])

   const handleSearch = () => {
      getValorisationStock(magId!, emplId!, codeArticle!).then((response) => {
         setValorisationStock(response.valorisation)
      })
   }




   return (
      <div className="w-full flex item-center justify-center gap-5">
         <div className="w-2/5 flex flex-col gap-3 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-thin">Valorisation de stock</h1>

            <h1 className="text-small text-default-400 ml-1">
               Magasin
            </h1>
            <div className="flex w-full gap-4">
               <Select
                  variant="bordered"
                  label="Magasin"
                  size="md"
                  // selectionMode="multiple"
                  selectedKeys={magId ? [magId.toString()] : []}
                  onChange={(e) => {
                     setMagId(parseInt(e.target.value))
                  }
                  }


               >
                  {magasins!.map((mag) => (
                     <SelectItem key={mag.magId} value={mag.magId}>
                        {mag.magLi}
                     </SelectItem>
                  ))}
               </Select>
            </div>

            <h1 className="text-small text-default-400 ml-1">
               Emplacments
            </h1>
            <div className="flex w-full gap-4">
               <Select
                  variant="bordered"
                  label="Emplacement"
                  size="md"
                  onChange={(e) => {
                     setEmplId(parseInt(e.target.value))
                     console.log(e.target.value)
                  }}
                  // selectionMode="multiple"

                  selectedKeys={emplId ? [emplId.toString()] : []}


               >
                  {emplacements!.map((emp) => (
                     <SelectItem key={emp.emplId} value={emp.emplId}>
                        {emp.emplLi}
                     </SelectItem>
                  ))}
               </Select>
            </div>

            <h1 className="text-small text-default-400 ml-1">
               Code Article
            </h1>
            <div className="flex w-full gap-4">
               <Input type="text" label="Code Article" isClearable validationBehavior="aria" radius="sm" size="lg" variant="bordered"
                  value={codeArticle!}
                  onChange={(e) => setCodeArticle(e.target.value)}
               />
            </div>

            <div className="w-3/6 mt-5 ">
               <Button color="primary" variant="shadow" size="lg" className="h-[50px] " startContent={
                  <FontAwesomeIcon icon={faSearch} />
               }
                  onPress={handleSearch}
               >
                  Recherchez
               </Button>
            </div>
            <div className="mt-5">
               <h1 className="text-small text-default-400 ml-1">
                  Valorisation de stock
               </h1>
               <h1 className="text-2xl font-bold">
                  {valorisationStock} ar
               </h1>
            </div>
         </div>
      </div>
   )
}