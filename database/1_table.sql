-- Table: famille
CREATE TABLE famille (
    famille_id SERIAL PRIMARY KEY,
    famille_li varchar(100),
    famille_num_com INTEGER,
    famille_dt_cr TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    famille_dern_mdf TIMESTAMP WITH TIME ZONE,
    fam_log_ref varchar(20) UNIQUE
);

-- Table: sous_famille
CREATE TABLE sous_famille (
    sous_fam_id SERIAL PRIMARY KEY,
    sous_fam_li varchar(250),
    sous_fam_dt_cr TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sous_fam_dern_mdf TIMESTAMP WITH TIME ZONE,
    sous_fam_log_ref char(10),
    famille_id INT REFERENCES famille (famille_id)
);
-- Table: article
CREATE TABLE article (
    art_id SERIAL PRIMARY KEY,
    art_li VARCHAR(250),
    art_ref VARCHAR(100) UNIQUE,
    art_cd VARCHAR(100) UNIQUE,
    art_pu DOUBLE Precision,
    art_qte DOUBLE Precision,
    art_cmp double precision,
    art_dte TIMESTAMP WITH TIME ZONE,
    art_dern_mdf TIMESTAMP WITH TIME ZONE,
    service_id INT,
    sous_famille_id INT REFERENCES sous_famille (sous_fam_id),
    unite_id INT
);

-- Table: unite
CREATE TABLE unite (
    unite_id SERIAL PRIMARY KEY,
    unite_li varchar(50),
    unite_abrv char(5),
    unite_dt_cr TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unite_dern_mdf TIMESTAMP WITH TIME ZONE
);

-- Table: stock_par_emplacement
CREATE TABLE stock_par_emplacement (
    stock_par_empl_id SERIAL PRIMARY KEY,
    empl_id INT,
    periode_id INT REFERENCES periode (periode_id),
    art_id int REFERENCES article (art_id),
    quantite DOUBLE Precision,
    cmup DOUBLE Precision
);

-- Table: article_historique
CREATE TABLE article_historique (
    art_hist_id SERIAL PRIMARY KEY,
    art_hist_li varchar,
    art_hist_cd varchar,
    art_hist_qte INT,
    art_hist_pu DOUBLE Precision,
    art_hist_cmup DOUBLE precision,
    art_hist_dt TIMESTAMP WITH TIME ZONE,
    art_hist_etat INTEGER,
    usr_id INT,
    art_id INT REFERENCES article (art_id)
);

-- Table: emplacement
CREATE TABLE emplacement (
    empl_id SERIAL PRIMARY KEY,
    empl_li varchar(250) UNIQUE,
    empl_lng DOUBLE Precision,
    empl_ltd DOUBLE Precision,
    empl_dt_cr TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    empl_dern_mdf TIMESTAMP WITH TIME ZONE,
    service_id INT,
    mag_id INT
);

-- Table: magasin
CREATE TABLE magasin (
    mag_id SERIAL PRIMARY KEY,
    mag_li varchar(500) UNIQUE,
    mag_com varchar(100),
    mag_dt_cr TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    mag_dern_mdf TIMESTAMP WITH TIME ZONE
);

-- Table: etat_stock
CREATE TABLE etat_stock (
    etat_stock_id SERIAL PRIMARY KEY,
    art_qte DOUBLE precision,
    art_dte DATE,
    art_stock_type INTEGER,
    art_id INT REFERENCES article (art_id),
    famille_id INT REFERENCES famille (famille_id),
    periode_id INT
);

-- Table: periode
CREATE TABLE periode (
    periode_id SERIAL PRIMARY KEY,
    periode_li varchar,
    periode_dt_db DATE,
    periode_dt_fin DATE,
    periode_etat INTEGER
);

-- Table: commande
CREATE TABLE commande (
    cmde_id SERIAL PRIMARY KEY,
    cmde_num INT,
    cmde_dt_cr date default now(),
    cmde_hr_cr TIME WITH TIME ZONE default now(),
    cmde_total DOUBLE Precision,
    empl_id INT REFERENCES emplacement (empl_id),
    unop_id INT
);

-- Table: commande_ligne
CREATE TABLE commande_ligne (
    cmde_ligne_id SERIAL PRIMARY KEY,
    cmde_ligne_qte INT,
    cmde_ligne_pu DOUBLE Precision,
    cmde_ligne_dt TIMESTAMP WITH TIME ZONE,
    art_num_serie varchar,
    art_cmup DOUBLE Precision,
    cmde_ligne_hr TIME WITH TIME ZONE,
    mvt_type INTEGER,
    cmde_id INT REFERENCES commande (cmde_id),
    empl_id INT,
    art_id INT REFERENCES article (art_id),
    fournisseur_id INT,
    periode_id INT REFERENCES periode (periode_id)
);

