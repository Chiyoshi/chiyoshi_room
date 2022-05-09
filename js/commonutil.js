/**
 * ゼロ埋め
 * @param {string} value - 値を指定する。
 * @param {string} length - ゼロ埋めする桁数を指定する。
 * @return {string} - ゼロ埋めした値
 */
function zeroPadding(value, length) {
	return (Array(length).join('0') + value).slice(-length); 
}

/**
 * 現在日付取得
 * @return {string} - [yyyy/mm/dd]という形式で戻る。
 */
function getDate() {
	var date = new Date();
	return date.getFullYear() + "/" + zeroPadding((date.getMonth() + 1), 2) + "/" + zeroPadding(date.getDate(), 2);
}


/**
 * 現在時刻取得
 * @return {string} - [hh:mm]という形式で戻る。
 */
function getTime() {
	var date = new Date();
	return zeroPadding(date.getHours(), 2) + ":" + zeroPadding(date.getMinutes(), 2);
}

/**
 * JOSNオブジェクト空チェック
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

/**
 * 指定されたidに対してdisabled属性を設定する
 * @param {string} id - idを指定する。
 */
function setDisabled(id){
	//前方一致で引数idから始まるidを取得する
	let setbuttonArray = $('[id^="' + id + '"]');

	//取得したidを持つタグにdisabledを設定する
	for(i=0; i< setbuttonArray.length; i++){
		$('#' + setbuttonArray[i].id).prop("disabled", true);
	}
}

/**
 * 指定されたidに対してdisabled属性を除去する
 * @param {string} id - idを指定する。
 */
function unDisabled(id){
	//前方一致で引数idから始まるidを取得する
	let unbuttonArray = $('[id^="' + id + '"]');

	//取得したidを持つタグからdisabledを除去する
	for(i=0; i< unbuttonArray.length; i++){
		$('#' + unbuttonArray[i].id).prop("disabled", false);
	}
}
