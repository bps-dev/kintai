// This is a JavaScript file

function createDB(){
    var db = window.openDatabase("Database", "1.0", "KintaiDatabase", 200000);
    db.transaction(createDBQuery, errorCB, successCB);
}

function createDBQuery(tx) {
    
    // t_monthlyテーブルの作成        
	tx.executeSql("CREATE TABLE IF NOT EXISTS t_monthly ("+
		"work_month TEXT NOT NULL,"+
		"basic_work_start_time TEXT(4) DEFAULT '0900',"+
		"basic_work_end_time TEXT(4) DEFAULT '1800',"+
		"basic_break_time TEXT(4) DEFAULT '0100',"+
		"CONSTRAINT pk_t_monthly PRIMARY KEY (work_month))"
		);
    // t_dailyテーブルの作成
    tx.executeSql("CREATE TABLE IF NOT EXISTS t_daily ("+
        "work_month TEXT NOT NULL,"+
        "work_date TEXT NOT NULL,"+
        "work_div TEXT(1) NOT NULL DEFAULT '0',"+
        "actual_work_start_time TEXT(4),"+
        "actual_work_end_time TEXT(4),"+
        "date_div TEXT(1) NOT NULL DEFAULT '0',"+
        "remark TEXT(500),"+
        "CONSTRAINT pk_t_daily PRIMARY KEY (work_month, work_date))"
    );
    // m_holidayテーブルの作成
    tx.executeSql("CREATE TABLE IF NOT EXISTS m_holiday ("+
        "year INTEGER(4),"+
        "month INTEGER(2),"+
        "day INTEGER(2),"+
        "week TEXT(1),"+
        "holiday_div TEXT(1) DEFAULT '1',"+
        "holiday_name TEXT(32),"+
        "CONSTRAINT pk_m_holiday PRIMARY KEY (year, month, day))"
    );
    // m_application_infoテーブルの作成
    tx.executeSql("CREATE TABLE IF NOT EXISTS m_application_info ("+
        "name TEXT(64) NOT NULL,"+
        "version TEXT(16) NOT NULL,"+
        "CONSTRAINT pk_m_application_info PRIMARY KEY (name))"
    );
    
    // m_application_infoレコード登録
    tx.executeSql("INSERT OR IGNORE INTO m_application_info VALUES ('勤怠アプリ', '1.0.0')");
    // m_holidayレコード登録
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 1, 1, '4', '1', '元日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 1, 12, '1', '1', '成人の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 2, 11, '3', '1', '建国記念の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 3, 21, '6', '1', '春分の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 4, 29, '3', '1', '昭和の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 5, 3, '0', '1', '憲法記念日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 5, 4, '1', '1', 'みどりの日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 5, 5, '2', '1', 'こどもの日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 7, 20, '1', '1', '海の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 9, 21, '1', '1', '敬老の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 9, 23, '3', '1', '秋分の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 10, 12, '1', '1', '体育の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 11, 3, '2', '1', '文化の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 11, 23, '1', '1', '勤労感謝の日')");
    tx.executeSql("INSERT OR IGNORE INTO m_holiday VALUES (2015, 12, 23, '3', '1', '天皇誕生日')");
}

// トランザクション失敗時のコールバック
//
function errorCB(err) {
    console.log("SQL 実行中にエラーが発生しました: "+err.code);
}

// トランザクション成功時のコールバック
//
function successCB() {
    console.log("DB create success..");
    
    checkThisMonthRecord();
}

