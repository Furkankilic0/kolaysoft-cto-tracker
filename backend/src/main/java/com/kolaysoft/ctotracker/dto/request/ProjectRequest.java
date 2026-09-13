package com.kolaysoft.ctotracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Proje adi bos birakilamaz")
    @Size(max = 150, message = "Proje adi en fazla 150 karakter olabilir")
    private String name;

    @Size(max = 150, message = "Musteri adi en fazla 150 karakter olabilir")
    private String customer;

    @Size(max = 20, message = "Proje kodu en fazla 20 karakter olabilir")
    private String code;

    private String description;

    private LocalDate startDate;

    private LocalDate targetEndDate;

    @NotNull(message = "Proje yoneticisi secilmelidir")
    private Long managerId;
}