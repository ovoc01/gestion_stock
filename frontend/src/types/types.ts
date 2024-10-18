import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type CSDropdownItemProps = {
   label: string;
   href: string;
   icon?: IconProp
   isDibbled?: boolean;
};



export type MagasinDataProps = {
   magId: number;
   magLi: string;
   magDtCr: string;
   magCom: string;
};

export type UniteDataProps = {
   uniteId: number;
   uniteLi: string;
   uniteAbrv: string
   uniteDtCr: string;
}

export type FamilleDataProps = {
   familleId: number;
   familleLi: string;
   familleRef: string;
   familleDtCr: string;
   famLogRef: string
}

export type SousFamilleDataProps = {
   sousFamId: number;
   sousFamLi: string;
   familleId: number;
   sousFamDtCr: string;
   familleLi: string;
}

export type ServiceExploitantDataProps = {
   serviceId: number;
   serviceLi: string;
   serviceNumBu: number;
   serviceDtCr: string;
}

export type ArticleDataProps = {
   artId: number;
   artRef: string;
   artCd: string;
   artLi: string;
   uniteId: number;
   uniteLi: string;
   sousFamId: number;
   sousFamLi: string;
   serviceId: number;
   serviceLi: string;
   artDtCr: string;
}

export type PeriodeDataProps = {
   periodeId: number;
   periodeLi: string;
   periodeDtDb: string;
   periodeDtFin: string;
   periodeEtat: string;
}

export type UniteOperationnelDataProps = {
   unopId: number;
   unopLi: string;
   unopNumBu: string;
   unopLiNumAff: string;
   unopMdmId: string;
   unopLng?: number;
   unopLtd?: number;
   unopUe: string;
   unopUeLi: string
}

export type EmplacementDataProps = {
   emplId: number;
   emplLi: string;
   emplDtCr: string;
   serviceId: number;
   magId: number;
   magLi: string;
   serviceLi: string;
}

export type UserInfoProps = {
   usrId: number;
   usrNom: string;
   usrPrenom: string;
   usrLogin: string;
   roleLi: string;
   roleId: number;
   usrDtCr: Date;
}

export type RoleDataProps = {
   roleId: number;
   roleLi: string;
}

export interface RowData {
   [key: string]: any; // Les données de ligne peuvent avoir n'importe quelle structure
}

export type RegistrationPayload = {
   username: string,
   password: string,
   nom: string,
   prenom: string,
   roleId: number,
   magAffect?: number[]
   servAffect?: number[]
}


export type MouvementData = {
   cmdeLigneId: number;
   article: string,
   code: string,
   reference: string,
   emplacement: string,
   prixUnitaire: number;
   quantite: number,
   unite: string,
   dateDeMouvement: Date,
   mvtType: number
}

export type CommandeData = {
   cmdeId: number;
   emplId: number;
   unopId: number;
   emplacement: string;
   uniteOperationnel: string;
   lib_commande: string
}

type MagasinInfo = {
   dateCreation: Date,
   niceDate: string
   telephone: string,
   utilisateurs: string,
   nombreEmplacement: number,
   magasin: string
}

type StockDetails = {
   quantite: number,
   article: string,
   emplacement: string,
   code_article: string,
   prixTotal: number,
   cmup: number
}
export type MagasinDetails = {
   info: MagasinInfo
   stocks: StockDetails[]
   valorisations: number
}


export type UserClaims = {
   username: string,
   role: string,
}


export type ValorisationDetails = {
   code_article: string
   article: string
   emplacement: string,
   magasin: string
   sous_famille: string
   quantite: number,
   cmup: number
}


export type CommandeDetails = {
   info: CommandeData,
   details: MouvementData[]
}

export type Livraison = {
   fournisseur: number
   livreur: string,
   cin: string,
   bonLivraison: string,
   dateLivraison: Date,
   dateEcheance: Date,
   bonCommande: string
   dateCommande: Date,
   observation?: string
}