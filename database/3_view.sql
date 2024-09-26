create or replace view v_sous_famille_lib as
select
    sf.sous_fam_id as sousFamId,
    sf.famille_id as familleId,
    sf.sous_fam_li as sousFamLi,
    f.famille_li as familleLi,
    sf.sous_fam_dt_cr as sousFamDtCr
from sous_famille sf
    join famille f on sf.famille_id = f.famille_id;

create or replace view v_article_lib as
select
    art_id as artId,
    art_li as artLi,
    art_ref as artRef,
    art_cd as artCd,
    s.service_li as serviceLi,
    s.service_id as serviceId,
    sf.sous_fam_li as sousFamLi,
    sf.sous_fam_id as sousFamId,
    u.unite_li as uniteLi,
    u.unite_id as uniteId,
    coalesce(art_pu, 0) as artPu,
    coalesce(art_cmp, 0) as artCmp,
    coalesce(art_qte, 0) as artQte,
    art_dte
from
    article a
    join service s on s.service_id = a.service_id
    join sous_famille sf on sf.sous_fam_id = a.sous_famille_id
    join unite u on u.unite_id = a.unite_id;

create or replace view v_emplacement_lib as
select
    e.empl_id as emplId,
    e.empl_li as emplLi,
    s.service_li as serviceLi,
    m.mag_li as magLi,
    s.service_id as serviceId,
    m.mag_id as magId,
    e.empl_dt_cr as emplDtCr
from
    emplacement e
    join service s on s.service_id = e.service_id
    join magasin m on m.mag_id = e.mag_id;

create or replace view v_utilisateur_lib as
select
    u.usr_id as usrId,
    r.role_li as roleLi,
    u.usr_login as usrLogin,
    u.usr_nom as usrNom,
    u.usr_prenom as usrPrenom,
    u.usr_dt_dern_acc as usrDtDernAcc,
    u.usr_dt_cr as usrDtCr
from utilisateur u
    join "role" r on r.role_id = u.role_id;

create or replace view v_utilisateur_lib_complet as
select
    u.usr_id as usrId,
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
select
    s.service_id as service_id,
    s.service_li as serviceLi,
    u.usr_id as usrId
from
    utilisateur u
    join travailler_dans td on td.usr_id = u.usr_id
    join service s on s.service_id = td.service_id;

create or replace view v_utilisateur_magasin as
select m.mag_id as magId, m.mag_li as magLi, um.depuis as depuis
from
    utilisateur u
    join utilisateur_magasin um on um.usr_id = u.usr_id
    join magasin m on m.mag_id = um.mag_id;

create or replace view v_stock_emplacement_initial as
SELECT e.empl_id, a.art_id, p.periode_id, 0 as cmup, 0 as quantite
FROM emplacement e
    CROSS JOIN article a
    cross join periode p
where
    periode_etat = 0
    and e.service_id = a.service_id;

create or replace view v_stock_par_emplacement as
select
    empl_id,
    art_id,
    periode_id,
    cmup,
    quantite
from stock_par_emplacement
union all
select *
from v_stock_emplacement_initial;

create or replace view v_emplacement_authorise_utilisateur
SELECT u.usr_id, u.usr_nom, e.empl_id, e.empl_li, td.depuis, td.jusqua
FROM
    travailler_dans td
    JOIN utilisateur u ON td.usr_id = u.usr_id
    JOIN emplacement e ON e.service_id = td.service_id;

create or replace view v_stock_par_emplacement_final as
SELECT
    empl_id,
    art_id,
    periode_id,
    MAX(cmup) as cmup,
    SUM(quantite) as quantite
FROM v_stock_par_emplacement
GROUP BY
    empl_id,
    art_id,
    periode_id;

create or replace view v_stock_par_emplacement_final_lib as
SELECT
    m.mag_id AS magid,
    m.mag_li AS magasin,
    e.empl_id AS emplid,
    e.empl_li AS emplacement,
    p.periode_id AS periodeid,
    p.periode_li AS periode,
    sf.famille_id AS familleid,
    sf.sous_fam_id AS sousfamilleid,
    sf.sous_fam_li AS sous_famille,
    a.art_id as artid,
    a.art_li AS article,
    a.art_cd AS code_article,
    sum(vtpef.quantite) AS quantite,
    max(vtpef.cmup) AS cmup
FROM
    v_stock_par_emplacement_final vtpef
    JOIN periode p ON vtpef.periode_id = p.periode_id
    JOIN article a ON vtpef.art_id = a.art_id
    JOIN emplacement e ON vtpef.empl_id = e.empl_id
    JOIN magasin m ON m.mag_id = e.mag_id
    JOIN sous_famille sf ON sf.sous_fam_id = a.sous_famille_id
GROUP BY
    a.art_li,
    p.periode_li,
    e.empl_li,
    m.mag_li,
    a.art_cd,
    sf.sous_fam_li,
    e.empl_id,
    m.mag_id,
    p.periode_id,
    sf.sous_fam_id,
    sf.famille_id,
    a.art_id;