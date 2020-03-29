$(function(){
    init();
});
function init(){
    // OhUtil.init({'require_auth': true});
    // existingDiary();
    $('#save-btn').on('click', function(e){
        console.log("保存键被按下");
        save({'needClosePanel': true});
    });
}
function existingDiary(){
    OhUtil.api({
        key:'diary', 
        data: {date: DIARY_DATE},
        success:loadExistingDiary
    });
}
function loadExistingDiary(data){
    if(data.diary){
        $('#diary').val(data.diary.content);
    }
	startAutoSave();
}
function startAutoSave() {
	var prevDiary = $('#diary').val();
	$('#diary').on('input propertychange', function(){
		$('#save-btn').text('保存');
	});
	setInterval(function(){
		var curDiary = $('#diary').val();
		if (curDiary != prevDiary) {
			save();
		}
		prevDiary = curDiary;
	}, 24000);
}
function closePanel(data){
    if (!OhUtil.isMobile() && parent.hideWrite) {
        parent.hideWrite({reload:data.reload?true:false});
    } else {
        location.reload();
    }
}
function save(data){
    console.log(data);
    var content = $("#diary").val();
    console.log("content" + content);
	var needClosePanel = data && data.needClosePanel;
    console.log("needClosePanel" + needClosePanel);
    console.log("是否"+ needClosePanel && !content);
    if (needClosePanel && !content) closePanel({reload:false});
	$('#save-btn').text("保存中...");
    OhUtil.post('api/write/', {'content':content, date:DIARY_DATE}, function(e){
		$('#save-btn').text("已保存");
		if (needClosePanel) {
			closePanel({reload:true});
		}
    }).fail(function(e){
        $('.blocker').hide();
    });
}
