package com.colasmadagascar.stockinventory.utilisateur;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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

    public List<UtilisateurDTO> getAllUtilisateur(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return utilisateurRepository.findAllBy(pageable);
    }

    public UtilisateurDTO getUtilisateurById(Long id) {
        return utilisateurRepository.findByUsrId(id);
    }

    public long count() {
        return utilisateurRepository.count();
    }

}