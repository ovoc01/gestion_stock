package com.colasmadagascar.stockinventory.utilisateur;

import java.util.Collection;
import java.util.List;

import com.colasmadagascar.stockinventory.utilisateur.role.Role;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;

@Entity
@Table(name="utilisateur")

public class Utilisateur  implements UserDetails {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long usrId;

    @Column
    String usrLogin;
    @Column
    String usrPwd;
    @Column
    String usrNom;
    @Column
    String usrPrenom;
    @Column
    Timestamp usrDtDernAcc;
    @Column
    Timestamp usrDtCr;

    @ManyToOne
    @JoinColumn(name="role_id")
    Role role;


    public void setUsrId(Long usrId){
        this.usrId = usrId;
    }

    public Long getUsrId(){
        return this.usrId;
    }


    public void setUsrLogin(String usrLogin){
        this.usrLogin = usrLogin;
    }

    public String getUsrLogin(){
        return this.usrLogin;
    }


    public void setUsrPwd(String usrPwd){
        this.usrPwd = usrPwd;
    }

    public String getUsrPwd(){
        return this.usrPwd;
    }


    public void setUsrNom(String usrNom){
        this.usrNom = usrNom;
    }

    public String getUsrNom(){
        return this.usrNom;
    }


    public void setUsrPrenom(String usrPrenom){
        this.usrPrenom = usrPrenom;
    }

    public String getUsrPrenom(){
        return this.usrPrenom;
    }


    public void setUsrDtDernAcc(Timestamp usrDtDernAcc){
        this.usrDtDernAcc = usrDtDernAcc;
    }

    public Timestamp getUsrDtDernAcc(){
        return this.usrDtDernAcc;
    }


    public void setUsrDtCr(Timestamp usrDtCr){
        this.usrDtCr = usrDtCr;
    }

    public Timestamp getUsrDtCr(){
        return this.usrDtCr;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(role);
    }

    @Override
    public String getPassword() {
        return this.getUsrPwd();
    }

    @Override
    public String getUsername() {
        return this.getUsrLogin();
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}