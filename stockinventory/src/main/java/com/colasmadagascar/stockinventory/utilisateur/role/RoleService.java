package com.colasmadagascar.stockinventory.utilisateur.role;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
@Service
public class RoleService {

    RoleRepository roleRepository;
    private final Map<Long, Role> roleCache = new HashMap<>();

    
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
        loadRoles();
    }

    private void loadRoles() {

        roleRepository.findAll().forEach(role -> roleCache.put(role.getRoleId(), role));

    }

    public Role getRoleById(Long roleId) {
        System.out.println(roleId + " " + roleCache.size());
        return Optional.ofNullable(roleCache.get(roleId))
                .orElseThrow(() -> new IllegalStateException("Role non trouvée"));
    }

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