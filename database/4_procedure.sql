CREATE OR REPLACE FUNCTION p_traiter_entree() RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
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


    INSERT INTO stock_par_emplacement (art_id, empl_id,periode_id,cmup, quantite)
    VALUES (NEW.art_id, NEW.empl_id, new.periode_id,new_cmup, new_qte)
    ON CONFLICT (art_id, empl_id) DO UPDATE
        SET cmup = new_cmup,
            quantite = new_qte;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION p_traiter_sortie() RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    new_qte double precision;
BEGIN
    -- Calculate the new CMUP only once, handling potential division by zero


    SELECT (spe.quantite - NEW.cmde_ligne_qte)
    INTO new_qte
    FROM v_stock_par_emplacement spe
    WHERE spe.art_id = NEW.art_id AND spe.empl_id = NEW.empl_id and spe.periode_id = NEW.periode_id;

    -- Update cmde_ligne with the calculated CMUP
    INSERT INTO stock_par_emplacement (art_id, empl_id,periode_id, quantite)
    VALUES (NEW.art_id, NEW.empl_id, new.periode_id,new_qte)
    ON CONFLICT (art_id, empl_id,periode_id) DO UPDATE
        SET quantite = new_qte;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION fun_get_valorisation(
    mag_id bigint = NULL,
    empl_id bigint = NULL,
    search_code VARCHAR(255) = NULL
)
    RETURNS double precision
AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(quantite * cmup), 0.0) AS valeur
        FROM v_stock_par_emplacement_final_lib
        WHERE (mag_id IS NULL OR magid = mag_id)
          AND (empl_id IS NULL OR emplid = empl_id)
          AND (search_code IS NULL OR code_article LIKE search_code)
    );
END;
$$ LANGUAGE plpgsql;

