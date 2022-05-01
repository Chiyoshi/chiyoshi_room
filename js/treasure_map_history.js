/**
 * 地図履歴クラス
 */
class TreasureMapHistory {
	constructor(date, buff, amount) {
		this.date = date;
		this.buff = buff;
		this.amount = amount;
	}

	get getDate() {
		return this.date;
	}

	set setDate(date_) {
		this.date = date_;
	}

	get getBuff() {
		return this.buff;
	}

	set setBuff(buff_) {
		this.buff = buff_;
	}

	get getAmount() {
		return this.amount;
	}

	set setAmount(amount_) {
		this.amount = amount_;
	}
}


/**
 * グローバル変数 定義
 */
// 修正前の地図履歴を保存する
var oldTreasureMapHistory;


/**
 * ボタン押下時アクション
 */
jQuery(function ($) {
	/**
	 * 初期画面表示時のアクション
	 */
	$(document).ready(function() {
		// 記録タブ
		// ローカルストレージから地図履歴テーブルを取得する。
		const history = getTreasureMapHistory();
			
		if (history) {
			Object.keys(history).forEach(function (key) {
				// 要素に追加
				$('#treasure-map-history-table').append(
					createTreasureMapHistoryHtml(history[key].date, history[key].time, history[key].buff, history[key].amount));
			});
		}

		// 合計タブ
		// ローカルストレージから地図合計テーブルを取得する。
		const json = getTreasureMapTotal();
			
		if (json) {
			Object.keys(json).forEach(function (key) {
				// 要素に追加
				$('#treasure-map-total-table').append(
					createTreasureMapTotalHtml(json[key].date, json[key].exp, json[key].repop, json[key].drop, json[key].special, json[key].gold, json[key].weak, json[key].count, json[key].total_amount));
			});
		}
	});


	/**
	 * 合計タブ切り替え時のアクション
	 */
	$(document).on('shown.bs.tab', '#item-total-tab', function () {
		// 全行を削除する
		$('#treasure-map-total-table').find('tbody tr').remove();

		// ローカルストレージから地図合計テーブルを取得する。
		const json = getTreasureMapTotal();
			
		if (json) {
			Object.keys(json).forEach(function (key) {
				// 要素に追加
				$('#treasure-map-total-table').append(
					createTreasureMapTotalHtml(json[key].date, json[key].exp, json[key].repop, json[key].drop, json[key].special, json[key].gold, json[key].weak, json[key].count, json[key].total_amount));
			});
		}
	});

	/**
	 * 地図ボタン押下時のアクション
	 */
	$(document).on('click', '#btn-add-buff', function () {
		addTreasureMapHistory($(this).text())
	});

	/**
	 * 履歴クリアボタン押下時のアクション
	 */
	$(document).on('click', '#btn-history-clear', function () {
		let result = window.confirm('履歴をクリアしますか？　※合計はクリアされません。');
		if (result) {
			// ローカルストレージから削除する
			localStorage.removeItem('treasure_map_history_table');
			// reloadメソッドによりページをリロード
			window.location.reload();
		}
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
		$(this).closest('tr').find('#amount').html('<input type="number" size="5" maxlength="3" value="' + amount + '" class="form-control form-control-sm">');

		// 修正ボタンを確定ボタンに変更する
		$(this).closest('tr').find('#btn-change').text('確定');
		$(this).closest('tr').find('#btn-change').attr('id', 'btn-complete');

		// 地図履歴クラスに修正前の情報を設定する
		oldTreasureMapHistory = new TreasureMapHistory(date, buff, amount);
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
			json[rownum].amount = parseInt(amount, 10)

			// ローカルストレージに保存し直す。
			localStorage.setItem('treasure_map_history_table', JSON.stringify(json));
		}

		// 修正前の値を削除してから変更後の値で登録し直す。
		deleteTreasureMapTotal({ date: oldTreasureMapHistory.getDate, time: oldTreasureMapHistory.getTime, buff: oldTreasureMapHistory.getBuff, amount : oldTreasureMapHistory.getAmount });
		insertTreasureMapTotal({ date: date, time: time, buff: buff, amount : amount });

	});

	/**
	 * 削除ボタン押下時のアクション
	 */
	$(document).on('click', '#treasure-map-history-table tbody tr td #btn-delete', function () {
		// 選択した行の値を取得する
		const date = $(this).closest('tr').find('#date').text();
		const time = $(this).closest('tr').find('#time').text();
		const buff = $(this).closest('tr').find('#buff').text();
		const amount = $(this).closest('tr').find('#amount').text();

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

		// 地図合計テーブルから対象レコードを削除する
		deleteTreasureMapTotal({ date: date, time: time, buff: buff, amount: amount });
	});

	/**
	 * 合計クリアボタン押下時のアクション
	 */
	$(document).on('click', '#btn-total-clear', function () {
		let result = window.confirm('合計をクリアしますか？');
		if (result) {
			// ローカルストレージから削除する
			localStorage.removeItem('treasure_map_total_table');
			// reloadメソッドによりページをリロード
			window.location.reload();
		}
	});

	/**
	 * コピーボタン押下時のアクション
	 */
	$(document).on('click', '#treasure-map-total-table tbody tr td #btn-total-row-copy', function () {
		// 選択した行の値を取得する
		const date = $(this).closest('tr').find('#date').text();
		const exp = $(this).closest('tr').find('#exp').text();
		const repop = $(this).closest('tr').find('#repop').text();
		const drop = $(this).closest('tr').find('#drop').text();
		const special = $(this).closest('tr').find('#special').text();
		const gold = $(this).closest('tr').find('#gold').text();
		const weak = $(this).closest('tr').find('#weak').text();
		const count = $(this).closest('tr').find('#count').text();
		const total_amount = $(this).closest('tr').find('#total_amount').text();

		// テキスト整形
		let text = '';
		text += '経験値:' + exp + ' ';
		text += 'リポ:' + repop + ' ';
		text += 'ドロ:' + drop + ' ';
		text += '特殊:' + special + ' ';
		text += 'ゴールド:' + gold + ' ';
		text += 'マナ弱:' + weak + ' ';
		text += '合計:' + count + ' ';
		text += '売上:' + total_amount + '本';

		// クリップボードにコピーする
		copy2clipboard(text);
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

			// 日付でソートする
			json.sort(function(a,b){
				if(a.date > b.date) return 1 
				if(a.date< b.date) return -1 
				return 0
			});
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
		var new_data = { date: date, time: time, buff: buff, amount: 0 };
		json.push(new_data);

		// ローカルストレージに保存する。
		localStorage.setItem('treasure_map_history_table', JSON.stringify(json));
	}

	// 地図合計テーブに対象レコードを登録する。
	insertTreasureMapTotal(new_data);
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

/**
 * 地図合計テーブルに追加するHTMLを作成する。
 * @param {string} date - 日付を指定する。
 * @param {string} exp - 経験値を指定する。
 * @param {string} repop - リポップを指定する。
 * @param {string} drop - ドロップを指定する。
 * @param {string} special - 特殊を指定する。
 * @param {string} gold - ゴールドを指定する。
 * @param {string} weak - マナ弱を指定する。
 * @param {string} count - 合計を指定する。
 * @param {string} total_amount - 売上を指定する。
 * @return {string} - html
 */
function createTreasureMapTotalHtml(date, exp, repop, drop, special, gold, weak, count, total_amount) {
	let str = '';
	str += '<tr>'
	str += '<td id="no"></td>' // Noはcssでカウントしている
	str += '<td id="date">' + date + '</td>'
	str += '<td id="exp">' + exp + '</td>'
	str += '<td id="repop">' + repop + '</td>'
	str += '<td id="drop">' + drop + '</td>'
	str += '<td id="special">' + special + '</td>'
	str += '<td id="gold">' + gold + '</td>'
	str += '<td id="weak">' + weak + '</td>'
	str += '<td id="count">' + count + '</td>'
	str += '<td id="total_amount">' + total_amount + '</td>'
	str += '<td id="change">' + '<button class="btn btn-info btn-sm form-control form-control-sm" id="btn-total-row-copy" type="button">コピー</button>' + '</td>'
	str += '</tr>'
	return str;
}

/**
 * 地図合計テーブルに対象レコードを登録する
 * @param {string} data - 地図履歴JSONを指定する。
 */
function insertTreasureMapTotal(data) {

	let isExistData = false;

	let treasure_map_total = getTreasureMapTotal();

	// 初期化
	let wk_exp = 0;
	let wk_repop = 0;
	let wk_drop = 0;
	let wk_special = 0;
	let wk_gold = 0;
	let wk_weak = 0;

	switch (data.buff) {
		case '経験値':
			wk_exp ++;
			break;
		case 'リポップ':
			wk_repop ++;
			break;
		case 'ドロップ':
			wk_drop ++;
			break;
		case '特殊':
			wk_special ++;
			break;
		case 'ゴールド':
			wk_gold ++;
			break;
		case 'マナ弱':
			wk_weak ++;
			break;
		default:
			break;
	}

	// ローカルストレージに存在する場合は値を加算する。
	if (!isEmpty(treasure_map_total)) {
		Object.keys(treasure_map_total).forEach(function (key) {
			if (treasure_map_total[key].date === data.date) {
				treasure_map_total[key].exp += wk_exp;
				treasure_map_total[key].repop += wk_repop;
				treasure_map_total[key].drop += wk_drop;
				treasure_map_total[key].special += wk_special;
				treasure_map_total[key].gold += wk_gold;
				treasure_map_total[key].weak += wk_weak;
				treasure_map_total[key].count ++;
				treasure_map_total[key].total_amount += parseInt(data.amount, 10);

				isExistData = true;
			}
		});
	}

	// ローカルストレージに存在しない場合は新規登録する。
	if(!isExistData) {
		treasure_map_total.push({
			date: data.date,
			exp: wk_exp,
			repop: wk_repop,
			drop: wk_drop,
			special: wk_special,
			gold: wk_gold,
			weak: wk_weak,
			count: 1,
			total_amount: parseInt(data.amount, 10);
		});
	}

	// ローカルストレージに保存し直す。
	localStorage.setItem('treasure_map_total_table', JSON.stringify(treasure_map_total));
}

/**
 * ローカルストレージから地図合計テーブルを取得する
 * @return {string} - json
 */
function getTreasureMapTotal() {
	let json = [];

	if (window.localStorage) {
		// ローカルストレージから値を取得する
		const data = localStorage.getItem('treasure_map_total_table');
		
		if (data) {
			json = JSON.parse(data);

			// 日付でソートする
			json.sort(function(a,b){
				if(a.date > b.date) return 1 
				if(a.date< b.date) return -1 
				return 0
			});
		}
	}

	return json;
}

/**
 * 地図合計テーブルから対象レコードを削除する
 * @param {string} data - 地図履歴JSONを指定する。
 */
function deleteTreasureMapTotal(data) {
	let treasure_map_total = getTreasureMapTotal();

	// 初期化
	let wk_exp = 0;
	let wk_repop = 0;
	let wk_drop = 0;
	let wk_special = 0;
	let wk_gold = 0;
	let wk_weak = 0;

	switch (data.buff) {
		case '経験値':
			wk_exp ++;
			break;
		case 'リポップ':
			wk_repop ++;
			break;
		case 'ドロップ':
			wk_drop ++;
			break;
		case '特殊':
			wk_special ++;
			break;
		case 'ゴールド':
			wk_gold ++;
			break;
		case 'マナ弱':
			wk_weak ++;
			break;
		default:
			break;
	}

	if (!isEmpty(treasure_map_total)) {
		Object.keys(treasure_map_total).forEach(function (key) {
			if (treasure_map_total[key].date === data.date) {
				treasure_map_total[key].exp -= wk_exp;
				treasure_map_total[key].repop -= wk_repop;
				treasure_map_total[key].drop -= wk_drop;
				treasure_map_total[key].special -= wk_special;
				treasure_map_total[key].gold -= wk_gold;
				treasure_map_total[key].weak -= wk_weak;
				treasure_map_total[key].count --;
				treasure_map_total[key].total_amount -= parseInt(data.amount, 10);
			}
		});
	}

	// ローカルストレージに保存する。
	localStorage.setItem('treasure_map_total_table', JSON.stringify(treasure_map_total));
}




/**
 * 未使用
 * treasure_map_total = [{ date: "yyyy/mm/dd", exp: 0, repop: 0, drop: 0, special: 0, gold: 0, weak: 0, count: 0, total_amount: 0 }]
 */
function aggregateTreasureMapTotal() {

	// ローカルストレージから地図履歴を取得する
	let json = getTreasureMapHistory();

	if (json) {
		let treasure_map_total = json.reduce(function (result, current) {
			let work = result.find(function (p) {
				return p.date === current.date
			});

			// 初期化
			let wk_exp = 0;
			let wk_repop = 0;
			let wk_drop = 0;
			let wk_special = 0;
			let wk_gold = 0;
			let wk_weak = 0;

			switch (current.buff) {
				case '経験値':
					wk_exp ++;
					break;
				case 'リポップ':
					wk_repop ++;
					break;
				case 'ドロップ':
					wk_drop ++;
					break;
				case '特殊':
					wk_special ++;
					break;
				case 'ゴールド':
					wk_gold ++;
					break;
				case 'マナ弱':
					wk_weak ++;
					break;
				default:
					break;
			}

			if (work) {
				work.exp += wk_exp;
				work.repop += wk_repop;
				work.drop += wk_drop;
				work.special += wk_special;
				work.gold += wk_gold;
				work.weak += wk_weak;
				work.count ++;
				work.total_amount += parseInt(current.amount, 10);
			} else {
				result.push({
					date: current.date,
					exp: wk_exp,
					repop: wk_repop,
					drop: wk_drop,
					special: wk_special,
					gold: wk_gold,
					weak: wk_weak,
					count: 1,
					total_amount: parseInt(current.amount, 10)
				});
			}
			return result;
		}, []);
	
		console.log(json);
		console.log(treasure_map_total);

	}

}



