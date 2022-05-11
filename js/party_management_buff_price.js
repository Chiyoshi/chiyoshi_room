/**
 * ボタン押下時アクション
 */
jQuery(function ($) {
	/**
	 * バフ代タブの表示時のアクション
	 */
	$(document).ready(function() {
		// ローカルストレージからバフ代管理テーブルを取得する。
		let buffPrice = getPartyManagementBuffPrice();
			
		if (!isEmpty(buffPrice)) {
			Object.keys(buffPrice).forEach(function (key) {
				// 要素に追加する
				$('#party-management-buff-price-table').append(createPartyManagementBuffPriceHtml(buffPrice[key]));
			});
		} else {
			// ローカルストレージに存在しない場合は初期データを作成する
			buffPrice = [{
				no: 0, 
				price_type: 'buy', 
				price: 0, 
				num: 7, 
				perperson: 0, 
				calculate_text_list: ['立替', '未', '未', '未', '未', '未', '未', '済']
			}];

			// 要素に追加する
			$('#party-management-buff-price-table').append(createPartyManagementBuffPriceHtml(buffPrice[0]));
		}

		// 精算金額を算出する
		calculateTotalAmount();

		// ローカルストレージから略称一覧を取得する
		let shortNameList = getPartyManagementBuffPriceShortNameList();

		if (!isEmpty(shortNameList)) {
			$('#input-short-name-1').val(shortNameList.shotname1);
			$('#input-short-name-2').val(shortNameList.shotname2);
			$('#input-short-name-3').val(shortNameList.shotname3);
			$('#input-short-name-4').val(shortNameList.shotname4);
			$('#input-short-name-5').val(shortNameList.shotname5);
			$('#input-short-name-6').val(shortNameList.shotname6);
			$('#input-short-name-7').val(shortNameList.shotname7);
			$('#input-short-name-8').val(shortNameList.shotname8);
		}
	});

	/**
	 * 行追加ボタン押下時のアクション
	 */
	$(document).on('click', '#btn-buff-price-add', function () {
		// 行番号を取得する
		const index = $('#party-management-buff-price-table tbody').children().length;

		// 行追加時の初期データを作成する
		let data = [{
			no: index, 
			price_type: 'buy', 
			price: 0, 
			num: 7, 
			perperson: 0, 
			calculate_text_list: ['立替', '未', '未', '未', '未', '未', '未', '済']
		}];

		// 要素に追加する
		$('#party-management-buff-price-table').append(createPartyManagementBuffPriceHtml(data[0]));
	});

	/**
	 * コピーボタン押下時のアクション
	 */
	$(document).on('click', '#btn-buff-price-copy', function () {
		let text = '';

		for (let i = 1; i <= 8; i++) {
			let shortname = $('#input-short-name-' + i).val();
			if (shortname) {
				text += shortname + $('#calc-total-amount-' + i).text() + '本　';
			}
		}
		
		copy2clipboard(text);
	});

	/**
	 * クリアボタン押下時のアクション
	 */
	$(document).on('click', '#btn-buff-price-clear', function () {
		let result = window.confirm('バフ代管理をクリアしますか？');
		if (result) {
			// ローカルストレージから削除する
			//localStorage.removeItem('party_management_buff_price_short_name_list');
			localStorage.removeItem('party_management_buff_price_table');
			// reloadメソッドによりページをリロード
			window.location.reload();
		}
	});

	/**
	 * 略称テキスト変更時のアクション
	 */
	$(document).on('change', '#party-management-buff-price-table thead tr th [id^="input-short-name-"]', function () {
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
	 * 売買セレクト変更時のアクション
	 */
	$(document).on('change', '#party-management-buff-price-table tbody tr td [id^="select-price-type-"]', function () {
		// ローカルストレージにバフ代管理テーブルを登録する
		insertPartyManagementBuffPrice();
		// 精算金額を算出する
		calculateTotalAmount();
	});

	/**
	 * 金額テキスト変更時のアクション
	 */
	$(document).on('change', '#party-management-buff-price-table tbody tr td [id^="input-price-"]', function () {
		// 行番号を取得する
		const index = $(this).closest('tr').index();
		// 1人あたりの金額を算出する
		calculatePerPerson(index);

		// ローカルストレージにバフ代管理テーブルを登録する
		insertPartyManagementBuffPrice();
		// 精算金額を算出する
		calculateTotalAmount();
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

		// ローカルストレージにバフ代管理テーブルを登録する
		insertPartyManagementBuffPrice();
		// 精算金額を算出する
		calculateTotalAmount();
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
		$(this).addClass(btnColor);

		// ローカルストレージにバフ代管理テーブルを登録する
		insertPartyManagementBuffPrice();
		// 精算金額を算出する
		calculateTotalAmount();
	});
});

/**
 * ローカルストレージからバフ代管理の略称一覧を取得する
 * @return {string} - json
 */
function getPartyManagementBuffPriceShortNameList() {
	let json = [];

	if (window.localStorage) {
		// ローカルストレージから値を取得する
		const data = localStorage.getItem('party_management_buff_price_short_name_list');
		
		if (!isEmpty(data)) {
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
		
		if (!isEmpty(data)) {
			json = JSON.parse(data);
		}
	}

	return json;
}

/**
 * ローカルストレージにバフ代管理の略称一覧を保存する
 * @param {string} data - 略称一覧のJSONデータを指定する。
 */
function insertPartyManagementBuffPriceShortNameList(data) {
	// ローカルストレージに保存する。
	localStorage.setItem('party_management_buff_price_short_name_list', JSON.stringify(data));
}

/**
 * ローカルストレージにバフ代管理テーブルを保存する
 */
function insertPartyManagementBuffPrice() {
	let data = [];

	let tr = $("#party-management-buff-price-table tbody tr");

	for (let i = 0; i < tr.length ; i++) {

		let priceType = tr.eq(i).find('#select-price-type-' + i).val();
		let price = tr.eq(i).find('#input-price-' + i).val();
		let num = tr.eq(i).find('#select-num-' + i).val();
		let perPerson = tr.eq(i).children('td').eq(4).text();
		
		let calculate1 = tr.eq(i).children('td').eq(5).text();
		let calculate2 = tr.eq(i).children('td').eq(6).text();
		let calculate3 = tr.eq(i).children('td').eq(7).text();
		let calculate4 = tr.eq(i).children('td').eq(8).text();
		let calculate5 = tr.eq(i).children('td').eq(9).text();
		let calculate6 = tr.eq(i).children('td').eq(10).text();
		let calculate7 = tr.eq(i).children('td').eq(11).text();
		let calculate8 = tr.eq(i).children('td').eq(12).text();
		
		let newData = {
			no: i, 
			price_type: priceType, 
			price: parseInt(price), 
			num: parseInt(num), 
			perperson: parseFloat(perPerson), 
			calculate_text_list: [
				calculate1, 
				calculate2,
				calculate3,
				calculate4,
				calculate5,
				calculate6,
				calculate7,
				calculate8
			]
		};

		data.push(newData);
	}

	// ローカルストレージに保存する。
	localStorage.setItem('party_management_buff_price_table', JSON.stringify(data));
}

/**
 * バフ代管理テーブルに追加するHTMLを作成する。
 * @param {string} data - テーブル1行のデータを指定する。
 * @return {string} - html
 */
function createPartyManagementBuffPriceHtml(data) {
	// 行番号
	let index = data.no;

	let str = '';
	str += '<tr>'

	// No
	str += '<td class="text-center" id="no"></td>' // Noはcssでカウントしている

	// 売買
	str += '<td class="text-center" id="price-type">'
	str += '<div class="form-group">'
	str += '    <select id="select-price-type-' + index + '" class="form-control-sm">'
	str += '        <option value="buy" ' + ('buy' == data.price_type ? 'selected' : '') + '>買い</option>'
	str += '        <option value="sell" ' + ('sell' == data.price_type ? 'selected' : '') + '>売り</option>'
	str += '    </select>'
	str += '</div>'
	str += '</td>'

	// 金額
	str += '<td class="text-center" id="price"><input type="number" class="form-control form-control-sm" id="input-price-' + index +'" value="' + data.price + '"></td>'

	// 人数
	str += '<td class="text-center" id="num">'
	str += '<div class="form-group">'
	str += '    <select id="select-num-' + index + '" class="form-control-sm">'

	for (let i = 1; i <= 8; i++) {
		str += '        <option value="' + i + '" ' + (data.num == i ? 'selected' : '') + '>' + i + '</option>'
	}

	str += '    </select>'
	str += '</div>'
	str += '</td>'

	// 1人あたり
	str += '<td class="text-center" id="per-person-' + index + '">' + data.perperson + '</td>'

	// 精算判定ボタン
	for (let i = 0; i < data.calculate_text_list.length; i++) {
		let btnText = data.calculate_text_list[i];
		let btnColor = '';
		let disabled = '';
	
		switch(btnText) {
			case '立替':
				btnColor = 'btn-info';
				break;
			case '未':
				btnColor = 'btn-secondary';
				break;
			case '済':
				if (data.num > i) {
					btnColor = '';
				} else {
					btnColor = 'btn-secondary';
					disabled = 'disabled';
				}
				break;
		}
	
		str += '<td class="text-center" id="calculate-' + (i + 1) + '">'
		str += '<button type="button" class="btn ' + btnColor + ' btn-sm form-control form-control-sm" id="btn-calculate-' + index + '-' + (i + 1) + '" ' + disabled + '>' + btnText + '</button>'
		str += '</td>'
	}

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
		perPerson = Math.round((parseInt(price) / parseInt(num)) * Math.pow( 10, 1 ) ) / Math.pow( 10, 1 );
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
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i) + 1)).text('未');
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i) + 1)).removeClass('btn-info');
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i) + 1)).removeClass('btn-secondary');
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i) + 1)).addClass('btn-secondary');
	}

	// ボタン名を変更する
	for (let i = num; i <= 8; i++) {
		$('#' + 'btn-calculate-' + index + '-' + (parseInt(i) + 1)).text('済');
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
		setDisabled('btn-calculate-' + index + '-' + (parseInt(i) + 1));
	}
}

