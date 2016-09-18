// This is a JavaScript file

var thisDate = new Date();

//年月日入力用
function datePicker() {
    var myNewDate = new Date();

    // Same handling for iPhone and Android
    window.plugins.datePicker.show({
        date : myNewDate,
        mode : 'date', // date or time or blank for both
        allowOldDates : true
    }, function(returnDate) {
        // 曜日の表記を文字列の配列で指定
        var weekNames = ['日', '月', '火', '水', '木', '金', '土'];
        var newDate = new Date(returnDate);
        
        //year:年、month:月、day:日、week:曜日(数値)
        var year = newDate.getFullYear();
        var month = newDate.getMonth() + 1;
        var day = newDate.getDate();
        var week = newDate.getDay(); 
        
        //date:年月日+曜日
        var date = year+"年"+month+"月"+day+"日"+"("+weekNames[week]+")";
        
        $("#dataYear").val(year);
        $("#dataMonth").val(month);
        $("#dataDay").val(day);
        $("#dataWeek").val(weekNames[week]);
    });
}

// 年月入力用
function monthPicker(dom) {
    var myNewDate = new Date();
    if (dom.val() != ''){
        myNewDate = new Date(myNewDate.getFullYear(), myNewDate.getMonth(), myNewDate.getDate(), dom.val().substring(0,4), dom.val().substring(5,6));
    }

    // Same handling for iPhone and Android
    window.plugins.datePicker.show({
        date : myNewDate,
        mode : 'date', // date or time or blank for both
        allowOldDates : true
    }, function(returnDate) {
        if (!returnDate) return;
        var newDate = new Date(returnDate);
        
        var year = newDate.getFullYear();
        var month = newDate.getMonth() + 1;
        var day = newDate.getDate();
        var ym = year + '年' + ('0' + (newDate.getMonth() + 1)).slice(-2) + '月';
        
        dom.html(ym);
    });
}

// 時刻入力用
function timePicker(dom) {
    var myNewDate = new Date();
    if (dom.val() != ''){
        myNewDate = new Date(myNewDate.getFullYear(), myNewDate.getMonth(), myNewDate.getDate(), dom.val().substring(0,2), dom.val().substring(3,5));
    }

    // Same handling for iPhone and Android
    window.plugins.datePicker.show({
        date : myNewDate,
        mode : 'time', // date or time or blank for both
        allowOldDates : true
    }, function(returnDate) {
        if (!returnDate) return;
        var newDate = new Date(returnDate);
        
        var year = newDate.getFullYear();
        var month = newDate.getMonth() + 1;
        var day = newDate.getDate();
        var time = ('0' + newDate.getHours()).slice(-2) + ':' + ('0' + newDate.getMinutes()).slice(-2);
        
        dom.html(time);        
    });
}

// 出勤時刻入力用
function startTimePicker(dom) {
    var myNewDate = new Date();
    if (dom.val() != ''){
        myNewDate = new Date(myNewDate.getFullYear(), myNewDate.getMonth(), myNewDate.getDate(), dom.val().substring(0,2), dom.val().substring(3,5));
    }

    // Same handling for iPhone and Android
    window.plugins.datePicker.show({
        date : myNewDate,
        mode : 'time', // date or time or blank for both
        allowOldDates : true
    }, function(returnDate) {
        if (!returnDate) return;
        var newDate = new Date(returnDate);
        
        var year = newDate.getFullYear();
        var month = newDate.getMonth() + 1;
        var day = newDate.getDate();
        var time = ('0' + newDate.getHours()).slice(-2) + ':' + ('0' + newDate.getMinutes()).slice(-2);
        
        // 退勤時刻
        var actual_work_end_time = $("#actual_work_end_time").html();
        var work_end_time = actual_work_end_time.substr(0,2) + actual_work_end_time.substr(3,5);
        // 変更出勤時刻
        var work_start_time = ('0' + newDate.getHours()).slice(-2) + ('0' + newDate.getMinutes()).slice(-2);
        
        // 退勤時刻<変更出勤時刻の場合、エラー
        if (work_end_time != '' && work_start_time > work_end_time) {
            alert("退勤時刻より後の時刻に変更することはできません。");
            return false;
        }
        
        dom.html(time);
        
        if (time != undefined){
           setActionWorkStartTime();
        }  
    });
}

// 退勤時刻入力用
function endTimePicker(dom) {
    var myNewDate = new Date();
    if (dom.val() != ''){
        myNewDate = new Date(myNewDate.getFullYear(), myNewDate.getMonth(), myNewDate.getDate(), dom.val().substring(0,2), dom.val().substring(3,5));
    }

    // Same handling for iPhone and Android
    window.plugins.datePicker.show({
        date : myNewDate,
        mode : 'time', // date or time or blank for both
        allowOldDates : true
    }, function(returnDate) {
        if (!returnDate) return;
        var newDate = new Date(returnDate);
        var year = newDate.getFullYear();
        var month = newDate.getMonth() + 1;
        var day = newDate.getDate();
        var time = ('0' + newDate.getHours()).slice(-2) + ':' + ('0' + newDate.getMinutes()).slice(-2);
        
        // 出勤時刻
        var actual_work_start_time = $("#actual_work_start_time").html();
        var work_start_time = actual_work_start_time.substr(0,2) + actual_work_start_time.substr(3,5);
        
        // 変更退勤時刻
        var work_end_time = ('0' + newDate.getHours()).slice(-2) + ('0' + newDate.getMinutes()).slice(-2);
        
        // 出勤時刻>変更退勤時刻の場合、エラー
        if (work_start_time > work_end_time) {
            alert("出勤時刻より前の時刻に変更することはできません。");
            return false;
        }
        
        dom.html(time);
        
        if (time != undefined){
            setActionWorkEndTime();
        } 
    });
}

//日付入力クリア
function dateClear() {
    $("#date").val("");
}

