package com.kolaysoft.ctotracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReviewRequest {

    @NotNull(message = "CTO kullanici ID'si belirtilmelidir")
    private Long ctoId;

    @NotBlank(message = "Yorum bos birakilamaz")
    private String comment;
}