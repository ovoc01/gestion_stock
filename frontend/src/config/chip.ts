import { ChipClassName } from "@/types/config";

export const DEFAULT_CHIP: ChipClassName[] = [
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