document.addEventListener("pageinit", function(e) {
    if (e.target.id == "daily_page") {
        // 日次画面のイベント処理
        checkThisMonthRecord();
        displayDailyData();
        //欠勤状態をボタンに反映
        setHoridayText();
        
        $('.timePicker').click(function(){
            if ($(this).html() == '') {
                return false;
            }
            
            var idname = $(this).attr("id");
            if(idname == "actual_work_start_time"){
                startTimePicker($(this));
            }else if(idname == "actual_work_end_time"){
                endTimePicker($(this));
            }
        });
        
        // 月末の場合、進むボタンを非表示にする
        var today = new Date();
        var nextDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate()+1);
        if ((today.getFullYear() < nextDate.getFullYear()) || today.getMonth() < nextDate.getMonth()) {
            $("#nextDay").hide();
        } else {
            $("#nextDay").show();
        }
        
        //備考欄のイベント処理
        $("#anote").blur( function () {
            setRemark();
        });
        
        // 「先日」ボタン押下時のイベント
        $('#backDay').click(function(){
            thisDate.setDate(thisDate.getDate() - 1);            
            displayDailyData2(thisDate);
            //出勤時間、退勤時間を取得
            displayDailyData();
            //欠勤状態を取得
            setHoridayText();
            
            // 月末の場合、進むボタンを非表示にする
            var today = new Date();
            var nextDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate()+1);
            if ((today.getFullYear() < nextDate.getFullYear()) || today.getMonth() < nextDate.getMonth()) {
                $("#nextDay").hide();
            } else {
                $("#nextDay").show();
            }
        });
        
        // 「翌日」ボタン押下時のイベント
        $('#nextDay').click(function(){
            thisDate.setDate(thisDate.getDate() + 1);
            displayDailyData2(thisDate);
            //出勤時間、退勤時間を取得
            displayDailyData();
            //欠勤状態を取得
            setHoridayText();
            
            // 月末の場合、進むボタンを非表示にする
            var today = new Date();
            var nextDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate()+1);
            if ((today.getFullYear() < nextDate.getFullYear()) || today.getMonth() < nextDate.getMonth()) {
                $("#nextDay").hide();
            } else {
                $("#nextDay").show();
            }
        });
        
        // 月次画面の日付押下時のイベント
        if(getDay()!=""){
            thisDate = getDay();
            displayDailyData2(thisDate);
            //出勤時間、退勤時間を取得
            displayDailyData();
            //欠勤状態を取得
            setHoridayText();
        }
       
    }
    if (e.target.id == "monthly_page") {
        // 月次画面のイベント処理
        checkThisMonthRecord();
        
        var d = new Date();         

    　　// 初期表示時のイベント
        setMonthlyFirstTime(d);
        
         //右上のボタンから日次画面へ遷移
        $('#goDaily').click(function(){
            d = new Date();
            setDay(d);
        });
        
        // 「先月」ボタン押下時のイベント
        $('#backMonth').click(function(){
            d.setMonth(d.getMonth() - 1);
            setMonthlyFirstTime(d);
        });
        
        // 「来月」ボタン押下時のイベント
        $('#nextMonth').click(function(){
            d.setMonth(d.getMonth() + 1);
            setMonthlyFirstTime(d);
        });
        
        // 「遷移」ボタン押下時のイベント
        $('#dailyPage_0').click(function(){
            d.setDate(0 + 1);
             setDay(d);
        });
        $('#dailyPage_1').click(function(){
            d.setDate(1 + 1);
             setDay(d);
        });        
        $('#dailyPage_2').click(function(){
            d.setDate(2 + 1);
             setDay(d);
        });        
        $('#dailyPage_3').click(function(){
            d.setDate(3 + 1);
             setDay(d);
        });        
        $('#dailyPage_4').click(function(){
            d.setDate(4 + 1);
             setDay(d);
        });        
        $('#dailyPage_5').click(function(){
            d.setDate(5 + 1);
             setDay(d);
        });        
        $('#dailyPage_6').click(function(){
            d.setDate(6 + 1);
             setDay(d);
        });        
        $('#dailyPage_7').click(function(){
            d.setDate(7 + 1);
             setDay(d);
        });        
        $('#dailyPage_8').click(function(){
            d.setDate(8 + 1);
             setDay(d);
        });        
        $('#dailyPage_9').click(function(){
            d.setDate(9 + 1);
             setDay(d);
        });        
        $('#dailyPage_10').click(function(){
            d.setDate(10 + 1);
             setDay(d);
        });        
        $('#dailyPage_11').click(function(){
            d.setDate(11 + 1);
             setDay(d);
        });        
        $('#dailyPage_12').click(function(){
            d.setDate(12 + 1);
             setDay(d);
        });        
        $('#dailyPage_13').click(function(){
            d.setDate(13 + 1);
             setDay(d);
        });        
        $('#dailyPage_14').click(function(){
            d.setDate(14 + 1);
             setDay(d);
        });        
        $('#dailyPage_15').click(function(){
            d.setDate(15 + 1);
             setDay(d);
        });        
        $('#dailyPage_16').click(function(){
            d.setDate(16 + 1);
             setDay(d);
        });        
        $('#dailyPage_17').click(function(){
            d.setDate(17 + 1);
             setDay(d);
        });        
        $('#dailyPage_18').click(function(){
            d.setDate(18 + 1);
             setDay(d);
        });        
        $('#dailyPage_19').click(function(){
            d.setDate(19 + 1);
             setDay(d);
        });        
        $('#dailyPage_20').click(function(){
            d.setDate(20 + 1);
             setDay(d);
        });        
        $('#dailyPage_21').click(function(){
            d.setDate(21 + 1);
             setDay(d);
        });        
        $('#dailyPage_22').click(function(){
            d.setDate(22 + 1);
             setDay(d);
        });        
        $('#dailyPage_23').click(function(){
            d.setDate(23 + 1);
             setDay(d);
        });        
        $('#dailyPage_24').click(function(){
            d.setDate(24 + 1);
             setDay(d);
        });        
        $('#dailyPage_25').click(function(){
            d.setDate(25 + 1);
             setDay(d);
        });        
        $('#dailyPage_26').click(function(){
            d.setDate(26 + 1);
             setDay(d);
        });        
        $('#dailyPage_27').click(function(){
            d.setDate(27 + 1);
             setDay(d);
        });        
        $('#dailyPage_28').click(function(){
            d.setDate(28 + 1);
             setDay(d);
        });        
        $('#dailyPage_29').click(function(){
            d.setDate(29 + 1);
             setDay(d);
        });        
        $('#dailyPage_30').click(function(){
            d.setDate(30 + 1);
             setDay(d);
        });
    }
    
    if (e.target.id == "csvmail_page") {
        // CSV送信画面のイベント処理
        checkThisMonthRecord();
        
        // 初期表示のイベント
        setMaxManth();
        
        // monthpicker押下時のイベント
        $('.monthPicker').click(function(){
            monthPicker($(this));
        });
        
        // 「出力」ボタン押下時のイベント
        $('#sendMail').click(function(){
            sendMail();
        });
    }
    if (e.target.id == "setting_page") {
        // 設定画面のイベント処理
        checkThisMonthRecord();
        
        // 初期表示時のイベント
        setFirstTime();
        
        // timepicker押下時のイベント
        $('.timePicker').click(function(){
            timePicker($(this));
        });
        
        // 「設定」ボタン押下時のイベント
        $('#update').click(function(){
            /* ****navigator.notificationが動作しないため、コメントアウト******
            navigator.notification.confirm(
        　　"今月の設定を変更しますか？", 
        　　onConfirm, 
        　　"確認", 
        　　"はい, いいえ");
        　　*/
        　　onConfirm(1);
        });               
    }
}, false);