/**
 * 精算金額を計算する
 */
function calculateTotalAmount() {
	
	let result = [0, 0, 0, 0, 0, 0, 0, 0];

	// ローカルストレージからバフ代管理テーブルを取得する。
	let buffPrice = getPartyManagementBuffPrice();
		
	if (!isEmpty(buffPrice)) {
		Object.keys(buffPrice).forEach(function (key) {
			
			for (let i = 0; i < buffPrice[key].calculate_text_list.length; i++) {
				switch(buffPrice[key].calculate_text_list[i]) {
					case '立替':
						if ('sell' == buffPrice[key].price_type) {
							result[i] = ((result[i] * 10) - ( buffPrice[key].perperson * 10)) / 10;
						}
						break;
					case '未':
						if ('buy' == buffPrice[key].price_type) {
							result[i] = ((result[i] * 10) + ( buffPrice[key].perperson * 10)) / 10;
						} else if ('sell' == buffPrice[key].price_type) {
							result[i] = ((result[i] * 10) - ( buffPrice[key].perperson * 10)) / 10;
						}
						break;
					case '済':
						break;
				}
			}
		});
	}

	// 画面表示
	for (let i = 0; i < result.length; i++) {
		$('#calc-total-amount-' + (i + 1)).text(result[i]);
	}
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
