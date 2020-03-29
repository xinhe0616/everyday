package com.xinhe.controller;

import com.xinhe.dao.DiaryMapper;
import com.xinhe.entity.Diary;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Controller
public class MyController {
    @Resource
    private DiaryMapper diaryMapper;

//    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");//设置日期格式
//    String time = df.format(new Date());

    @RequestMapping("/test")
    public String test(HttpSession session){
        session.setAttribute("context","hello");
        return "thymeleaftest";
    }
    @RequestMapping({"/","index"})
    public String index(){
        return "index";
    }
    @RequestMapping({"/write"})
    public String write(HttpSession session){
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");//设置日期格式
        String time = df.format(new Date());
        if(diaryMapper.selectDiary(time)!=null){
            session.setAttribute("context",diaryMapper.selectDiary(time).getUserDiaryContext());
        }
        return "write";
    }
    @RequestMapping({"setting"})
    public String setting(){
        return "setting";
    }

//    @RequestMapping({"/add"})
//    @ResponseBody
//    public String add(){
//        diaryMapper.addDiary(new Diary(time,"我是日记内容"));
//        List<Diary> diary = diaryMapper.selectAllDiary(time);
//        return "添加成功:"+ diary;
//    }
//    @RequestMapping({"/delete"})
//    @ResponseBody
//    public String delete(){
//        diaryMapper.deleteDiary(time);
//        List<Diary> diary = diaryMapper.selectAllDiary(time);
//        return "删除成功" + diary;
//    }
//    @RequestMapping({"/update"})
//    @ResponseBody
//    public String update(){
//        diaryMapper.updateDiary(new Diary(time,"我是修改后的内容"));
//        List<Diary> diary = diaryMapper.selectAllDiary(time);
//        return "更新成功" + diary;
//    }
//    @RequestMapping({"/select"})
//    @ResponseBody
//    public String select()
//    {
//        List<Diary> diary = diaryMapper.selectDiary(time);
//        return diary+"";
//    }
    @RequestMapping({"/selectAll"})
    @ResponseBody
    public String selectAll()
    {
        StringBuilder res = new StringBuilder();
        List<Diary> diaries = diaryMapper.selectAllDiary();
        for (Diary diary : diaries) {
            res.append("</br>").append(diary);
        }
        return res.toString();
    }

    @RequestMapping({"/api/write"})
    @ResponseBody
    public String writeSave(String content)
    {
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");//设置日期格式
        String time = df.format(new Date());
        if(diaryMapper.selectDiary(time)!=null){
//            String str = diaryMapper.selectDiary(time).getUserDiaryContext();
            diaryMapper.updateDiary(new Diary(time,content));
        }else {
            diaryMapper.addDiary(new Diary(time,content));
        }
        return content+time;
    }
//    @RequestMapping({"/writeContext"})
//    @ResponseBody
//    public String writeContext()
//    {
//        SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");//设置日期格式
//        String time = df.format(new Date());
//        if(diaryMapper.selectDiary(time)!=null){
//            return diaryMapper.selectDiary(time).toString();
//        }
//        else {
//            return "你今天还没有写过日记";
//        }
//    }
}