//月次画面から日次画面を取得
function getDay(){
    return thisDate;
}
function setDay(d){
    thisDate = d;
}

// ----------------------------------------------------------------------
// 月次画面展開時の初期設定(翌月、来月の値取得)
// ----------------------------------------------------------------------
function setMonthlyFirstTime(d) {    
    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）

    $("#thisYear").html(ymWk.substring(0, 4));
    $("#thisMonth").html(ymWk.substring(4, 6));

    var thisMonthDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); //求めたい月の日数を取得

    var actualWorkStartTime;                     //出勤時間
    var actualWorkEndTime;                       //退勤時間
    var actualWorkTime = new Array(31);//勤務内容
    var totalTime = 0;                           //合計勤務時間
    var totalHoliday = 0;     　　　　　　　　   //合計欠勤日数
    var monthlyDataDay = new Array(31);//日付
    var givenDay;                                //初期表示する日程
    var monthlyGivenDay;                         //日付として認識
    var weekday = [ "日", "月", "火", "水", "木", "金", "土" ] ;
    var monthlyDataWeek = new Array(thisMonthDay);
    var selectDay;     //知りたい日付(01,02,03…)

    $("#totalHoliday").html(totalHoliday);

    $("#monthlyDataDay_28").html("");
    $("#monthlyDataDay_29").html("");
    $("#monthlyDataDay_30").html("");
    $("#monthlyDataDay_31").html("");

    $("#monthlyDataWeek_28").html("");
    $("#monthlyDataWeek_29").html("");
    $("#monthlyDataWeek_30").html("");
    $("#monthlyDataWeek_31").html("");

    $("#dailyPage_28").hide();
    $("#dailyPage_29").hide();
    $("#dailyPage_30").hide();

    for(var i = 0;i < thisMonthDay;i++){
        monthlyDataDay[i] = i + 1;
        if (monthlyDataDay[i] < 10) {
            $("#monthlyDataDay_" + i).html("&nbsp&nbsp" + monthlyDataDay[i] + "日");
            
        } else {
            $("#monthlyDataDay_" + i).html(monthlyDataDay[i] + "日");
            
        }
       
        selectDay = i + 1;
        if(selectDay < 10){
            selectDay = "0" + selectDay;   
        }
        givenDay = ymWk.substring(0, 4) + "/" + ymWk.substring(4,6) + "/" +　selectDay;
        monthlyGivenDay = new Date(givenDay);
　　　　monthlyDataWeek[i]  = weekday[ monthlyGivenDay.getDay() ];
        $("#monthlyDataWeek_" + i).html("(" + monthlyDataWeek[i] + ")");
        $("#dailyPage_" + i).show();
    }
    
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);
    
    // TODO:基本休憩時間を取得
    // 前月の基本勤務時間と基本休憩時間を選択
    var sql = "SELECT * FROM t_monthly" 
            + " WHERE work_month = " + ymWk;
    
    execSQL(db, sql, [], function(rs){
        var firstbasicBreakStartTime = rs.rows.item(0).basic_break_start_time;
        var firstbasicBreakEndTime = rs.rows.item(0).basic_break_end_time;
        
        var firstbasicBreakStartTime1 = firstbasicBreakStartTime.substring(0, 2);
        var firstbasicBreakStartTime2 = firstbasicBreakStartTime.substring(2, 4);
        var firstbasicBreakEndTime1 = firstbasicBreakEndTime.substring(0, 2);
        var firstbasicBreakEndTime2 = firstbasicBreakEndTime.substring(2, 4);
        
        var basicBreakTime = (parseInt(firstbasicBreakEndTime1) * 60)
                            + parseInt(firstbasicBreakEndTime2)
                            - (parseInt(firstbasicBreakStartTime1) * 60)
                            - parseInt(firstbasicBreakStartTime2);
        
        // 出勤時間と退勤時間を選択
        var sql = "SELECT * FROM t_daily"
                + " WHERE work_month = "
                + ymWk;
        execSQL(db, sql, [], function (rs) {
            for(var i = 0;i < thisMonthDay;i++){
                if(rs.rows.item(i).work_div == 1){
                    actualWorkTime[i] = "　欠勤";
                    $("#actualWorkTime_" + i).html(actualWorkTime[i]);
                    totalHoliday = totalHoliday + 1;
                    $("#totalHoliday").html(totalHoliday);
                }else{
                    actualWorkStartTime = rs.rows.item(i).actual_work_start_time;
                    actualWorkEndTime = rs.rows.item(i).actual_work_end_time;
                    var end_h;
                    var end_m;
                    var start_h;
                    var start_m;
                    
                    var st = '　 　';
                    if (actualWorkStartTime != null) {
                        start_h = actualWorkStartTime.substring(0, 2);
                        start_m = actualWorkStartTime.substring(2, 4);
                        st = start_h + ":" + start_m;
                    }
                    var ed = '　 　';
                    if (actualWorkEndTime != null) {
                        end_h = actualWorkEndTime.substring(0, 2);
                        end_m = actualWorkEndTime.substring(2, 4);
                        ed = end_h + ":" + end_m;
                    }
                    //勤務時間
                    var kinmuTime = 0;
                    var kinmuTimeText = 0;
                    if (actualWorkStartTime != null && actualWorkEndTime != null) {
                        kinmuTime = ((parseInt(end_h) * 60) + parseInt(end_m) - (parseInt(start_h) * 60) - parseInt(start_m))/60;
                        kinmuTimeText = Math.round((kinmuTime - (basicBreakTime/60)) *100)/100;
                    }
                    
                    actualWorkTime[i] =" 　" + st + "　～　" + ed + "　[ " + kinmuTimeText + "h ]";
                    $("#actualWorkTime_" + i).html(actualWorkTime[i]);
                    totalTime += kinmuTimeText;
                }
            }
            $("#totalTime").html(totalTime);
        }, function(error){
            alert(error.message);
        });
        
    }, function(error){
        alert(error.message);
    });
    
    // 月末の場合、進むボタンを非表示にする
    var today = new Date();
    var nextDate = new Date(d.getFullYear(), d.getMonth()+1, d.getDate());
    if ((today.getFullYear() < nextDate.getFullYear()) || today.getMonth() < nextDate.getMonth()) {
        $("#nextMonth").hide();
    } else {
        $("#nextMonth").show();
    }

}