-- Table: utilisateur
CREATE TABLE utilisateur (
    usr_id SERIAL PRIMARY KEY,
    role_id INT,
    usr_login varchar,
    usr_pwd varchar,
    usr_nom varchar,
    usr_prenom varchar,
    etat int,
    usr_dt_cr TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usr_dt_dern_acc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: service
CREATE TABLE service (
    service_id SERIAL PRIMARY KEY,
    service_li varchar UNIQUE,
    service_num_bu INT,
    service_dt_cr TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    service_dern_mdf TIMESTAMP WITH TIME ZONE
);

-- Table: unite_operationnel
CREATE TABLE unite_operationnel (
    unop_id SERIAL PRIMARY KEY,
    unop_li varchar UNIQUE,
    unop_num_bu INT,
    unop_li_bu varchar,
    unop_li_num_aff varchar,
    unop_ref varchar UNIQUE,
    unop_matrn_id varchar,
    unop_lng DOUBLE precision,
    unop_ltd double precision,
    unop_dt_cr TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unop_dern_mdf TIMESTAMP WITH TIME ZONE
);

-- Table: role
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_li varchar UNIQUE
);

-- Table: fournisseur
CREATE TABLE fournisseur (
    fournisseur_id SERIAL PRIMARY KEY,
    fournisseur_li varchar UNIQUE
);

create table utilisateur_magasin (
    usr_id integer references utilisateur (usr_id),
    mag_id integer references magasin (mag_id),
    depuis date default now(),
    jusqua date,
    CONSTRAINT pk_utilisateur_magasin PRIMARY KEY (usr_id, mag_id)
);

-- Table: travailler_dans
CREATE TABLE travailler_dans (
    usr_id INT,
    service_id INT,
    depuis date default now(),
    jusqua date,
    CONSTRAINT pk_travailler_dans PRIMARY KEY (usr_id, service_id)
);

-- Contraintes de clés étrangères pour les tables
ALTER TABLE article
ADD CONSTRAINT fk_article_service FOREIGN KEY (service_id) REFERENCES service (service_id);

ALTER TABLE article
ADD CONSTRAINT fk_article_unite FOREIGN KEY (unite_id) REFERENCES unite (unite_id);

ALTER TABLE stock_par_emplacement
ADD CONSTRAINT fk_stock_emplacement FOREIGN KEY (empl_id) REFERENCES emplacement (empl_id);

ALTER TABLE article_historique
ADD CONSTRAINT fk_article_historique_utilisateur FOREIGN KEY (usr_id) REFERENCES utilisateur (usr_id);

ALTER TABLE emplacement
ADD CONSTRAINT fk_emplacement_service FOREIGN KEY (service_id) REFERENCES service (service_id);

ALTER TABLE emplacement
ADD CONSTRAINT fk_emplacement_magasin FOREIGN KEY (mag_id) REFERENCES magasin (mag_id);

ALTER TABLE etat_stock
ADD CONSTRAINT fk_etat_stock_periode FOREIGN KEY (periode_id) REFERENCES periode (periode_id);

ALTER TABLE commande
ADD CONSTRAINT fk_commande_unop FOREIGN KEY (unop_id) REFERENCES unite_operationnel (unop_id);

ALTER TABLE commande_ligne
ADD CONSTRAINT fk_commande_ligne_empl FOREIGN KEY (empl_id) REFERENCES emplacement (empl_id);

ALTER TABLE commande_ligne
ADD CONSTRAINT fk_commande_ligne_fournisseur FOREIGN KEY (fournisseur_id) REFERENCES fournisseur (fournisseur_id);

ALTER TABLE utilisateur
ADD CONSTRAINT fk_utilisateur_role FOREIGN KEY (role_id) REFERENCES role (role_id);

ALTER TABLE travailler_dans
ADD CONSTRAINT fk_travailler_dans_utilisateur FOREIGN KEY (usr_id) REFERENCES utilisateur (usr_id);

ALTER TABLE travailler_dans
ADD CONSTRAINT fk_travailler_dans_service FOREIGN KEY (service_id) REFERENCES service (service_id);

ALTER TABLE stock_par_emplacement
ADD CONSTRAINT stock_par_emplacement_art_id_empl_id_key UNIQUE (art_id, empl_id);