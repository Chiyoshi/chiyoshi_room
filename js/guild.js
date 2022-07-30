/**
 * 攻城対戦履歴テーブルを生成する
 */
function createGuildVersusHistoryTableHtml(guild_versus_history_list) {

	// 空の場合は何もしない
	if (!guild_versus_history_list) {
		return;
	}

	for (let i = 0; i < guild_versus_history_list.length; i++) {

		let guild_versus_history = guild_versus_history_list[i];

		let eventDate = guild_versus_history['eventDate'];
		let defenseRank = guild_versus_history['defenseRank'];
		let defenseGuildMarkImage = guild_versus_history['defenseGuildMarkImage'];
		let defenseGuildName = guild_versus_history['defenseGuildName'];
		let defensePoint = guild_versus_history['defensePoint'];
		let attackRank = guild_versus_history['attackRank'];
		let attackGuildMarkImage = guild_versus_history['attackGuildMarkImage'];
		let attackGuildName = guild_versus_history['attackGuildName'];
		let attackPoint = guild_versus_history['attackPoint'];

		let tableHtml = '';

		tableHtml += '<tr>';
		tableHtml += '    <td class="text-center">' + eventDate + '</td>';
		tableHtml += '    <td class="text-center">' + defenseRank + '</td>';
		tableHtml += '    <td class="text-center">';

		if (defenseGuildMarkImage) {
			tableHtml += '<img class="guildimage" src="' + defenseGuildMarkImage + '" />';
		} else if (defenseGuildName) {
			tableHtml += '<span class="noimage" title="No Img"></span>';
		}

		tableHtml += '    </td>';
		tableHtml += '    <td class="text-center">' + defenseGuildName + '</td>';
		tableHtml += '    <td class="text-center">' + defensePoint + '</td>';
		tableHtml += '    <td class="text-center">' + attackRank + '</td>';
		tableHtml += '    <td class="text-center">';

		if (attackGuildMarkImage) {
			tableHtml += '<img class="guildimage" src="' + attackGuildMarkImage + '" />';
		} else if (attackGuildName) {
			tableHtml += '<span class="noimage" title="No Img"></span>';
		}

		tableHtml += '    </td>';
		tableHtml += '    <td class="text-center">' + attackGuildName + '</td>';
		
		tableHtml += '    <td class="text-center">'

		if (attackGuildName) {
			tableHtml += attackPoint;
		}

		tableHtml += '    </td>';
		
		tableHtml += '</tr>';

		$('#guild-versus-history-table').append(tableHtml);
	}
}

