package com.colasmadagascar.stockinventory.utilisateur.role;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name="role")

public class Role  implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long roleId;

    @Column
    String roleLi;

    

    
    public void setRoleId(Long roleId){
        this.roleId = roleId;
    }

    public Long getRoleId(){
        return this.roleId;
    }


    public void setRoleLi(String roleLi){
        this.roleLi = roleLi;
    }

    public String getRoleLi(){
        return this.roleLi;
    }


    @Override
    public String getAuthority() {
        return this.getRoleLi();
    }
}