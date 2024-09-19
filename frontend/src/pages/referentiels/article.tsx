import CrudComponent from "@/components/crudComponents"
import { createArticle, deleteArticle, getAllArticles, getAllSousFamilles, getAllUnite, updateArticle } from "@/services/api/article.service";
import { getAllServiceExploitant } from "@/services/api/serviceExploitant.service";
import { ArticleDataProps, ServiceExploitantDataProps, SousFamilleDataProps, UniteDataProps } from "@/types/types";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/react";


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function ArticlePage() {
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;
   const [isNewRowAdded, setIsNewRowAdded] = useState(false);
   const [sousFamId, setSousFamId] = useState<number | null>(null)
   const [serviceId, setServiceId] = useState<number | null>(null)
   const [uniteId, setUniteId] = useState<number | null>(null)
   const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);
   const navigate = useNavigate();

   const [label, setLabel] = useState('')
   const [artRef, setArtRef] = useState('')

   const [sousFamilles, setSousFamilles] = useState<SousFamilleDataProps[] | null>([]);
   const [serviceExploitants, setServiceExploitants] = useState<ServiceExploitantDataProps[] | null>([])
   const [unites, setUnites] = useState<UniteDataProps[] | null>([])
   const [data, setData] = useState<ArticleDataProps[] | null>([])


   useEffect(() => {
      getAllArticles({ page, size })
         .then((response) => {
            setData(response.articles)

         })
   }, [isNewRowAdded, page, size])


   useEffect(() => {
      getAllSousFamilles({ page, size })
         .then((response) => {
            setSousFamilles(response.sousFamilles);

         }
         )

      getAllServiceExploitant({ page, size })
         .then((response) => {
            setServiceExploitants(response.serviceExploitants)
         })


      getAllUnite({ page, size })
         .then((response) => {
            setUnites(response.unites);
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })

   }, []);

   useEffect(() => {
      if (rowToUpdate) {
         
         const row = data!.find((row: ArticleDataProps) => row.artId === rowToUpdate)
         console.log(row)
         if (row) {
            setLabel(row.artLi.trim())
            setArtRef(row.artRef?.trim())
            setSousFamId(row.sousFamId)
            setServiceId(row.serviceId)
            setUniteId(row.uniteId)
         }
      }
   }, [rowToUpdate])


   const columns = [
      {
         key: 'artId',
         label: 'Article Id',
         type: 'integer'
      },
      {
         key: 'artRef',
         label: 'Reference',
         type: 'string'
      },
      {
         key: 'artCd',
         label: 'Code'
      },
      {
         key: 'artLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key: 'sousFamLi',
         label: 'Sous Famille'
      },
      {
         key: 'artPu',
         label: 'Prix unitaire'
      },
      {
         key: 'artQte',
         label: 'Quantité en Stock'
      },
      {
         key: 'artCmp',
         label: 'CMUP'
      },
      {
         key: 'artDtCr',
         label: 'Date de création',
      }

   ]




   const resetInput = () => {
      setSousFamId(null)
      setServiceId(null)
      setUniteId(null)
      setLabel('')
      setArtRef('')
      setRowToUpdate(null)
   }

   const onAdd = () => {
      if (sousFamId && serviceId && uniteId && label && artRef) {
         createArticle(artRef, label, sousFamId!, serviceId!, uniteId!)
            .then(() => {
               setIsNewRowAdded(!isNewRowAdded)
               toast.success('Article ajouté avec succès')
            })
      } else {
         toast.error('Veuillez remplir tous les champs')
      }
   };

   const onRowDelete = async (id: number) => {
      await deleteArticle(id)
         .then((response) => {
            console.log(response)
            setIsNewRowAdded(!isNewRowAdded)
            toast.success('Article supprimé avec succès')
         })
   }

   const onPageChange = (page: number) => {
      searchParams.set('page', page.toString());
      searchParams.set('size', size.toString());
      const updatedUrl = `${location.pathname}?${searchParams.toString()}`;
      
      navigate(updatedUrl)
   }


   const onRowUpdate = async() => {
      if (sousFamId && serviceId && uniteId && label && artRef) {
         updateArticle(rowToUpdate!, artRef, label, sousFamId!, serviceId!, uniteId!)
         .then((response) => {
            console.log(response)
            setIsNewRowAdded(!isNewRowAdded)
            toast.success('Article modifié avec succès')
         })
      } else {
         toast.error('Veuillez remplir tous les champs')
      }

   }

   return (
      <CrudComponent
         pageTitle="Article"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         onAdd={onAdd}
         onSearch={() => { }}
         dataAbbreviation="art"
         pageIcon={<FontAwesomeIcon icon={faNewspaper} />}
         resetInput={resetInput}
         onRowDelete={onRowDelete}
         onRowUpdate={onRowUpdate}
         onPageChange={onPageChange}
         setRowToUpdate={setRowToUpdate}
         isDeleteAuthorized
         isUpdateAuthorized

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">
               <Select
                  variant="bordered"

                  label="Sous Familles"
                  onChange={(e) => {
                     setSousFamId(parseInt(e.target.value))

                  }}

                  selectedKeys={sousFamId ? [sousFamId.toString()] : []}
               >
                  {sousFamilles!.map((sousFam) => (
                     <SelectItem key={sousFam.sousFamId} value={sousFam.sousFamId}>
                        {sousFam.sousFamLi}
                     </SelectItem>
                  ))}
               </Select>
               <Select
                  variant="bordered"

                  label="Services exploitants"
                  onChange={(e) => {
                     setServiceId(parseInt(e.target.value))
                  }}
                  selectedKeys={serviceId? [serviceId.toString()] : []}
               >
                  {serviceExploitants!.map((service) => (
                     <SelectItem key={service.serviceId} value={service.serviceId}>
                        {service.serviceLi}
                     </SelectItem>
                  ))}
               </Select>
               <Select
                  variant="bordered"

                  label="Unites"
                  onChange={(e) => {
                     setUniteId(parseInt(e.target.value))
                  }}

                  selectedKeys={uniteId ? [uniteId.toString()] : []}
               >
                  {unites!.map((unite) => (
                     <SelectItem key={unite.uniteId} value={unite.uniteId}>
                        {unite.uniteLi}
                     </SelectItem>
                  ))}
               </Select>
               <Input value={label} type="text" label="Libellé" validationBehavior="aria" radius="sm" size="md" onChange={(e) => setLabel(e.target.value)} />
               <Input value={artRef} type="text" label="Reference" validationBehavior="aria" radius="sm" size="md" onChange={(e) => setArtRef(e.target.value)} />
            </div>
         }
      />
   )
}