// ----------------------------------------------------------------------
//設定ボタン押下時の確認ポップアップ
// ----------------------------------------------------------------------
function onConfirm(buttonIndex) {
    if (buttonIndex==1) {
        //はいボタン
        setTime();
    } else if (buttonIndex==2) {
        //いいえボタン
    } else {
        //その他ボタン
    }    
}

// ----------------------------------------------------------------------
// 設定画面展開時の初期設定
// ----------------------------------------------------------------------
function setFirstTime() {    
　　var d = new Date();
    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）
    var firstbasicWorkStartTime;    //初期基本勤務開始時間
    var firstbasicWorkEndTime;        //初期基本勤務終了時間
    var firstbasicBreakStartTime;　//初期基本休憩開始時間
    var firstbasicBreakEndTime;      //初期基本休憩終了時間
    
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);
     
    // 前月の基本勤務時間と基本休憩時間を選択
    var sql = "SELECT * FROM t_monthly" 
            + " WHERE work_month = " 
            + "(SELECT MAX(work_month) FROM t_monthly)"; 

    execSQL(db, sql, [], function(rs){
        if(rs.rows.length === 0){
            firstbasicWorkStartTime = "0900";
            firstbasicWorkEndTime = "1800";
            firstbasicBreakStartTime = "1200";
            firstbasicBreakEndTime = "1300";
        }else{
            firstbasicWorkStartTime = rs.rows.item(0).basic_work_start_time;
            firstbasicWorkEndTime = rs.rows.item(0).basic_work_end_time;
            firstbasicBreakStartTime = rs.rows.item(0).basic_break_start_time;
            firstbasicBreakEndTime = rs.rows.item(0).basic_break_end_time;
             
            var firstbasicWorkStartTime1 = firstbasicWorkStartTime.substring(0, 2);
            var firstbasicWorkStartTime2 = firstbasicWorkStartTime.substring(2, 4);                 
            firstbasicWorkStartTime = firstbasicWorkStartTime1 + ":" +firstbasicWorkStartTime2;
                
            var firstbasicWorkEndTime1 = firstbasicWorkEndTime.substring(0, 2);
            var firstbasicWorkEndTime2 = firstbasicWorkEndTime.substring(2, 4);                 
            firstbasicWorkEndTime = firstbasicWorkEndTime1 + ":" +firstbasicWorkEndTime2;
            
            var firstbasicBreakStartTime1 = firstbasicBreakStartTime.substring(0, 2);
            var firstbasicBreakStartTime2 = firstbasicBreakStartTime.substring(2, 4);                 
            firstbasicBreakStartTime = firstbasicBreakStartTime1 + ":" +firstbasicBreakStartTime2;
                
            var firstbasicBreakEndTime1 = firstbasicBreakEndTime.substring(0, 2);
            var firstbasicBreakEndTime2 = firstbasicBreakEndTime.substring(2, 4);                 
            firstbasicBreakEndTime = firstbasicBreakEndTime1 + ":" +firstbasicBreakEndTime2;

            // document.getElementById("basicWorkStartTime").value = firstbasicWorkStartTime;    //基本勤務開始時間の初期値設定
            // document.getElementById("basicWorkEndTime").value = firstbasicWorkEndTime;        //基本勤務終了時間の初期値設定
            // document.getElementById("basicBreakStartTime").value = firstbasicBreakStartTime;　//基本休憩開始時間の初期値設定
            // document.getElementById("basicBreakEndTime").value = firstbasicBreakEndTime;      //基本休憩終了時間の初期値設定
             
            $("#basicWorkStartTime").html(firstbasicWorkStartTime);
            $("#basicWorkEndTime").html(firstbasicWorkEndTime);
            $("#basicBreakStartTime").html(firstbasicBreakStartTime);
            $("#basicBreakEndTime").html(firstbasicBreakEndTime);
        }  
    }, function(error){
        alert(error.message);
    });       
}

// ----------------------------------------------------------------------
// 設定ボタン押下時
// ----------------------------------------------------------------------
function setTime() {

    var basicWorkStartTime = $("#basicWorkStartTime").html();　　　　//基本勤務開始時間
    var basicWorkEndTime = $("#basicWorkEndTime").html();　　　　　　//基本勤務終了時間
    var basicBreakStartTime = $("#basicBreakStartTime").html();　　 　//基本休憩開始時間
    var basicBreakEndTime = $("#basicBreakEndTime").html();　　　　 　//基本休憩終了時間
    
    if (basicWorkStartTime == "" || basicWorkEndTime == ""){
        alert("基本作業時間が入力されていません");
        return;
    }
    
    if(basicBreakStartTime == "" ||  basicBreakEndTime == ""){
        alert("休憩時間が入力されていません");
        return;
    }
    
    if (basicWorkStartTime > basicWorkEndTime){
        alert("基本作業時間が正しくありません");
        return;
    }
    
    if(basicBreakStartTime > basicBreakEndTime){
        alert("休憩時間が正しくありません");
        return;
    }
    
    if(basicBreakStartTime < basicWorkStartTime || basicBreakEndTime > basicWorkEndTime){
        alert("休憩時間が正しくありません2");
        return;    
    }
    
    basicWorkStartTime = basicWorkStartTime.replace(':', '');
    basicWorkEndTime = basicWorkEndTime.replace(':', '');
    basicBreakStartTime = basicBreakStartTime.replace(':', '');
    basicBreakEndTime = basicBreakEndTime.replace(':', '');
    
    var d = new Date();         
    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）
    
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);
    
    // 基本勤務始業時間を更新
    var sql = "UPDATE t_monthly SET basic_work_start_time = '" + basicWorkStartTime 
              + "', basic_work_end_time = '" + basicWorkEndTime
              + "', basic_break_start_time = '" + basicBreakStartTime
              + "', basic_break_end_time = '" + basicBreakEndTime
              + "' WHERE work_month =  '" + ymWk + "'"; 
              
    execSQL(db, sql, [], function(rs){
        alert("変更した設定は今月から反映されます。");
    }, function(error){
        alert(error.message);
    });
}

