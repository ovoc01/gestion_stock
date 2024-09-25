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

insert into unite (unite_li, unite_abrv) values ('Kilogramme', 'kg');

insert into unite (unite_li, unite_abrv) values ('Piece', 'pc');

insert into unite (unite_li, unite_abrv) values ('Litre', 'l');

insert into unite (unite_li, unite_abrv) values ('Carton', 'ct');

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