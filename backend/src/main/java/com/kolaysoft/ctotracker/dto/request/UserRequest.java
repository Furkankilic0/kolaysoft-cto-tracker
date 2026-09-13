package com.kolaysoft.ctotracker.dto.request;

import com.kolaysoft.ctotracker.entity.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserRequest {

    @NotBlank(message = "Ad soyad bos birakilamaz")
    @Size(max = 100, message = "Ad soyad en fazla 100 karakter olabilir")
    private String fullName;

    @NotBlank(message = "Email bos birakilamaz")
    @Email(message = "Gecerli bir email adresi giriniz")
    private String email;

    @NotBlank(message = "Sifre bos birakilamaz")
    @Size(min = 6, message = "Sifre en az 6 karakter olmalidir")
    private String password;

    @NotNull(message = "Rol secilmelidir")
    private Role role;
}