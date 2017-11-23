//  'use strict';
$(function () {
	'use strict';
	var DEBUG = true;

	var machineCount = 10;

	initializingContent();

	function initializingContent() {
		$('#info > div').remove();
		for (var i = 0; i < machineCount; i++) {
			var elem = '<div><p>#' + (i + 1) + ':</p>'
				+ '<input class="machineField" type="text" ' +
				'placeholder="Ender Data.."></div>';
			$(elem).appendTo('#info');
		}
		var elem =
			'<div>' +
			'<button id = "calc" type="button">Calculate</button>' +
			'<button id = "rand" type="button">Rand</button>' +
			/* '<button class = "sizer" min = "1" max = "10" step = "1" type="number"></button>' +
			'<div class="quantity-nav">' +
			'<div class="quantity-button quantity-up">+</div>' +
			'<div class="quantity-button quantity-down">-</div>' +
			'</div>' + */
			'<div class="quantity">' +
			'<input type="number" min="1" max="10" step="1" value="' + machineCount + '" >' +
			'<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>' +
			'</div>' +
			'</div>';

		$(elem).appendTo('#info');
	}

	function calc() {
		var taskList = [];
		var taskColorList = [];

		var firstM = $.trim($('#firstM').val());
		var secondM = $.trim($('#secondM').val());

		if (firstM != "" && secondM != "") {
			logger("alg starts");
			var sp_firstM = firstM.split(" ");
			var sp_secondM = secondM.split(" ");

			if (sp_firstM.length == sp_secondM.length) {
				jonAlg(sp_firstM, sp_secondM, taskList);
				drawGraph(sp_firstM, sp_secondM, taskList, taskColorList);
				drawTable(sp_firstM, sp_secondM, taskList, taskColorList);
			}
		}
	}

	function drawGraph(firstM, secondM, taskList, taskColorList) {
		prepareWorkSpace();

		var generalIdle = 0;
		var cm = 50;
		var elm = "";
		var generalLength = 0;
		var firstMLen = 0, secondMLen = 0;
		var coef = 0;
		var firstMEndIddle = 0;
		var secondMgeneralLen = 0;

		for (var i = 0; i < firstM.length; ++i) {
			firstMLen += parseInt(firstM[i]);
			secondMLen += parseInt(secondM[i]);
		}

		firstMEndIddle += firstMLen;
		secondMgeneralLen += secondMLen;

		firstMLen += parseInt(secondM[secondM.length - 1]);
		secondMLen += parseInt(firstM[0]);

		if (firstMEndIddle < 0) {
			firstMEndIddle = parseInt(secondM[secondM.length - 1]);
		}

		logger("firstMEndIddle: " + firstMEndIddle);

		generalIdle += parseInt(firstM[0]);

		if (secondMLen > firstMLen) {
			generalLength = secondMLen;
		} else {
			generalLength = firstMLen;
		}

		logger("genLen: " + generalLength);

		for (var i = 0; i < generalLength; ++i) {
			elm = '<div style="width: ' + cm +
				'px; background-color: #333 "><p>' + (i + 1) + '</p></div>';
			$(elm).appendTo('#counters');
		}

		$('#graph').css('width', (generalLength * cm));

		//for bot line first iddle
		elm = '<div style="' +
			'width: ' + (firstM[0] * cm) + 'px;' +
			'background-image: repeating-linear-gradient(-45deg,' +
			'transparent,' +
			'transparent 5px,' +
			'#555 5px,' +
			'#555 10px); ">' +
			'</div>';
		$(elm).appendTo('#bot');
		//

		for (var i = 0; i < firstM.length; ++i) {
			//for top line
			taskColorList[i] = getRandomColor();

			elm = '<div style="' +
				'width: ' + (firstM[i] * cm) + 'px;' +
				'background-color:' + taskColorList[i] + '"><p>' + taskList[i] + '</p>'
			'</div>';

			$(elm).appendTo('#top');

			// for bot line
			elm = '<div style="' +
				'width: ' + (secondM[i] * cm) + 'px;' +
				'background-color:' + taskColorList[i] + '"><p>' + taskList[i] + '</p>' +
				'</div>';

			$(elm).appendTo('#bot');

			var iddle = 0;

			if (i < firstM.length - 1) {
				iddle = parseInt(firstM[i + 1]) - (parseInt(secondM[i]) + coef);
			}

			if (iddle > 0) {
				elm = '<div style="' +
					'width: ' + (iddle * cm) + 'px;' +
					'background-image: repeating-linear-gradient(-45deg,' +
					'transparent,' +
					'transparent 5px,' +
					'#555 5px,' +
					'#555 10px); ">' +
					'</div>';

				$(elm).appendTo('#bot');
				coef = 0;
				generalIdle += iddle;
			} else if (iddle < 0) {
				coef = (-1 * iddle);
			} else if (iddle == 0) {
				coef = 0;
			}
			logger("currentIddle: " + iddle);
			logger("currentCoef: " + coef + "\n");
		}
		secondMgeneralLen += generalIdle;
		firstMEndIddle = (secondMgeneralLen - firstMEndIddle);
		if (firstMEndIddle < 0) {
			firstMEndIddle = parseInt(secondM[secondM.length - 1]);
		}

		// For top line: end iddle block for first Machine timeline
		elm = '<div style="' +
			'width: ' + (firstMEndIddle * cm) + 'px;' +
			'background-image: repeating-linear-gradient(-45deg,' +
			'transparent,' +
			'transparent 5px,' +
			'#555 5px,' +
			'#555 10px); ">' +
			'</div>';

		$(elm).appendTo('#top');
		//
		$('<p>' + taskList.join(", ") + '</p>').appendTo('#sequence');
		$('<p>' + generalLength.toString() + '</p>').appendTo('#work-time');
		$('<p>' + generalIdle.toString() + '</p>').appendTo('#idle');

		logger("Sequence: " + taskList.join(", "));
		logger("coef: " + coef);
	}

	function drawTable(firstM, secondM, taskList, taskColorList) {
		cleartable();

		var coef = 0;
		var generalIdle = parseInt(firstM[0]);

		var m1Start = [];
		var m1Stop = [];
		var m2Start = [];
		var m2Stop = [];

		for (var i = 0; i < firstM.length; ++i) {

			// FOR START POSITION OF 1ST MACHINE
			var startT1 = 0;
			for (var m = 0; m < i; m++) {
				startT1 += parseInt(firstM[m]);
			}
			m1Start.push(startT1);
			//////////////////////

			// FOR STOP POSITION OF 1ST MACHINE
			var stoptT1 = 0;
			for (var m = 0; m < i + 1; m++) {
				stoptT1 += parseInt(firstM[m]);
			}
			m1Stop.push(stoptT1);
			//////////////////////

			//FOR START POSITION OF 2ST MACHINE
			var startT2 = 0;
			startT2 += generalIdle;
			for (var m = 0; m < i; m++) {
				startT2 += parseInt(secondM[m]);
			}
			//////////////////////


			//FOR STOP POSITION OF 2ST MACHINE
			var stopT2 = 0;
			stopT2 += generalIdle;
			for (var m = 0; m < i + 1; m++) {
				stopT2 += parseInt(secondM[m]);
			}
			//////////////////////

			var iddle = 0;

			if (i < firstM.length - 1) {
				iddle = parseInt(firstM[i + 1]) - (parseInt(secondM[i]) + coef);
				logger("iddle: " + iddle);
			}

			if (iddle > 0) {
				generalIdle += parseInt(iddle);
				coef = 0;
			} else if (iddle < 0) {
				coef = (-1 * iddle);
			} else if (iddle == 0) {
				coef = 0;
			}

			m2Start.push(startT2);
			m2Stop.push(stopT2);
		}

		logger("m1Start: " + m1Start);
		logger("m1Stop: " + m1Stop);
		logger("m2Start: " + m2Start);
		logger("m2Stop: " + m2Stop);


		$('<table>').appendTo('#tableResults');
		var tableLength = firstM.length;

		// TABLE HEADER CREATION
		$('<tr id = "tableHeader">').appendTo('#tableResults > table');
		for (var i = 0, m = 0; i < 2 * 2 + 1; ++i) {
			if (i == 0) {
				$('<th id = "nullCell"></th>').appendTo('#tableHeader');
				continue;
			}

			if (i % 2) {
				var elem = "M" + (m + 1) + " start";
			} else {
				var elem = "M" + (m + 1) + " stop";
				m++;
			}
			$('<th>' + elem + '</th>').appendTo('#tableHeader');
		}
		$('</tr>').appendTo('#tableResults > table');
		// TABLE HEADER CREATION END'S

		// MAIN BODY TABLE CREATION
		for (var td = 0, r = 0; td < taskList.length; ++td, r++) {

			var tdItem = "#tdItem_" + td;
			$('<tr id = "tdItem_' + td + '">').appendTo('#tableResults > table');

			for (var i = 0; i < 2 + 1; ++i) {
				if (i == 0) {
					var cellColorStyle = ' style = "background-color: ' +
						taskColorList[td] + ';" ';
					$('<td' + cellColorStyle + '>' +
						'<p class = "taskTCell">' + taskList[td] + '</p>' +
						'</td>').appendTo(tdItem);
					continue;
				}

				if (i % 2) {
					var elem1 = m1Start[r].toString();
					var elem2 = m1Stop[r].toString();
				} else {
					var elem1 = m2Start[r].toString();
					var elem2 = m2Stop[r].toString();
				}
				$('<td>' + elem1 + '</td>').appendTo(tdItem);
				$('<td>' + elem2 + '</td>').appendTo(tdItem);

			}
			$('</tr>').appendTo('#tableResults > table');
		}


		$('</table>').appendTo('#tableResults');
	}

	function cleartable() {
		$('#tableResults > table').remove();
	}

	function randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	function prepareWorkSpace() {
		$('#graph').css('visibility', 'visible');
		$('#answers').css('visibility', 'visible');
		// space clear
		$('#top > div').remove();
		$('#bot > div').remove();
		$('#counters > div').remove();
		$('#idle > p').remove();
		$('#work-time > p').remove();
		$('#sequence > p').remove();
		//
	}

	function jonAlg(firstM, secondM, taskList) {
		var generalLength = firstM.length;
		var taskListSorted = [];
		var firstMachine = [];
		var secondMachine = [];


		for (var i = 0; i < generalLength; i++) {
			firstMachine[i] = -1;
			secondMachine[i] = -1;

			taskList[i] = "Z" + (i + 1);
		}

		for (var i = 0; i < generalLength; ++i) {
			var fIndex = -1,
				sIndex = -1,
				fVal = Number.MAX_SAFE_INTEGER,
				sVal = Number.MAX_SAFE_INTEGER;

			for (var j = 0; j < generalLength; ++j) {
				// for first Machine
				if (fVal > firstM[j] && firstM[j] != -1) {
					fVal = firstM[j];
					fIndex = j;
				}
				// for second Machine
				if (sVal > secondM[j] && secondM[j] != -1) {
					sVal = secondM[j];
					sIndex = j;
				}
			}
			// compare the values
			if (fVal > sVal) {
				for (var r = generalLength - 1; 0 < r + 1; --r) {
					if (secondMachine[r] == -1) {
						firstMachine[r] = firstM[sIndex];
						secondMachine[r] = secondM[sIndex];
						taskListSorted[r] = taskList[sIndex]

						firstM[sIndex] = -1;
						secondM[sIndex] = -1;
						break;
					}
				}
			} else if (fVal < sVal || fVal == sVal) {
				for (var r = 0; r < generalLength; ++r) {
					if (firstMachine[r] == -1) {
						firstMachine[r] = firstM[fIndex];
						secondMachine[r] = secondM[fIndex];
						taskListSorted[r] = taskList[fIndex]

						firstM[fIndex] = -1;
						secondM[fIndex] = -1;
						break;
					}
				}
			}
		}

		for (var i = 0; i < generalLength; ++i) {
			firstM[i] = firstMachine[i];
			secondM[i] = secondMachine[i];
			taskList[i] = taskListSorted[i];
		}

		logger("FirstM  res: " + firstM);
		logger("SecondM res: " + secondM);
		logger("Sequence: " + taskList.join(", "));
	}

	// EVENT DEFITION BLOCK
	$('#rand').click(function () {
		var taskCount = randomIntFromInterval(2, 7);

		$('.machineField').each(function () {
			var elem = '';

			for (var i = 0; i < taskCount + 1; i++) {
				elem += randomIntFromInterval(1, 6) + ' ';
			}

			$(this).val(elem);
		})
	})


	$('.quantity > input').on('input', function () {
		var temp = $('.quantity > input').val();
		if (machineCount > 0 && machineCount < 11 && temp != '') {
			machineCount = temp;
			logger(machineCount);

		}

	})

	$('.quantity > input').on('change', function () {
		var temp = $('.quantity > input').val();

		if (machineCount > 0 && machineCount < 11 && temp != '') {
			machineCount = temp;
			logger(machineCount);

		}

	})

	$('#secondM').keydown(function (e) {
		if (e.keyCode === 13) {
			calc();
		}
	})

	$('#btn').click(function () {
		calc();
	})
	// EVENT DEFITION BLOCK END

	function logger(param) {
		if (DEBUG)
			console.log(param);
	}

});






