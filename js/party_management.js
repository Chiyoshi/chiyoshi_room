/**
 * ボタン押下時アクション
 */
jQuery(function ($) {
	/**
	 * 初期画面表示時のアクション
	 */
	$(document).ready(function() {
		// バフ代タブ
		for (let i = 0; i < 1; i++) {
			$('#party-management-buff-price-table').append(createPartyManagementBuffPriceHtml(i));
		}

		// 予約代タブ
		for (let i = 0; i < 10; i++) {
			$('#party-management-reserve-table').append(createPartyManagementReserveHtml(i));
		}
	});

	/**
	 * 行追加ボタン押下時のアクション
	 */
	$(document).on('click', '#btn-buff-price-add', function () {
		// 行番号を取得する
		const index = $('#party-management-buff-price-table tbody').children().length;
		// 行追加
		$('#party-management-buff-price-table').append(createPartyManagementBuffPriceHtml(index));
	});

	/**
	 * コピーボタン押下時のアクション
	 */

	/**
	 * クリアボタン押下時のアクション
	 */

	/**
	 * 略称テキスト変更時のアクション
	 */
	$(document).on('click', '#party-management-buff-price-table thead tr th [id^="input-short-name-"]', function () {
		let shortNameList = {
			shotname1: $('#input-short-name-1').val(),
			shotname2: $('#input-short-name-2').val(),
			shotname3: $('#input-short-name-3').val(),
			shotname4: $('#input-short-name-4').val(),
			shotname5: $('#input-short-name-5').val(),
			shotname6: $('#input-short-name-6').val(),
			shotname7: $('#input-short-name-7').val(),
			shotname8: $('#input-short-name-8').val()
		};

		// ローカルストレージに存在する
		insertPartyManagementBuffPriceShortNameList(shortNameList);
	});

	/**
	 * 精算判定ボタン押下時のアクション
	 */
	$(document).on('click', '#party-management-buff-price-table tbody tr td [id^="btn-calculate-"]', function () {
		let btnText = $(this).text();
		let btnColor;
		
		switch(btnText) {
			case '未':
				btnText = '済';
				btnColor = '';
				break;
			case '済':
				btnText = '立替'
				btnColor = 'btn-info';
				break;
			case '立替':
				btnText = '未'
				btnColor = 'btn-secondary';
				break;
		}

		// ボタン名を変更する
		$(this).text(btnText);

		// ボタンの色を変更する
		$(this).removeClass('btn-info');
		$(this).removeClass('btn-secondary');
		$(this).removeClass('btn-white');
		$(this).addClass(btnColor);
	});

	/**
	 * 金額テキスト変更時のアクション
	 */
	$(document).on('change', '#party-management-buff-price-table tbody tr td [id^="input-price-"]', function () {
		// 行番号を取得する
		const index = $(this).closest('tr').index();
		// 1人あたりの金額を算出する
		calculatePerPerson(index);
	});
	
	

	/**
	 * 人数セレクト変更時のアクション
	 */
	$(document).on('change', '#party-management-buff-price-table tbody tr td [id^="select-num-"]', function () {
		// 行番号を取得する
		const index = $(this).closest('tr').index();
		// 人数を取得する
		const num = $(this).closest('tr').find('#' + $(this).attr('id')).val();

		changeCalculateButtonText(index, num);
		setDisabledCalculateButton(index, num);

		// 1人あたりの金額を算出する
		calculatePerPerson(index);
	});

});

/**
 * ローカルストレージからバフ代管理の略称一覧を取得する
 * @return {string} - json
 */
function getPartyManagementBuffPriceShortNameList() {
	let json = {};

	if (window.localStorage) {
		// ローカルストレージから値を取得する
		const data = localStorage.getItem('party_management_buff_price_short_name_list');
		
		if (data) {
			json = JSON.parse(data);
		}
	}

	return json;
}


/**
 * ローカルストレージからバフ代管理テーブルを取得する
 * @return {string} - json
 */
