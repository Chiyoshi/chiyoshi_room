/**
 * ボタン押下時アクション
 */
jQuery(function ($) {
	/**
	 * 予約タブ切り替え時のアクション
	 */
	$(document).on('shown.bs.tab', '#item-reserve-tab', function () {
		// 全行を削除する
		$('#party-management-reserve-table').find('tbody tr').remove();

		// ローカルストレージから予約管理テーブルを取得する。
		let reserve = getPartyManagementReserve();
			
		if (!isEmpty(reserve)) {
			Object.keys(reserve).forEach(function (key) {
				// 要素に追加する
				$('#party-management-reserve-table').append(createPartyManagementReserveHtml(reserve[key]));
			});
		} else {
			// ローカルストレージに存在しない場合は初期データを作成する
			reserve = [{
				no: 0, 
				name: '', 
				remarks: ''
			}];

			// 要素に追加する
			$('#party-management-reserve-table').append(createPartyManagementReserveHtml(reserve[0]));
		}
	});

	/**
	 * 行追加ボタン押下時のアクション
	 */
	$(document).on('click', '#btn-reserve-add', function () {
		// 行番号を取得する
		const index = $('#party-management-reserve-table tbody').children().length;

		// 行追加時の初期データを作成する
		let data = [{
			no: index, 
			name: '', 
			remarks: ''
		}];

		// 要素に追加する
		$('#party-management-reserve-table').append(createPartyManagementReserveHtml(data[0]));
	});

	/**
	 * コピーボタン押下時のアクション
	 */
	$(document).on('click', '#btn-reserve-copy', function () {
		let text = '';

		// ローカルストレージから予約管理テーブルを取得する。
		let reserve = getPartyManagementReserve();

		if (!isEmpty(reserve)) {
			Object.keys(reserve).forEach(function (key) {
				text += (parseInt(key) + 1) + ':' + reserve[key].name + '　'
			});
		}
		
		copy2clipboard(text);
	});

	/**
	 * クリアボタン押下時のアクション
	 */
	$(document).on('click', '#btn-reserve-clear', function () {
		let result = window.confirm('予約管理をクリアしますか？');
		if (result) {
			// ローカルストレージから削除する
			localStorage.removeItem('party_management_reserve_table');
			// reloadメソッドによりページをリロード
			window.location.reload();
		}
	});

	/**
	 * 名前テキスト変更時のアクション
	 */
	$(document).on('change', '#party-management-reserve-table tbody tr td [id^="input-name-"]', function () {
		// ローカルストレージに予約管理テーブルを登録する
		insertPartyManagementReserve();
	});

	/**
	 * 備考テキスト変更時のアクション
	 */
	$(document).on('change', '#party-management-reserve-table tbody tr td [id^="input-remarks-"]', function () {
		// ローカルストレージに予約管理テーブルを登録する
		insertPartyManagementReserve();
	});

	/**
	 * 行入れ替え(↑)ボタン押下時のアクション
	 */
	$(document).on('click', '#party-management-reserve-table tbody tr td [id^="btn-row-up-"]', function () {
		let $row = $(this).closest("tr");
		let $row_prev = $row.prev("tr");
		if($row.prev.length) {
			$row.insertBefore($row_prev);
		}

		// ローカルストレージに保存する。
		insertPartyManagementReserve();
	});

	/**
	 * 行入れ替え(↓)ボタン押下時のアクション
	 */
	$(document).on('click', '#party-management-reserve-table tbody tr td [id^="btn-row-down-"]', function () {
		let $row = $(this).closest("tr");
		let $row_next = $row.next("tr");
		if($row.next.length) {
			$row.insertAfter($row_next);
		}

		// ローカルストレージに保存する。
		insertPartyManagementReserve();
	});

	/**
	 * 削除ボタン押下時のアクション
	 */
	$(document).on('click', '#party-management-reserve-table tbody tr td [id^="btn-row-delete-"]', function () {
		// 行削除
		$(this).closest('tr').remove();

		// ローカルストレージに保存する。
		insertPartyManagementReserve();
	});
});

/**
 * ローカルストレージから予約管理テーブルを取得する
 * @return {string} - json
 */
function getPartyManagementReserve() {
	let json = [];

	if (window.localStorage) {
		// ローカルストレージから値を取得する
		const data = localStorage.getItem('party_management_reserve_table');
		
		if (!isEmpty(data)) {
			json = JSON.parse(data);
		}
	}

	return json;
}

/**
 * ローカルストレージに予約管理テーブルを保存する
 */
function insertPartyManagementReserve() {
	let data = [];

	let tr = $("#party-management-reserve-table tbody tr");

	for (let i = 0; i < tr.length ; i++) {
		let name = tr.eq(i).children('td').eq(1).children('input').val();
		let remarks = tr.eq(i).children('td').eq(2).children('input').val();
		
		let newData = {
			no: i, 
			name: name, 
			remarks: remarks
		};

		data.push(newData);
	}

	// ローカルストレージに保存する。
	localStorage.setItem('party_management_reserve_table', JSON.stringify(data));
}

/**
 * 予約管理テーブルに追加するHTMLを作成する。
 * @param {string} data - テーブル1行のデータを指定する。
 * @return {string} - html
 */
function createPartyManagementReserveHtml(data) {
	// 行番号
	let index = data.no;

	let str = '';
	str += '<tr>'

	// No
	str += '<td class="text-center table-counter" id="no"></td>' // Noはcssでカウントしている

	// 名前
	str += '<td id="name"><input type="text" maxlength="20" class="form-control form-control-sm" id="input-name-' + index +'" value="' + data.name + '"></td>'

	// 備考
	str += '<td id="remarks"><input type="text" maxlength="20" class="form-control form-control-sm" id="input-remarks-' + index +'" value="' + data.remarks + '"></td>'

	// 行操作ボタン
	str += '<td id="rowup">' + '<button type="button" class="btn btn-info btn-sm form-control form-control-sm" id="btn-row-up-' + index +'">↑</button>' + '</td>'
	str += '<td id="rowdown">' + '<button type="button" class="btn btn-info btn-sm form-control form-control-sm" id="btn-row-down-' + index +'">↓</button>' + '</td>'
	str += '<td id="delete">' + '<button type="button" class="btn btn-info btn-sm form-control form-control-sm" id="btn-row-delete-' + index +'">削除</button>' + '</td>'
	str += '</tr>'
	return str;
}
