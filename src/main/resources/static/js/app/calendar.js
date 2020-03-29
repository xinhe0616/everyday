var Calendar = (function(){
    var selectedDate = null;
    var currentYear = (new Date()).getFullYear();
    var currentMonth = (new Date()).getMonth();
    var today = new Date();
    var onDateChange = null;
    var calendarRoot = $('.calendar');
    function init() {
        changeMonth(currentYear, currentMonth);
        bindEvents();
    }
    function setDate(date, year, month) {
        var tds = calendarRoot.find('.content').find('td');
        selectedDate = date;
        tds.removeClass('active');
        if (year != undefined && year != currentYear || month != undefined && month != currentMonth) {
            currentYear = year;
            currentMonth = month;
            changeMonth(currentYear, currentMonth);
        }
        var diary = calendarRoot.find('.content').find('td[data-diary=' + date + ']');
        diary.addClass('hasDiary active');
    }
    function changeMonth(year, month) {
        OhUtil.api({
            'key': 'diary/simple_by_month/' + year + '/' + (month + 1),
            'success': function(e) {
                render(year, month, e.diaries);
            }
        });
    }
    function bindEvents() {
        calendarRoot.find('.ctrl').on('click', function(){
            if($(this).data('nav') == 'prev') {
                if (currentMonth == 0) {
                    currentYear -= 1;
                    currentMonth = 11;
                } else {
                    currentMonth -= 1;
                }
            } else {
                if (currentMonth == 11) {
                    currentYear += 1;
                    currentMonth = 0;
                } else {
                    currentMonth += 1;
                }
            }
            changeMonth(currentYear, currentMonth);
        });
        calendarRoot.find('.content').on('click', 'td', function(){
            if ($(this).data('diary')) {
                setDate($(this).data('diary'));
                onDateChange($(this).data('diary'));
            }
        });
    }
    function render(year, month, diaries) {
        var monthLength = new Date(year, month + 1, 0).getDate();
        var startDate = new Date(year, month, 1);
        var startDay = startDate.getDay();
        var monthDays = [];
        var monthHolder = calendarRoot.find('.content');
        var str = '';
        renderMonth();
        generateMonthDays();
        renderMonthDays();
        function renderMonth() {
            var monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            calendarRoot.find('.header .title').text(monthNames[month]);
        }
        function generateMonthDays() {
            // padding for pre empties
            for (var i = 0; i < startDay-1; i ++) {
                monthDays.push({'date': 0});
            }
            // days
            for (var i = 0; i < monthLength; i ++) {
                var date = {'date' : new Date(year, month, i+1)};
                var dateString = getDateString(date.date);
                var todayDateString = getDateString(new Date());
                if (dateString in diaries) {
                    date['diary'] = diaries[dateString];
                }
                if (dateString == todayDateString) {
                    date['today'] = true;
                }
                monthDays.push(date);
            }
            // padding for post empties
            var calLength = monthDays.length;
            if (calLength%7) {
                for (var i = 0; i < 7 - calLength % 7; i++) {
                    monthDays.push({'date': 0});
                }
            }
        }
        function getDateString(date) {
            var dmonth = (date.getMonth() + 1).toString();
            var ddate = date.getDate().toString();
            var dateString = date.getFullYear() + '-' + (dmonth[1] ? dmonth : '0' + dmonth) + '-' + (ddate[1] ? ddate : '0' + ddate);
            return dateString;
        }
        function renderMonthDays() {
            for (var i = 0; i < monthDays.length; i ++) {
                if ((i+1)%7 == 1) {
                    str += '<tr class="days">';
                }
                if (monthDays[i].date) {
                    if (monthDays[i].diary) {
                        if (monthDays[i].diary == selectedDate) {
                            str += '<td class="hasDiary active" data-diary=' + monthDays[i].diary + '><div class="inner">' + monthDays[i].date.getDate() + '</div></td>';
                        } else {
                            str += '<td class="hasDiary" data-diary=' + monthDays[i].diary + '><div class="inner">' + monthDays[i].date.getDate() + '</div></td>';
                        }
                    }
                    else if (monthDays[i].today){
                        str += '<td class="today"><div class="inner">' + monthDays[i].date.getDate() + '</div></td>';
                    } else {
                        str += '<td><div class="inner">' + monthDays[i].date.getDate() + '</div></td>';
                    }
                } else {
                    str += '<td></td>';
                }
                if ((i+1)%7 == 0) {
                    str += '</tr>';
                }
            }
            monthHolder.find('tr.days').remove();
            monthHolder.append(str);
        }
    }
    function setOnDateChange(callback) {
        onDateChange = callback;
    }

    return {
        init: init,
        setDate: setDate,
        setOnDateChange: setOnDateChange,
    }
})();
