var diaries = [];
var nomore = false;
var cur = 0;
var DIARY_DATE = null;
var CURRENT_DIARY = null;

var MSG_ALREADY_NEWEST = '已是最新一篇';
var MSG_ALREADY_OLDEST = '已是第一篇';
var KEY_CURRENT_ID = 'CURRENT_DIARY_ID';
var MSG_CANNOT_EDIT_DELETED_DIARY = '不能修改已删除的日记';
var MSG_CANNOT_DELETE_DELETED_DIARY = '不能删除已删除的日记';
$(function(){
    init();
    Calendar.init();
    Calendar.setOnDateChange(getDiary);
});
function init(){
    OhUtil.init({'require_auth': true});
    cur = OhUtil.getSItem(KEY_CURRENT_ID);
    userConfig();
    if (cur) {
        getDiary(cur);
    } else {
        latestDiary();
    }

    $('.btn.prev').on('click', previousDiary);
    $('.btn.next').on('click', nextDiary);
    $('.btn.random').on('click', randomDiary);
    $('#shortcut-btn').on('click', toggleShortcuts);
    $('.close-btn').on('click', function(){
        $(this).parent().hide();
    });
    $('.btn.new').on('click', clickedWrite);
    $('.btn.setting').on('click', showSetting);
    $('.logout-btn').on('click', logout);
    $('.del').on('click', deleteDiary);
    $('.edt').on('click', editDiary);

    $('body').on('keydown', function(e){
        handlePress(e, e.keyCode);
    });
}
function deleteDiary() {
    if (CURRENT_DIARY.status == 1) {
        // alert(MSG_CANNOT_DELETE_DELETED_DIARY);
        return;
    }
    var MSG_ARE_SURE_DELETE = '确定删除吗？\n删除之后的日记不可恢复。';
    var r = confirm(MSG_ARE_SURE_DELETE);
    if (r) {
        OhUtil.api({
            key:'diary/delete/'+cur, 
            success:deleteSuccess, 
            fail:failHandler
        });
    }
}
function editDiary() {
    if (CURRENT_DIARY.status == 1) {
        // alert(MSG_CANNOT_EDIT_DELETED_DIARY);
        return;
    }
    showWrite(DIARY_DATE);
}
function deleteSuccess() {
    alert('删除成功！');
    location.reload();
}
function showDiary(diary){
    $('.paper .title .date').text(diary['createddate']);
    $('.paper .title .weekday').text(diary['weekday']);
    $('.paper .title .diff').text(diary['date_word']);
    $('.paper .content').html(OhUtil.nl2br(diary['content']));
    Calendar.setDate(diary['id'], diary['createddate'].split('-')[0], parseInt(diary['createddate'].split('-')[1]) - 1);
    cur = diary.id;
    DIARY_DATE = diary.createddate;
    CURRENT_DIARY = diary;
    OhUtil.setSItem(KEY_CURRENT_ID, cur);
    if (diary.status == 1) {
        // deleted
        $('.paper').addClass('deleted');
        $('.paper .content').text('[本日记已于' + diary['deleteddate'].substr(0, 10) + '被你删除]');
        $('.del,.edt').hide();
    } else {
        $('.paper').removeClass('deleted');
        $('.del,.edt').show();
    }
}
function logout(){
    OhUtil.setSItem(KEY_CURRENT_ID, '');
    OhUtil.logout();
}
function toggleShortcuts(){
    if(!$('#shortcut-panel').is(':visible')){
        $('#shortcut-panel').show();
    }else{
        $('#shortcut-panel').hide();
    }
}
function clickedWrite() {
    showWrite();
}
function showWrite(date){
    console.log("修改地址");
    console.log(window.location.href)
    // let search = window.location.search;
    let src_setting = "write";
    $('.config-panel').modal('show');
    $('#config').attr('src',  src_setting);
    setTimeout(function(){
        $('#config').show();
        $('.config-panel #loader').hide();
    }, 1000);
}
function showSetting(){
    console.log("按键按下");
    $('.config-panel').modal('show');

    let src_setting = "setting";
    $('#config').attr('src',  src_setting);
    $('#config').show();
    $('.config-panel #loader').hide();
}
function hideWrite(data){
    $('.config-panel').modal('hide');
    if(data && data.reload){
        location.reload();
    }
}
function hideSetting(){
    $('.config-panel').modal('hide');
}
function hidePanel(){
    if($('#shortcut-panel').is(':visible')){
        toggleShortcuts();
    }
}
function nextDiary(){
    if (!cur) {
        return;
    }
    OhUtil.api({
        key:'diary/next/'+cur, 
        success:showNext, 
        fail:failHandler
    });
}
function getDiary(id){
    OhUtil.api({
        key:'diary/' + id,  
        success:showDiaryById, 
        fail:failHandler
    });
}
function showDiaryById(diary) {
    if (diary.diary){
        showDiary(diary.diary);
    } else{
        showMsg(MSG_ALREADY_NEWEST);
    }
}
function showNext(diary){
    if (diary.diary){
        showDiary(diary.diary);
    } else{
        showMsg(MSG_ALREADY_NEWEST);
    }
}
function previousDiary(){
    if (!cur) {
        return;
    }
    OhUtil.api({
        key:'diary/prev/'+cur, 
        success:showPrevious, 
        fail:failHandler
    });
}
function showPrevious(diary){
    if (diary.diary){
        showDiary(diary.diary);
    } else{
        showMsg(MSG_ALREADY_OLDEST);
    }
}
function latestDiary(){
    OhUtil.api({
        key:'diary/latest', 
        success:showLatest, 
        fail:failHandler
    });
}
function showLatest(diary){
    if (diary.diary){
        showDiary(diary.diary);
    } else{
        showWelcomeMsg();
    }
}
function showWelcomeMsg() {
    $('.paper').hide();
    $('.paper.empty').show();
}
function randomDiary(){
    OhUtil.api({
        key:'diary/random', 
        success:showRandom, 
        fail:failHandler
    });
}
function showRandom(diary){
    if (diary.diary){
        showDiary(diary.diary);
    } else{
        showMsg(MSG_ALREADY_OLDEST);
    }
}
function userConfig(){
    OhUtil.api({
        key:'user/config',
        success:showUserConfig,
        fail:failHandler
    });
}
function showUserConfig(data){
    $('.user-info .user-email').text(data.user_config.useremail);
}
var show = false;
function showMsg(msg){
    if (show){
        return;
    }
    show = true;
    $('.msg').text(msg).animate({
        'top':'0px'
    }, 200).delay(1200).animate({
        'top':'-80px'
    }, 200, function(){
        show = false;
    });
}
var messages = {
    6:'无效的身份认证，请重新登录。',
    7:'身份认证已过期，请重新登录。'
};
function failHandler(error_status, error_msg){
    if (error_status == 403){
        var message = JSON.parse(error_msg);
        if(message.error && message.error in messages){
            alert(messages[message.error]);
            location = '/login';
        }
    } else{
        // alert(error_msg);
    }
}
var KEY_MAPPING = {
    74:'nextDiary',
    75:'previousDiary',
    76:'randomDiary',
    191:'toggleShortcuts',
    27:'hidePanel',
    67:'showWrite',
    188:'showSetting'
};
function handlePress(e, keycode){
    console.log(e);
    if (e.ctrlKey || e.altKey || e.metaKey){
        return;
    }
    console.log(keycode);
    if (keycode in KEY_MAPPING){
        eval(KEY_MAPPING[keycode]+'()');
    } else{
    }
}
