$(function(){
    init();
});
function init(){
    OhUtil.init({'require_auth': true});
    bindEvents();
    loadUserConfigs();
}
function bindEvents(){
    $("#btn-pw-submit").on('click', function(e){
        tryChangePW();
    });
    $("#btn-frequency-submit").on('click', function(e){
        tryChangeFrequency();
    });
    $("#btn-done").on('click', function(e){
        closePanel();
    });
    $('form').submit(function(e){
        e.preventDefault();
        var form = $(this);
        OhUtil.post(form.attr('action'), form.serializeObject(), function(e){
            window[form.attr('cb')](e);
        }).fail(function(e){
            window[form.attr('cb')](e.responseJSON);
        });
    });
}
function changePWDone(e){
    var messages = {
        0: '修改成功！',
        2: '旧密码不正确。',
        1: '新密码不够复杂。'
    };
    apiAlert(messages, e.error);
    if (!e.error) {
        $('#form-changepw input[type="password"]').val('');
    }
}
function changeFCDone(e){
    var messages = {
        0: '修改成功！'
    };
    apiAlert(messages, e.error);
}
function changeSHDone(e){
    var messages = {
        0: '修改成功！'
    };
    apiAlert(messages, e.error);
}
function changeSMDone(e){
    var messages = {
        0: '修改成功！'
    };
    apiAlert(messages, e.error);
}
function apiAlert(messages, code){
    if (code in messages) {
        alert(messages[code]);
    } else {
        alert('网络故障，请稍后重试下！实在不行，请联系管理员。');
    }
}
function loadUserConfigs(){
    OhUtil.api({
        key:'user/config',
        success:_loadUserConfigs
    });
}
function _loadUserConfigs(data){
    var user_config = data.user_config;

    $('#select-frequency').val(user_config.frequency);
    $('#select-sendhour').val(user_config.send_hour);
    $('#checkbox-stopmail').prop('checked', user_config.stop_mail);
}
function closePanel(){
    parent.hideSetting();
}