// ----------------------------------------------------------------------
//出勤時刻の更新
// ----------------------------------------------------------------------
function setActionWorkStartTime() {    
    var actual_work_start_time = $("#actual_work_start_time").html();
    var work_start_time = actual_work_start_time.substr(0,2) + actual_work_start_time.substr(3,5); 

    var d = thisDate;         
    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）
    var dWk = ymdWk.substring(6, 8);            // 処理日  （DD）

    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);

    //出勤時間を更新
    var sql = "UPDATE t_daily SET actual_work_start_time = '" + work_start_time
            + "' WHERE work_month = '" +  ymWk
            + "' and work_date = '" + ymdWk  + "'";

    execSQL(db, sql, [], function(rs){
        //alert("出勤時間を変更しました。");
    }, function(error){
        alert(error.message);
    });
}

// ----------------------------------------------------------------------
//退勤時刻の更新
// ----------------------------------------------------------------------
function setActionWorkEndTime() {    
    var actual_work_end_time = $("#actual_work_end_time").html();
    var work_end_time = actual_work_end_time.substr(0,2) + actual_work_end_time.substr(3,5);

    var d = thisDate;         
    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）
    var dWk = ymdWk.substring(6, 8);            // 処理日  （DD）

    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);

    //退勤時刻を更新
    var sql = "UPDATE t_daily SET actual_work_end_time = '" + work_end_time
            + "' WHERE work_month = '" +  ymWk
            + "' and work_date = '" + ymdWk  + "'";
  
    execSQL(db, sql, [], function(rs){
       //alert("退勤時間を変更しました。");
    }, function(error){
        alert(error.message);
    });
}

// ----------------------------------------------------------------------
//備考欄の更新
// ----------------------------------------------------------------------
function setRemark() {
    var anote = $("#anote").val();

    //var d = new Date();         
    var d = thisDate;
    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）
    var dWk = ymdWk.substring(6, 8);         // 処理日  （DD）
    
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);

    //備考を更新
    var sql = "UPDATE t_daily SET remark = '" + anote
            + "' WHERE work_month = '" +  ymWk
            + "' and work_date = '" + ymdWk  + "'";
 
    execSQL(db, sql, [], function(rs){
        //alert("備考を変更しました。");
    }, function(error){
        alert(error.message);
    });
}

// ----------------------------------------------------------------------
// 日次画面初期表示
// ----------------------------------------------------------------------
function displayDailyData(){
    if ($("#disp_date").val() == "") {
        // 今日のレコードを表示
        var thisDate = new Date();
        var yyyy = thisDate.getFullYear();
        var mm = thisDate.getMonth()+1;
        var dd = thisDate.getDate();
        var week = thisDate.getDay();
        var weekdays = ["日", "月", "火", "水", "木", "金", "土"];
        // ヘッダー表示
        $("#day .year").html(yyyy);
        $("#day .month").html(mm);
        $("#day .date").html(dd);
        $("#day .week").html(weekdays[week]);
        
        // 表示中の日付を格納
        mm += "";
        if (mm.length === 1) {
            mm = "0" + mm;
        }
        dd += "";
        if (dd.length === 1) {
            dd = "0" + dd;
        }
        var work_month = yyyy+""+mm+""+dd;
        $("#disp_date").val(work_month);
    } else {
        // ヘッダー表示
        // 今日のレコードを表示
        var thisDate = new Date($("#disp_date").val().substring(0,4)+"-"+$("#disp_date").val().substring(4,6)+"-"+$("#disp_date").val().substring(6,8));
        var yyyy = $("#disp_date").val().substring(0,4);
        var mm = $("#disp_date").val().substring(4,6);
        var dd = $("#disp_date").val().substring(6,8);
        var week = thisDate.getDay();
        var weekdays = ["日", "月", "火", "水", "木", "金", "土"];
        
        $("#day .year").html(yyyy);
        $("#day .month").html(mm);
        $("#day .date").html(dd);
        $("#day .week").html(weekdays[week]);
    }
    
    // データ取得
    var work_month = $("#disp_date").val().substring(0,6);
    var work_date = $("#disp_date").val();
    var sql = "SELECT * FROM t_daily WHERE work_month = '" + work_month + "' and work_date = '" + work_date + "'"; 
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);
    execSQL(db, sql, [], function(rs){
        var len = rs.rows.length;
        if (len > 0) {
            var disp_actual_work_start_time = "";
            var disp_actual_work_end_time = "";
            if (rs.rows.item(0).actual_work_start_time != null) {
                disp_actual_work_start_time = rs.rows.item(0).actual_work_start_time.substring(0,2) + ":" + rs.rows.item(0).actual_work_start_time.substring(2,4);
                // 出勤している場合、退勤ボタンを表示する
                $(".work_end_button").show();
                $(".work_end_input").removeAttr("disabled");
                
                // 出勤ボタンを非表示にする
                $(".work_start_button").hide();
                $(".work_start_input").attr("disabled", "dsabled");
            } else {
                // 出勤していない場合、退勤ボタンは非表示にする
                $(".work_end_button").hide();
                $(".work_end_input").attr("disabled", "dsabled");
                
                // 出勤ボタンを表示する
                $(".work_start_button").show();
                $(".work_start_input").removeAttr("disabled");
            }
            if (rs.rows.item(0).actual_work_end_time != null) {
                disp_actual_work_end_time = rs.rows.item(0).actual_work_end_time.substring(0,2) + ":" + rs.rows.item(0).actual_work_end_time.substring(2,4);
                // 退勤している場合、出勤、退勤ボタンを非表示にする
                $(".work_end_button").hide();
                $(".work_end_input").attr("disabled", "dsabled");
                $(".work_start_button").hide();
                $(".work_start_input").attr("disabled", "dsabled");
            }    
            $("#actual_work_start_time").html(disp_actual_work_start_time);
            $("#actual_work_end_time").html(disp_actual_work_end_time);
            $(".remark_textarea").val(rs.rows.item(0).remark);
        }else{
            sql = "INSERT INTO t_monthly(work_month) VALUES ('"+ work_month + "')";
            execSQL(db, sql, [], function(rs){});
            for (var i = 1; i <= 31; i++) {
                // 1ヶ月分のt_dailyデータをINSERT。
                if (i < 10) {
                    i = "0" + i;
                }
                var work_date = work_month + ""+i;
                sql = "INSERT INTO t_daily(work_month, work_date) VALUES (" + work_month + ", " + work_date + ")";
                execSQL(db, sql, [], function(rs){});
            }
            // 出勤ボタンを表示する
            $(".work_start_button").show();
            $(".work_start_input").removeAttr("disabled");
        }
    }, function(error){
      console.log(error.message);
    });

}