// 今月のレコードが月次テーブルにあるかチェック
// 無ければ、レコードを作成
function checkThisMonthRecord(){
    console.log("checkThisMonthRecord start");
    var db = window.openDatabase("Database", "1.0", "KintaiDatabase", 200000);
    
    // 今月のレコードをSELECT
    var thisDate = new Date();
    var yyyy = thisDate.getFullYear();
    var mm = thisDate.getMonth()+1;
    mm += "";
    if (mm.length === 1) {
        mm = "0" + mm;
    }
    var work_month = yyyy+""+mm;
    
    var lastDate = new Date();
    lastDate.setDate(0);
    yyyy = lastDate.getFullYear();
    mm = lastDate.getMonth()+1;
    mm += "";
    if (mm.length === 1) {
        mm = "0" + mm;
    }
    var last_month = yyyy+""+mm;
    
    var sql = 'SELECT * FROM t_monthly WHERE work_month='+work_month;
    
    execSQL(db, sql, [], function(rs){
        var len = rs.rows.length;
        console.log("今月("+work_month+")のレコードが " + len + " 行あります。");
        if (len == 0) {
            // 今月のレコードが存在しない場合、先月のレコードを取得
            sql = 'SELECT * FROM t_monthly WHERE work_month='+last_month;
            execSQL(db, sql, [], function(rs){
                len = rs.rows.length;
                console.log("先月("+last_month+")のレコードが " + len + " 行あります。");
                if (len == 0) {
                    // 先月のレコードが存在しない場合、デフォルト値で今月のレコードをINSERT
                    sql = "INSERT INTO t_monthly(work_month) VALUES ("
                        + work_month
                        +")";
                    execSQL(db, sql, [], function(rs){
                    });
                } else {
                    // 先月のレコードが存在する場合、先月の基本勤務始業時間等を使ってINSERT
                    sql = "INSERT INTO t_monthly(work_month, basic_work_start_time, basic_work_end_time, basic_break_start_time, basic_break_end_time) VALUES ("
                        + work_month + ", "
                        + "'"+ rs.rows.item(0).basic_work_start_time + "',"
                        + "'"+ rs.rows.item(0).basic_work_end_time + "',"
                        + "'"+ rs.rows.item(0).basic_break_start_time + "',"
                        + "'"+ rs.rows.item(0).basic_break_end_time + "'"
                        +")";
                    execSQL(db, sql, [], function(rs){
                    });
                }
                for (var i = 1; i <= 31; i++) {
                    // 1ヶ月分のt_dailyデータをINSERT。
                    // TODO:休暇区分はDate.getDay()を使用して求める
                    if (i < 10) {
                        i = "0" + i;
                    }
                    var work_date = work_month + ""+i;
                    sql = "INSERT INTO t_daily(work_month, work_date) VALUES (" + work_month + ", " + work_date + ")";
                    execSQL(db, sql, [], function(rs){});
                }
                
            }, function(error){
                alert(error.message);
            });

        } else {
            // 今月のレコードが存在する場合、何もしない
        }
    }, function(error){
        alert(error.message);
    });
    
        console.log("checkThisMonthRecord end");
}

// デバッグ用
// 全ての月のレコードを出力
function checkAllMonth(){
    var db = window.openDatabase("Database", "1.0", "KintaiDatabase", 200000);
    db.transaction(checkAllMonthQuery, errorCB);
}
function checkAllMonthQuery(tx){
    tx.executeSql('SELECT * FROM t_monthly', [], checkAllMonthQuerySuccess, errorCB);
}
function checkAllMonthQuerySuccess(tx, results){
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        console.log("行 = " + i + " work_month = " + results.rows.item(i).work_month
        + " basic_work_start_time = " + results.rows.item(i).basic_work_start_time
        + " basic_work_end_time = " + results.rows.item(i).basic_work_end_time
        + " basic_break_start_time = " + results.rows.item(i).basic_break_start_time
        + " basic_break_end_time = " + results.rows.item(i).basic_break_end_time
        );
    }  
}
// デバッグ用
// 全ての日のレコードを出力
function checkAllDate(){
    var db = window.openDatabase("Database", "1.0", "KintaiDatabase", 200000);
    db.transaction(checkAllDateQuery, errorCB);
}
function checkAllDateQuery(tx){
    tx.executeSql('SELECT * FROM t_daily', [], checkAllDateQuerySuccess, errorCB);
}
function checkAllDateQuerySuccess(tx, results){
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        console.log("行 = " + i + " work_month = " + results.rows.item(i).work_month
        + " work_date = " + results.rows.item(i).work_date
        + " actual_work_start_time = " + results.rows.item(i).actual_work_start_time
        + " actual_work_end_time = " + results.rows.item(i).actual_work_end_time
        );
    }  
}
// テーブルを全削除
function dropAllTable(){
    var db = window.openDatabase("Database", "1.0", "KintaiDatabase", 200000);
    db.transaction(dropAllTableQuery, errorCB);
}
function dropAllTableQuery(tx){
    tx.executeSql('DROP TABLE t_daily');
    tx.executeSql('DROP TABLE t_monthly');
    tx.executeSql('DROP TABLE m_holiday');
    tx.executeSql('DROP TABLE m_application_info');
}

// ------------------------------------------------------------
// ＤＢオープン
// ------------------------------------------------------------
// name　　    : DB名
// version     : 指定無くてよい
// displayName : 表示名、ダイアログなどで利用される
// size        : 最大容量、バイト単位
// ------------------------------------------------------------
function openDb(name, version, displayName, size){
    // DB初回作成時のみコールされる、特に仕様無し、スケルトン
    var callback = function(){
        alert("create new db.");
    };
    return window.openDatabase(name, version, displayName, size, callback);
}

// ------------------------------------------------------------
// ＳＱＬ実行
// ------------------------------------------------------------
// db          : openDbの戻り値
// sqlBase     : 実行するSQL、パラメータ部は?
// sqlParams   : パラメータ（配列）、無い場合空[]を指定
// callback    : 処理終了時コールバック(エラー発生時；第一引数：処理結果)
// err         : 処理エラー時コールバック(エラー発生時；第一引数：エラー情報)
// ------------------------------------------------------------
function execSQL(db, sqlBase, sqlParams, callback, err){
    db.transaction(function(transaction){
        // SQL実行
        transaction.executeSql(sqlBase, sqlParams,function(transaction, result){
            // 成功
            callback(result);
        }, function(transaction, error){
            // 失敗
            //err(error);
        });
    });
}
