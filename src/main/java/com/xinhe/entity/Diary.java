package com.xinhe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diary {
    private String userDiaryId;
    private String userDiaryContext;
}