// -----------------------------------------------------------------------
//日次画面初期表示取得(月次から遷移した場合の初期表示)
//------------------------------------------------------------------------
function displayDailyData2(thisDate){
    if (thisDate == null) {    
        displayDailyData();
    }else{
        // 今日のレコードを表示
        var yyyy = thisDate.getFullYear();
        var mm = thisDate.getMonth()+1;
        var dd = thisDate.getDate();
        var week = thisDate.getDay();
        var weekdays = ["日", "月", "火", "水", "木", "金", "土"];
        // ヘッダー表示
        $("#day .year").html(yyyy);
        $("#day .month").html(mm);
        $("#day .date").html(dd);
        $("#day .week").html(weekdays[week]);
        // 表示中の日付を格納
        mm += "";
        if (mm.length === 1) {
            mm = "0" + mm;
        }
        dd += "";
        if (dd.length === 1) {
            dd = "0" + dd;
        }
        var work_month = yyyy+""+mm+""+dd;
        $("#disp_date").val(work_month);
    }
    
    // データ取得
    var work_month = $("#disp_date").val().substring(0,6);
    var work_date = $("#disp_date").val().substring(6,8);
    var sql = "SELECT * FROM t_daily WHERE work_month = '" + work_month + "' and work_date = '" + work_date + "'"; 

    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);
    execSQL(db, sql, [], function(rs){
        var len = rs.rows.length;
        if (len > 0) {
            $("#actual_work_start_time").html(rs.rows.item(0).actual_work_start_time);
            $("#actual_work_end_time").html(rs.rows.item(0).actual_work_end_time);
            $(".remark_textarea").html(rs.rows.item(0).remark);
        }
    }, function(error){
      console.log(error.message);
    });

}

// ----------------------------------------------------------------------
// 日次画面 戻るボタン押下
// ----------------------------------------------------------------------
function backDate() {
    var old_yyyy = $("#disp_date").val().substring(0,4);
    var old_mm = $("#disp_date").val().substring(4,6);
    var old_dd = $("#disp_date").val().substring(6,8);
    
    var date = new Date(old_yyyy+"-"+old_mm+"-"+old_dd);
    date.setDate(date.getDate()-1);
    
    var yyyy = date.getFullYear();
    var mm = date.getMonth()+1;
    var dd = date.getDate();
        
    // 表示中の日付を格納
    mm += "";
    if (mm.length === 1) {
        mm = "0" + mm;
    }
    dd += "";
    if (dd.length === 1) {
        dd = "0" + dd;
    }
    var work_month = yyyy+""+mm+""+dd;
    $("#disp_date").val(work_month);
    
    displayDailyData();
}

// ----------------------------------------------------------------------
// 日次画面 進むボタン押下
// ----------------------------------------------------------------------
function forwardDate() {
    var old_yyyy = $("#disp_date").val().substring(0,4);
    var old_mm = $("#disp_date").val().substring(4,6);
    var old_dd = $("#disp_date").val().substring(6,8);
    
    var date = new Date(old_yyyy+"-"+old_mm+"-"+old_dd);
    date.setDate(date.getDate()+1);
    
    var yyyy = date.getFullYear();
    var mm = date.getMonth()+1;
    var dd = date.getDate();
        
    // 表示中の日付を格納
    mm += "";
    if (mm.length === 1) {
        mm = "0" + mm;
    }
    dd += "";
    if (dd.length === 1) {
        dd = "0" + dd;
    }
    var work_month = yyyy+""+mm+""+dd;
    $("#disp_date").val(work_month);
    
    displayDailyData();
} 

function setMaxManth() {
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);
        
    // 最大の年月
    var workMonth;
    
    // 年
    var year;
    
    // 月
    var month;
    
    // 最大年月取得
    var sql = "SELECT MAX(work_month) as work_month FROM t_monthly";

    // SQL実行
    execSQL(db, sql, [], function(rs){
        workMonth = rs.rows.item(0).work_month;
        year = workMonth.substring(0, 4);
        month = workMonth.substring(4, 6);
        $("#work_year").val(year);
        $("#work_month").val(month);
    }, function(error){
        console.log(error.message);
    });
}

