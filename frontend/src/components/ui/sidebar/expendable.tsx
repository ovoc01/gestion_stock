import { faArrowDown, faChevronDown, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Expendable() {
   return <div>

      <div
         className="relative flex h-[calc(100vh-2rem)] w-full max-w-[20rem] flex-col rounded-xl bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
         <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            <div className="relative block w-full">
               <div role="button"
                  className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none bg-blue-gray-50/50 text-start text-blue-gray-700 hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                  <button type="button"
                     className="flex items-center justify-between w-full p-3 font-sans text-xl antialiased font-semibold leading-snug text-left transition-colors border-b-0 select-none border-b-blue-gray-100 text-blue-gray-900 hover:text-blue-gray-900">
                     <div className="grid mr-4 place-items-center">
                        <FontAwesomeIcon icon={faHome} />
                     </div>
                     <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed text-blue-gray-900">
                        Dashboard
                     </p>
                     <span className="ml-4">
                        <FontAwesomeIcon icon={faChevronDown} />
                     </span>
                  </button>
               </div>
               <div className="overflow-hidden">
                  <div className="block w-full py-1 font-sans text-sm antialiased font-light leading-normal text-gray-700">
                     <nav className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal text-blue-gray-700">
                        <div role="button"
                           className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                           <div className="grid mr-4 place-items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                              </svg>
                           </div>
                           Analytics
                        </div>
                        <div role="button"
                           className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                           <div className="grid mr-4 place-items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                              </svg>
                           </div>
                           Reporting
                        </div>
                        <div role="button"
                           className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                           <div className="grid mr-4 place-items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                 stroke="currentColor" aria-hidden="true" className="w-5 h-3">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                              </svg>
                           </div>
                           Projects
                        </div>
                     </nav>
                  </div>
               </div>
            </div>


         </nav>
      </div>



   </div>
}