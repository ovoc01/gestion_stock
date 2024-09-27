import CrudComponent from "@/components/features/crud-components"
import { createArticle, deleteArticle, getAllArticles, getAllSousFamilles, getAllUnite, updateArticle } from "@/services/api/article.service";
import { getAllServiceExploitant } from "@/services/api/service-exploitant.service";
import { ArticleDataProps, ServiceExploitantDataProps, SousFamilleDataProps, UniteDataProps } from "@/types/types";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@nextui-org/input";
import { Divider, Select, SelectItem } from "@nextui-org/react";


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

   const [requestError, setRequestError] = useState<any>(null)


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

   ]




   const resetInput = () => {
      setSousFamId(null)
      setServiceId(null)
      setUniteId(null)
      setLabel('')
      setArtRef('')
      setRowToUpdate(null)
      setRequestError(null)
   }

   const onAdd = () => {

      createArticle(artRef, label, sousFamId!, serviceId!, uniteId!)
         .then(() => {
            setIsNewRowAdded(!isNewRowAdded)
            toast.success('Article ajouté avec succès')
         })
         .catch((error) => {
            if (error.response) {
               if (error.response.status === 400) {
                  setRequestError(error.response.data)
               }
            }
         })

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

   const onRowUpdate = async () => {
      updateArticle(rowToUpdate!, artRef, label, sousFamId!, serviceId!, uniteId!)
         .then((response) => {
            console.log(response)
            setIsNewRowAdded(!isNewRowAdded)
            toast.success('Article modifié avec succès')
         })
         .catch((error) => {
            if (error.response) {
               if (error.response.status === 400) {
                  setRequestError(error.response.data)
               }
            }
         })

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
               <h1 className="text-small text-default-400 ml-1">Service exploitant</h1>
               <Select
                  variant="bordered"

                  label="Services exploitants"
                  onChange={(e) => {
                     setServiceId(parseInt(e.target.value))
                  }}
                  selectedKeys={serviceId ? [serviceId.toString()] : []}
                  isInvalid={requestError?.serviceIdError !== null && requestError?.serviceIdError !== undefined}
                  errorMessage={requestError?.serviceIdError}
               >
                  {serviceExploitants!.map((service) => (
                     <SelectItem key={service.serviceId} value={service.serviceId}>
                        {service.serviceLi}
                     </SelectItem>
                  ))}
               </Select>
               <Divider className="my-2" />
               <h1 className="text-small text-default-400 ml-1">Information du nouvelle article</h1>
               <div className="flex gap-4">
                  <Input value={label} type="text" label="Libellé" validationBehavior="aria" radius="sm"
                     size="md" onChange={(e) => setLabel(e.target.value)}
                     isInvalid={requestError?.artLiError !== null && requestError?.artLiError !== undefined}
                     errorMessage={requestError?.artLiError}
                     variant="bordered"
                  />
                  <Select
                     variant="bordered"

                     label="Unites"
                     onChange={(e) => {
                        setUniteId(parseInt(e.target.value))
                     }}

                     selectedKeys={uniteId ? [uniteId.toString()] : []}
                     isInvalid={requestError?.uniteIdError !== null && requestError?.uniteIdError !== undefined}
                     errorMessage={requestError?.uniteIdError}
                  >
                     {unites!.map((unite) => (
                        <SelectItem key={unite.uniteId} value={unite.uniteId}>
                           {unite.uniteLi}
                        </SelectItem>
                     ))}
                  </Select>
               </div>
               <Select
                  variant="bordered"

                  label="Sous Familles"
                  onChange={(e) => {
                     setSousFamId(parseInt(e.target.value))

                  }}

                  selectedKeys={sousFamId ? [sousFamId.toString()] : []}
                  isInvalid={requestError?.sousFamIdError !== null && requestError?.sousFamIdError !== undefined}
                  errorMessage={requestError?.sousFamIdError}
               >
                  {sousFamilles!.map((sousFam) => (
                     <SelectItem key={sousFam.sousFamId} value={sousFam.sousFamId}>
                        {sousFam.sousFamLi}
                     </SelectItem>
                  ))}
               </Select>




               <Input value={artRef} type="text" label="Reference" validationBehavior="aria" radius="sm"
                  size="md" onChange={(e) => setArtRef(e.target.value)}

               />
            </div>
         }
      />
   )
}