// ----------------------------------------------------------------------
// 出勤ボタン押下時
// ----------------------------------------------------------------------
function setWorkStartTime() {    
    var d = new Date();
    d.setYear($("#day .year").html());
    d.setMonth($("#day .month").html()-1);
    d.setDate($("#day .date").html());

    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）
    var hmWk = comDateFormat(d, "HHmm");      // 現在時刻  （HHMM）
    
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);
    
    // 基本勤務始業時間
    var sql = "SELECT * from t_monthly where work_month = '" + ymWk + "'";
    execSQL(db, sql, [], function(rs){
        if (rs.rows.length > 0 ){
            bwstWk = rs.rows.item(0).basic_work_start_time;
            
            // 現在時刻 >= 基本勤務始業時間（t_monthly . basic_work_start_time）の場合、端末の現在時刻を設定
            // 現在時刻 < 基本勤務始業時間（t_monthly . basic_work_start_time）の場合、基本勤務始業時間を設定
            var setTimeWk;
            if (hmWk >= bwstWk) {
                setTimeWk = hmWk;
            } else {
                setTimeWk = bwstWk;
            }
            
            // データベース更新
            sql = "UPDATE t_daily SET actual_work_start_time = '" + setTimeWk + "' WHERE work_date = '" + ymdWk + "'";
            //sql = "INSERT INTO t_daily (work_month, work_date, work_div, actual_work_start_time, actual_work_end_time, date_div, remark) " +
            //      "VALUES ('201508', '20150826', '1', null, null, '0', 'テスト')";
            execSQL(db, sql, [], function(rs){
                $("#actual_work_start_time").html(setTimeWk.substr(0,2) + ':' + setTimeWk.substr(2,2));
                
                // 退勤ボタンを表示
                $(".work_end_button").show();
                $(".work_end_input").removeAttr("disabled");
                
                // 出勤ボタンを非表示
                $(".work_start_button").hide();
                $(".work_start_input").attr("disabled","disabled");
                
                
                alert("出勤しました");
            }, function(error){
                alert(error.message);
            });
        }
    }, function(error){
        alert(error.message);
    });

    
}

// ----------------------------------------------------------------------
// 退勤ボタン押下時
// ----------------------------------------------------------------------
function setWorkEndTime() {
    var d = new Date();
    d.setYear($("#day .year").html());
    d.setMonth($("#day .month").html()-1);
    d.setDate($("#day .date").html());

    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）
    var hmWk = comDateFormat(d, "HHmm");      // 現在時刻  （HHMM）
    
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);
    
    // 基本勤務始業時間
    var sql = "SELECT * from t_monthly where work_month = '" + ymWk + "'";
    execSQL(db, sql, [], function(rs){
        if (rs.rows.length > 0 ){
            bwedWk = rs.rows.item(0).basic_work_end_time;
            
            // 現在時刻 >= 基本勤務終業時間（t_monthly . basic_work_end_time）の場合、基本勤務終業時間を設定
            // 現在時刻 < 基本勤務終業時間（t_monthly . basic_work_end_time）の場合、端末の現在時刻を設定 
            var setTimeWk;
            if (hmWk >= bwedWk) {
                setTimeWk = bwedWk;
            } else {
                setTimeWk = hmWk;
            }
            
            // データベース更新
            sql = "UPDATE t_daily SET actual_work_end_time = '" + setTimeWk + "' WHERE work_date = '" + ymdWk + "'";
            execSQL(db, sql, [], function(rs){
                $("#actual_work_end_time").html(setTimeWk.substr(0,2) + ':' + setTimeWk.substr(2,2));
                
                // 退勤ボタンを非表示
                $(".work_end_button").hide();
                $(".work_end_input").attr("disabled","disabled");
                
                alert("退勤しました");
            }, function(error){
                alert(error.message);
            });
        }
    }, function(error){
        alert(error.message);
    });
}

// ----------------------------------------------------------------------
// 休暇ボタン押下時
// ----------------------------------------------------------------------
function setHoliday(text) {
    var d = new Date();
    d.setYear($("#day .year").html());
    d.setMonth($("#day .month").html()-1);
    d.setDate($("#day .date").html());
    
    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）
    var dWk = ymdWk.substring(6, 8);            // 処理日  （DD）
    
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);

    //勤怠区分取得
    var sql = "SELECT * from t_daily where work_month = '"+ ymWk +"' and work_date = '" + ymdWk + "'";
    
    execSQL(db, sql, [], function(rs){
        if (rs.rows.length > 0 ){
            wdWk = rs.rows.item(0).work_div;
            
            var setHolidayWK;
            var dispHoliday;
            if (wdWk == "1") {      //欠勤区分が欠勤（work_div=1）の場合
                //勤怠区分を勤務（t_daily . work_div=0）に更新する
                setHolidayWK = "0";
                //休暇ボタン表示
                dispHoliday = "休暇";
                
                $("#holiday_view").hide();
                $("#work_time_input_area").show();
                
                // データベース更新
                sql = "UPDATE t_daily SET work_div = '" + setHolidayWK + "' WHERE work_month = '"+ ymWk +"' and work_date = '" + ymdWk + "'";
                execSQL(db, sql, [], function(rs){
                    alert("休暇を取り消しました。");
                }, function(error){
                    alert(error.message);
                }); 
                
            } else {        //欠勤区分が勤務（work_div=0）の場合
                //休暇ボタン表示
                // 休暇ボタン押下時、勤怠区分を欠勤（t_daily . work_div=1）に更新する。
                setHolidayWK = "1";
                //休暇取り消しボタン表示
                dispHoliday = "休暇取消";
                
                // 出勤・退勤ボタン非表示
                $(".work_start_button").hide();
                $(".work_start_input").attr("disabled","disabled");
                $(".work_end_button").hide();
                $(".work_end_input").attr("disabled","disabled");
                $("#holiday_view").show();
                $("#work_time_input_area").hide();
                
                // データベース更新
                sql = "UPDATE t_daily SET work_div = '" + setHolidayWK + "' WHERE work_month = '"+ ymWk +"' and work_date = '" + ymdWk + "'";
                execSQL(db, sql, [], function(rs){
                    alert("休暇登録しました。");
                }, function(error){
                    alert(error.message);
                }); 
            }
            
            $("#text").html(dispHoliday);

        }
    }, function(error){
        alert(error.message);
    });
}

