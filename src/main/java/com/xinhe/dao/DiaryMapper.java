package com.xinhe.dao;

import com.xinhe.entity.Diary;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface DiaryMapper {
    int addDiary(Diary diary);
    List<Diary> selectAllDiary();
    Diary selectDiary(String numId);
    int deleteDiary(String numId);
    int updateDiary(Diary diary);
}
