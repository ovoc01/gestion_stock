--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13
-- Dumped by pg_dump version 14.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: fun_get_valorisation(bigint, bigint, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fun_get_valorisation(mag_id bigint DEFAULT NULL::bigint, empl_id bigint DEFAULT NULL::bigint, search_code character varying DEFAULT NULL::character varying) RETURNS double precision
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN (SELECT COALESCE(SUM(quantite * cmup), 0.0) AS valeur
            FROM v_stock_par_emplacement_final_lib
            WHERE (mag_id IS NULL OR magid = mag_id)
              AND (empl_id IS NULL OR emplid = empl_id)
              AND (search_code IS NULL OR code_article LIKE '%' || search_code || '%'));
END;
$$;


ALTER FUNCTION public.fun_get_valorisation(mag_id bigint, empl_id bigint, search_code character varying) OWNER TO postgres;

--
-- Name: fun_get_valorisation_details(bigint, bigint, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fun_get_valorisation_details(p_mag_id bigint DEFAULT NULL::bigint, p_empl_id bigint DEFAULT NULL::bigint, p_search_code character varying DEFAULT NULL::character varying) RETURNS TABLE(magid integer, magasin character varying, emplid integer, emplacement character varying, periodeid integer, periode character varying, familleid integer, sousfamilleid integer, sous_famille character varying, artid integer, article character varying, code_article character varying, quantite double precision, cmup double precision)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
        SELECT m.mag_id            AS magid,
               m.mag_li            AS magasin,
               e.empl_id           AS emplid,
               e.empl_li           AS emplacement,
               p.periode_id        AS periodeid,
               p.periode_li        AS periode,
               sf.famille_id       AS familleid,
               sf.sous_fam_id      AS sousfamilleid,
               sf.sous_fam_li      AS sous_famille,
               a.art_id            AS artid,
               a.art_li            AS article,
               a.art_cd            AS code_article,
               SUM(vtpef.quantite) AS quantite,
               MAX(vtpef.cmup)     AS cmup
        FROM v_stock_par_emplacement_final vtpef
                 JOIN periode p ON vtpef.periode_id = p.periode_id
                 JOIN article a ON vtpef.art_id = a.art_id
                 JOIN emplacement e ON vtpef.empl_id = e.empl_id
                 JOIN magasin m ON m.mag_id = e.mag_id
                 JOIN sous_famille sf ON sf.sous_fam_id = a.sous_famille_id
        WHERE (p_mag_id IS NULL OR m.mag_id = p_mag_id)
          AND (p_empl_id IS NULL OR e.empl_id = p_empl_id)
          AND (p_search_code IS NULL OR a.art_cd LIKE '%' || p_search_code || '%')
        GROUP BY a.art_li, p.periode_li, e.empl_li, m.mag_li, a.art_cd,
                 sf.sous_fam_li, e.empl_id, m.mag_id, p.periode_id,
                 sf.sous_fam_id, sf.famille_id, a.art_id;
END;
$$;


ALTER FUNCTION public.fun_get_valorisation_details(p_mag_id bigint, p_empl_id bigint, p_search_code character varying) OWNER TO postgres;

--
-- Name: p_traiter_entree(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.p_traiter_entree() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_cmup double precision;
    new_qte double precision;
BEGIN
    -- Calculate the new CMUP only once, handling potential division by zero
    SELECT
            (spe.quantite * spe.cmup + NEW.cmde_ligne_qte * NEW.cmde_ligne_pu) / (spe.quantite + NEW.cmde_ligne_qte)
    INTO new_cmup
    FROM v_stock_par_emplacement spe
    WHERE spe.art_id = NEW.art_id AND spe.empl_id = NEW.empl_id and spe.periode_id = NEW.periode_id;

    SELECT (spe.quantite + NEW.cmde_ligne_qte)
    INTO new_qte
    FROM v_stock_par_emplacement spe
    WHERE spe.art_id = NEW.art_id AND spe.empl_id = NEW.empl_id and spe.periode_id = NEW.periode_id;

    update commande_ligne set art_cmup=new_cmup where cmde_ligne_id=NEW.cmde_ligne_id;
    
    INSERT INTO stock_par_emplacement (art_id, empl_id,periode_id,cmup, quantite)
    VALUES (NEW.art_id, NEW.empl_id, new.periode_id,new_cmup, new_qte)
    ON CONFLICT (art_id, empl_id,periode_id) DO UPDATE
        SET cmup = new_cmup,
            quantite = new_qte;
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.p_traiter_entree() OWNER TO postgres;

--
-- Name: p_traiter_sortie(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.p_traiter_sortie() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_qte double precision;
    new_cmup double precision;
BEGIN
    -- Calculate the new CMUP only once, handling potential division by zero


    SELECT (spe.quantite - NEW.cmde_ligne_qte)
    INTO new_qte
    FROM v_stock_par_emplacement spe
    WHERE spe.art_id = NEW.art_id AND spe.empl_id = NEW.empl_id and spe.periode_id = NEW.periode_id;

    SELECT (spe.cmup)
    INTO new_cmup
    FROM v_stock_par_emplacement spe
    WHERE spe.art_id = NEW.art_id AND spe.empl_id = NEW.empl_id and spe.periode_id = NEW.periode_id;
    
    
    update commande_ligne set cmde_ligne_pu= new_cmup where cmde_ligne_id=new.cmde_ligne_id;

    -- Update cmde_ligne with the calculated CMUP
    INSERT INTO stock_par_emplacement (art_id, empl_id,periode_id, quantite)
    VALUES (NEW.art_id, NEW.empl_id, new.periode_id,new_qte)
    ON CONFLICT (art_id, empl_id,periode_id) DO UPDATE
        SET quantite = new_qte;
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.p_traiter_sortie() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.article (
    art_id integer NOT NULL,
    art_li character varying(250),
    art_ref character varying(100),
    art_cd character varying(100),
    art_pu double precision,
    art_qte double precision,
    art_cmp double precision,
    art_dte timestamp with time zone,
    art_dern_mdf timestamp with time zone,
    service_id integer,
    sous_famille_id integer,
    unite_id integer,
    fam_id integer
);


ALTER TABLE public.article OWNER TO postgres;

--
-- Name: article_art_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.article_art_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.article_art_id_seq OWNER TO postgres;

--
-- Name: article_art_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.article_art_id_seq OWNED BY public.article.art_id;


--
-- Name: article_historique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.article_historique (
    art_hist_id integer NOT NULL,
    art_hist_li character varying,
    art_hist_cd character varying,
    art_hist_qte integer,
    art_hist_pu double precision,
    art_hist_cmup double precision,
    art_hist_dt timestamp with time zone,
    art_hist_etat integer,
    usr_id integer,
    art_id integer
);


ALTER TABLE public.article_historique OWNER TO postgres;

--
-- Name: article_historique_art_hist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.article_historique_art_hist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.article_historique_art_hist_id_seq OWNER TO postgres;

--
-- Name: article_historique_art_hist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.article_historique_art_hist_id_seq OWNED BY public.article_historique.art_hist_id;


--
-- Name: commande; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commande (
    cmde_id integer NOT NULL,
    cmde_num integer,
    cmde_dt_cr date DEFAULT now(),
    cmde_hr_cr time with time zone DEFAULT now(),
    cmde_total double precision,
    empl_id integer,
    unop_id integer,
    periode_id integer
);


ALTER TABLE public.commande OWNER TO postgres;

--
-- Name: commande_cmde_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commande_cmde_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.commande_cmde_id_seq OWNER TO postgres;

--
-- Name: commande_cmde_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commande_cmde_id_seq OWNED BY public.commande.cmde_id;


--
-- Name: commande_ligne; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commande_ligne (
    cmde_ligne_id integer NOT NULL,
    cmde_ligne_qte integer,
    cmde_ligne_pu double precision,
    cmde_ligne_dt date DEFAULT now(),
    art_num_serie character varying,
    art_cmup double precision,
    cmde_ligne_hr time without time zone DEFAULT now(),
    mvt_type integer,
    cmde_id integer,
    empl_id integer,
    art_id integer,
    fournisseur_id integer,
    periode_id integer,
    cmde_bc character varying
);


ALTER TABLE public.commande_ligne OWNER TO postgres;

--
-- Name: commande_ligne_cmde_ligne_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commande_ligne_cmde_ligne_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.commande_ligne_cmde_ligne_id_seq OWNER TO postgres;

--
-- Name: commande_ligne_cmde_ligne_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commande_ligne_cmde_ligne_id_seq OWNED BY public.commande_ligne.cmde_ligne_id;


--
-- Name: emplacement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emplacement (
    empl_id integer NOT NULL,
    empl_li character varying(250),
    empl_lng double precision,
    empl_ltd double precision,
    empl_dt_cr timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    empl_dern_mdf timestamp with time zone,
    service_id integer,
    mag_id integer
);


ALTER TABLE public.emplacement OWNER TO postgres;

--
-- Name: emplacement_empl_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emplacement_empl_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.emplacement_empl_id_seq OWNER TO postgres;

--
-- Name: emplacement_empl_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emplacement_empl_id_seq OWNED BY public.emplacement.empl_id;


--
-- Name: etat_stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etat_stock (
    etat_stock_id integer NOT NULL,
    art_qte double precision,
    art_dte date,
    art_stock_type integer,
    art_id integer,
    famille_id integer,
    periode_id integer
);


ALTER TABLE public.etat_stock OWNER TO postgres;

--
-- Name: etat_stock_etat_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.etat_stock_etat_stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.etat_stock_etat_stock_id_seq OWNER TO postgres;

--
-- Name: etat_stock_etat_stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.etat_stock_etat_stock_id_seq OWNED BY public.etat_stock.etat_stock_id;


--
-- Name: famille; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.famille (
    famille_id integer NOT NULL,
    famille_li character varying(100),
    famille_num_com integer,
    famille_dt_cr timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    famille_dern_mdf timestamp with time zone,
    fam_log_ref character varying(20)
);


ALTER TABLE public.famille OWNER TO postgres;

--
-- Name: famille_famille_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.famille_famille_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.famille_famille_id_seq OWNER TO postgres;

--
-- Name: famille_famille_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.famille_famille_id_seq OWNED BY public.famille.famille_id;


--
-- Name: fournisseur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fournisseur (
    fournisseur_id integer NOT NULL,
    fournisseur_li character varying
);


ALTER TABLE public.fournisseur OWNER TO postgres;

--
-- Name: fournisseur_fournisseur_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fournisseur_fournisseur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.fournisseur_fournisseur_id_seq OWNER TO postgres;

--
-- Name: fournisseur_fournisseur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fournisseur_fournisseur_id_seq OWNED BY public.fournisseur.fournisseur_id;


--
-- Name: magasin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.magasin (
    mag_id integer NOT NULL,
    mag_li character varying(500),
    mag_com character varying(100),
    mag_dt_cr timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    mag_dern_mdf timestamp with time zone
);


ALTER TABLE public.magasin OWNER TO postgres;

--
-- Name: magasin_mag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.magasin_mag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.magasin_mag_id_seq OWNER TO postgres;

--
-- Name: magasin_mag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.magasin_mag_id_seq OWNED BY public.magasin.mag_id;


--
-- Name: periode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.periode (
    periode_id integer NOT NULL,
    periode_li character varying,
    periode_dt_db date,
    periode_dt_fin date,
    periode_etat integer
);


ALTER TABLE public.periode OWNER TO postgres;

--
-- Name: periode_periode_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.periode_periode_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.periode_periode_id_seq OWNER TO postgres;

--
-- Name: periode_periode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.periode_periode_id_seq OWNED BY public.periode.periode_id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    role_id integer NOT NULL,
    role_li character varying
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_role_id_seq OWNER TO postgres;

--
-- Name: role_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_role_id_seq OWNED BY public.role.role_id;


--
-- Name: service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service (
    service_id integer NOT NULL,
    service_li character varying,
    service_num_bu integer,
    service_dt_cr timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    service_dern_mdf timestamp with time zone
);


ALTER TABLE public.service OWNER TO postgres;

--
-- Name: service_service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_service_id_seq OWNER TO postgres;

--
-- Name: service_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_service_id_seq OWNED BY public.service.service_id;


--
-- Name: sous_famille; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sous_famille (
    sous_fam_id integer NOT NULL,
    sous_fam_li character varying(250),
    sous_fam_dt_cr timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    sous_fam_dern_mdf timestamp with time zone,
    famille_id integer,
    sous_fam_log_ref character varying(10)
);


ALTER TABLE public.sous_famille OWNER TO postgres;

--
-- Name: sous_famille_sous_fam_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sous_famille_sous_fam_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sous_famille_sous_fam_id_seq OWNER TO postgres;

--
-- Name: sous_famille_sous_fam_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sous_famille_sous_fam_id_seq OWNED BY public.sous_famille.sous_fam_id;


--
-- Name: stock_par_emplacement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_par_emplacement (
    stock_par_empl_id integer NOT NULL,
    empl_id integer,
    art_id integer,
    quantite double precision,
    cmup double precision,
    periode_id integer
);


ALTER TABLE public.stock_par_emplacement OWNER TO postgres;

--
-- Name: stock_par_emplacement_stock_par_empl_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_par_emplacement_stock_par_empl_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_par_emplacement_stock_par_empl_id_seq OWNER TO postgres;

--
-- Name: stock_par_emplacement_stock_par_empl_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_par_emplacement_stock_par_empl_id_seq OWNED BY public.stock_par_emplacement.stock_par_empl_id;


--
-- Name: travailler_dans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.travailler_dans (
    usr_id integer NOT NULL,
    service_id integer NOT NULL,
    depuis date DEFAULT now(),
    jusqua date
);


ALTER TABLE public.travailler_dans OWNER TO postgres;

--
-- Name: unite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unite (
    unite_id integer NOT NULL,
    unite_li character varying(50),
    unite_abrv character(5),
    unite_dt_cr timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    unite_dern_mdf timestamp with time zone
);


ALTER TABLE public.unite OWNER TO postgres;

--
-- Name: unite_operationnel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unite_operationnel (
    unop_id integer NOT NULL,
    unop_li character varying,
    unop_num_bu character varying(30),
    unop_li_num_aff character varying,
    unop_ref character varying,
    unop_mdm_id character varying,
    unop_lng double precision,
    unop_ltd double precision,
    unop_dt_cr timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    unop_dern_mdf timestamp with time zone,
    unop_ue character varying(10),
    unop_ue_li character varying(150)
);


ALTER TABLE public.unite_operationnel OWNER TO postgres;

--
-- Name: unite_operationnel_unop_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unite_operationnel_unop_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unite_operationnel_unop_id_seq OWNER TO postgres;

--
-- Name: unite_operationnel_unop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unite_operationnel_unop_id_seq OWNED BY public.unite_operationnel.unop_id;


--
-- Name: unite_unite_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unite_unite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unite_unite_id_seq OWNER TO postgres;

--
-- Name: unite_unite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unite_unite_id_seq OWNED BY public.unite.unite_id;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    usr_id integer NOT NULL,
    role_id integer,
    usr_login character varying,
    usr_pwd character varying,
    usr_nom character varying,
    usr_prenom character varying,
    etat integer,
    usr_dt_cr timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    usr_dt_dern_acc timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: utilisateur_magasin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur_magasin (
    usr_id integer NOT NULL,
    mag_id integer NOT NULL,
    depuis date DEFAULT now(),
    jusqua date
);


ALTER TABLE public.utilisateur_magasin OWNER TO postgres;

--
-- Name: utilisateur_usr_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_usr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilisateur_usr_id_seq OWNER TO postgres;

--
-- Name: utilisateur_usr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_usr_id_seq OWNED BY public.utilisateur.usr_id;


--
-- Name: v_article_lib; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_article_lib AS
 SELECT a.art_id AS artid,
    a.art_li AS artli,
    a.art_ref AS artref,
    a.art_cd AS artcd,
    s.service_li AS serviceli,
    s.service_id AS serviceid,
    sf.sous_fam_li AS sousfamli,
    sf.sous_fam_id AS sousfamid,
    u.unite_li AS uniteli,
    u.unite_id AS uniteid,
    COALESCE(a.art_pu, (0)::double precision) AS artpu,
    COALESCE(a.art_cmp, (0)::double precision) AS artcmp,
    COALESCE(a.art_qte, (0)::double precision) AS artqte,
    a.art_dte
   FROM (((public.article a
     JOIN public.service s ON ((s.service_id = a.service_id)))
     JOIN public.sous_famille sf ON ((sf.sous_fam_id = a.sous_famille_id)))
     JOIN public.unite u ON ((u.unite_id = a.unite_id)));


ALTER TABLE public.v_article_lib OWNER TO postgres;

--
-- Name: v_commande_lib; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_commande_lib AS
 SELECT c.cmde_id AS cmdeid,
    c.cmde_num AS cmdenum,
    c.empl_id AS emplid,
    c.unop_id AS unopid,
    e.empl_li AS emplacement,
    uo.unop_li AS uniteoperationnel,
    concat(e.empl_li, ' Vers ', uo.unop_li) AS lib_commande
   FROM ((public.commande c
     JOIN public.emplacement e ON ((e.empl_id = c.empl_id)))
     JOIN public.unite_operationnel uo ON ((c.unop_id = uo.unop_id)));


ALTER TABLE public.v_commande_lib OWNER TO postgres;

--
-- Name: v_emplacement_authorise_utilisateur; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_emplacement_authorise_utilisateur AS
 SELECT u.usr_id,
    u.usr_nom,
    e.empl_id,
    e.empl_li,
    td.depuis,
    td.jusqua
   FROM ((public.travailler_dans td
     JOIN public.utilisateur u ON ((td.usr_id = u.usr_id)))
     JOIN public.emplacement e ON ((e.service_id = td.service_id)));


ALTER TABLE public.v_emplacement_authorise_utilisateur OWNER TO postgres;

--
-- Name: v_emplacement_lib; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_emplacement_lib AS
 SELECT e.empl_id AS emplid,
    e.empl_li AS emplli,
    s.service_li AS serviceli,
    m.mag_li AS magli,
    s.service_id AS serviceid,
    m.mag_id AS magid,
    e.empl_dt_cr AS empldtcr
   FROM ((public.emplacement e
     JOIN public.service s ON ((s.service_id = e.service_id)))
     JOIN public.magasin m ON ((m.mag_id = e.mag_id)));


ALTER TABLE public.v_emplacement_lib OWNER TO postgres;

--
-- Name: v_magasin_detail_ligne_lib; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_magasin_detail_ligne_lib AS
 SELECT m.mag_id,
    m.mag_li AS magasin,
    m.mag_dt_cr AS datecreation,
    'Aucune numero enregistré'::text AS telephone,
        CASE
            WHEN (count(DISTINCT u.usr_id) = 0) THEN 'Aucun utilisateurs associés a ce magasin'::text
            ELSE string_agg(DISTINCT concat(u.usr_nom, ' ', u.usr_prenom), ', '::text)
        END AS utilisateurs,
    count(DISTINCT e.empl_id) AS nombreemplacement
   FROM (((public.magasin m
     LEFT JOIN public.utilisateur_magasin um ON ((m.mag_id = um.mag_id)))
     LEFT JOIN public.utilisateur u ON ((u.usr_id = um.usr_id)))
     LEFT JOIN public.emplacement e ON ((m.mag_id = e.mag_id)))
  GROUP BY m.mag_dt_cr, m.mag_li, m.mag_id;


ALTER TABLE public.v_magasin_detail_ligne_lib OWNER TO postgres;

--
-- Name: v_mouvement_lib; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_mouvement_lib AS
 SELECT cl.cmde_ligne_id AS cmdeligneid,
    a.art_li AS article,
    a.art_cd AS code,
    a.art_ref AS reference,
    e.empl_li AS emplacement,
    cl.cmde_ligne_pu AS prixunitaire,
    cl.cmde_ligne_qte AS quantite,
    u.unite_li AS unite,
    cl.cmde_ligne_dt AS datedemouvement,
    cl.mvt_type AS mvttype,
        CASE
            WHEN (cl.mvt_type = 0) THEN 'entree'::text
            ELSE 'sortie'::text
        END AS mvtli,
    cl.cmde_id AS cmdeid
   FROM (((public.commande_ligne cl
     JOIN public.article a ON ((a.art_id = cl.art_id)))
     JOIN public.emplacement e ON ((e.empl_id = cl.empl_id)))
     JOIN public.unite u ON ((a.unite_id = u.unite_id)));


ALTER TABLE public.v_mouvement_lib OWNER TO postgres;

--
-- Name: v_sous_famille_lib; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_sous_famille_lib AS
 SELECT sf.sous_fam_id AS sousfamid,
    sf.famille_id AS familleid,
    sf.sous_fam_li AS sousfamli,
    f.famille_li AS familleli,
    sf.sous_fam_dt_cr AS sousfamdtcr
   FROM (public.sous_famille sf
     JOIN public.famille f ON ((sf.famille_id = f.famille_id)));


ALTER TABLE public.v_sous_famille_lib OWNER TO postgres;

--
-- Name: v_stock_emplacement_initial; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_stock_emplacement_initial AS
 SELECT e.empl_id,
    a.art_id,
    p.periode_id,
    0 AS cmup,
    0 AS quantite
   FROM ((public.emplacement e
     CROSS JOIN public.article a)
     CROSS JOIN public.periode p)
  WHERE ((p.periode_etat = 0) AND (e.service_id = a.service_id));


ALTER TABLE public.v_stock_emplacement_initial OWNER TO postgres;

--
-- Name: v_stock_par_emplacement; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_stock_par_emplacement AS
 SELECT stock_par_emplacement.empl_id,
    stock_par_emplacement.art_id,
    stock_par_emplacement.periode_id,
    stock_par_emplacement.cmup,
    stock_par_emplacement.quantite
   FROM public.stock_par_emplacement
UNION ALL
 SELECT v_stock_emplacement_initial.empl_id,
    v_stock_emplacement_initial.art_id,
    v_stock_emplacement_initial.periode_id,
    v_stock_emplacement_initial.cmup,
    v_stock_emplacement_initial.quantite
   FROM public.v_stock_emplacement_initial;


ALTER TABLE public.v_stock_par_emplacement OWNER TO postgres;

--
-- Name: v_stock_par_emplacement_final; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_stock_par_emplacement_final AS
 SELECT v_stock_par_emplacement.empl_id,
    v_stock_par_emplacement.art_id,
    v_stock_par_emplacement.periode_id,
    max(v_stock_par_emplacement.cmup) AS cmup,
    sum(v_stock_par_emplacement.quantite) AS quantite
   FROM public.v_stock_par_emplacement
  GROUP BY v_stock_par_emplacement.empl_id, v_stock_par_emplacement.art_id, v_stock_par_emplacement.periode_id;


ALTER TABLE public.v_stock_par_emplacement_final OWNER TO postgres;

--
-- Name: v_stock_par_emplacement_final_lib; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_stock_par_emplacement_final_lib AS
 SELECT m.mag_id AS magid,
    m.mag_li AS magasin,
    e.empl_id AS emplid,
    e.empl_li AS emplacement,
    p.periode_id AS periodeid,
    p.periode_li AS periode,
    sf.famille_id AS familleid,
    sf.sous_fam_id AS sousfamilleid,
    sf.sous_fam_li AS sous_famille,
    a.art_id AS artid,
    a.art_li AS article,
    a.art_cd AS code_article,
    sum(vtpef.quantite) AS quantite,
    max(vtpef.cmup) AS cmup
   FROM (((((public.v_stock_par_emplacement_final vtpef
     JOIN public.periode p ON ((vtpef.periode_id = p.periode_id)))
     JOIN public.article a ON ((vtpef.art_id = a.art_id)))
     JOIN public.emplacement e ON ((vtpef.empl_id = e.empl_id)))
     JOIN public.magasin m ON ((m.mag_id = e.mag_id)))
     JOIN public.sous_famille sf ON ((sf.sous_fam_id = a.sous_famille_id)))
  GROUP BY a.art_li, p.periode_li, e.empl_li, m.mag_li, a.art_cd, sf.sous_fam_li, e.empl_id, m.mag_id, p.periode_id, sf.sous_fam_id, sf.famille_id, a.art_id;


ALTER TABLE public.v_stock_par_emplacement_final_lib OWNER TO postgres;

--
-- Name: v_utilisateur_lib; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_utilisateur_lib AS
 SELECT u.usr_id AS usrid,
    r.role_li AS roleli,
    u.usr_login AS usrlogin,
    u.usr_nom AS usrnom,
    u.usr_prenom AS usrprenom,
    u.usr_dt_dern_acc AS usrdtdernacc,
    u.usr_dt_cr AS usrdtcr
   FROM (public.utilisateur u
     JOIN public.role r ON ((r.role_id = u.role_id)));


ALTER TABLE public.v_utilisateur_lib OWNER TO postgres;

--
-- Name: v_utilisateur_lib_complet; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_utilisateur_lib_complet AS
 SELECT u.usr_id AS usrid,
    r.role_li AS roleli,
    r.role_id AS roleid,
    u.usr_login AS usrlogin,
    u.usr_pwd AS usrpwd,
    u.usr_nom AS usrnom,
    u.usr_prenom AS usrprenom,
    u.usr_dt_dern_acc AS usrdtdernacc,
    u.usr_dt_cr AS usrdtcr
   FROM (public.utilisateur u
     JOIN public.role r ON ((r.role_id = u.role_id)));


ALTER TABLE public.v_utilisateur_lib_complet OWNER TO postgres;

--
-- Name: v_utilisateur_magasin; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_utilisateur_magasin AS
 SELECT m.mag_id AS magid,
    m.mag_li AS magli,
    um.depuis,
    um.usr_id AS usrid
   FROM ((public.utilisateur u
     JOIN public.utilisateur_magasin um ON ((um.usr_id = u.usr_id)))
     JOIN public.magasin m ON ((m.mag_id = um.mag_id)));


ALTER TABLE public.v_utilisateur_magasin OWNER TO postgres;

--
-- Name: v_utilisateur_service; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_utilisateur_service AS
 SELECT s.service_id,
    s.service_li AS serviceli,
    u.usr_id AS usrid
   FROM ((public.utilisateur u
     JOIN public.travailler_dans td ON ((td.usr_id = u.usr_id)))
     JOIN public.service s ON ((s.service_id = td.service_id)));


ALTER TABLE public.v_utilisateur_service OWNER TO postgres;

--
-- Name: article art_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article ALTER COLUMN art_id SET DEFAULT nextval('public.article_art_id_seq'::regclass);


--
-- Name: article_historique art_hist_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_historique ALTER COLUMN art_hist_id SET DEFAULT nextval('public.article_historique_art_hist_id_seq'::regclass);


--
-- Name: commande cmde_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande ALTER COLUMN cmde_id SET DEFAULT nextval('public.commande_cmde_id_seq'::regclass);


--
-- Name: commande_ligne cmde_ligne_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_ligne ALTER COLUMN cmde_ligne_id SET DEFAULT nextval('public.commande_ligne_cmde_ligne_id_seq'::regclass);


--
-- Name: emplacement empl_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplacement ALTER COLUMN empl_id SET DEFAULT nextval('public.emplacement_empl_id_seq'::regclass);


--
-- Name: etat_stock etat_stock_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etat_stock ALTER COLUMN etat_stock_id SET DEFAULT nextval('public.etat_stock_etat_stock_id_seq'::regclass);


--
-- Name: famille famille_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.famille ALTER COLUMN famille_id SET DEFAULT nextval('public.famille_famille_id_seq'::regclass);


--
-- Name: fournisseur fournisseur_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fournisseur ALTER COLUMN fournisseur_id SET DEFAULT nextval('public.fournisseur_fournisseur_id_seq'::regclass);


--
-- Name: magasin mag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magasin ALTER COLUMN mag_id SET DEFAULT nextval('public.magasin_mag_id_seq'::regclass);


--
-- Name: periode periode_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periode ALTER COLUMN periode_id SET DEFAULT nextval('public.periode_periode_id_seq'::regclass);


--
-- Name: role role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN role_id SET DEFAULT nextval('public.role_role_id_seq'::regclass);


--
-- Name: service service_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service ALTER COLUMN service_id SET DEFAULT nextval('public.service_service_id_seq'::regclass);


--
-- Name: sous_famille sous_fam_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sous_famille ALTER COLUMN sous_fam_id SET DEFAULT nextval('public.sous_famille_sous_fam_id_seq'::regclass);


--
-- Name: stock_par_emplacement stock_par_empl_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_par_emplacement ALTER COLUMN stock_par_empl_id SET DEFAULT nextval('public.stock_par_emplacement_stock_par_empl_id_seq'::regclass);


--
-- Name: unite unite_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unite ALTER COLUMN unite_id SET DEFAULT nextval('public.unite_unite_id_seq'::regclass);


--
-- Name: unite_operationnel unop_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unite_operationnel ALTER COLUMN unop_id SET DEFAULT nextval('public.unite_operationnel_unop_id_seq'::regclass);


--
-- Name: utilisateur usr_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN usr_id SET DEFAULT nextval('public.utilisateur_usr_id_seq'::regclass);


--
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.article (art_id, art_li, art_ref, art_cd, art_pu, art_qte, art_cmp, art_dte, art_dern_mdf, service_id, sous_famille_id, unite_id, fam_id) FROM stdin;
26	HP 72 MAGENTA	\N	C9373A	\N	\N	\N	\N	\N	3	\N	1	10
27	Papier A0 0.914*50m	\N	Art.32430079 papier A0	\N	\N	\N	\N	\N	3	\N	13	10
28	Paper One Papier A4 80g 	\N	Paper One Papier A4 80g 	\N	\N	\N	\N	\N	3	\N	1	10
29	Paper One Papier A3 	\N	Paper One Papier A3 	\N	\N	\N	\N	\N	3	\N	1	10
30	DETO DEVEYQUICK 15M 25/500MS SPE2 1,4S_PK13_QQ	\N	EXP00027	\N	\N	\N	\N	\N	4	\N	1	16
31	DETO DEVEYQUICK 21M 25/500MS SPE2 1,4S_PK13_QQ	\N	EXP00028	\N	\N	\N	\N	\N	4	\N	1	16
32	HUILE DE CHAUFFE SERIOLA_AMBT_PH	\N	MCO00015	\N	\N	\N	\N	\N	4	\N	5	18
33	ATELBIO	\N	MCO00020	\N	\N	\N	\N	\N	4	\N	5	18
34	PALIER AVEC ROULEMENT UCT 210	\N	PM0031	\N	\N	\N	\N	\N	4	\N	1	27
36	POCHE FILTRANTE 2 CANAUX LARGEUR	\N	PM0034	\N	\N	\N	\N	\N	4	\N	1	27
39	Gasoil GO DETAXE POSTE ENROBE RN6	\N	GAS0004	\N	\N	\N	\N	\N	4	\N	5	30
41	GAINE EN PEBD neutre EP100u -Largeur 95mm	\N	FCO00079	\N	\N	\N	\N	\N	5	\N	4	13
42	GAINE EN PEBD neutre EP100u -Largeur 125mm	\N	FCO00080	\N	\N	\N	\N	\N	5	\N	4	13
43	BANDE TRANSPORTEUSE 800	\N	PSU1177	\N	\N	\N	\N	\N	5	\N	4	14
44	BANDE TRANSPORTEUSE 500	\N	PSU1178	\N	\N	\N	\N	\N	5	\N	4	14
45	Gaine plastique E95-L95	\N	FCO00021	\N	\N	\N	\N	\N	5	\N	9	16
46	Ligne de tir bifilaire	\N	FCO00025	\N	\N	\N	\N	\N	5	\N	13	16
50	DETO NONEL DAVENYL 15M/500MS SP 20 1.4S	\N	EXP00034	\N	\N	\N	\N	\N	5	\N	1	16
53	Bague excentrique HP200	\N	PM004	\N	\N	\N	\N	\N	5	\N	1	27
54	Nordbak 1095059960	\N	PM005	\N	\N	\N	\N	\N	5	\N	1	27
56	Bague boitier contre arbre HP200	\N	PM009	\N	\N	\N	\N	\N	5	\N	1	27
57	Gasoil GO DETAXE CARRIERE RN6	\N	GAS0003	\N	\N	\N	\N	\N	5	\N	5	30
62	Rock fill 1-70 kg/pc Traditional Method	\N	ROCKFILL_TM	\N	\N	\N	\N	\N	7	\N	15	19
63	SABLE DE RIVIERE	\N	SABLE_RIVIERE	\N	\N	\N	\N	\N	7	\N	15	19
64	Sterile	\N	STRIL	\N	\N	\N	\N	\N	7	\N	15	19
65	FLUXANT ORM 65	\N	FLUXANT	\N	\N	\N	\N	\N	7	\N	5	20
66	GREENFLUX 2000	\N	GREENFLUX_2000	\N	\N	\N	\N	\N	7	\N	5	20
67	HUILE DE DEMOULAGE SEPARATOR VEGETAL 61	\N	HUILE_DEMOULAGE	\N	\N	\N	\N	\N	7	\N	5	20
68	PAVE 20X10	\N	PAVE_20X10	\N	\N	\N	\N	\N	7	\N	1	21
69	PREFA DECO DE FACADE TYPE 02A - 02B	\N	PF_DECO_TYP2A-2B	\N	\N	\N	\N	\N	7	\N	1	21
70	PREFA DECO DE FACADE TYPE 01	\N	PF_DECO_TYPE1	\N	\N	\N	\N	\N	7	\N	1	21
71	PREFA DECO DE FACADE TYPE 03	\N	PF_DECO_TYPE3	\N	\N	\N	\N	\N	7	\N	1	21
72	EME2 0/20 EB 20 ASSISE 20/30 CLASSE 2	\N	EME2_0/20_20/30	\N	\N	\N	\N	\N	7	\N	15	22
73	FLUIDEN 1828	\N	FLUIDEN	\N	\N	\N	\N	\N	7	\N	5	22
74	GB3 0/14 EB 14 ASSISE 35/50	\N	GB3_0/14_35/50	\N	\N	\N	\N	\N	7	\N	15	22
75	C30/37 S4 F572L DMAX20	\N	C30/37_S4_572L	\N	\N	\N	\N	\N	7	\N	11	23
76	C30/37 S4 F582L DMAX10	\N	C30/37_S4_582L	\N	\N	\N	\N	\N	7	\N	11	23
77	C30/37 S4 F592L DMAX20	\N	C30/37_S4_592L	\N	\N	\N	\N	\N	7	\N	11	23
78	BITUME 10/20	\N	BITUME1020	\N	\N	\N	\N	\N	7	\N	15	24
79	BITUME COLFLEX HP	\N	COLFLEX_HP	\N	\N	\N	\N	\N	7	\N	15	24
80	BITUME COLFLEX N	\N	COLFLEX_N	\N	\N	\N	\N	\N	7	\N	15	24
81	CIMENT CEM I 42.5 50KG	\N	CEM I 42.5	\N	\N	\N	\N	\N	7	\N	15	25
82	CIMENT CEM II 42.5 50KG	\N	CEM II 42.5	\N	\N	\N	\N	\N	7	\N	15	25
83	USINAGE SERRURE+POIGNEE+TIRE DOIGT	\N	QMEN03	\N	\N	\N	\N	\N	9	\N	12	6
84	ENS BEQUILLE/BOUTON CARRE 7mm AVEC ROSACES INOX	\N	QSE374081/2	\N	\N	\N	\N	\N	9	\N	12	6
85	CYL 5G 30X30 LN HERACLES CD 83014011	\N	QSE 364090	\N	\N	\N	\N	\N	9	\N	12	6
86	SAC CALES PLUS DE 10 PYL. 87	\N	POMA0015	\N	\N	\N	\N	\N	10	\N	12	26
87	CABLE CUIVRE NU 25mm_	\N	POMA0016	\N	\N	\N	\N	\N	10	\N	4	26
88	ENS. GRILLE CUIVRE DE MISE A LA TERRE	\N	POMA0017	\N	\N	\N	\N	\N	10	\N	12	26
89	PINCE A DECOFFRER 600*18	\N	OPIN12824	\N	\N	\N	\N	\N	11	\N	12	5
90	CISAILLE TYPE AVIATION D G	\N	OCIS15490-88	\N	\N	\N	\N	\N	11	\N	12	5
91	TAILLANT T45 D89 Semi Balistique Jupe r�tro	\N	PSU1175	\N	\N	\N	\N	\N	13	\N	1	14
92	EMULSTAR 8000 70/2080	\N	EXP00039	\N	\N	\N	\N	\N	13	\N	9	16
94	BOBINE ELECTROVANNE-REF 3002279	\N	PM0038	\N	\N	\N	\N	\N	13	\N	1	27
95	POMPE X NOW 20032001	\N	PM0039	\N	\N	\N	\N	\N	13	\N	1	27
96	MOTEUR-REF 3005820	\N	PM0040	\N	\N	\N	\N	\N	13	\N	1	27
97	CONDENSATEUR-REF 20087026	\N	PM0041	\N	\N	\N	\N	\N	13	\N	1	27
99	Evalsy AM(xm-411)	\N	FCO00038	\N	\N	\N	\N	\N	4	3	9	13
174	Rod Shank HD709-02504	\N	PSU0378	\N	\N	\N	\N	\N	5	18	1	14
175	Rondelle grower 18 zinguee -31791416	\N	PSU0354	\N	\N	\N	\N	\N	4	18	1	14
176	Rondelle ressort 12,2x28x1,5 -31799193	\N	PSU0367	\N	\N	\N	\N	\N	4	18	1	14
177	ROULEAU CENTRAL 100*375 MD03247001	\N	PSU0539	\N	\N	\N	\N	\N	5	23	1	14
178	ROULEAU LATERAL 100*310 MD03067002	\N	PSU0540	\N	\N	\N	\N	\N	5	23	1	14
100	Polyram S (Fût 175kg)	\N	FCO00042	\N	\N	\N	\N	\N	4	3	25	13
51	Détonateur nonel daveyquick long 12m/500ms	\N	EXP00036	\N	\N	\N	\N	\N	5	\N	1	16
55	Coussinet sphérique HP200	\N	PM006	\N	\N	\N	\N	\N	5	\N	1	27
35	Compteur mécanique 4 chiffres	\N	PM0033	\N	\N	\N	\N	\N	4	\N	1	27
47	Détonateur de 15ML	\N	EXP0007AMBQQ	\N	\N	\N	\N	\N	5	\N	4	16
49	Détonateur électrique MI 6m - Daveydet	\N	EXP00032	\N	\N	\N	\N	\N	5	\N	1	16
59	Fer Torsadé 12	\N	FRT12	\N	\N	\N	\N	\N	6	\N	3	2
1	LONGRINE EN KATRAFAY 20*20*250	\N	BKATR 20	\N	\N	\N	\N	\N	1	\N	12	3
2	MADRIER PIN 0,08*0,20*400	\N	BMADPIN2084	\N	\N	\N	\N	\N	1	\N	12	3
3	BATTEUSE EDF REVERSIBLE 202U	\N	QBAT202U	\N	\N	\N	\N	\N	1	\N	1	6
4	BATTEUSE A PLAQUER CARRE DE 6MM COMPLE	\N	QBATCAR6	\N	\N	\N	\N	\N	1	\N	1	6
5	BLOC AIMANT RESINE 400	\N	QBLOCEM40287	\N	\N	\N	\N	\N	1	\N	1	6
6	BLOC PLATINE 1389	\N	QBLOCP4	\N	\N	\N	\N	\N	1	\N	1	6
7	LAME KATRAFAY 2.5*10*280	\N	BKATR21028	\N	\N	\N	\N	\N	1	\N	12	3
8	TPN 4MM	\N	FTN5	\N	\N	\N	\N	\N	2	\N	2	2
9	FER CARRE 20*20	\N	FC3	\N	\N	\N	\N	\N	2	\N	2	2
10	IPE 120	\N	FIP13	\N	\N	\N	\N	\N	2	\N	3	2
11	BOULON MEC 16/45	\N	CB85	\N	\N	\N	\N	\N	2	\N	1	4
12	BAGUETTE ALU	\N	CBAG2	\N	\N	\N	\N	\N	2	\N	1	4
13	FORET A BETON 4	\N	OT29	\N	\N	\N	\N	\N	2	\N	1	5
14	FRAISES DIAM 35	\N	OFRAI35	\N	\N	\N	\N	\N	2	\N	1	5
15	DELL MULTIPORT ADAPTER-DA305	\N	DELL 6-iN-1 USB-C	\N	\N	\N	\N	\N	3	\N	1	8
16	SOURIS SANS FIL DELL MS3320W	\N	SOURIS SANS FIL DELL MS3320W	\N	\N	\N	\N	\N	3	\N	1	8
17	Sac de transport DELL	\N	Sac DELL	\N	\N	\N	\N	\N	3	\N	1	8
18	CABLE HDMI 1.5M	\N	CABLE HDMI 1.5M	\N	\N	\N	\N	\N	3	\N	1	8
19	BATTERIE POUR DELL  5570	\N	BATTERIE 47WHR 3C LITH	\N	\N	\N	\N	\N	3	\N	1	8
20	BATTERIE ONDULEUR	\N	iNFOPRO 12V7Ah	\N	\N	\N	\N	\N	3	\N	1	8
21	ITEL IT5620	\N	351186745018921	\N	\N	\N	\N	\N	3	\N	1	9
22	NOKIA 106 TA-1114	\N	354194109069891	\N	\N	\N	\N	\N	3	\N	1	9
37	Gasoil détaxé TOTAL_PK13_PH	\N	GAS0001	\N	\N	\N	\N	\N	4	\N	5	30
52	Cordeau détonant TITACORD 12Gr	\N	EXP00040	\N	\N	\N	\N	\N	5	\N	4	16
98	Emilakrésine	\N	FCO00041	\N	\N	\N	\N	\N	4	3	9	13
48	Détonateur électrique MI 15m - Daveydet	\N	EXP00031	\N	\N	\N	\N	\N	5	\N	1	16
58	Fer Torsadé 6	\N	FRT6	\N	\N	\N	\N	\N	6	\N	3	2
61	Fer Torsadé 14	\N	FRT14	\N	\N	\N	\N	\N	6	\N	3	2
38	Gasoil détaxé JOVENA_ AMBOKATRA_PH	\N	GAS0002	\N	\N	\N	\N	\N	4	\N	5	30
40	Gasoil detaxé TOTAL	\N	GAS0005	\N	\N	\N	\N	\N	4	\N	5	30
60	Fer Torsadé 20	\N	FRT20	\N	\N	\N	\N	\N	6	\N	3	2
93	GICLEUR 3,00 X 60W DELAVAN	\N	PM0037	\N	\N	\N	\N	\N	13	\N	1	27
23	NOKIA 106 TA-1114	\N	354194109170657	\N	\N	\N	\N	\N	3	\N	1	9
24	SAMSUNG A05 4G LTE E+ 4+64GB BLK	\N	354660977974701	\N	\N	\N	\N	\N	3	\N	1	9
25	HP 72 PHOTO BLACK	\N	C9370A	\N	\N	\N	\N	\N	3	\N	1	10
135	Soufre poudre	\N	FCO00039	\N	\N	\N	\N	\N	4	3	9	13
138	GAINE EN PEBD neutre EP100u -Largeur 95mm	\N	FCO00059	\N	\N	\N	\N	\N	5	5	9	13
139	FER CORNIERE 50*50*5	\N	FCO00087	\N	\N	\N	\N	\N	5	6	6	13
140	FER CORNIERE 60*60*6	\N	FCO00088	\N	\N	\N	\N	\N	5	6	6	13
141	FER CORNIERE 80*80*8	\N	FCO00089	\N	\N	\N	\N	\N	5	6	6	13
142	Coin de serrage blindage	\N	PSU0067	\N	\N	\N	\N	\N	5	7	1	14
143	INDICATEUR IDE 400-CAPTEUR NUMERIQUE(V4)	\N	PSU1109	\N	\N	\N	\N	\N	5	7	12	14
144	CAPTEUR NUMERIQUE CPFN -A 30T-C5 NMI TC6981	\N	PSU1110	\N	\N	\N	\N	\N	5	7	1	14
145	Pompe J6 CCE	\N	PSU0209	\N	\N	\N	\N	\N	4	8	1	14
146	Protection HP 706302164100	\N	PSU0210	\N	\N	\N	\N	\N	5	8	1	14
147	Reniflard MM0376022	\N	PSU0212	\N	\N	\N	\N	\N	5	8	1	14
148	Support elastique	\N	PSU0248	\N	\N	\N	\N	\N	5	8	1	14
149	EP 630/4 6+2Y L1000	\N	PSU0114	\N	\N	\N	\N	\N	5	9	4	14
150	Machon SNR H313	\N	PSU0186	\N	\N	\N	\N	\N	5	9	1	14
151	Machon T45	\N	PSU0188	\N	\N	\N	\N	\N	5	9	1	14
152	Meule Affuteuse  13- 8563	\N	PSU0190	\N	\N	\N	\N	\N	5	9	1	14
153	Cellule bruleur	\N	FCO00011	\N	\N	\N	\N	\N	4	10	1	14
154	Accouplement Flexible 13064078	\N	PSU0001	\N	\N	\N	\N	\N	5	10	1	14
157	Bande EP400/3 4+2 L650	\N	PSU0012	\N	\N	\N	\N	\N	5	10	4	14
158	Boulons CR TMCC	\N	PSU0041	\N	\N	\N	\N	\N	5	10	1	14
159	Boulons Serrage blind Lat VB	\N	PSU0044	\N	\N	\N	\N	\N	5	10	1	14
160	Bride de fixation machoire fixe	\N	PSU0046	\N	\N	\N	\N	\N	5	10	1	14
161	Buse d'arrosage PU queue de carp	\N	PSU0047	\N	\N	\N	\N	\N	5	10	1	14
164	DETONATEUR ELECTRIQUE DE 05ML	\N	EXP0004	\N	\N	\N	\N	\N	5	12	4	16
155	Anneau d'etancheité en U	\N	PSU0008	\N	\N	\N	\N	\N	5	10	1	14
163	DÉTONATEUR ELECTRIQUE DE 04ML	\N	EXP0003	\N	\N	\N	\N	\N	5	12	1	16
156	Bague arrêt SNR FR120X11	\N	PSU0010	\N	\N	\N	\N	\N	5	10	1	14
166	Détonateur électrique MI 6m - Daveydettonateur de 15ML	\N	EXP0007	\N	\N	\N	\N	\N	5	12	4	16
137	acetylène	\N	GAZ0002	\N	\N	\N	\N	\N	5	5	11	13
167	Nitrate d'ammonium	\N	EXP00017	\N	\N	\N	\N	\N	5	14	9	16
169	Pale de malaxage en fonte NI HARD 2 -3511Y1	\N	PSU0360	\N	\N	\N	\N	\N	4	18	1	14
170	Palier SY45FM -31710116	\N	PSU0364	\N	\N	\N	\N	\N	4	18	1	14
171	Pointe de pale bord	\N	PSU0326	\N	\N	\N	\N	\N	4	18	1	14
172	Pointe pale de bord -35120B32-19R	\N	PSU0358	\N	\N	\N	\N	\N	4	18	1	14
173	Rod Shank HC120-T45	\N	PSU0381	\N	\N	\N	\N	\N	5	18	1	14
136	oxygène	\N	GAZ0001	\N	\N	\N	\N	\N	5	5	11	13
162	Cordeau détonant 12 gr/m	\N	EXP0001	\N	\N	\N	\N	\N	5	12	4	16
165	DÉTONATEUR ELECTRIQUE DE 06ML	\N	EXP0006	\N	\N	\N	\N	\N	5	12	1	16
179	rouleaux central MD0338606102	\N	PSU0570	\N	\N	\N	\N	\N	5	23	1	14
180	rouleaux central IMPACT MD03040157	\N	PSU0571	\N	\N	\N	\N	\N	5	23	1	14
181	rouleaux central IMPACT MD0328606102	\N	PSU0572	\N	\N	\N	\N	\N	5	23	1	14
\.


--
-- Data for Name: article_historique; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.article_historique (art_hist_id, art_hist_li, art_hist_cd, art_hist_qte, art_hist_pu, art_hist_cmup, art_hist_dt, art_hist_etat, usr_id, art_id) FROM stdin;
\.


--
-- Data for Name: commande; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commande (cmde_id, cmde_num, cmde_dt_cr, cmde_hr_cr, cmde_total, empl_id, unop_id, periode_id) FROM stdin;
\.


--
-- Data for Name: commande_ligne; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commande_ligne (cmde_ligne_id, cmde_ligne_qte, cmde_ligne_pu, cmde_ligne_dt, art_num_serie, art_cmup, cmde_ligne_hr, mvt_type, cmde_id, empl_id, art_id, fournisseur_id, periode_id, cmde_bc) FROM stdin;
59	120	3000	2024-10-09	\N	3000	08:24:02.641017	0	\N	20	98	\N	3	JKJSK
60	10	10000000	2024-10-09	\N	\N	08:26:07.741322	0	\N	26	173	\N	3	20930
61	10	40000	2024-10-09	\N	\N	08:42:14.710777	0	\N	11	178	\N	3	2000
\.


--
-- Data for Name: emplacement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emplacement (empl_id, empl_li, empl_lng, empl_ltd, empl_dt_cr, empl_dern_mdf, service_id, mag_id) FROM stdin;
20	22000-ET INDUS FIANARANTSOA QQ	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	6
9	22000-ET INDUS RN6_LOT2 BM- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	11
11	22000-ET INDUS TOLIARA QQ	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	7
26	EMPLACEMENT DTIP	\N	\N	2024-10-08 06:25:54.662575+00	\N	3	17
44	22000-ET INDUS JICA QQ - VENTES	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	5
14	22000-ET INDUS AMBOKATRA QQ - TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	5
2	22000-ET INDUS PK13 PE- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	4
5	22000-ET INDUS PK13 QQ- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	4
32	22000-ET INDUS AMBOKATRA PH-  MATIERES PREMIERES	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	5
1	22000-ET INDUS JICA QQ - TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	5
31	22000-ET INDUS RN6 LOT2 QQ- ABBATAGE/MINAGE	\N	\N	2024-10-08 06:25:54.662575+00	\N	13	11
29	22000-ET INDUS AMBOKATRA QQ - ABBATAGE/MINAGE	\N	\N	2024-10-08 06:25:54.662575+00	\N	13	5
28	22000-ET INDUS RN6_LOT1 PH- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	10
21	22000-ET INDUS AMBOKATRA BM- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	5
27	22000-ET INDUS RN13 QQ- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	15
17	22000-ET INDUS AMBOKATRA PH- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	5
3	EMPLACEMENT_MAGBOIS_01	\N	\N	2024-10-08 06:25:54.662575+00	\N	1	1
18	EMPLACEMENT_MAGINFO_01	\N	\N	2024-10-08 06:25:54.662575+00	\N	3	3
6	22000-ET INDUS TOLIARA PH	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	7
25	22000-ET INDUS RN13 PH- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	15
19	EMPLACEMENT_MAGSAV	\N	\N	2024-10-08 06:25:54.662575+00	\N	8	12
48	2200005QQ004.210250 22000-ET INDUS RN13 BEHARA QQ- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	15
46	22000-ET INDUS RN6 LOT2 PH-  MATIERES PREMIERES	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	11
42	22000-ET INDUS RN13 PH -  MATIERES PREMIERES	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	15
34	22000-ET INDUS JICA QQ - ABBATAGE/MINAGE	\N	\N	2024-10-08 06:25:54.662575+00	\N	13	5
15	22000-ET INDUS PK13 PH- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	4
24	22000-ET INDUS RN13 QQ - ABBATAGE/MINAGE	\N	\N	2024-10-08 06:25:54.662575+00	\N	13	15
16	22000-ET INDUS PK13 BM- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	4
36	22000-ET INDUS RN6_LOT1 PE- TRAITEMENT\t	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	10
7	22000-ET INDUS FIANARANTSOA PH	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	6
41	2200005QQ001.210452 22000-ET INDUS RN13 BEHARA QQ - ABBATAGE/MINAGE	\N	\N	2024-10-08 06:25:54.662575+00	\N	13	15
47	EMPLACEMENT_CHARPENTE_ATELIER_GM_DEPÔT	\N	\N	2024-10-08 06:25:54.662575+00	\N	1	16
43	22000-ET INDUS RN6 LOT1 PH-  MATIERES PREMIERES	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	10
35	22000-ET INDUS RN13 PE - MATIERES PREMIERES	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	15
30	22000-ET INDUS JICA PH-  MATIERES PREMIERES	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	5
39	22000-ET INDUS PK13 QQ - ABBATAGE/MINAGE	\N	\N	2024-10-08 06:25:54.662575+00	\N	13	4
33	Gare G1 Anosy	\N	\N	2024-10-08 06:25:54.662575+00	\N	10	14
4	EMPLACEMENT_MAGFERRAILLAGE	\N	\N	2024-10-08 06:25:54.662575+00	\N	6	8
8	22000-ET INDUS RN6_LOT1 QQ- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	10
45	22000-ET INDUS RN6 LOT2 PE - MATIERES PREMIERES	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	11
12	22000-ET INDUS AMBOKATRA PE- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	5
37	22000-ET INDUS RN6_LOT2 PE- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	11
22	EMPLACEMENT_MENUISERIE MALAGA	\N	\N	2024-10-08 06:25:54.662575+00	\N	9	13
10	22000-ET INDUS RN6_LOT2 QQ- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	11
40	22000-ET INDUS RN6 LOT1 QQ- ABBATAGE/MINAGE	\N	\N	2024-10-08 06:25:54.662575+00	\N	13	10
13	EMPLACEMENT_MAGFER_01	\N	\N	2024-10-08 06:25:54.662575+00	\N	2	2
38	22000-ET INDUS RN6_LOT2 PH- TRAITEMENT	\N	\N	2024-10-08 06:25:54.662575+00	\N	5	11
23	22000-ET INDUS PK13 PH -  MATIERES PREMIERES	\N	\N	2024-10-08 06:25:54.662575+00	\N	4	4
\.


--
-- Data for Name: etat_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etat_stock (etat_stock_id, art_qte, art_dte, art_stock_type, art_id, famille_id, periode_id) FROM stdin;
\.


--
-- Data for Name: famille; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.famille (famille_id, famille_li, famille_num_com, famille_dt_cr, famille_dern_mdf, fam_log_ref) FROM stdin;
1	6D-Petit outillage	\N	2024-10-08 06:17:54.146642+00	\N	\N
2	Acier	\N	2024-10-08 06:17:54.146642+00	\N	\N
3	Bois	\N	2024-10-08 06:17:54.146642+00	\N	\N
4	Consommable	\N	2024-10-08 06:17:54.146642+00	\N	\N
5	Outillage	\N	2024-10-08 06:17:54.146642+00	\N	\N
6	Quincaillerie	\N	2024-10-08 06:17:54.146642+00	\N	\N
7	3C-Bois	\N	2024-10-08 06:17:54.146642+00	\N	\N
8	Divers informatique	\N	2024-10-08 06:17:54.146642+00	\N	\N
10	Consommable informatique	\N	2024-10-08 06:17:54.146642+00	\N	\N
11	Produit fini chantier	\N	2024-10-08 06:17:54.146642+00	\N	\N
13	Fournitures Consommables	\N	2024-10-08 06:17:54.146642+00	\N	\N
14	Pieces d'usure	\N	2024-10-08 06:17:54.146642+00	\N	\N
15	Conteneur	\N	2024-10-08 06:17:54.146642+00	\N	\N
16	Explosif	\N	2024-10-08 06:17:54.146642+00	\N	\N
17	Gaz	\N	2024-10-08 06:17:54.146642+00	\N	\N
19	AGREGATS	\N	2024-10-08 06:17:54.146642+00	\N	\N
20	ADDITIFS	\N	2024-10-08 06:17:54.146642+00	\N	\N
21	PREFAS	\N	2024-10-08 06:17:54.146642+00	\N	\N
22	PRODNOIR	\N	2024-10-08 06:17:54.146642+00	\N	\N
23	BPE	\N	2024-10-08 06:17:54.146642+00	\N	\N
24	BITUMES	\N	2024-10-08 06:17:54.146642+00	\N	\N
25	CIMENT	\N	2024-10-08 06:17:54.146642+00	\N	\N
26	POMA	\N	2024-10-08 06:17:54.146642+00	\N	\N
28	Imprimante	\N	2024-10-08 06:17:54.146642+00	\N	\N
29	Autres consommables	\N	2024-10-08 06:17:54.146642+00	\N	\N
30	Gasoil	\N	2024-10-08 06:17:54.146642+00	\N	\N
9	Téléphonie	\N	2024-10-08 06:17:54.146642+00	\N	\N
12	Matières Premières	\N	2024-10-08 06:17:54.146642+00	\N	\N
27	Pièce mécanique	\N	2024-10-08 06:17:54.146642+00	\N	\N
18	Matières Consommables	\N	2024-10-08 06:17:54.146642+00	\N	\N
\.


--
-- Data for Name: fournisseur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fournisseur (fournisseur_id, fournisseur_li) FROM stdin;
\.


--
-- Data for Name: magasin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.magasin (mag_id, mag_li, mag_com, mag_dt_cr, mag_dern_mdf) FROM stdin;
1	MAGBOIS	MAGASIN ATELIER BOIS	2024-10-07 06:18:27.000982+00	\N
2	MAGFER	MAGASIN ATELIER FER	2024-10-07 06:18:27.000982+00	\N
3	MAGINFO	MAGASIN INFORMATIQUE	2024-10-07 06:18:27.000982+00	\N
4	MAGPK13	MAGASIN PK13	2024-10-07 06:18:27.000982+00	\N
5	MAGAMBOKATRA	MAG_AMBOKATRA	2024-10-07 06:18:27.000982+00	\N
6	MAG_RN12 	Magasin RN12	2024-10-07 06:18:27.000982+00	\N
7	MAG_Toliara	Magasin Toliara	2024-10-07 06:18:27.000982+00	\N
8	MAGFERRAILLAGE	MAGASIN FERRAILLAGE	2024-10-07 06:18:27.000982+00	\N
9	MAGANTSIRANANA	MAGASIN ANTSIRANANA	2024-10-07 06:18:27.000982+00	\N
10	MAG_RN6_LOT1	Magasin RN6 LOT1	2024-10-07 06:18:27.000982+00	\N
11	MAG_RN6_LOT2	Magasin RN6 LOT2	2024-10-07 06:18:27.000982+00	\N
12	MAG_SAV	MAGASIN SAV	2024-10-07 06:18:27.000982+00	\N
13	MAG_MENUISERIE_MALAGA	MENUISERIE MALAGA	2024-10-07 06:18:27.000982+00	\N
14	MAG_TPC	Magasin TPC	2024-10-07 06:18:27.000982+00	\N
15	MAG_RN13	MAG_RN13	2024-10-07 06:18:27.000982+00	\N
17	MAGASIN DTIP	MAGASIN PAPIER DTIP	2024-10-07 06:18:27.000982+00	\N
16	MAG_CHARPENTE_ATELIER_GM_DEPÔT	\N	2024-10-07 03:18:27+00	2024-10-08 08:42:10.549395+00
\.


--
-- Data for Name: periode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.periode (periode_id, periode_li, periode_dt_db, periode_dt_fin, periode_etat) FROM stdin;
3	test	2024-10-08	\N	0
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (role_id, role_li) FROM stdin;
1	Administrateur
3	Super Utilisateur
2	Utilisateur
\.


--
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service (service_id, service_li, service_num_bu, service_dt_cr, service_dern_mdf) FROM stdin;
1	ATELIER BOIS	19577804	2024-10-08 07:36:06.862433+00	\N
2	ATELIER FER	19578107	2024-10-08 07:36:06.862433+00	\N
3	SERVICE INFORMATIQUE	300800	2024-10-08 07:36:06.862433+00	\N
4	INDUSTRIES	200500	2024-10-08 07:36:06.862433+00	\N
5	INDUSTRIES - TRAITEMENT	210250	2024-10-08 07:36:06.862433+00	\N
6	ATELIER FERRAILLAGE	19778359	2024-10-08 07:36:06.862433+00	\N
7	PRODUITS	10101	2024-10-08 07:36:06.862433+00	\N
8	SAV	19713708	2024-10-08 07:36:06.862433+00	\N
9	MENUISERIES INTERIEURES MALAGA II	23784845	2024-10-08 07:36:06.862433+00	\N
10	TPC	220005	2024-10-08 07:36:06.862433+00	\N
11	TRX	28026750	2024-10-08 07:36:06.862433+00	\N
12	TST	0	2024-10-08 07:36:06.862433+00	\N
13	INDUSTRIES - ABBATAGE / MINAGE	210452	2024-10-08 07:36:06.862433+00	\N
\.


--
-- Data for Name: sous_famille; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sous_famille (sous_fam_id, sous_fam_li, sous_fam_dt_cr, sous_fam_dern_mdf, famille_id, sous_fam_log_ref) FROM stdin;
2	Ciments	2024-10-08 06:20:39.097049+00	\N	12	\N
3	Emulsifiants/Additifs	2024-10-08 06:20:39.097049+00	\N	13	\N
5	Fournitures consommables	2024-10-08 06:20:39.097049+00	\N	13	\N
6	Autres fournitures	2024-10-08 06:20:39.097049+00	\N	13	\N
7	pieces d'usure pont bascule	2024-10-08 06:20:39.097049+00	\N	14	\N
11	Conteneur	2024-10-08 06:20:39.097049+00	\N	15	\N
12	Autres Consommation de minage	2024-10-08 06:20:39.097049+00	\N	16	\N
13	Gomme	2024-10-08 06:20:39.097049+00	\N	16	\N
14	Nitrate 	2024-10-08 06:20:39.097049+00	\N	16	\N
15	GAZ	2024-10-08 06:20:39.097049+00	\N	17	\N
17	Lubrifiants	2024-10-08 06:20:39.097049+00	\N	18	\N
20	Bitumes bruts	2024-10-08 06:20:39.097049+00	\N	12	\N
21	Bitumes fondus	2024-10-08 06:20:39.097049+00	\N	12	\N
16	Gasoil detaxé	2024-10-08 06:20:39.097049+00	\N	18	\N
19	Agrégats	2024-10-08 06:20:39.097049+00	\N	11	\N
26	Pièces d'usure Poste enrobée	2024-10-08 06:20:39.097049+00	\N	14	\N
9	Pièces d'usure carrière	2024-10-08 06:20:39.097049+00	\N	14	\N
8	Pièces détachées engins GM PU	2024-10-08 06:20:39.097049+00	\N	14	\N
1	Enrobés	2024-10-08 06:20:39.097049+00	\N	11	\N
23	Pièces d'usures Trommel	2024-10-08 06:20:39.097049+00	\N	14	\N
25	Gasoil taxé	2024-10-08 06:20:39.097049+00	\N	18	\N
18	Pièces d'usure chantier	2024-10-08 06:20:39.097049+00	\N	14	\N
10	Pièces d'usure concasseur	2024-10-08 06:20:39.097049+00	\N	14	\N
27	Pièce mécanique	2024-10-08 06:20:39.097049+00	\N	27	\N
24	Pièces d'usure forage	2024-10-08 06:20:39.097049+00	\N	14	\N
4	Pièces détactées engins GM FC	2024-10-08 06:20:39.097049+00	\N	13	\N
22	Autres Pétroles	2024-10-08 06:20:39.097049+00	\N	18	\N
\.


--
-- Data for Name: stock_par_emplacement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_par_emplacement (stock_par_empl_id, empl_id, art_id, quantite, cmup, periode_id) FROM stdin;
42	20	98	120	3000	3
43	26	173	\N	\N	3
44	11	178	\N	\N	3
\.


--
-- Data for Name: travailler_dans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.travailler_dans (usr_id, service_id, depuis, jusqua) FROM stdin;
\.


--
-- Data for Name: unite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unite (unite_id, unite_li, unite_abrv, unite_dt_cr, unite_dern_mdf) FROM stdin;
5	Litre	L    	2024-10-08 07:55:33.0362+00	\N
6	Barre	B    	2024-10-08 07:55:33.0362+00	\N
7	Feuille	FE   	2024-10-08 07:55:33.0362+00	\N
9	Kilogramme	KG   	2024-10-08 07:55:33.0362+00	\N
10	Sac	S    	2024-10-08 07:55:33.0362+00	\N
13	Rouleau	RO   	2024-10-08 07:55:33.0362+00	\N
14	Paire	PR   	2024-10-08 07:55:33.0362+00	\N
15	Tonne	T    	2024-10-08 07:55:33.0362+00	\N
16	Boite	BTE  	2024-10-08 07:55:33.0362+00	\N
17	Ensemble	ENS  	2024-10-08 07:55:33.0362+00	\N
18	Jeu	JEU  	2024-10-08 07:55:33.0362+00	\N
19	Flacon	FL   	2024-10-08 07:55:33.0362+00	\N
20	Bouteille	BL   	2024-10-08 07:55:33.0362+00	\N
21	Tube	TB   	2024-10-08 07:55:33.0362+00	\N
22	Lot	LOT  	2024-10-08 07:55:33.0362+00	\N
23	Bidon	BD   	2024-10-08 07:55:33.0362+00	\N
24	Paquet	PQ   	2024-10-08 07:55:33.0362+00	\N
26	Millilitre	MI   	2024-10-08 07:55:33.0362+00	\N
27	Bobine	BO   	2024-10-08 07:55:33.0362+00	\N
12	Pièce	PCE  	2024-10-08 07:55:33.0362+00	\N
4	Mètre	M    	2024-10-08 07:55:33.0362+00	\N
25	Fût	FU   	2024-10-08 07:55:33.0362+00	\N
11	Mètre cube	MCB  	2024-10-08 07:55:33.0362+00	\N
1	Unité	U    	2024-10-08 07:55:33.0362+00	\N
3	Mètre linéaire	ML   	2024-10-08 07:55:33.0362+00	\N
2	Mètre carré	MCR  	2024-10-08 07:55:33.0362+00	\N
8	Kilomètre	KM   	2024-10-08 07:55:33.0362+00	\N
\.


--
-- Data for Name: unite_operationnel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unite_operationnel (unop_id, unop_li, unop_num_bu, unop_li_num_aff, unop_ref, unop_mdm_id, unop_lng, unop_ltd, unop_dt_cr, unop_dern_mdf, unop_ue, unop_ue_li) FROM stdin;
1	ETUDE TPC	2200005CR001	20048336	20048376	410784	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
2	AUTRES FRAIS DE DEVELOPPEMENT	2200005CR001	20048476	20049012	410788	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
3	MAG.CENTRE ROUTE TAMATAVE	2200002CR002	19712740	19713716	167809	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
4	DEPOT CONTAINERS CR - PK13	2200002CR001	19565217	19565341	233097	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
5	ROAD MAINTENANCE AND EARHWROKS TP	2200002CR003	19712726	19713706	240199	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
6	GENIE CIVIL PLANT SITE MAINTENANCE TP	2200002CR003	19712721	19713703	240201	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
7	MAINTENANCE PORT TAMATAVE TP	2200002CR003	19712720	19713702	240204	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
8	CHANTIERS TERMINES TRAVAUX	2200002CR001	19565231	19565355	240210	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
9	REHABILITATIONS DES DIGUES DE TANA	2200002CR001	18645515	18645714	353772	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
10	HYDROBLASTING TAMATAVE	2200002CR003	19712708	19713694	354583	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
11	SORTIES DE TANA - LOT 1	2200002CR001	18645517	18645728	357735	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
12	SORTIES DE TANA - LOT 2	2200002CR001	18645518	18645730	357736	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
13	STAR TAMATAVE	2200002CR002	19712693	19713682	368845	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
14	POINT A TEMPS ANTANANARIVO LOT1&3	2200002CR001	19533075	19565365	371563	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
15	RUELLES DE TANA PHASE III	2200002CR001	19533073	19535964	374004	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
16	TMSA 2 - PROJET VAOVAO	2200002CR001	18645538	18645751	374962	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
17	2X2 VOIES ANTANIMENA	2200002CR001	18645541	18645752	375767	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
18	REHABILITATION RN2 - LOT1	2200002CR001	19565247	19565367	380079	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
19	SPAT- QUAIS ET DARSES	2200002CR002	19712683	19713675	380082	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
20	MICTSL- REHAB VOIES POIDS LOURDS	2200002CR002	19712678	19713672	380083	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
21	SPAT- SILO ET VOIE MIXTE	2200002CR002	19712677	19713671	380084	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
22	DMSA-ROOF AND ROADS	2200002CR003	19712669	19713665	381612	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
23	STAR - VOIE NOUVELLERN7	2200002CR001	18645544	18645778	381614	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
24	RN44 LOT1ET LOT 2	2200002CR001	19565256	19565379	381682	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
25	OTI- PROJET TMF	2200002CR003	19712661	19713662	382091	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
26	RN9-LOT2	2200002CR001	18645550	18645783	383211	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
27	ROAD MAINTENANCE -2020	2200002CR003	19712660	389186 - ROAD MAINTENANCE -2020	389186	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
28	MAINT MECANIQUE -2020	2200002CR003	19712658	19713659	389189	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
29	STAR-VOIE INTERNE N�2	2200002CR001	18645551	18645798	392018	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
30	PHARMALAGASY	2200002CR001	19565262	19565393	393585	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
31	SPAT 20-RESEAUX ENTERRES	2200002CR002	19712656	19713657	394276	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
32	BARRAGE D AMBATOVY	2200002CR001	19565263	19565394	167804	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
33	MAINTENANCE QMM TP	2200002CR003	19712653	19713654	240107	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
34	HOUSE CONSTRUCTION	2200002CR001	19565273	19565400	240226	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
35	22000-ET INDUS JICA QQ - ABBATAGE/MINAGE	2200004QQ002	2200004QQ002.210452	2200004QQ002.210452	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
36	SPAT-FOURNITURE DEFENSES DE QUAI	2200002CR001	19712644	19713648	402537	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
37	CUA -POINT A TEMPS 67HA	2200002CR001	19533074	19565407	404186	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
38	ATELIER MAINTENANCE	2200002CR003	19622585	19622600	407558	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
39	VILLA MARAIS MASAY-CLOTURE	2200002CR001	19745075	19745080	409037	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
40	PAF IVATO	2200002CR001	19752563	19752572	409083	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
41	PARIF - EXUTOIRE	2200002CR001	19753780	19753806	409095	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
42	TRX - RN12	2200002CR001	19992711	19992811	410431	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
43	RNP7-TRX	2200002CR001	20007701	20007710	410515	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
44	TMP - RN12	2200002CR001	20007935	20007978	410517	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
45	FRAIS DE SECTEUR TAMATAVE	2200002CR002	20033747	410703 - FRAIS DE SECTEUR TAMATAVE	410703	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
46	LPSA - TANISOA	2200002CR001	20089896	20089914	411001	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
47	MATP - PAT A	2200002CR001	20090088	20090098	411002	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
48	TMP MATP - PAT A	2200002CR001	20095118	20510887	412982	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
49	PROJET TRAIN URBAIN - LOT 1	2200002CR001	20420822	412791 - PROJET TRAIN URBAIN - LOT 1	412791	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
50	JIRAMA LOT1	2200002CR001	20467781	20467827	412742	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
51	JIRAMA LOT 2	2200002CR001	20467995	20468023	412745	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
52	DIGUE PRODUIR	2200002CR001	20703273	413833 - DIGUE PRODUIR	413833	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
53	HFF - GIRATOIRE	2200002CR001	20707047	20707068	413845	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
54	RESIDENCE MAKI ANTANIMENA	2200003CB002	19712738	19713715	167884	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
55	STATION JOVENNA ANOSIZATO	2200003CB002	19712737	19713713	166193	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
56	PROJET CAMPUS	2200003CB002	19712736	19713712	177486	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
57	ASA ECOLE AMERICAINE	2200003CB002	19712735	19713711	181083	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
58	SAV	2200003CB002	19712733	19713708	240315	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
59	FUTURA ANDRANOMENA	2200003CB002	19712722	19713704	286675	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
60	HOTEL TWF	2200003CB002	19712719	19713701	292067	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
61	SPAT - PORT ACADEMY CENTER TOAMASINA	2200003CB002	19712717	19713700	311113	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
62	PETITS CHANTIERS FORAGE	2200003CB001	19565178	317637 - PETITS CHANTIERS FORAGE	317637	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
63	PARKING VISEO ANDRAHARO	2200003CB002	19712716	19713699	322419	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
64	RETROFITS JOVENA LOTS 1	2200003CB002	19712714	19713698	322910	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
65	CENTRALE A BETON OTC	2200003CB002	19712711	19713696	330742	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
66	VILLA XXV IVANDRY	2200003CB002	19712710	19713695	330964	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
67	R+5 IVANDRY	2200003CB002	19712704	19713692	348398	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
68	TRAVAUX D URGENCE SUR LA RN6	2200003CC001	19712697	19713688	357251	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
69	IMMEUBLE S2 IVANDRY	2200003CB002	19712696	19713687	362982	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
70	EXTENSION PARKING VISEO	2200003CB002	19712694	19713685	371308	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
71	FONDATION EXTENSION PARKING VISEO	2200003CB002	19712692	19713681	375308	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
72	REHABILITATION METROPOLE ANTANINARENINA	2200003CB002	19712689	19713680	376706	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
73	ROVA MANJAKAMIADANA	2200003CB002	19712688	19713679	380035	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
74	PROJET SANIFER 1 METRO	2200003CB002	19712687	19713678	382818	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
75	OCEAN TRADE REVETEMENTS SOLS	2200003CB002	19712686	19713677	383593	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
76	KIANJA_MASOANDRO	2200003CB002	19712685	19713676	384737	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
77	IMMEUBLE DE LUXE A AMBOHIBAO	2200003CB002	19712682	19713674	393621	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
78	SPA CENTRE DE LOISIR ALAROBIA	2200003CB002	19712679	19713673	167688	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
79	3 VILLAS IVANDRY ALAROBIA	2200003CB002	19712676	19713670	167691	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
80	48 LOGEMENTS	2200003CB002	19712673	19713669	167692	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
81	DEPOT PK13 BATIMENT	2200003CB002	19712672	19713667	167707	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
82	MATERIELS BATIMENTS	2200003CB002	19712670	19713666	349159	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
83	GRUE DEPOT	2200003CB002	19712668	19713664	392381	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
84	CHANTIERS TERMINES BGC	2200003CB002	19712667	19713663	167666	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
85	AKADIN H � ALAROBIA	2200003CB002	19712651	399286 - AKADIN H � ALAROBIA	399286	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
86	RESIDENCE K. NISSA IVANDRY	2200003CB002	19712648	19713651	397788	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
87	TRAVAUX DE VRD AU HTWF	2200003CB002	19712649	19713652	400259	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
88	COMPLEXE HOTELIER ET RESIDENTIEL A ANDAK	2200003CB002	19712646	399586 - COMPLEXE HOTELIER ET RESIDENTIEL A ANDAK	399586	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
89	ACCES AUX ENTREPOTS ANOSIVAVAKA	2200003CB001	19565197	19565329	397649	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
90	ATELIER BOIS	2200003CB003	19577759	407122 - ATELIER BOIS	407122	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
91	ATELIER FER	2200003CB004	19578059	407127 - ATELIER FER	407127	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
92	ATELIER FERRAILLAGE	2200003CB004	19578321	407132 - ATELIER FERRAILLAGE	407132	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
93	FONDATION MALAGA RESIDENCE II	2200003CB001	19754338	19754348	409100	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
94	MALAGA RESIDENCE II	2200003CB002	19754394	19754415	409101	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
95	IMMEUBLE BLUELINE	2200003CB002	19754461	19754526	409102	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
96	STATION SERVICE TOTAL "NY ANTSIKA": GENI	2200003CB002	19830977	19831067	409690	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
97	STATION SERVICE TOTAL "NY ANTSIKA" - AUV	2200003CB002	19830977	19831506	409694	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
98	IMMEUBLE DYVE (AQUAMAD)	2200003CB002	20073516	20073521	410903	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
99	SONDAGE ANDRALANITRA - GEOTECHNIQUE	2200003CB001	20337983	20339138	412159	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
100	DIAGNOISTIC STRUCTUREL INTH	2200003CB002	20475581	20475611	412776	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
101	TOZZI GREEN FONDATION DES PYLONES FARAHA	2200003CB001	20659449	20659533	413635	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
102	TOZZI GREEN SOUS-STATION ANOSIZATO	2200003CB001	20659449	20659660	413636	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
103	FRAIS GENERAUX AGENCE                   	2200001AD001	2200001AD001.320000	2200001AD001 - FRAIS GENERAUX SIEGE - 320000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
104	SERVICE INFORMATIQUE                     	2200001AD001	2200001AD001.300800	2200001AD001 - SERVICE INFORMATIQUE - 300800	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
105	GIE ECHANGEUR OI                        	2200001AD001	581000	581000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
106	FRAIS GENERAUX DROI                     	2200001AD001	330300	330300	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
107	FRAIS DE SIEGE                          	2200001AD001	330100	330100	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
108	SERVICE  ACHAT                          	2200001AD001	300700	2200001AD001 - SERVICE ACHAT - 300700	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
109	SERVICE SURETE                          	2200001AD001	300290	2200001AD001 - SERVICE SURETE - 300290	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
110	DEPENSE A REFACTURER                    	2200001LABOR	111900	111900	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
111	RSE - SPONSORING                        	2200001AD001	301600	2200001AD001 - SERVICE COMMUNICATION - 301600	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
112	LABORATOIRE                             	2200001SL001	10009152	2200001SL001 - SERVICE LABORATOIRE	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
113	DTEI	2200001SO001	10009153	2200001SO001 - SERVICE DTEI	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
114	FRAIS- COVID-19                         	2200001AD001	300630	300630	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
115	ATELIER GM                             	2200006EQUIP	102000	102000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
116	CESSION MAT RICHIE & BROSS              	2200006AD001	503000	503000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
117	BARGE EXPRESS                          	2200006ST001	\N	2200006ST001.10009202 - BARGE EXPRESS	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
118	MAG. GM TNR                            	2200006EM002	10009199	10009199	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
119	STAND BY CONDUCTEUR	2200006EQUIP	102200	102200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
120	FRAIS GM -SECTEUR TANA CRMI             	2200002SM001	10010709	10010709	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
121	FRAIS GM -SECTEUR TAMATAVE    	2200002SM002	10010710	10010710	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
122	FRAIS GM INDUSTRIES TAMATAVE            	2200004SM001	10010712	10010712	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1591	CENTRE GESTION MATERIEL
123	FRAIS GM INDUSTRIES TANA                	2200004SM002	10010713	10010713	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
124	FRAIS GM - CBCI                         	2200003SM001	10009171	10009171	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
125	22000-ET INDUS PK13 QQ -  ABBATAGE/MINAGE	2200004QQ001	2200004QQ001. 210452	2200004QQ001. 210452	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
126	22000-ET INDUS AMBOKATRA QQ - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200004QQ003	2200004QQ003.200200	2200004QQ003.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
127	22000-ET INDUS PK13 PH - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200004PH001	2200004PH001.200200	2200004PH001.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
128	POSTE ENROBE GENIE TAMATAVE TP          	2200004PH003	10009186	10009186	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
129	PREFABRICATION GENIE TAMATAVE TP        	2200004BM004	10009178	10009178	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
130	BPE TANA - PK13                         	2200004BM001	10009175	10009175	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
131	  22000-ET INDUS PK13 PH - MATIERES PREMIERES  	2200004PH001	2200004PH001.200124	2200004PH001.200124	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
132	USINE EMULSION GENIE TAMATAVE TP        	2200004PE003	10009183	10009183	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
133	PREFABRICATION-DEPOT                    	2200004BB001	10009174	10009174	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
134	BETON PRET A L'EMPLOI-DEPOT             	2200004BM003	2200004BM003 -  BPE DEPOT ANOSIBE - 200500	2200004BM003 -  BPE DEPOT ANOSIBE - 200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
135	TRX � RN9 PAIR	22000002CR001	20988996	20988997	415175	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
136	CENTRALE A BETON MALAGA II	2200004BM007	\N	2200004BM007.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
137	FRAIS GENERAUX FORAGE    	2200003AD001	\N	300400	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
138	FRAIS GENERAUX CGBC    	2200003AD001	310000	2200003AD001 - FRAIS GENERAUX BATIMENT - 310000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
139	SERVICE QHSE	2200001AD001	300600	2200001AD001 - SERVICE QHSE - 300600	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
140	SERVICE MEDICAL	2200001AD001	\N	2200001AD001 - SERVICE MEDICAL - 300610	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
141	FRAIS ENCADREMENT AGENCE	2200002CR001	290000	2200002CR001 - FRAIS ENCADREMENT ROUTE TANA	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
142	FRAIS GENERAUX DIREXPL 	2200002AD001	\N	2200002AD001 - FRAIS GENERAUX ROUTE	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
143	 FRAIS GENERAUX GM                      	2200006AD001	\N	310000-GM	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
144	FRAIS GM - CHARGES D'EXPLOITATION CRMI	2200002SM003	\N	10010711	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
145	FRAIS GENERAUX A FACTURER A CMBI    	2200001AD001	\N	301500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
146	SERVICE TOPO	2200002AD001	301100	2200002AD001 - SERVICE TOPO - 301100	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
147	SERVICE COMPTABILITE	2200001AD001	300300	2200001AD001 - SERVICE FINANCE  SIEGE - 300300	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
148	SERVICE RH	2200001AD001	300200	2200001AD001 - SERVICE RH - 300200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
149	Popote	2200001AD001	2200001AD001.300400	25559896 - Popote	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
150	BUREAU ETUDE DE PRIX RPM	2200002AD001	301200	2200002AD001 - BUREAU D'ETUDE ROUTE - 301200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
151	BIUREAU ETUDE DE PRIX BGC	2200003AD001	301200-BAT	2200003AD001 - ETUDE DE PRIX BATIMENT - 301200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
152	STATION-SERVICE GALANA NOFY ANKORONDRANO 	2200003CB002	21389649	21389650	416931	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
153	 FRAIS DISTRIBUTION CARBURANT   	2200006EQUIP	102300	102300	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
154	FRAIS GENERAUX SECTEUR TAMATAVE - CRMI  	2200002AD001	2200002AD001.300400	2200002AD001.300400	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
155	Carri�re Handouli	2204001QQ001	10010755	10010755	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
156	AP TRIBALIER Thomas	AP TRIBALIER Thomas	128189	AP TRIBALIER Thomas	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
157	AP FERRAZI Richard	AP FERRAZI Richard	109507	AP FERRAZI Richard	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
158	22000-ET INDUS PK13 QQ - TRAITEMENT	2200004QQ001	2200004QQ001.210250	2200004QQ001.210250	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
159	22000-ET INDUS PK13 PE - TRAITEMENT	 2200004PE001 	2200004PE001.200500	2200004PE001.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
160	22000-ET INDUS PK13 PH - TRAITEMENT	2200004PH001	2200004PH001.200500	2200004PH001.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
161	22000-ET INDUS PK13 BM	 2200004BM001 	2200004BM001.200500	2200004BM001.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
162	22000-ET INDUS AMBOKATRA PH - TRAITEMENT	2200004PH003	2200004PH003.200500	2200004PH003.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
163	22000-ET INDUS AMBOKATRA BM	2200004BM004	2200004BM004.200500	2200004BM004.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	Industries
164	22000-ET INDUS AMBOKATRA QQ - TRAITEMENT	2200004QQ003	2200004QQ003.210250	2200004QQ003.210250	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
165	22000-ET INDUS JICA QQ - TRAITEMENT	2200004QQ002	2200004QQ002.210250	2200004QQ002.210250	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
166	22000-ET INDUS AMBOKATRA PE - TRAITEMENT	2200004PE003	2200004PE003.200500	2200004PE003.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
167	AP BOUET STEPHANE	AP BOUET STEPHANE	254187	AP BOUET STEPHANE	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
168	GREEN YELLOW 2	2200002CR001	21853893	2200002CR001.21853893	422 675	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE BATIMENT
169	FRAIS ENCADREMENT BATIMENT TRAVAUX	2200003CB002	2200003CB002.290000	2200003CB002 - FRAIS ENCADREMENT BATIMENT TRAVAUX	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE BATIMENT
170	22000-ET INDUS AD	2200004AD001	2200004AD001.310000	2200004AD001.310000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	Industries
171	STAR AMBATOLAMPY - VRD	2200002CR001	2200002CR001.22163637	2200002CR001.22163638	423 691	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE ROUTES ET GENIE CIVIL
172	TRX � RN58A	2200002CR001	\N	2200002CR001.22362048	424362	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
173	IMMEUBLE AKADIN I ANKORONDRANO	2200003CB002	2200003CB002.22244457	423930 - IMMEUBLE AKADIN I	423930	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
174	RUELLES TANA III - 2�me phase	2200002CR001	2200002CR001.22468770	424690 - RUELLES TANA III - 2�me phase	424690	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
176	AP DIAS Anthony	AP DIAS Anthony	263976	AP DIAS Anthony	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
177	AP ROGER Alain	AP ROGER Alain	137943	AP ROGER Alain	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
178	22000-ET ROUTE GC EQ	2200002EQUIP	\N	2200002EQUIP.102000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1591	CENTRE GESTION MATERIEL
179	TRX RN6	220005AD001	\N	220005AD001.301400 	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRAND PROJET
180	22000-ET INDUS ANTSIRANANA QQ	2200004QQ004	\N	2200004QQ004.210250	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	Industries
181	FONDATION AKADIN I	2200003CB001	22520770	2200003CB001.22520771	424848	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
182	22000-ET INDUS JICA QQ - FRAIS ENCADREMENT	2200004QQ002	2200004QQ002.290000	2200004QQ002.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
183	TRX - PROCONICS	2200002CR001	\N	2200002CR001.23067050	426618	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
184	220003-EQUIP-GM.BAT	2200003EQUIP	\N	2200003EQUIP.102000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1591	CENTRE GESTION MATERIEL
185	AP ARZANI Laurent	AP ARZANI Laurent	131029	AP ARZANI Laurent	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
186	AP LE BORGNE DAVID	AP LE BORGNE DAVID	267837	AP LE BORGNE DAVID	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
187	2200004EQUIP-22000-ET INDUS EQ	2200004EQUIP	778965	2200004EQUIP.778965	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1593	Industries
188	VOLATSARA Elisabeth	Villa 10   Zone FORELLO 	CHEQUE	VOLATSARA Elisabeth	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	EXT	CLIENT EXTERNE
189	DEPLOIEMENT LOGICIEL	2200001AD001	300500	2200001AD001 - DEPLOIEMENT LOGICIEL - 300500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1597	SIEGE COLAS MADAGASCAR
190	FONCTIONNEMENT ATELIER GM	2200006EQUIP	2200006EQUIP.102000	2200006EQUIP - FONCTIONNEMENT ATELIER GM - 102000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
191	RN6 - LOT 2 Amen� du mat�riel	2200005CR004	\N	2200005CR004.23396998	427524 	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
192	RN6 - LOT 1 Amen� du mat�riel	2200005CR003	\N	2200005CR003.23424554	427247   	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
193	22000-ET RTE DEPOT AT GP1 SM	2200002SM004	\N	10014918	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
194	SONDAGE TPC	2200003CB001	2200003CB001.23539027	428193 - SONDAGE TPC	428193	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
195	RN6 LOT 2 - Frais de fonctionnement	2200005CR004	\N	23397068 - I11. Frais de fonctionnement	427524	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
196	RN6 LOT 1 - Frais de fonctionnement	2200005CR003	\N	23424617 - I11. Frais de fonctionnement	427247	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
197	RN6 LOT 1 - PREFA	2200005BB002	\N	2200005BB002.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
198	RN6 LOT 2 - PREFA	2200005BB003	\N	2200005BB003.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
199	ATELIER GM RN6	2200005SM001	\N	10017022	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
200	22000-ET BAT EQ - CENTRALE A BETON IMER BTK1008	2200003EQUIP	\N	2200003EQUIP.678655	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
201	22000-ET INDUS RN6 LOT1 QQ- TRAITEMENT	2200005QQ002	2200005QQ002.210250 	2200005QQ002.210250 	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
202	22000-ET INDUS RN6 LOT2 QQ- TRAITEMENT	2200005QQ003	2200005QQ003.210250	2200005QQ003.210250	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
203	PMD AMBOHIMANAMBOLA 	2200003CB002	2200003CB002.23729716	428833 - PMD ET USINE DE SAVON A AMBOHIMANAMBOLA	428833	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
204	SHOWROOMS ET BUREAUX ANOSIVAVAKA 	2200003CB002	2200003CB002.23730992	428839 - SHOWROOMS ET BUREAUX ANOSIVAVAKA	428839	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
205	DOUBLON � SUPPRIMER	2200003CB002	2200003CB002.23730993	2200003CB002.23730992	428839	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
206	Frais de secteur encadrement TANA	2200002CR001	\N	2200002CR001.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
207	MADARAIL � FOURNITURES DE BALLAST	2200002CR001	2200002CR001.24334661	2200002CR001.24665662	435961	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
208	TRX - HITA	2200002CR001	\N	2200002CR001.23813535	429033	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
209	Pont  Ranozaza	2200002CR001	\N	2200002CR001.21111595	415637	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
210	DALLAGE HANGAR IVATO	2200003CB002	\N	2200003CB002.24452364	436637	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
211	22000-ET INDUS AMBOKATRA QQ - FRAIS ENCADREMENT	2200004QQ003	2200004QQ003.290000	2200004QQ003.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
212	RN6 - LOT 1 CTX Ppal Terrass/Chauss�e - D.	2200005CR003	\N	2200005CR003.23424552	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
213	RN6 LOT 2 - PERSONNEL AGENCE	2200005CR004	\N	2200005CR004.23397067	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
214	RN6 - LOT 1 DTX -JGA	2200005CR003	\N	2200005CR003.23424551	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
215	RN6 LOT 2 - DTX P CHAUMAY	2200005CR004	\N	2200005CR004.23397059	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
216	RN6 LOT 1 - CTX PPAL JRA	2200005CR003	\N	2200005CR003.23424610	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
217	RN6 LOT 1 - D�penses AB � r�partir	2200005CR003.	\N	2200005CR003.23424611	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
218	CAB TSARASAOTRA	2200004BM007	2200004BM007.10010730	2200004BM007 -  BPE MALAGA - 200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
219	CLIENTS DIVERS TRAVAUX	22000CMDM393117	\N	18702665	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
220	RN6 LOT 1 - Personnel Agence	2200005CR003	\N	2200005CR003.23424616	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
221	RN6 LOT 2 - CTX OA -G.MICKAEL	2200005CR004	\N	2200005CR004.23397062	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
222	RN6 - LOT 2 CTX Terrassement R.RAKOTO	2200005CR004	\N	2200005CR004.23397065	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
223	FONDATION SHOWROOM ANOSIVAVAKA 	2200003CB002	2200003CB002.24777677	2200003CB002.24777678	438310	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
224	PLATINIUM TOWER ALAROBIA	2200003CB002	2200003CB002;24854310	438638 -  PLATINIUM TOWER	438638	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
225	RN6 - LOT 1 CCH Ppal OA - JP. BERNARD	2200005CR003	\N	2200005CR003.23424553	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
226	RESIDENCE ANAKEA ANDROHIBE 	 2200003CB002	2200003CB002.24374812	 2200003CB002.24374813	 436212	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE ROUTES ET GENIE CIVIL
227	IMMEUBLE NEW YORK ANDRAHARO	2200003CB002	2200003CB002.25360845	2200003CB002.25360846	440906	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
228	FONDATION PLATINIUM TOWER	2200003CB002	2200003CB002.25474138	2200003CB002.25474140	441800	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
229	FONDATION IMMEUBLE NEW YORK	2200003CB002	2200003CB002.25547886	2200003CB002.25547887	442140	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
230	Service Juridique	2200001AD001	\N	2200001AD001 - SERVICE JURIDIQUE - 300900	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
231	RNO LOT2 CTX Ppal Terrass/Chauss�e - BALSAMA	2200005CR004	\N	2200005CR004.23397060	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
232	MENUISERIES INTERIEURES MALAGA II 	2200003CB002	2200003CB002.23784844	2200003CB002.23784845	428978	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
233	IMMEUBLE S3 ALAROBIA	2200003CB002	2200003CB002.25185930	2200003CB002.25185931	440290	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
234	TPC-Frais de fonctionnement	2200005CB001	\N	25559895 - Frais de fonctionnement	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
235	RN6 LOT2 - Mise en place des industries	2200005CR004	\N	2200005CR004;23396999	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
236	IMMEUBLE R+9  ANKORONDRANO	2200003CB002	2200003CB002;26450774	449429 - IMMEUBLE R+9 ANKORONDRANO	449429	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
237	TPC - BATIMENT	2200005CB001	\N	2200005CB001.26337484	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
238	FONDATION IMMEUBLE R+9  	2200003CB002	2200003CB002.26480930	2200003CB002.26480931	449512	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
239	SPAT	2200003CB002	2200003CB002.19712717	2200003CB002.19713700	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
240	RN6 LOT1 F3. OA neufs BK 500 � 524	2200005CR003	2200005CR003.232224244	2200005CR003.23424592	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
241	FRAIS ENCADREMENT FORAGE	2200003CB001	\N	2200003CB001.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
242	2200002CR003-FRAIS ENCADREMENT ROUTE MAINTENANCE	2200003CR003	\N	2200003CR003.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	CENTRE ROUTES ET GENIE CIVIL
243	RN13  AMBOVOMBE � TAOLAGNARO 	2200005CR001	\N	458080 - RN13  AMBOVOMBE � TAOLAGNARO 	458080	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
244	 FRAIS GENERAUX GRANDS PROJETS 	2200005AD001	\N	2200005AD001.310000 - FRAIS GENERAUX GRANDS PROJETS	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
245	TPC - Albin Vanacker 	220005CB001	\N	26959639 - RSP M A.VANACKER	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
246	TPC - Denis Haumesser	220005CB001	\N	25618867 - DPJ2 D. HAUMESSER	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
247	TPC - Patrick Hastoy	220005CB001	\N	25559890 - DT P. HASTOY	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
248	TPC - David Martinat	220005CB001	\N	25559891 - DPA D. MARTINAT	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
249	TPC - Louis BINET	220005CB001	\N	26337484 - CTX L.BINET	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
250	TPC - Marc Arnaud SAULNEROND	220005CB001	\N	25559893 - CDG MA. SAULNEROND	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
251	TPC - V.I.E	220005CB001	\N	25559894 - V.I.E	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
252	FRAIS LOGISTIQUE ET TRANSPORT	2200006ST002	\N	10010714	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1591	CENTRE GESTION MATERIEL
253	Route et GC Maintenance CR - Encadrement	2200002AD001	\N	2200002AD001.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE ROUTE
254	TPC installation de chantier	220005CB001	\N	220005CB001.27747785	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
255	RN6 Lot1 - joints de chauss�e 	2200005CR003	\N	2200005CR003.23424591	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE ROUTE
256	RN6 Lot2 -  joints de chauss�es	2200005CR004	\N	2200005CR004-23397035	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE ROUTE
257	CHARPENTE ATELIER GM DEP�T	2200003CB004	2200003CB004.28026745	2200003CB004.28026750	454737	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
258	ACCES ROAD - PIPELINE	2200002CR002	2200002CR002.28034062	454751 - ACCES ROAD - PIPELINE	454751	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE ROUTE
259	22000-ET INDUS RN13 PH - TRAITEMENT	2200005PH001	2200005PH001.200500	2200005PH001.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
260	22000-ET INDUS RN13 QQ - TRAITEMENT	2200005QQ001	2200005QQ001.210250	2200005QQ001.210250	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
261	ATELIER GM RN13	2200005SM002	\N	10017023	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1591	GM
262	TPC - MOREL Alexandre	220005CB001	\N	26337482 - DTX A. MOREL	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
263	22000-ET INDUS RN6 LOT2 PH - TRAITEMENT	2200005PH003	2200005PH003.200500	2200005PH003.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
264	USINE TEXTILE AKANJO	2200003CB002	\N	462521 - USINE TEXTILE AKANJO	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
265	THE BUREAU	2200003CB002	\N	456441 - THE BUREAU	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
266	MINOTERIE DE TAMATAVE 	200003CB002	29094643	463843 - MINOTERIE DE TAMATAVE 	463843	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
267	RN13 - A2. Mise en place des industries	CB2200005CR007	\N	28978439 - A2. Mise en place des industries	28978439	\N	\N	2024-10-07 06:08:23.94325+00	\N	1593	INDUSTRIES
268	RN13 FRAIS FONCTIONNEMENT	2200005CR001	\N	28985886 - RN13 FRAIS FONCTIONNEMENT	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
269	TPC Outils sp�ciaux	2200005CB001	\N	29487734-TPC outils sp�ciaux	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
270	22000-ET INDUS RN13 - BB	2200005BB001	\N	2200005BB001.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
271	22000-ET INDUS RN13 - BM	2200005BM001	\N	2200005BM001.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
272	22000-ET INDUS RN13 PE - TRAITEMENT	2200005PE002	2200005PE002.200500	2200005PE002.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
273	MAGASIN CENTRAL RN13 	2200005TE001	\N	2200005TE001.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
274	STAR DIEGO - VRD	2200002CR001	2200002CR001.29744936	467981 - STAR DIEGO - VRD	467 981	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE ROUTE
275	FONDATION THE BUREAU	2200003CB001	2200003CB001.29386467	465300 - FONDATION THE BUREAU	465300	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
276	22000-ET INDUS RN6 LOT2 PE - TRAITEMENT	2200005PE001	2200005PE001 .200500	2200005PE001 .200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
277	TPC - D�voiement assainissement SMA	220005CB001	\N	27432712-D�voiement assainissement SMA	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
278	Business Developpement 	2200001AD001	\N	2200001AD001 - Business Developpement -301700	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1597	SIEGE COLAS MADAGASCAR
279	TPC GARE 1 ANOSY	2200003CB002	30116049	30116050-TPC GARE 1 ANOSY	470074	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
280	TPC GARE 2 SOARANO	2200003CB002	30499033	30499034 - TPC GARE 2 SOARANO	472056	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
281	TPC Plateforme PK13	2200002CR001	\N	30273177 - TPC Plateforme PK13	470813	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTE
282	TPC montage pyl�nes	2200005CB001	\N	27740060 - Montage RM	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
283	22000-ET INDUS RN6 LOT1 PH - TRAITEMENT	2200005PH002	2200005PH002.200500	2200005PH002.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
284	Forage TPC gare G02_O	2200003CB001	\N	472107 - Forage TPC gare G02_O	472107	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
285	Mise en Place des industries C09	2200005CR004	\N	23396999_A2 Mise en Place des industries	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	COLAS MADA GRANDS PROJETS
286	SHOWROOM TOYOTA ANKORONDRANO 	2200003CB002	30890664	30890666 - SHOWROOM TOYOTA ANKORONDRANO 	474009	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
287	MAGASIN CENTRAL RN6 LOT 1	2200005TE002	\N	2200005TE002.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
288	MAGASIN CENTRAL RN6 LOT 2	2200005TE003	\N	2200005TE003.200500	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
289	 RN6 - 2�me pr�fa C09	2200005BB004	\N	2200005BB004 -  RN6 - 2�me pr�fa C09	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
290	PIEUX PYLONES TPC 	2200003CB001	30509499	30509500 - PIEUX PYLONES TPC 	472108	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
291	PYLONES TPC 	2200003CB001	30498289	30498290 - PYLONES TPC 	472049	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
292	FONDATION GARE 1 ANOSY	2200003CB001	29818684	29818686 - FONDATION GARE 1 ANOSY	468542	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
293	FONDATION GARE 2 SOARANO	2200003CB001	30509234	30509235 - FONDATION GARE 2 SOARANO	472107	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
294	TPC GARE 4 ANKORONDRANO	2200003CB002	31092352	31092354 - TPC GARE 4 ANKORONDRANO	475129	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
295	TPC Construction Ouverture M�tallique	2200005CB001	\N	31365219 - Construction Ouverture M�tallique	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
296	FONDATION TPC GARE G04	2200003CB001	31306917	31306918-FONDATION TPC GARE G04_O	476017	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
297	TRX RNP7 - ANTSIRABE	2200002CR001	\N	31794629 -  TRX RNP7 - ANTSIRABE	478014	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTE
298	MINOTERIE DE TAMATAVE TRANCHE 2 	2200003CB002	\N	 31833926 - MINOTERIE DE TAMATAVE TRANCHE 2 	478252	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
299	FONDATION SHOWROOM TOYOTA	2200003CB001	32482696	32482697 - FONDATION SHOWROOM TOYOTA	481225	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
300	travaux d�am�nagement Zone Industrielle AMPITATAFIKA 	2200002CR001	32339473	32339475 - travaux d�am�nagement Zone Industrielle AMPITATAFIKA 	480203	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTE
301	TPC GARE 6 ANALAMAHINTSY COLISEUM	2200003CB002	32562176	32562179	481478	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
302	VRD  - TOYOTA	2200002CR001	31233380	31233383	475728	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE ROUTE
303	SCIM - TAMATAVE	2200002CR003	31264772	31264774	475850	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE ROUTE
304	DMSA � TRAVERSEE RN2	2200002CR003	31278577	31278579	475911	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE ROUTE
305	FONDATION TPC GARE G6	2200003CB001	32628024	32628026	481705	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
306	FONDATION MINOTERIE TRANCHE 2	2200003CB001	32585436	32585438	481559	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	CENTRE BATIMENT
307	22000-ET INDUS RN13 BEHARA QQ � TRAITEMENT	2200005QQ004	\N	2200005QQ004.210250	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
308	IMMEUBLE AKADIN N ALAROBIA 	2200003CB002	32853749	32853750	482418	\N	\N	2024-10-07 06:08:23.94325+00	\N	1596	CENTRE BATIMENT
309	TPC 25559898\tInformatique	 2200005CB001	\N	TPC 25559898\tInformatique	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	\N
310	TPC Gare motrice	2200005CB001	\N	31122393 Gare motrice	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	\N
311	TPC- REMONTEES MECANIQUES	2200005CB001	25555376	2555376 - TPC- REMONTEES MECANIQUES	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1589	\N
312	TPC FONDATION GARE G7	2200003CB001	33323534	33323535 - TPC FONDATION GARE G7	484060	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
313	FONDATION AKADIN N	2200003CB001	33725889	33725891 - FONDATION AKADIN N	493333	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
314	22000-ET INDUS PK13 QQ - VENTE	2200004QQ001	2200004QQ001.200300	2200004QQ001.200300	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
315	22000-ET INDUS PK13 QQ - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200004QQ001	2200004QQ001.200200	2200004QQ001.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
316	22000-ET INDUS PK13 PE - MATIERES PREMIERES	2200004PE001	2200004PE001.200124	2200004PE001.200124	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
317	22000-ET INDUS PK13 PE - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200004PE001	2200004PE001.200200	2200004PE001.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
318	22000-ET INDUS AMBOKATRA PH -  MATIERES PREMIERES	2200004PH003	2200004PH003.200124	2200004PH003.200124	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1593	CENTRE INDUSTRIES
319	22000-ET INDUS AMBOKATRA PH -  AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200004PH003	2200004PH003.200200	2200004PH003.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1593	CENTRE INDUSTRIES
320	22000-ET INDUS AMBOKATRA PH -  FRAIS ENCADREMENT	2200004PH003	2200004PH003.290000	2200004PH003.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	1593	CENTRE INDUSTRIES
321	22000-ET INDUS AMBOKATRA PE -  MATIERES PREMIERES	2200004PE003	2200004PE003.200124	2200004PE003.200124	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
322	22000-ET INDUS AMBOKATRA PE -  AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200004PE003	2200004PE003.200200	2200004PE003.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
323	22000-ET INDUS AMBOKATRA PE -  FRAIS ENCADREMENT	2200004PE003	2200004PE003.290000	2200004PE003.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
324	22000-ET INDUS AMBOKATRA QQ - ABBATAGE/MINAGE	2200004QQ003	2200004QQ003.210452	2200004QQ003.210452	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
325	22000-ET INDUS AMBOKATRA QQ - VENTES	2200004QQ003	2200004QQ003.200300	2200004QQ003.200300	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
326	22000-ET INDUS JICA QQ - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200004QQ002	2200004QQ002.200200	2200004QQ002.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
327	22000-ET INDUS RN13 QQ - ABBATAGE/MINAGE	2200005QQ001	2200005QQ001.210452	2200005QQ001.210452	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
328	22000-ET INDUS RN13 QQ - VENTES	2200005QQ001	2200005QQ001.200300	2200005QQ001.200300	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
329	22000-ET INDUS RN13 QQ - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200005QQ001	2200005QQ001.200200	2200005QQ001.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
330	22000-ET INDUS RN13 QQ - FRAIS ENCADREMENT	2200005QQ001	2200005QQ001.290000	2200005QQ001.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
331	22000-ET INDUS RN13 PH - MATIERES PREMIERES	2200005PH001	2200005PH001.200124	2200005PH001.200124	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
332	22000-ET INDUS RN13 PH - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200005PH001	2200005PH001.200200	2200005PH001.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
333	22000-ET INDUS RN6 LOT1 QQ- ABBATAGE/MINAGE	2200005QQ002	2200005QQ002.210452	2200005QQ002.210452	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
334	22000-ET INDUS RN6 LOT1 QQ- VENTES	2200005QQ002	2200005QQ002.200300	2200005QQ002.200300	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
335	22000-ET INDUS RN6 LOT1 QQ- AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200005QQ002	2200005QQ002.200200	2200005QQ002.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
336	22000-ET INDUS RN6 LOT2 QQ- ABBATAGE/MINAGE	2200005QQ003	2200005QQ003.210452	2200005QQ003.210452	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
337	22000-ET INDUS RN6 LOT2 QQ- VENTES	2200005QQ003	2200005QQ003.200300	2200005QQ003.200300	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
338	22000-ET INDUS RN6 LOT2 QQ- AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200005QQ003	2200005QQ003.200200	2200005QQ003.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
339	22000-ET INDUS RN6 LOT1 PH - MATIERES PREMIERES	2200005PH002	2200005PH002.200124	2200005PH002.200124	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
340	22000-ET INDUS RN6 LOT1 PH - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200005PH002	2200005PH002.200200	2200005PH002.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
341	22000-ET INDUS RN6 LOT2 PH - MATIERES PREMIERES	2200005PH003	2200005PH003.200124	2200005PH003.200124	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
342	22000-ET INDUS RN6 LOT2 PH - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200005PH003	2200005PH003.200200	2200005PH003.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
343	22000-ET INDUS RN6 LOT2 PE - MATIERES PREMIERES	2200005PE001	2200005PE001 .200124	2200005PE001 .200124	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
344	22000-ET INDUS RN6 LOT2 PE - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200005PE001	2200005PE001 .200200	2200005PE001 .200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
345	22000-ET INDUS RN13 PE - MATIERES PREMIERES	2200005PE002	2200005PE002.200124	2200005PE002.200124	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
346	22000-ET INDUS RN13 PE - AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200005PE002	2200005PE002.200200	2200005PE002.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
347	22000-ET INDUS PK13 QQ- FRAIS ENCADREMENT	2200004QQ001	2200004QQ001.290000	2200004QQ001.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
348	22000-ET INDUS PK13 PE- FRAIS ENCADREMENT	2200004PE001	2200004PE001.290000	2200004PE001.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
349	22000-ET INDUS PK13 PH- FRAIS ENCADREMENT	2200004PH001	2200004PH001.290000	2200004PH001.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
350	22000-ET INDUS RN6 LOT2 - FRAIS ENCADREMENT	2200005QQ003	2200005QQ003.290000	2200005QQ003.290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE INDUSTRIES
351	TPC GARE 5 ARTEC	2200003CB002	2200003CB002.33861922	2200003CB002.33861923	494129	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE BATIMENT
352	TPC GARE 7 AMBATOBE	2200003CB002	2200003CB002.33863085	2200003CB002.33863087	494130	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE BATIMENT
353	TRX � BOULEVARD RATSIMILAHO TAMATAVE	2200002CR002	2200002CR002.33077162	2200002CR002.33077163	483121	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
354	MICTSL � FOURNITURES ANCRAGES	2200002CR002	2200002CR002.33066743	2200002CR002.33066745	483084	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
355	DMSA � COOLING TOWER REPLACEMENT	2200002CR003	2200002CR003.32784531	2200002CR003.32784532	482175	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTES ET GENIE CIVIL
356	22000-ET INDUS RN13 BEHARA QQ � ABBATAGE/MINAGE	2200005QQ004	\N	2200005QQ004.210452	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
357	TPC Trvx Suppl�mentaires POMA	2200005CR002	\N	2200005CR002.34131703	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS\t
358	Concasseur secondaire 3STD PK13	\N	\N	A7000089	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1591	CENTRE GESTION MATERIEL
359	22000-ET INDUS JICA QQ - VENTES	2200004QQ002	2200004QQ002.200300	2200004QQ002.200300	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
360	RN6 lot 02 phase E5	2200005CR004	\N	2200005CR004;23397024 phase E5	427524	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE GRANDS PROJETS
361	22000-ET INDUS RN13 BEHARA QQ � AUTRES FRAIS DE PRODUCTION INDUSTRIES	2200005QQ004	\N	2200005QQ004.200200	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
362	290000-IX-ENCADREMENT ROUTE TAMATAVE CR	\N	\N	290000	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTE
363	Amen� installation replis mat�riel 	2200005CR001	\N	28962564 - amen� installation replis mat�riel 	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	\N	\N
364	MAHATONY - installation chantier 	2200003CB007	\N	2200003CB007.34571141	497466	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
365	RN13 - Amen� installation replis mat�riel	2200005CR001	\N	2200005CR001.28962564	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
366	PARKING PRADON ANTANIMENA 	2200003CB002	34693258	2200003CB002.34693261	498057	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
367	FONDATION SKYLINE P1	2200003CB001	34877636	2200003CB001.34877637	499051	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
369	SKYLINE P1 - D�marrage	2200003CB006	33883062	2200003CB006.33941479	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
370	SKYLINE P1 - FRAIS DE CHANTIER P1	2200003CB006	33883062	2200003CB006.35014942	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
371	SKYLINE P1 - TERRASSEMENTS P1	2200003CB006	33883062	2200003CB006.35014943	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
372	SKYLINE P1 - FONDATIONS P1	2200003CB006	33883062	2200003CB006.35014944	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
373	SKYLINE P1 - PB RDC P1	2200003CB006	33883062	2200003CB006.35014945	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
374	SKYLINE P1 - PH RDC P1	2200003CB006	33883062	2200003CB006.35014946	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
375	SKYLINE P1 - PH R1 P1	2200003CB006	33883062	2200003CB006.35014947	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
376	SKYLINE P1 - PH R2 P1	2200003CB006	33883062	2200003CB006.35014948	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
377	SKYLINE P1 - PH R3 P1	2200003CB006	33883062	2200003CB006.35014949	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
378	SKYLINE P1 - PH R4 P1	2200003CB006	33883062	2200003CB006.35014950	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
379	SKYLINE P1 - PH R5 P1	2200003CB006	33883062	2200003CB006.35014951	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
380	SKYLINE P1 - PH R6 P1	2200003CB006	33883062	2200003CB006.35014952	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
381	SKYLINE P1 -PH R7 P1	2200003CB006	33883062	2200003CB006.35014953	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
382	SKYLINE P1 -PH R8 P1	2200003CB006	33883062	2200003CB006.35014954	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
383	SKYLINE P1 -OUVRAGES+TT P1	2200003CB006	33883062	2200003CB006.35014955	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
384	SKYLINE P1 -FINITIONS P1	2200003CB006	33883062	2200003CB006.35014956	494235	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
385	MUR DE SOUTENEMENT PK13	2200003CB002	34969141	2200003CB002.34969142	499457	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
386	TPC EQUIPEMENTS SPECIFIQUES	2200005CB001	\N	2200005CB001.30226942	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE BATIMENT
387	FONDATION RN6	2200003CB001	35815248	2200003CB001.35815252	504722	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
389	TPC  Chargement / D�chargement	2200005CB001	\N	2200005CB001.30419361	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE2009	CENTRE GRANDS PROJETS
390	Frais de chantier SPAT- QUAI 7	2200002CR004	354783 65	2200002CR004.35862429	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1596	CENTRE ROUTE
391	FONDATION TPC GARE G3	2200003CB001	36705441	36705442-FONDATION TPC GARE G3	509153	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
392	TPC GARE 3 FRAISE 	2200003CB002	36705264	36705265-TPC GARE 3 FRAISE 	509150	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
393	22000-ET INDUS RN6 LOT1 PE - TRAITEMENT	2200005PE003	\N	2200005PE003.200500 	\N	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1593	CENTRE INDUSTRIES
394	PROJET MASAY IMMEUBLES R+6 Phase 00	2200003CB008	36762268	2200003CB008.36762588	509327	\N	\N	2024-10-07 06:08:23.94325+00	\N	UE1589	CENTRE BATIMENT
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (usr_id, role_id, usr_login, usr_pwd, usr_nom, usr_prenom, etat, usr_dt_cr, usr_dt_dern_acc) FROM stdin;
7	3	RAZAFIT4	$2a$10$o9N8eve5UKHHcTSPqsPAsOo5DeZ3i9VwrtSTJ4TxWY0A1j1kkvKyy	RAZAFINDRAVELO	Tantelison Odilon	\N	2024-09-24 05:38:57.134+00	\N
8	1	RAZAFIM5	$2a$10$KvSYEbO5bj7qmhMbbyZGlug/qD7OfzsPzNyqk.rLvkbtTc.ir/Gp.	RAZAFINDRASOAVA	Mirindra Zo	\N	2024-09-24 05:40:24.983+00	\N
9	2	COCO22	$2a$10$31fOWJne7T3vwd3qL3VHT.oCyaWb1hb1KB1857zLgfaaXa.thKxSW	HERINJANAHARY	Salohy Fitiavana	\N	2024-09-24 05:45:58.702+00	\N
10	2	RAKOTV4	$2a$10$Zn0FC9B8XnT7dxQS9FL9neMzSq2o2AB8DkslgG9QZv51ZmWE.oX8S	RAKOTO	Vlad	\N	2024-10-02 07:08:54.645+00	\N
11	3	ZKLKZL	$2a$10$jqC1hCyvVV9sr8ksnf0/2eVenLYgt.apspPsIO19Gp1KgDoofCTJy	ZZKL	ZJKZJK	\N	2024-10-02 07:13:57.54+00	\N
12	2	dsfsdf	$2a$10$bT21ix2aO2NO6idPWDHgO.r8Wy828vmpORyvetcs9HkBpkSEEPJi.	Res	sdfs	\N	2024-10-04 07:48:22.742+00	\N
13	1	admin	$2a$10$YZKHBaI8om4ie7KB8PJwLOPYev7N9X5dJDkylNCzGhzoZwrqwWeIK	ADMINISTRATEUR	admin	\N	2024-10-07 10:39:06.26+00	\N
14	1	RAVALIT1	$2a$10$8PfSX4esxzBGRqoUOwQ5jeQI/p8GpDLEhKDauhQm5uofp0l2RsRlG	RAVALISON	Tiana	\N	2024-10-07 10:40:19.706+00	\N
15	2	RAMAHAJ	$2a$10$SaXFvD5FUCJTfPtP1gQwO.8WyKfAcOk4zNN1s9Ha6v2tt4RRWfwhm	RAMAHAFANY	JEAN MAHAY	\N	2024-10-07 10:41:40.891+00	\N
16	3	RAJERIT1	$2a$10$TaMR/z4LgUfv.p.UGXVrdufIAbHUnpaCRNRQOg6oKrNM8G9BS4q5e	RAJERISON	Tania	\N	2024-10-07 10:43:03.589+00	\N
17	1	ANDRIAM1	$2a$10$cBcQAAoMrzu7mfhlEMkW3eMtOWRSzLC45HIB4KTHBCVPL0QrYz5E2	ANDRIAMANDIMBIHASINA	Malo	\N	2024-10-07 10:44:01.218+00	\N
18	2	RANAIVH2	$2a$10$EOds5FGI7inj8LX6bzUt3OnKYZAuB3wklJT7BYBrMaL3kOZc0FJn2	RANAIVOMANANTSOA	HENRI	\N	2024-10-07 10:46:17.21+00	\N
19	2	RABESOM	$2a$10$IWS8Q1Dhz8WKkDzOTWmuTecKVy.paFUd7/9hRggUK7EmCG5nzZ15K	RABESON	Marcellin	\N	2024-10-07 10:47:41.801+00	\N
20	2	RAMANAR	$2a$10$5DuRpaxD1R.Is4WpUn3GIOj3Nmz3kIMNOiD0YExheXNC9m7ALIbd2	RAMANANTENASOA	RADO HERIZO	\N	2024-10-07 10:51:16.8+00	\N
21	2	ANDRIAV	$2a$10$DqIcMihsZIeZQkRVJzD81ODTbvhFhPlBVVcjAbpKGu41pnSEJFdtK	ANDRIAMALALA	Vony	\N	2024-10-07 10:52:09.721+00	\N
22	2	ANDRIAA1	$2a$10$ZJi05KvIi0Fmnicq0YkUoOk6sypetgip5BoSZT8WV5W76RuqqYcl6	ANDRIAMIHARY	Andy	\N	2024-10-07 10:53:09.47+00	\N
23	2	RAMAMOH	$2a$10$MrVYzd6EtZisi.f2xkaw4uARWBmkjWnQcO6GsaL1tw5MP6NxeVyl6	RAMAMONJISOA	NAMBININA	\N	2024-10-07 10:54:21.787+00	\N
24	2	RANDRIC1	$2a$10$5o8AjHjFqeAOvo8hBrDFeOFKOq9F8FyGzSILEHK8SopPHGrKI0/.u	RANDRIANANTENAINA	Charles	\N	2024-10-07 10:55:04.917+00	\N
25	2	ZOELINL	$2a$10$iUtJfwVd9xCQ/hC65wNvdO0VipKsX5nOOM70akXkq/jug83cRVWyC	ZOELINE	Lala	\N	2024-10-07 10:55:59.906+00	\N
26	2	HARINDV	$2a$10$ntkdBBoc4QMASXbIw7WJNeib8FdJpu733Df7.8zYcZOGc8CR7neqq	HARIDIMBIMAHEFASOA 	VAHATRA STEVE	\N	2024-10-07 10:57:36.297+00	\N
27	1	RAKOTOE2	$2a$10$7i42mMNzNwmwwEJ2A3ndu.JYsz9ozj6uzwk5Mjw6.BuXCbRdwAyKC	RAKOTOARISOA 	Eliot	\N	2024-10-07 10:59:52.729+00	\N
28	2	ANDRIAH5	$2a$10$p.f4XDeXmpR2GL7cfF3yZOCabKdbmNQeWHNKai/Rc7b9zMYsuLX9i	ANDRIAMANGAVOLOLONA	Anja	\N	2024-10-07 11:00:53.556+00	\N
29	3	RAJAONR1	$2a$10$mNV1HqJLopY91bbkdwfpz.bW3UHqYbeVN4tJVfaAUHwH5g.teYnQa	RAJAONARISON	Rojo	\N	2024-10-07 11:02:24.409+00	\N
30	2	RANDRIR4	$2a$10$M.WY40uHMyCupvKyP/CRh.ux4SZ3yVZ/0FvM5sECcAFAfr7aQ/0qe	RANDRIAMIHAJA	RICARDO MORATTEL	\N	2024-10-07 11:03:10.437+00	\N
31	2	SAROBID	$2a$10$inr9ECbxhbyPUw8Kc/rcnepN84a/QAI44GWKMJOoIeMcTwsvoMUhu	SAROBIDY	DAMIEN JIMMY PHILOBERT	\N	2024-10-07 11:04:00.025+00	\N
32	2	TAFITAM	$2a$10$olVWsTQUleAcuq7PVTwyde9LvJgQcWzY9AeSZ6/kgKJxMRkc5cyhK	TAFITASOA	Mahefa Andriniaina	\N	2024-10-07 11:04:38.758+00	\N
\.


--
-- Data for Name: utilisateur_magasin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur_magasin (usr_id, mag_id, depuis, jusqua) FROM stdin;
\.


--
-- Name: article_art_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.article_art_id_seq', 181, true);


--
-- Name: article_historique_art_hist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.article_historique_art_hist_id_seq', 1, false);


--
-- Name: commande_cmde_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_cmde_id_seq', 9, true);


--
-- Name: commande_ligne_cmde_ligne_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commande_ligne_cmde_ligne_id_seq', 61, true);


--
-- Name: emplacement_empl_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emplacement_empl_id_seq', 48, true);


--
-- Name: etat_stock_etat_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etat_stock_etat_stock_id_seq', 1, false);


--
-- Name: famille_famille_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.famille_famille_id_seq', 30, true);


--
-- Name: fournisseur_fournisseur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fournisseur_fournisseur_id_seq', 1, false);


--
-- Name: magasin_mag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.magasin_mag_id_seq', 5, true);


--
-- Name: periode_periode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.periode_periode_id_seq', 3, true);


--
-- Name: role_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_role_id_seq', 3, true);


--
-- Name: service_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_service_id_seq', 13, true);


--
-- Name: sous_famille_sous_fam_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sous_famille_sous_fam_id_seq', 27, true);


--
-- Name: stock_par_emplacement_stock_par_empl_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_par_emplacement_stock_par_empl_id_seq', 44, true);


--
-- Name: unite_operationnel_unop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unite_operationnel_unop_id_seq', 17, true);


--
-- Name: unite_unite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unite_unite_id_seq', 27, true);


--
-- Name: utilisateur_usr_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_usr_id_seq', 32, true);


--
-- Name: article article_art_cd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_art_cd_key UNIQUE (art_cd);


--
-- Name: article article_art_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_art_ref_key UNIQUE (art_ref);


--
-- Name: article_historique article_historique_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_historique
    ADD CONSTRAINT article_historique_pkey PRIMARY KEY (art_hist_id);


--
-- Name: article article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_pkey PRIMARY KEY (art_id);


--
-- Name: commande_ligne commande_ligne_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_ligne
    ADD CONSTRAINT commande_ligne_pkey PRIMARY KEY (cmde_ligne_id);


--
-- Name: commande commande_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_pkey PRIMARY KEY (cmde_id);


--
-- Name: emplacement emplacement_empl_li_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplacement
    ADD CONSTRAINT emplacement_empl_li_key UNIQUE (empl_li);


--
-- Name: emplacement emplacement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplacement
    ADD CONSTRAINT emplacement_pkey PRIMARY KEY (empl_id);


--
-- Name: etat_stock etat_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etat_stock
    ADD CONSTRAINT etat_stock_pkey PRIMARY KEY (etat_stock_id);


--
-- Name: famille famille_fam_log_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.famille
    ADD CONSTRAINT famille_fam_log_ref_key UNIQUE (fam_log_ref);


--
-- Name: famille famille_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.famille
    ADD CONSTRAINT famille_pkey PRIMARY KEY (famille_id);


--
-- Name: fournisseur fournisseur_fournisseur_li_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fournisseur
    ADD CONSTRAINT fournisseur_fournisseur_li_key UNIQUE (fournisseur_li);


--
-- Name: fournisseur fournisseur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fournisseur
    ADD CONSTRAINT fournisseur_pkey PRIMARY KEY (fournisseur_id);


--
-- Name: magasin magasin_mag_li_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magasin
    ADD CONSTRAINT magasin_mag_li_key UNIQUE (mag_li);


--
-- Name: magasin magasin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magasin
    ADD CONSTRAINT magasin_pkey PRIMARY KEY (mag_id);


--
-- Name: periode periode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periode
    ADD CONSTRAINT periode_pkey PRIMARY KEY (periode_id);


--
-- Name: travailler_dans pk_travailler_dans; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.travailler_dans
    ADD CONSTRAINT pk_travailler_dans PRIMARY KEY (usr_id, service_id);


--
-- Name: utilisateur_magasin pk_utilisateur_magasin; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur_magasin
    ADD CONSTRAINT pk_utilisateur_magasin PRIMARY KEY (usr_id, mag_id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);


--
-- Name: role role_role_li_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_role_li_key UNIQUE (role_li);


--
-- Name: service service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT service_pkey PRIMARY KEY (service_id);


--
-- Name: service service_service_li_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT service_service_li_key UNIQUE (service_li);


--
-- Name: sous_famille sous_famille_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sous_famille
    ADD CONSTRAINT sous_famille_pkey PRIMARY KEY (sous_fam_id);


--
-- Name: stock_par_emplacement stock_par_emplacement_art_id_empl_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_par_emplacement
    ADD CONSTRAINT stock_par_emplacement_art_id_empl_id_key UNIQUE (art_id, empl_id, periode_id);


--
-- Name: stock_par_emplacement stock_par_emplacement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_par_emplacement
    ADD CONSTRAINT stock_par_emplacement_pkey PRIMARY KEY (stock_par_empl_id);


--
-- Name: unite_operationnel unite_operationnel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unite_operationnel
    ADD CONSTRAINT unite_operationnel_pkey PRIMARY KEY (unop_id);


--
-- Name: unite_operationnel unite_operationnel_unop_li_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unite_operationnel
    ADD CONSTRAINT unite_operationnel_unop_li_key UNIQUE (unop_li);


--
-- Name: unite_operationnel unite_operationnel_unop_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unite_operationnel
    ADD CONSTRAINT unite_operationnel_unop_ref_key UNIQUE (unop_ref);


--
-- Name: unite unite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unite
    ADD CONSTRAINT unite_pkey PRIMARY KEY (unite_id);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (usr_id);


--
-- Name: commande_ligne trigger_traiter_entree; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_traiter_entree AFTER INSERT ON public.commande_ligne FOR EACH ROW WHEN ((new.mvt_type = 0)) EXECUTE FUNCTION public.p_traiter_entree();


--
-- Name: commande_ligne trigger_traiter_sortie; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_traiter_sortie AFTER INSERT ON public.commande_ligne FOR EACH ROW WHEN ((new.mvt_type > 0)) EXECUTE FUNCTION public.p_traiter_sortie();


--
-- Name: article article_famille_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_famille_fk FOREIGN KEY (fam_id) REFERENCES public.famille(famille_id);


--
-- Name: article_historique article_historique_art_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_historique
    ADD CONSTRAINT article_historique_art_id_fkey FOREIGN KEY (art_id) REFERENCES public.article(art_id);


--
-- Name: article article_sous_famille_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_sous_famille_id_fkey FOREIGN KEY (sous_famille_id) REFERENCES public.sous_famille(sous_fam_id);


--
-- Name: commande commande_commande__fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_commande__fk FOREIGN KEY (periode_id) REFERENCES public.periode(periode_id);


--
-- Name: commande commande_empl_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT commande_empl_id_fkey FOREIGN KEY (empl_id) REFERENCES public.emplacement(empl_id);


--
-- Name: commande_ligne commande_ligne_art_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_ligne
    ADD CONSTRAINT commande_ligne_art_id_fkey FOREIGN KEY (art_id) REFERENCES public.article(art_id);


--
-- Name: commande_ligne commande_ligne_cmde_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_ligne
    ADD CONSTRAINT commande_ligne_cmde_id_fkey FOREIGN KEY (cmde_id) REFERENCES public.commande(cmde_id);


--
-- Name: commande_ligne commande_ligne_periode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_ligne
    ADD CONSTRAINT commande_ligne_periode_id_fkey FOREIGN KEY (periode_id) REFERENCES public.periode(periode_id);


--
-- Name: etat_stock etat_stock_art_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etat_stock
    ADD CONSTRAINT etat_stock_art_id_fkey FOREIGN KEY (art_id) REFERENCES public.article(art_id);


--
-- Name: etat_stock etat_stock_famille_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etat_stock
    ADD CONSTRAINT etat_stock_famille_id_fkey FOREIGN KEY (famille_id) REFERENCES public.famille(famille_id);


--
-- Name: article_historique fk_article_historique_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_historique
    ADD CONSTRAINT fk_article_historique_utilisateur FOREIGN KEY (usr_id) REFERENCES public.utilisateur(usr_id);


--
-- Name: article fk_article_service; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT fk_article_service FOREIGN KEY (service_id) REFERENCES public.service(service_id);


--
-- Name: article fk_article_unite; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT fk_article_unite FOREIGN KEY (unite_id) REFERENCES public.unite(unite_id);


--
-- Name: commande_ligne fk_commande_ligne_empl; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_ligne
    ADD CONSTRAINT fk_commande_ligne_empl FOREIGN KEY (empl_id) REFERENCES public.emplacement(empl_id);


--
-- Name: commande_ligne fk_commande_ligne_fournisseur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande_ligne
    ADD CONSTRAINT fk_commande_ligne_fournisseur FOREIGN KEY (fournisseur_id) REFERENCES public.fournisseur(fournisseur_id);


--
-- Name: commande fk_commande_unop; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commande
    ADD CONSTRAINT fk_commande_unop FOREIGN KEY (unop_id) REFERENCES public.unite_operationnel(unop_id);


--
-- Name: emplacement fk_emplacement_magasin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplacement
    ADD CONSTRAINT fk_emplacement_magasin FOREIGN KEY (mag_id) REFERENCES public.magasin(mag_id);


--
-- Name: emplacement fk_emplacement_service; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplacement
    ADD CONSTRAINT fk_emplacement_service FOREIGN KEY (service_id) REFERENCES public.service(service_id);


--
-- Name: etat_stock fk_etat_stock_periode; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etat_stock
    ADD CONSTRAINT fk_etat_stock_periode FOREIGN KEY (periode_id) REFERENCES public.periode(periode_id);


--
-- Name: stock_par_emplacement fk_stock_emplacement; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_par_emplacement
    ADD CONSTRAINT fk_stock_emplacement FOREIGN KEY (empl_id) REFERENCES public.emplacement(empl_id);


--
-- Name: travailler_dans fk_travailler_dans_service; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.travailler_dans
    ADD CONSTRAINT fk_travailler_dans_service FOREIGN KEY (service_id) REFERENCES public.service(service_id);


--
-- Name: travailler_dans fk_travailler_dans_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.travailler_dans
    ADD CONSTRAINT fk_travailler_dans_utilisateur FOREIGN KEY (usr_id) REFERENCES public.utilisateur(usr_id);


--
-- Name: utilisateur fk_utilisateur_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT fk_utilisateur_role FOREIGN KEY (role_id) REFERENCES public.role(role_id);


--
-- Name: sous_famille sous_famille_famille_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sous_famille
    ADD CONSTRAINT sous_famille_famille_id_fkey FOREIGN KEY (famille_id) REFERENCES public.famille(famille_id);


--
-- Name: stock_par_emplacement stock_par_emplacement_art_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_par_emplacement
    ADD CONSTRAINT stock_par_emplacement_art_id_fkey FOREIGN KEY (art_id) REFERENCES public.article(art_id);


--
-- Name: stock_par_emplacement stock_par_emplacement_stock_par_emplacement__fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_par_emplacement
    ADD CONSTRAINT stock_par_emplacement_stock_par_emplacement__fk FOREIGN KEY (periode_id) REFERENCES public.periode(periode_id);


--
-- Name: utilisateur_magasin utilisateur_magasin_mag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur_magasin
    ADD CONSTRAINT utilisateur_magasin_mag_id_fkey FOREIGN KEY (mag_id) REFERENCES public.magasin(mag_id);


--
-- Name: utilisateur_magasin utilisateur_magasin_usr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur_magasin
    ADD CONSTRAINT utilisateur_magasin_usr_id_fkey FOREIGN KEY (usr_id) REFERENCES public.utilisateur(usr_id);


--
-- PostgreSQL database dump complete
--

