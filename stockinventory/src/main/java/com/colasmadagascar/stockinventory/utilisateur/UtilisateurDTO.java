package com.colasmadagascar.stockinventory.utilisateur;

import java.time.LocalDateTime;


public interface UtilisateurDTO {
   Long getUsrId();
   String getUsrLogin();
   String getUsrNom();
   String getUsrPrenom();
   String getRoleLi();
   Long getRoleId();
   String getUsrPwd();
   LocalDateTime getUsrDtCr();
   LocalDateTime getUsrDtDernAcc();
}
