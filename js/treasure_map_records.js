
jQuery(function ($) {
	/**
	 * 画面表示時に地図履歴テーブルを読み込む
	 */
	$(document).ready(function() {
		// ローカルストレージから地図履歴テーブルを取得する。
		const json = getTreasureMapHistory();
			
		if (json) {
			Object.keys(json).forEach(function (key) {
				// 要素に追加
				$('#treasure-map-history-table').append(
					createTreasureMapHistoryHtml(json[key].date, json[key].time, json[key].buff, json[key].amount));
			});
		}
	});

	/**
	 * 地図ボタン押下時のアクション
	 */
	$(document).on('click', '#btn-add-buff', function () {
		addTreasureMapHistory($(this).text())
	});



    // テーブルの行を追加する処理です
    $(document).on('click', '#treasure-map-history-table tbody tr td #btn-add-row', function () {

        //$("#user_list tbody tr:first-child") // テーブルの一番初めの行を指定する
        //    .clone(true)                     // 指定した一番初めの行のHTML要素を複製する
        //    .appendTo("#user_list tbody");   // 複製した要素をtbodyに追加する
        //
        //
        //$("#user_list tbody tr:last-child input").val(""); // 追加した行の値をクリアする
        
    });

	/**
	 * 修正ボタン押下時のアクション
	 */
	$(document).on('click', '#treasure-map-history-table tbody tr td #btn-change', function () {
		// 選択した行の値を取得する
		const date = $(this).closest('tr').find('#date').text();
		const time = $(this).closest('tr').find('#time').text();
		const buff = $(this).closest('tr').find('#buff').text();
		const amount = $(this).closest('tr').find('#amount').text();

		// 選択した行を修正できるように要素を変更する
		$(this).closest('tr').find('#date').html('<input type="text" size="5" maxlength="10" value="' + date + '" class="form-control form-control-sm">');
		$(this).closest('tr').find('#time').html('<input type="text" size="5" maxlength="5" value="' + time + '" class="form-control form-control-sm">');
		$(this).closest('tr').find('#buff').html('<input type="text" size="5" maxlength="10" value="' + buff + '" class="form-control form-control-sm">');
		$(this).closest('tr').find('#amount').html('<input type="text" size="5" maxlength="3" value="' + amount + '" class="form-control form-control-sm">');

		// 修正ボタンを確定ボタンに変更する
		$(this).closest('tr').find('#btn-change').text('確定');
		$(this).closest('tr').find('#btn-change').attr('id', 'btn-complete');
	});

	/**
	 * 確定ボタン押下時のアクション
	 */
	$(document).on('click', '#treasure-map-history-table tbody tr td #btn-complete', function () {
		// 選択した行の値を取得する
		const date = $(this).closest('tr').find('#date').children().first().val();
		const time = $(this).closest('tr').find('#time').children().first().val();
		const buff = $(this).closest('tr').find('#buff').children().first().val();
		const amount = $(this).closest('tr').find('#amount').children().first().val();

		// 選択した行を修正できるように要素を変更する
		$(this).closest('tr').find('#date').html(date);
		$(this).closest('tr').find('#time').html(time);
		$(this).closest('tr').find('#buff').html(buff);
		$(this).closest('tr').find('#amount').html(amount);

		// 修正ボタンを確定ボタンに変更する
		$(this).closest('tr').find('#btn-complete').text('修正');
		$(this).closest('tr').find('#btn-complete').attr('id', 'btn-change');

		// 行番号を取得する
		const rownum = $(this).closest('tr').index();

		// ローカルストレージから地図履歴テーブルを取得する。
		let json = getTreasureMapHistory();
			
		if (json) {
			// JSONの中身を書き換える。
			json[rownum].date = date
			json[rownum].time = time
			json[rownum].buff = buff
			json[rownum].amount = amount

			// ローカルストレージに保存し直す。
			localStorage.setItem('treasure_map_history_table', JSON.stringify(json));
		}
	});

	/**
	 * 削除ボタン押下時のアクション
	 */
	$(document).on('click', '#treasure-map-history-table tbody tr td #btn-delete', function () {
		// 行番号を取得する
		const rownum = $(this).closest('tr').index();
		// 行削除
		$(this).closest('tr').remove();

		// ローカルストレージから地図履歴テーブルを取得する。
		let json = getTreasureMapHistory();

		if (json) {
			// JSONから指定したINDEXを削除する。
			json.splice(rownum, 1);
			// ローカルストレージに保存し直す。
			localStorage.setItem('treasure_map_history_table', JSON.stringify(json));
		}
	});

});




/**
 * ローカルストレージから地図履歴テーブルを取得する
 * @return {string} - json
 */
function getTreasureMapHistory() {
	let json = [];

	if (window.localStorage) {
		// ローカルストレージから値を取得する
		const data = localStorage.getItem('treasure_map_history_table');
		
		if (data) {
			json = JSON.parse(data);
		}
	}

	return json;
}

/**
 * 地図履歴テーブルに履歴を追加する。
 * @param {string} buff - バフ名を指定する。
 */
function addTreasureMapHistory(buff) {
	//const num = $('#treasure-map-history-table tbody').children().length + 1;
	const date = getDate();
	const time = getTime();

	// 要素に追加
	$('#treasure-map-history-table').append(createTreasureMapHistoryHtml(date, time, buff, 0));

	// ローカルストレージから地図履歴を取得する
	let json = getTreasureMapHistory();
		
	if (json) {
		var new_data = { date: date, time: time, buff: buff, amount : 0 };
		json.push(new_data);

		// ローカルストレージに保存する
		localStorage.setItem('treasure_map_history_table', JSON.stringify(json));
	}
}

/**
 * 地図履歴テーブルに追加するHTMLを作成する。
 * @param {string} date - 日付を指定する。
 * @param {string} time - 時間を指定する。
 * @param {string} buff - バフ名を指定する。
 * @param {string} amount - 金額を指定する。
 * @return {string} - html
 */
function createTreasureMapHistoryHtml(date, time, buff, amount) {
	let str = '';
	str += '<tr>'
	str += '<td id="no"></td>' // Noはcssでカウントしている
	str += '<td id="date">' + date + '</td>'
	str += '<td id="time">' + time + '</td>'
	str += '<td id="buff">' + buff + '</td>'
	str += '<td id="amount">' + amount + '</td>'
	str += '<td id="change">' + '<button class="btn btn-info btn-sm form-control form-control-sm" id="btn-change" type="button">修正</button>' + '</td>'
	str += '<td id="delete">' + '<button class="btn btn-info btn-sm form-control form-control-sm" id="btn-delete" type="button">削除</button>' + '</td>'
	str += '</tr>'
	return str;
}