// ----------------------------------------------------------------------
// 休暇状況セット
// ----------------------------------------------------------------------
function setHoridayText(){
    var d = new Date();
    d.setYear($("#day .year").html());
    d.setMonth($("#day .month").html()-1);
    d.setDate($("#day .date").html());

    var ymdWk = comDateFormat(d, "yyyyMMdd"); // 処理年月日（YYYYMMDD）
    var ymWk = ymdWk.substring(0, 6);         // 処理年月  （YYYYMM）
    var dWk = ymdWk.substring(6, 8);            // 処理日  （DD）
    var hmWk = comDateFormat(d, "HHmm");      // 現在時刻  （HHMM）

    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);

    //勤怠区分取得
    var sql = "SELECT * from t_daily where work_month = '"+ ymWk +"' and work_date = '" + ymdWk + "'";
    execSQL(db, sql, [], function(rs){
        if (rs.rows.length > 0 ){
            wdWk = rs.rows.item(0).work_div;
            var dispHoliday;
            if (wdWk == "1") {      //欠勤区分が欠勤（work_div=1）の場合
                //休暇取り消しボタン表示
                dispHoliday = "休暇取消";
                
                // 出勤・退勤ボタン非表示
                $(".work_start_button").hide();
                $(".work_start_input").attr("disabled","disabled");
                $(".work_end_button").hide();
                $(".work_end_input").attr("disabled","disabled");
                $("#holiday_view").show();
                $("#work_time_input_area").hide();
                
            } else {        //欠勤区分が勤務（work_div=0）の場合
                //休暇ボタン表示
                dispHoliday = "休暇";
                $("#holiday_view").hide();
                $("#work_time_input_area").show();
            }
            $("#text").html(dispHoliday);
        }
    },function(error){
        alert(error.message);
    });
}

// ----------------------------------------------------------------------
// 出力ボタン押下時
// ----------------------------------------------------------------------
function sendMail() {

    // 本文
    var body = '';
    // 年月
    var yearMonth = $("#work_year").val() + $("#work_month").val();
    // 年
    var year;
    // 月
    var month;
    // 日
    var day;
    // 時
    var hour;
    // 分
    var minute;
    // DB接続
    var db = openDb("Database", "1.0", "KintaiDatabase", 200000);
    // 休憩時間
    var breakTime;
    // sql文
    var sql = "SELECT t_daily.work_date, "
        + " t_daily.actual_work_start_time, "
        + " t_daily.actual_work_end_time, "
        + " t_daily.work_div, "
        + " t_daily.remark, "
        + " t_monthly.basic_break_start_time, "
        + " t_monthly.basic_break_end_time "
        + " FROM t_daily LEFT JOIN t_monthly "
        + " ON t_daily.work_month = t_monthly.work_month"
        + " WHERE t_daily.work_month = " + yearMonth;
        + " ORDER BY t_daily.work_date";

    execSQL(db, sql, [], function(rs){
        if (rs.rows.length === 0) {
            alert("指定した月のデータはありません。");
        } else {
            for(var i = 0;i < rs.rows.length;i++){
                var item = rs.rows.item(i);
                
                if (i == 0) body = "年月日,出勤,退勤,休憩,勤務区分,備考\n";
                
                if (item.work_date == "" || item.work_date == null) {
                    body = body + ", ";
                    
                } else {
                    year = item.work_date.substring(0, 4);
                    month = item.work_date.substring(4, 6);
                    day = item.work_date.substring(6,8);
                    body = body + year + "/" + month + "/" + day + ",";
                }
                
                // 出勤時間
                if (item.actual_work_start_time == "" || item.actual_work_start_time == null) {
                    body = body + ",";
                    
                } else {
                    body = body + item.actual_work_start_time.substring(0,2) + ":" 
                        + item.actual_work_start_time.substring(2,4) + ",";
                }
                
                // 退勤時間
                if (item.actual_work_end_time == "" || item.actual_work_end_time == null) {
                    body = body + ",";
                    
                } else {
                    body = body + item.actual_work_end_time.substring(0,2) + ":" 
                        + item.actual_work_end_time.substring(2,4) + ",";
                }
                
                // 休憩時間
                if (item.actual_work_start_time == "" || item.actual_work_start_time == null
                    || item.actual_work_end_time == "" || item.actual_work_end_time == null
                    || item.basic_break_start_time == "" || item.basic_break_start_time == null
                    || item.basic_break_end_time == "" || item.basic_break_end_time == null) {
                        body = body + ",";
                        
                } else {
                    // 基本休憩終了時間　<= 出勤
                    if (item.basic_break_start_time <= item.actual_work_start_time) {
                        body = body + "00:00" + ",";
                        
                    // 出勤 < 基本休憩開始時間 かつ 基本休憩終了時間 < 退勤
                    } else if (item.actual_work_start_time < item.basic_break_start_time
                        && item.basic_break_end_time < item.actual_work_end_time) {
                            breakTime = "0" + (item.basic_break_end_time - item.basic_break_start_time);
                            body = body + (breakTime).substring(0,2) + ":"
                                + (breakTime).substring(2,4) + ",";
                                
                    // 基本休憩開始時間 < 出勤 かつ 基本休憩終了時間 <= 退勤
                    } else if (item.basic_break_start_time < item.actual_work_start_time
                        && item.basic_break_end_time <= item.actual_work_end_time) {
                            breakTime = "00" + item.basic_break_end_time - item.actual_work_start_time;
                            body = body + breakTime.substring(0,2) + ":" 
                                + breakTime.substring(2,4) + ",";
                    } 
                }
                
                // 勤務区分
                if (item.work_div == "" || item.work_div == null) {
                    body = body + ",";
                    
                } else {
                    if (item.work_div == 0) {
                        body = body + "勤務,";
                    } else {
                        body = body + "欠勤,";
                    }
                }
                
                 // 備考
                if (item.remark == "" || item.remark == null) {
                    body = body + "\"\"" + "\n";
                    
                } else {
                    body = body + "\"" + item.remark + "\"\n";
                }                 
            }
            
            setTimeout(function() {
                mailKick(body);
            } , 1000);
        }
        
    },function(error){
        alert(error.message);
    });
}
 
// ----------------------------------------------------------------------
// デフォルトメーラーを起動する
// ----------------------------------------------------------------------
function　mailKick(body) {
    
    window.plugins.webintent.startActivity (
        {
            action: window.plugins.webintent.ACTION_VIEW,
            url: 'mailto:' + "" +'?subject=' + "【はにかむ勤怠】勤怠CSV" + "&body=" + body
        },
        function () {},
        function () {alert ('Failed to open URL via Android Intent');}
    );
}