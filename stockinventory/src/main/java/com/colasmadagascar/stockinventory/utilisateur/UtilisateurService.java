package com.colasmadagascar.stockinventory.utilisateur;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class UtilisateurService {
    @Autowired
    UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> getAllEntities() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getEntityById(Long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur saveEntity(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur updateEntity(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public void deleteEntityById(Long id) {
        utilisateurRepository.deleteById(id);
    }

    public List<UtilisateurDTO> getAllUtilisateur() {
        return utilisateurRepository.findAllBy();
    }

    public long count(){
        return utilisateurRepository.count();
    }

}