function getPartyManagementBuffPrice() {
	let json = [];

	if (window.localStorage) {
		// ローカルストレージから値を取得する
		const data = localStorage.getItem('party_management_buff_price_table');
		
		if (data) {
			json = JSON.parse(data);
		}
	}

	return json;
}

/**
 * ローカルストレージにバフ代管理の略称一覧を保存する
 * @param {string} data - JSONデータを指定する。
 */
function insertPartyManagementBuffPriceShortNameList(data) {
	// ローカルストレージに保存する。
	localStorage.setItem('party_management_buff_price_short_name_list', data);
}



/**
 * PT予約管理テーブルに追加するHTMLを作成する。
 * @param {string} index - 番号を指定する。
 * @return {string} - html
 */
function createPartyManagementReserveHtml(index) {
	let str = '';
	str += '<tr>'
	str += '<td id="no"></td>' // Noはcssでカウントしている
	str += '<td id="name"><input type="text" maxlength="20" class="form-control form-control-sm" id="input-name-' + index +'"></td>'
	str += '<td id="remarks"><input type="text" maxlength="20" class="form-control form-control-sm" id="input-remarks-' + index +'"></td>'
	str += '<td id="up">' + '<button class="btn btn-info btn-sm form-control form-control-sm" id="btn-up-' + index +'" type="button">↑</button>' + '</td>'
	str += '<td id="down">' + '<button class="btn btn-info btn-sm form-control form-control-sm" id="btn-down-' + index +'" type="button">↓</button>' + '</td>'
	str += '<td id="delete">' + '<button class="btn btn-info btn-sm form-control form-control-sm" id="btn-delete-' + index +'" type="button">削除</button>' + '</td>'
	str += '</tr>'
	return str;
}

/**
 * バフ代管理テーブルに追加するHTMLを作成する。
 * @param {string} index - 番号を指定する。
 * @return {string} - html
 */
function createPartyManagementBuffPriceHtml(index) {
	let str = '';
	str += '<tr>'
	str += '<td class="text-center" id="no"></td>' // Noはcssでカウントしている
	str += '<td class="text-center" id="price-type">'
	str += '<div class="form-group">'
	str += '    <select id="select-price-type-' + index + '" class="form-control-sm">'
	str += '        <option>買い</option>'
	str += '        <option>売り</option>'
	str += '    </select>'
	str += '</div>'
	str += '</td>'
	str += '<td class="text-center" id="price"><input type="number" maxlength="3" class="form-control form-control-sm" id="input-price-' + index +'"></td>'
	str += '<td class="text-center" id="num">'
	str += '<div class="form-group">'
	str += '    <select id="select-num-' + index + '" class="form-control-sm">'
	str += '        <option>1</option>'
	str += '        <option>2</option>'
	str += '        <option>3</option>'
	str += '        <option>4</option>'
	str += '        <option>5</option>'
	str += '        <option>6</option>'
	str += '        <option>7</option>'
	str += '        <option>8</option>'
	str += '    </select>'
	str += '</div>'
	str += '</td>'
	str += '<td class="text-center" id="per-person-' + index + '">0</td>'
	str += '<td class="text-center" id="calculate-1">' + '<button class="btn btn-info btn-sm form-control form-control-sm" id="btn-calculate-' + index + '-1" type="button">立替</button>' + '</td>'
	str += '<td class="text-center" id="calculate-2">' + '<button class="btn btn-secondary btn-sm form-control form-control-sm" id="btn-calculate-' + index + '-2" type="button">未</button>' + '</td>'
	str += '<td class="text-center" id="calculate-3">' + '<button class="btn btn-secondary btn-sm form-control form-control-sm" id="btn-calculate-' + index + '-3" type="button">未</button>' + '</td>'
	str += '<td class="text-center" id="calculate-4">' + '<button class="btn btn-secondary btn-sm form-control form-control-sm" id="btn-calculate-' + index + '-4" type="button">未</button>' + '</td>'
	str += '<td class="text-center" id="calculate-5">' + '<button class="btn btn-secondary btn-sm form-control form-control-sm" id="btn-calculate-' + index + '-5" type="button">未</button>' + '</td>'
	str += '<td class="text-center" id="calculate-6">' + '<button class="btn btn-secondary btn-sm form-control form-control-sm" id="btn-calculate-' + index + '-6" type="button">未</button>' + '</td>'
	str += '<td class="text-center" id="calculate-7">' + '<button class="btn btn-secondary btn-sm form-control form-control-sm" id="btn-calculate-' + index + '-7" type="button">未</button>' + '</td>'
	str += '<td class="text-center" id="calculate-8">' + '<button class="btn btn-secondary btn-sm form-control form-control-sm" id="btn-calculate-' + index + '-8" type="button">未</button>' + '</td>'
	str += '</tr>'
	return str;
}

