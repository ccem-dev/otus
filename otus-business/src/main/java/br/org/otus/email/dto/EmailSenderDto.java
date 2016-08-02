package br.org.otus.email.dto;

import br.org.otus.security.EncryptorResources;
import br.org.tutty.Equalization;

public class EmailSenderDto {

    @Equalization(name = "name")
    private String name;

    @Equalization(name = "email")
    private String email;

    @Equalization(name = "password")
    private String password;

    public void encrypt() {
        this.password = EncryptorResources.encrypt(password);
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

}
