package com.colasmadagascar.stockinventory.utilisateur.role;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service

public class RoleService  {
   @Autowired
   RoleRepository roleRepository;

   
   public List<Role> getAllEntities() {
        return roleRepository.findAll();
    }


    public Optional<Role> getEntityById(Long id) {
        return roleRepository.findById(id);
    }


    public Role saveEntity(Role role) {
        return roleRepository.save(role);
    }


    public Role updateEntity(Role role) {
        return roleRepository.save(role);
    }

    public void deleteEntityById(Long id) {
        roleRepository.deleteById(id);
    }



}