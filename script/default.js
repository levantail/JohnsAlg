//  'use strict';
$(function () {
	'use strict';
	var DEBUG = true;

	var machineCount = 2; // start value

	var machineData = [];
	var taskList = [];
	var taskColorList = [];


	initializingContent();

	function initializingContent() {
		initInputBlock();
		initMenuBarBlock();
	}

	function initInputBlock() {
		$('#input-section > article').remove();
		for (var i = 0; i < machineCount; i++) {
			var elem =
				'<article class = "input-content-' + (i + 1) + '">' +
				'<p>#' + (i + 1) + ':</p>' +
				'<input class="machineField" type="text" placeholder="Ender Data..">' +
				'</article>';
			$(elem).appendTo('#input-section');
		}
	}

	function initMenuBarBlock() {
		var elem =
			'<button id = "calc" type="button">Calculate</button>' +
			'<button id = "rand" type="button">Rand</button>' +
			'<input id = "sizer" min = "1"' +
			' max = "10" step = "1" type="number"' +
			' value="' + machineCount + '"></button>';

		$(elem).appendTo('#menu-bar-section');
	}

	function calc() {
		machineData = []; // removing all prev. elements from array

		$('.machineField').each(function () {

			var machElement = $.trim($(this).val());

			if (machElement == "") {
				return;
			}

			machElement = machElement.split(' ');
			machineData.push(machElement);
		})



		logger("<======alg starts======>");

		logger(">---calculating by jonAlg---<");
		jonAlg();
		logger(">---drawing graph---<" + taskList.join(','));
		drawGraph();
		logger("<======alg ends======>");
	}

	function drawIddleBlock(iddleLenght, blockWidth, destin) {
		var elm = '<div class="iddle-block" style="' +
			'width: ' + (iddleLenght * blockWidth) + 'px;' +
			'">' +
			'</div>';
		$(elm).appendTo('.' + destin);
	}

	function drawBlock(blockLenght, blockColor, blockWidth, taskName, destin) {

		var elem = '<div style="' +
			'width: ' + (blockLenght * blockWidth) + 'px;' +
			'background-color:' + blockColor + '"><p>' + 'Z' + (1 + taskName) + '</p>'
		'</div>';

		$(elem).appendTo('.' + destin);

	}

	function drawRowBlock(machineName) {
		var elem = '<div class = "' + machineName + '" div></div>'
		$(elem).appendTo('#seq-lines');
	}

	function drawGraph() {
		prepareWorkSpace();

		taskColorList = [];

		var elm = "";
		var generalLength = 0;
		var firstMLen = 0,
			lastMLen = 0;
		var firstMEndIddle = 0;
		var lastMgeneralLen = 0;

		var blockHeight = 50;
		var blockWidth = 50;

		var startIddle = 0;





		$('#seq-lines').css('height', (machineCount * blockHeight));
		$('#graph').css('height', (machineCount * blockHeight + 15));

		var mixPrevMach = new Array();
		var iddleMach = new Array();

		var machineIddleData = [];
		var machineStartIddle = [];

		for (var i = 0; i < machineCount; i++) {//////////////////////////
			var coef = 0;

			var mixPrevMachTemp = machineData[i].slice();
			var iddleMachTemp = [];

			for (var k = 0; k < machineData[i].length; k++) {
				iddleMachTemp.push(0);
			}

			//creating row-block
			var machineName = 'row-block-' + (i + 1);
			drawRowBlock(machineName);

			// for first block iddle at every new machines (ex. first one)
			if (startIddle != 0) {
				logger("FIREUP");
				drawIddleBlock(startIddle, blockWidth, machineName);
			}
			//
			for (var m = 0; m < machineData[0].length; m++) {//====

				if (taskColorList[m] == undefined) {
					taskColorList.push(getRandomColor());
				}

				logger(machineCount);
				logger(taskColorList);

				if (startIddle == 0) {
					drawBlock(
						machineData[i][m],
						taskColorList[m],
						blockWidth,
						taskList[m],
						machineName);
					continue;
				}

				drawBlock(
					machineData[i][m],
					taskColorList[m],
					blockWidth,
					taskList[m],
					machineName);


				var iddle = 0;

				if (m < machineData[i - 1].length - 1) {
					iddle = parseInt(mixPrevMach[m + 1]) - (parseInt(machineData[i][m]) + coef);
				}

				if (iddle > 0) {
					logger('iddle: ' + iddle);
					drawIddleBlock(iddle, blockWidth, machineName);
					if (m < machineData[i].length - 1) {
						mixPrevMachTemp[m + 1] += iddle;
					}
					iddleMachTemp[m] = iddle;
					coef = 0;
				} else if (iddle < 0) {
					coef = (-1 * iddle);
				} else if (iddle == 0) {
					coef = 0;
				}

			}//====

			mixPrevMach = mixPrevMachTemp.slice();

			machineIddleData.push(iddleMachTemp);
			machineStartIddle.push(startIddle);

			iddleMach = iddleMachTemp.slice();

			startIddle += machineData[i][0];
			logger('iddleMachTemp: ');
			logger(iddleMachTemp);
			logger('startIddle:');
			logger(startIddle);




		}////////////////////////////

		startIddle -= machineData[machineCount - 1][0];

		for (var k = 0; k < machineData[0].length; k++) {
			generalLength += iddleMach[k] + machineData[machineCount - 1][k];
		}
		generalLength += startIddle;

		logger(generalLength);
		// printing ruller
		for (var i = 0; i < generalLength; ++i) {
			elm = '<div style="width: ' + (blockWidth - 1) +
				'px; background-color: #333 "><p>' + (i + 1) + '</p></div>';
			$(elm).appendTo('#counters');
		}

		$('#graph').css('width', generalLength * blockWidth);


		var seqTemp = [];
		var lastMachineIddleTime = startIddle;
		for (var i = 0; i < taskList.length; i++) {
			seqTemp[i] = 'Z' + (1 + taskList[i]);
			lastMachineIddleTime += iddleMach[i];
		}
		logger(taskList);
		logger(seqTemp);

		$('<p>' + seqTemp.join(", ") + '</p>').appendTo('#sequence');
		$('<p>' + generalLength.toString() + '</p>').appendTo('#work-time');
		$('<p>' + lastMachineIddleTime.toString() + '</p>').appendTo('#idle');

		logger("Sequence: " + taskList.join(", "));
		logger("coef: " + coef);

		logger(iddleMach)
		logger('//===========-Table creating-==========\\');

		// TABLE HEADER CREATION
		$('<table></table>').appendTo('#tableResults');

		$('<tr id = "tableHeader">').appendTo('#tableResults > table');
		for (var i = 0, m = 0; i < machineCount * 2 + 1; ++i) {
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
		for (var i = 0; i < taskList.length; ++i) {

			var tdItem = "#tdItem_" + i;
			$('<tr id = "tdItem_' + i + '"></tr>').appendTo('#tableResults > table');

			var elem =
				'<td style = "background-color: ' +
				taskColorList[i] + ';" >' +
				'<p class = "taskTCell">' +
				'Z' + (1 + taskList[i]) +
				'</p>' +
				'</td>';

			$(elem).appendTo(tdItem);
			for (var m = 0; m < machineCount; ++m) {
				var mStop = machineStartIddle[m];
				var mStart = 0;
				

				for (var r = 0; r < i + 1; r++) {
					mStop += machineData[m][r] + machineIddleData[m][r];
				}
				mStop -= machineIddleData[m][i];
				mStart = mStop - machineData[m][i];
				$('<td>' + mStart + '</td>').appendTo(tdItem);
				$('<td>' + mStop + '</td>').appendTo(tdItem);
			}
		}
		//MAIN BODY TABLE CREATION END'S 
	}

	function drawTable() {

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
				startT2 += parseInt(lastM[m]);
			}
			//////////////////////


			//FOR STOP POSITION OF 2ST MACHINE
			var stopT2 = 0;
			stopT2 += generalIdle;
			for (var m = 0; m < i + 1; m++) {
				stopT2 += parseInt(lastM[m]);
			}
			//////////////////////

			var iddle = 0;

			if (i < firstM.length - 1) {
				iddle = parseInt(firstM[i + 1]) - (parseInt(lastM[i]) + coef);
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
		for (var i = 0, r = 0; i < taskList.length; ++i, r++) {

			var iItem = "#iItem_" + i;
			$('<tr id = "iItem_' + i + '">').appendTo('#tableResults > table');

			for (var i = 0; i < 2 + 1; ++i) {
				if (i == 0) {
					var cellColorStyle = ' style = "background-color: ' +
						taskColorList[i] + ';" ';
					$('<i' + cellColorStyle + '>' +
						'<p class = "taskTCell">' + 'Z' + (1 + taskList[i]) + '</p>' +
						'</i>').appendTo(iItem);
					continue;
				}

				if (i % 2) {
					var elem1 = m1Start[r].toString();
					var elem2 = m1Stop[r].toString();
				} else {
					var elem1 = m2Start[r].toString();
					var elem2 = m2Stop[r].toString();
				}
				$('<i>' + elem1 + '</i>').appendTo(iItem);
				$('<i>' + elem2 + '</i>').appendTo(iItem);

			}
			$('</tr>').appendTo('#tableResults > table');
		}
		//MAIN BODY TABLE CREATION END'S


		$('</table>').appendTo('#tableResults');
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
		$('#seq-lines > div').remove();
		$('#counters > div').remove();
		$('#idle > p').remove();
		$('#work-time > p').remove();
		$('#sequence > p').remove();
		//table clearing
		$('#tableResults > table').remove();
	}

	function prepareValuesToAlg(firstM, lastM) {
		var generalLength = machineData[0].length;
		var machineAmount = machineData.length;

		logger(machineAmount);

		for (var i = 0; i < generalLength; i++) {
			firstM[i] = 0;
			lastM[i] = 0;
		}

		for (var i = 0; i < Math.ceil(machineAmount / 2); i++) {
			for (var m = 0; m < generalLength; m++) {
				firstM[m] += parseInt(machineData[i][m]);
			}
		}
		for (var i = Math.ceil(machineAmount / 2); i < machineAmount; i++) {
			for (var m = 0; m < generalLength; m++) {
				lastM[m] += parseInt(machineData[i][m]);
			}
		}

	}

	function jonAlg() {

		var generalLength = machineData[0].length;
		logger(generalLength);

		var firstM = new Array(generalLength);
		var lastM = new Array(generalLength);

		prepareValuesToAlg(firstM, lastM);

		logger("GROUPs TO CALC:");
		logger(firstM);
		logger(lastM);

		var taskListSorted = [];
		var firstMachine = [];
		var lastMachine = [];

		for (var i = 0; i < generalLength; i++) {
			firstMachine[i] = -1;
			lastMachine[i] = -1;

			taskList[i] = i;
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
				// for last Machine
				if (sVal > lastM[j] && lastM[j] != -1) {
					sVal = lastM[j];
					sIndex = j;
				}
			}
			// compare the values
			if (fVal > sVal) {
				for (var r = generalLength - 1; 0 < r + 1; --r) {
					if (lastMachine[r] == -1) {
						firstMachine[r] = firstM[sIndex];
						lastMachine[r] = lastM[sIndex];
						taskListSorted[r] = taskList[sIndex]

						firstM[sIndex] = -1;
						lastM[sIndex] = -1;
						break;
					}
				}
			} else if (fVal < sVal || fVal == sVal) {
				for (var r = 0; r < generalLength; ++r) {
					if (firstMachine[r] == -1) {
						firstMachine[r] = firstM[fIndex];
						lastMachine[r] = lastM[fIndex];
						taskListSorted[r] = taskList[fIndex]

						firstM[fIndex] = -1;
						lastM[fIndex] = -1;
						break;
					}
				}
			}
		}
		taskList = taskListSorted.slice();

		for (var i = 0; i < machineData.length; i++) {
			var newMachine = [];
			var oldMachine = machineData[i].slice();

			for (var m = 0; m < machineData[i].length; m++) {
				newMachine[m] = parseInt(oldMachine[taskList[m]]);
			}
			machineData[i] = newMachine.slice();
			logger("SEQ IS ");
			logger(machineData[i]);
		}

		logger("FirstM  res: " + firstM);
		logger("LastM res: " + lastM);
		logger("Sequence: " + taskList.join(", "));
	}

	// EVENTS DEFITION BLOCK

	$('#info').on('wheel', function (e) {

		if (e.originalEvent.deltaY < 0) {
			var temp = parseInt($('#sizer').val()) - 1;
			if (temp < 11 && temp > 0) {
				$('#sizer').val(temp);
			}
		}
		if (e.originalEvent.deltaY > 0) {
			var temp = parseInt($('#sizer').val()) + 1;
			if (temp < 11 && temp > 0) {
				$('#sizer').val(temp);
			}
		}
		$('#sizer').trigger('input');
	})

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

	$('#sizer').on('input', function () {

		var temp = $.trim($('#sizer').val());

		if (temp > 0 && temp < 11 && temp != '') {

			machineCount = parseInt(temp);
			initInputBlock();
			logger(machineCount);
		} else {
			logger("Machine: out of range.");
		}

	})

	$('#calc').click(function () {
		calc();
	})

	// EVENT DEFITION BLOCK END

	function logger(param) {
		if (DEBUG)
			console.log(param);
	}

});