import CrudComponent from "@/components/crudComponents"
import { createMagasin, deleteMagasin, getAllMagasins } from "@/services/api/batiment.service";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { now, getLocalTimeZone ,DateValue} from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";
import { useLocation, useNavigate } from "react-router-dom";

export default function MagasinPage() {
   const [label,setLabel] = useState('')
   const [dateCreation,setDateCreation] = useState<DateValue>(now(getLocalTimeZone()))
   const [commentaire,setCommentaire] = useState('')
   const [isValidLabel,setIsValidLabel] = useState(false)
   const [labelError,setLabelError] = useState('')
   const [isNewRowAdded, setIsNewRowAdded] = useState(false);
   const [totalPage, setTotalPage] = useState<number>();
   
   const location = useLocation();
   const navigate = useNavigate();


   const [data, setData] = useState([]);
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;


   useEffect(() => {
      getAllMagasins({page,size})
         .then((response) => {
            console.table(response)
            setData(response.magasins);
            const realPage = Math.ceil(response.totalPages/size)
            setTotalPage(realPage)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })

   }, [isNewRowAdded,page,size]);


   const columns = [
      {
         key: 'magId',
         label: 'Magasin Id',
         type: 'integer'
      },
      {
         key: 'magLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key: 'magResp',
         label: 'Responsable'
      },
      {
         key: 'magDtCr',
         label: 'Date de création',
      }

   ]



   const onLabelChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value)
   }


   const createNewFamille = async () => {
      if(label === ''){
         setIsValidLabel(true)
         setLabelError('Le libellé est obligatoire')
         return
      }
      console.log(dateCreation)
      await createMagasin(label,dateCreation!.toDate(getLocalTimeZone()),commentaire)
      .then((response)=>{
         toast.success(response.message)
         setIsNewRowAdded(!isNewRowAdded)
         setLabel('')
         setCommentaire('')
         
      })
   };

   const onRowDelete = async (id:number)=> {
      await deleteMagasin(id)
         .then((response)=>{
            toast.success(response.message)
            setIsNewRowAdded(!isNewRowAdded)
         })
   }

   const onPageChange = (page: number) => {
      searchParams.set('page', page.toString());
      searchParams.set('size', size.toString());
      const updatedUrl = `${location.pathname}?${searchParams.toString()}`;

      navigate(updatedUrl)
   }

   return (
      <CrudComponent
         pageTitle="Magasin"
         columns={columns}
         rowsData={data}
         onAdd={createNewFamille}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faWarehouse} />}
         isActionAuthorized
         initialPage={page}
         onPageChange={onPageChange}
         pages={totalPage}
         onRowDelete={onRowDelete}

         addModalContent={
            <div className="w-full flex flex-col justify-center gap-4 align-center min-h-[170px] pb-5">
               <Input type="text" label="Libellé" isRequired isClearable validationBehavior="aria" radius="sm" size="lg" onChange={(e)=>onLabelChange(e)} isInvalid={isValidLabel} errorMessage={labelError}/>
               <DatePicker
                  label="Date de création"
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={dateCreation}
                  radius="sm"
                  size="lg"
                  onChange={(e)=>{
                     console.log(e)
                     setDateCreation(e)
                  }}
               />
               <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Textarea
                     label="Commentaire"
                     onChange={(e)=>setCommentaire(e.target.value)}
                  />
               </div>
            </div>
         }
      />
   )
}
