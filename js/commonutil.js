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

/**
 * 空チェック
 * @param {string} obj - JSONオブジェクトを指定する。
 * @return {string} - [obj]という形式で戻る。
 */
function isEmpty(obj){
  return !Object.keys(obj).length;
}

/**
 * クリップボードにコピーする
 * @param {string} text - テキストを指定する。
 */
function copy2clipboard(text) {
	// コピー用のtextareaを生成
	var textarea = document.createElement('textarea');
	textarea.style.position ='absolute';
	textarea.style.opacity = 0;
	textarea.style.pointerEvents = 'none';
	textarea.value = text;
 
	// 一時的にtextareaをページに追加して、コピー後に削除
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.setSelectionRange(0, 999999);
	document.execCommand('copy');
	textarea.parentNode.removeChild(textarea);
}