var OhUtil = (function(){
    var token;
    var SITE_TYPE = !isMobile() ? 'PC' : 'MOBILE';
    var router = {
        'PC': {
            'login': '/login/',
            'diary': '/diary/',
            'write': '/write/',
            'home': '/home/',
            'settings': '/settings/',
        },
        'MOBILE': {
            'login': '/m/login/',
            'diary': '/m/diary/',
            'write': '/m/write/',
            'home': '/m/home/',
            'settings': '/m/settings/',
        }
    };
    function isIOS() {
        return navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 ||
            navigator.userAgent.indexOf('iPod') > 0;
    }
    function isAndroid() {
        return navigator.userAgent.indexOf('Android') > 0;
    }
    function isMobile() {
        return isAndroid() || isIOS(); // poor windows phone users
    }
    function init(config){
        if (config.require_auth){
            auth();
        }
    }
    function navigate(path) {
        location.href = router[SITE_TYPE][path];
    }
    function auth(){
        token = $.cookie('token');
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPaFNoZW5naHVvIiwidXNhZ2UiOiJsb2dpbiIsInVzZXJfaWQiOjY1ODAyMCwiZXhwIjoxNjAwNzUzMjcwLjAzMzI2Mn0.AleddnUhMg5SIbulmFscKMrWy40eREkGN7gjIW2oSWk";
        if (!token){
            navigate('login');
        }
    }
    function is_auth(){
        token = $.cookie('token');
        return !!token;
    }
    function api(config){
        if (!lock(config.key)){
            return;
        }
        var key = config.key;
        var success = config.success;
        var fail = config.fail;
        var data = config.data;
        var params = {
            cache: true,
            dataType: 'json',
            url:'/api/'+key+'/',
            headers:{},
            data:{}
        };
        if(token){
            params['headers']['auth'] = 'token ' + token;
        }
        if(data != undefined){
            params['data'] = data;
        }
        $.ajax(params).done(function(e){
            unlock(config.key);
            if(success){
                success(e);
            }
        }).fail(function(e){
            unlock(config.key);
            // console.log(e);
            if(fail){
                fail(e.status, e.responseText);
            }
        });
    }
    var in_progress = [];
    function lock(key){
        if (in_progress[key]) return false;
        in_progress[key] = true;
        setTimeout(function(){
            if (in_progress[key]){
                $('.logo .loading').show();
            }
        }, 200);
        return true;
    }
    function unlock(key){
        in_progress[key] = false;
        $('.logo .loading').hide();
    }
    function post(url, data, success_callback){
        data['csrfmiddlewaretoken'] = csrf;

        return $.ajax({
            url:url,
            headers:{'auth': 'token '+token},
            data:data,
            method:'post',
            success: success_callback
        });

    }
    function nl2br(text){
        text = text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        return text;
    }
    function login(token){
        $.cookie('token', token, {'path':'/'});
        if (!isMobile()) {
            navigate('diary');
        } else {
            navigate('home');
        }
    }
    function setToken(token) {
        $.cookie('token', token, {'path':'/'});
    }
    function logout(){
        $.removeCookie('token', {'path':'/'});
        navigate('login');
    }
    function setSItem(key, val) {
        sessionStorage.setItem(key, val);
    }
    function getSItem(key) {
        return sessionStorage.getItem(key);
    }
    return {
        init: init,
        auth: auth,
        is_auth: is_auth,
        api: api,
        post: post,
        nl2br: nl2br,
        login: login,
        logout: logout,
        isMobile: isMobile,
        setToken: setToken,
        navigate: navigate,
        setSItem: setSItem,
        getSItem: getSItem,
    }
})();
$.fn.serializeObject = function(){
    var obj = {};

    $.each( this.serializeArray(), function(i,o){
        var n = o.name,
        v = o.value;

        obj[n] = obj[n] === undefined ? v
            : $.isArray( obj[n] ) ? obj[n].concat( v )
            : [ obj[n], v ];
    });

    return obj;
};
