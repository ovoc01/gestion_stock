insert into role (role_li) values ('Administrateur');

insert into role (role_li) values ('Utilisateur Simple');

insert into role (role_li) values ('Super Utilisateur');

insert into
    service (service_li, service_num_bu)
values ('Informatique', 2345023);

insert into
    service (service_li, service_num_bu)
values (
        'Atelier bois et fer',
        2345001
    );

--unite
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Piece', 'pc   ', '2024-09-24 04:21:12.172892 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Carton', 'ct   ', '2024-09-24 04:21:12.173357 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Barre', 'B    ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Feuille', 'FE   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Kilogramme', 'KG   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Sac', 'S    ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Rouleau', 'RO   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Paire', 'PR   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Tonne', 'T    ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Boite', 'BTE  ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ( 'Ensemble', 'ENS  ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Jeu', 'JEU  ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Flacon', 'FL   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Bouteille', 'BL   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Tube', 'TB   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Lot', 'LOT  ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Bidon', 'BD   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Paquet', 'PQ   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Millilitre', 'MI   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Bobine', 'BO   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Mètre cube', 'MCB  ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Mètre carré', 'MCR  ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Pièce', 'PCE  ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Mètre', 'M    ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Unité', 'U    ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Mètre linéaire', 'ML   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Fût', 'FU   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Kilomètre', 'KM   ', '2024-10-07 05:50:42.282700 +00:00');
INSERT INTO public.unite ( unite_li, unite_abrv, unite_dt_cr) VALUES ('Litre', 'L    ', '2024-09-24 04:21:12.173127 +00:00');


insert into
    famille (famille_li, fam_log_ref)
values ('Consommable', 'CO');

insert into
    famille (famille_li, fam_log_ref)
values (
        'Divers Informatique',
        'DIINF'
    );

insert into
    sous_famille (sous_fam_li, famille_id)
values ('Telephone', 2);

insert into
    magasin (mag_li, mag_com)
values (
        'Magasin PK13',
        'Magasin Principal'
    );

insert into magasin (mag_li) values ('Magasin PK14');

insert into magasin (mag_li) values ('Magasin RN13');

insert into magasin (mag_li) values ('Magasin RN1');