/**
 * バフ代１人あたりの金額を計算する
 * @param {string} index - 行番号を指定する。
 */
function calculatePerPerson(index) {
	// 金額を取得する
	const price = $('#' + 'input-price-' + index).val();

	// 人数を取得する
	const num = $('#select-num-' + index).val();

	let perPerson = 0;
	
	// 金額、人数が入力されている場合のみ計算する
	if (price && num) {
		// 四捨五入（小数点第一位）
		perPerson = Math.round((parseInt(price, 10) / parseInt(num, 10)) * Math.pow( 10, 1 ) ) / Math.pow( 10, 1 );
	}

	// 1人あたりの金額を設定する
	$('#per-person-' + index).text(perPerson);
}

/**
 * 人数に合わせて精算判定ボタン名を変更する
 * @param {string} index - 行番号を指定する。
 * @param {string} num - 人数を指定する。
 */
function changeCalculateButtonText(index, num) {
	// 初期化
	$('#' + 'btn-calculate-' + index + '-1').text('立替');
	$('#' + 'btn-calculate-' + index + '-1').removeClass('btn-info');
	$('#' + 'btn-calculate-' + index + '-1').removeClass('btn-secondary');
	$('#' + 'btn-calculate-' + index + '-1').addClass('btn-info');

	for (let i = 1; i <= 8; i++) {
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i, 10) + 1)).text('未');
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i, 10) + 1)).removeClass('btn-info');
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i, 10) + 1)).removeClass('btn-secondary');
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i, 10) + 1)).addClass('btn-secondary');
	}

	// ボタン名を変更する
	for (let i = num; i <= 8; i++) {
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i, 10) + 1)).text('済');
	}
}

/**
 * 人数に合わせて精算判定ボタンを非活性にする
 * @param {string} index - 行番号を指定する。
 * @param {string} num - 人数を指定する。
 */
function setDisabledCalculateButton(index, num) {
	// 初期化
	unDisabled('btn-calculate-' + index + '-');

	// 非活性
	for (let i = num; i <= 8; i++) {
		setDisabled('btn-calculate-' + index + '-' + (parseInt(i, 10) + 1));
	}
}

/**
 * 精算金額を計算する
 * @param {string} index - 行番号を指定する。
 */
function calculateTotalAmount() {
	// 金額を取得する
	const price = $('#' + 'input-price-' + index).val();

	// 人数を取得する
	const num = $('#select-num-' + index).val();

	let perPerson = 0;
	
	// 金額、人数が入力されている場合のみ計算する
	if (price && num) {
		// 四捨五入（小数点第一位）
		perPerson = Math.round((parseInt(price, 10) / parseInt(num, 10)) * Math.pow( 10, 1 ) ) / Math.pow( 10, 1 );
	}

	// 1人あたりの金額を設定する
	$('#per-person-' + index).text(perPerson);
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
			total_amount: parseInt(data.amount, 10)
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
 * 地図履歴テーブルを元に集計する
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

		// console.log(json);
		// console.log(treasure_map_total);

		// ローカルストレージに保存する。
		localStorage.setItem('treasure_map_total_table', JSON.stringify(treasure_map_total));
	}

}



