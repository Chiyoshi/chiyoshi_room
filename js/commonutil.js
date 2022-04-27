/**
 * 現在日付取得
 * @return {string} - [yyyy/mm/dd]という形式で戻る。
 */
function getDate() {
	var date = new Date();
	return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
}


/**
 * 現在時刻取得
 * @return {string} - [hh:mm]という形式で戻る。
 */
function getTime() {
	var date = new Date();
	return date.getHours() + ":" + date.getMinutes();
}



