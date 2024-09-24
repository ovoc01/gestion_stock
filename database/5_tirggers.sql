CREATE TRIGGER trigger_traiter_entree
AFTER INSERT ON commande_ligne FOR EACH ROW when (New.mvt_type = 0)
EXECUTE PROCEDURE p_traiter_entree ();

CREATE TRIGGER trigger_traiter_sortie
AFTER INSERT ON commande_ligne FOR EACH ROW when (New.mvt_type > 0)
EXECUTE PROCEDURE p_traiter_sortie ();