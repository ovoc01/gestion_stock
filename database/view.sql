create or replace view v_sous_famille_lib as
select sf.sous_fam_id as sousFamId,sf.famille_id as familleId,sf.sous_fam_li as sousFamLi,f.famille_li as familleLi ,sf.sous_fam_dt_cr as sousFamDtCr from sous_famille sf 
join famille f on sf.famille_id = f.famille_id;

create or replace view v_article_lib as
select art_id as artId,
		art_li as artLi,
		art_ref as artRef,
		art_cd as artCd, 
		s.service_li as serviceLi,
		s.service_id as serviceId,
		sf.sous_fam_li as sousFamLi,
		sf.sous_fam_id 	as sousFamId,
		u.unite_li as uniteLi,
		u.unite_id as uniteId,
		coalesce (art_pu,0)as artPu ,
		coalesce (art_cmp,0)as artCmp ,
      coalesce (art_qte,0)as artQte ,
		art_dte
		from article a 
join service s on s.service_id = a.service_id 
join sous_famille sf on sf.sous_fam_id = a.sous_famille_id 
join unite u  on u.unite_id = a.unite_id;


create or replace view v_emplacement_lib as
select e.empl_id as emplId,
e.empl_li as emplLi,
s.service_li as serviceLi,
m.mag_li as magLi,
s.service_id as serviceId,
m.mag_id as magId,
e.empl_dt_cr as emplDtCr
from emplacement e 
join service s on s.service_id = e.service_id 
join magasin m on m.mag_id = e.mag_id;

create or replace view v_utilisateur_lib as
select u.usr_id as usrId,
r.role_li as roleLi,
u.usr_login as usrLogin,
u.usr_nom as usrNom,
u.usr_prenom as usrPrenom,
u.usr_dt_dern_acc as usrDtDernAcc,
u.usr_dt_cr as usrDtCr
from utilisateur u
join "role" r on r.role_id = u.role_id;



create or replace view v_utilisateur_lib_complet as
select u.usr_id as usrId,
r.role_li as roleLi,
r.role_id as roleId,
u.usr_login as usrLogin,
u.usr_pwd as usrPwd,
u.usr_nom as usrNom,
u.usr_prenom as usrPrenom,
u.usr_dt_dern_acc as usrDtDernAcc,
u.usr_dt_cr as usrDtCr
from utilisateur u
join "role" r on r.role_id = u.role_id;


create or replace view v_utilisateur_service as
select s.service_id as service_id,
s.service_li as serviceLi,
u.usr_id as usrId
from utilisateur u 
join travailler_dans td on td.usr_id = u.usr_id 
join service s on s.service_id = td.service_id ;

create or replace view v_utilisateur_magasin as
select 
m.mag_id as magId,
m.mag_li as magLi,
um.depuis as depuis
from utilisateur u 
join utilisateur_magasin um on um.usr_id = u.usr_id
join magasin m on m.mag_id = um.mag_id;