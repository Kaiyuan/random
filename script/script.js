jQuery(document).ready(function($) {
	var numbox = new Array('NO1','NO2','NO3','NO4','NO5','NO6','NO7','NO8');  
	var number = $('#Number');
	var Resukt = $('#Result');	//结果列表
	var minInput = $('#min');	//最小值 input
	var maxInput = $('#max');	//最大值 input
	var lengthInput = $('#length')	//个数 input
	var mes = $('#Messages');
	var mesTxt = document.getElementById('MessagesText');
	var historyBn = $('#historyBn');
	var historyBox = $('#HistoryBox');
	var historyClose = $('#HistoryClose');
	var infoBn = $('#infoBn');
	var infoBox = $('#InfoBox');
	var infoClose = $('#InfoClose');
	var donatBox = $('#DonateBox');
	var donatBn = $('#donatebn');
	var donatShow = $('#donatShow');
	var theRes = new Array;
	var chMin = chMax = chNO = numS = 0;
	var Audio = document.getElementById('Audio');
	var chST = 100;
	var showArr = new Array('0','0','0','0','0','0','0','0');
	var showNum;
	var AuVol = localStorage.randomVolume;


	if (!AuVol) {
		localStorage['randomVolume'] = AuVol = '1';
	};
	if (AuVol==='0') {
		Audio.volume = 0;
		$('#AudioBn>i').removeClass('fa-volume-up').addClass('fa-volume-off');
	};
	if (getMin) {
		minInput.val(getMin);
	};
	if (getMax) {
		maxInput.val(getMax);
	};
	if (getLength) {
		lengthInput.val(getLength);
	};
	if (getMin&&getMax&&getLength&&ifGo) {
		random(getMin,getMax,getLength);
	};

	$('#AudioBn').on('click','.fa-volume-up',function(event) {
		localStorage['randomVolume'] = AuVol = '0';
		Audio.volume = 0;
		$('#AudioBn i').removeClass('fa-volume-up').addClass('fa-volume-off');
	});	
	$('#AudioBn').on('click','.fa-volume-off',function(event) {
		localStorage['randomVolume'] = AuVol  = '1';
		Audio.volume = 1;
		$('#AudioBn i').removeClass('fa-volume-off').addClass('fa-volume-up');
	});
	mes.click(function(event) {
		$(this).fadeOut('fast');
	});

	// 记录按钮
	historyBn.click(function(event) {
		historyBox.fadeIn('fast');
	});
	historyClose.click(function(event) {
		historyBox.fadeOut('fast');
	});

	// 说明
	infoBn.click(function(event) {
		infoBox.fadeIn('fast');
	});
	infoClose.click(function(event) {
		infoBox.fadeOut('fast');
	});

	// 咖啡窗口
	donatBn.click(function(event) {
		donatBox.fadeOut('fast');
	});
	donatShow.click(function(event) {
		donatBox.fadeIn('fast');
	});

	// 点击输入框时候全选输入框内容
	$('#form input').click(function(event) {
		$(this).select();
	});

	$('.pressed').click(function(event) {
		/* 结果输出进行时 */
		mesBox('正在生成数字');
	});
	$('.click').click(function(event) {
		mes.fadeOut('fast');
		/* 点击 GO 执行 */
		$('#form input').removeClass('warn');
		$('#button').removeClass('click').addClass('pressed');
		var thisMin = parseInt(minInput.val());
		var thisMax = parseInt(maxInput.val());
		var thisLength = parseInt(lengthInput.val());
		if (isNaN(thisMin)) {
			minInput.addClass('warn');
			mesBox('请输入数字');
		} else if (isNaN(thisMax)) {
			maxInput.addClass('warn');
			mesBox('请输入数字');
		} else if (isNaN(thisLength)) {
			lengthInput.addClass('warn');
			mesBox('请输入数字');
		} else if(thisLength>thisMax) {
			maxInput.addClass('warn');
			lengthInput.addClass('warn');
			mesBox('个数必须小于最大值！');
		} else {
			random(thisMin,thisMax,thisLength);
		};	
	});

	// 生成随机数
	function random (minNO,maxNO,lengthNO) {
		if (!minNO) {
			var minNO = 1;
		};
		if (!maxNO) {
			var maxNO = 10;
		};
		if (!lengthNO) {
			var lengthNO = 1;
		};
		if (minNO!=chMin||maxNO!=chMax) {
			/* 清空原数组 */
			while(theRes.length > 0){ theRes.pop(); }

			/* 生成随机数组*/
			theArr = maxNO - minNO;
			for (var i = theArr; i >= 0; i--) {
				theRes[i] = minNO+i;
			};
			console.log('生成数组');

			/* 打散数组 http://www.ifrans.cn/javascript-array-random-sort/ */
			theRes.sort(randomSort);
			console.log('打散数组');

			chMin = minNO;
			chMax = maxNO;
			chNO = 0;
		};

		// 输出随机数
		if (lengthNO>1&&maxNO>lengthNO) {
			for (var i = lengthNO - 1; i >= 0; i--) {
				var thisNO = theRes[chNO];
				if (thisNO!=null&&thisNO!='undefined') {
					numVar(thisNO);
					console.log('输出第 %d 个数 %d',chNO+1,thisNO);
					chNO = chNO+1;
					console.log('chNO %d',chNO);
				} else {
					resAppend();
					break;	// 终止循环
				};
			};
		} else {
			if (chNO<theRes.length) {
				var theNo = theRes[chNO];
				numVar(theNo);
				chNO = chNO+1;
			} else {
				resAppend();
			};
		};
		$('#button').removeClass('pressed').addClass('click');
	}

	// 随机顺序
	function randomSort(a, b){
	    return Math.random()>.5 ? -1:1;	
	}

	// 显示数字
	function resAppend (thisNO) {
		if (thisNO!=null&&thisNO!='undefined') {
			Resukt.append('<li><span>'+thisNO+'</span></li>');
			console.log('输出随机数 %d',thisNO);
		} else {
			mesBox('没了不重复的随机数',true);
		};
	}

	// 提示窗口
	function mesBox (text,ifh) {
		mes.stop();	// 立即结束之前的动画
		mesTxt.innerHTML	=	text;
		if (ifh) {
			mes.fadeIn('fast').delay(2000).fadeOut('fast');
		} else{
			mes.fadeIn('fast');
		};
		
	}

	function numAni (theLength) {
		if (!theLength) {
			theLength = 8;
		};
		for (var i = theLength - 1; i >= 0; i--) {
			document.getElementById(numbox[i]).innerHTML	=	Math.ceil(Math.random()*9);
		};
	}

	function numVar (thisNum) {
		if (thisNum) {
			showNum = thisNum;
			thisSrt = thisNum.toString();	// 把数字转为字符串
			var numL = thisSrt.length;	//数字位数
			for (var i = numL - 1; i >= 0; i--) {
				// 数组长度－1再减去 i 得到数字位置
				showArr[7-i] = thisSrt.substr(numL-i-1,1);
			};
			numShow();
		}
	}

	function numShow () {
		if (chST>0) {
			if (Audio.paused&&AuVol==='1') {
				Audio.currentTime = 0;
				Audio.play();
			};
			var numA = Math.ceil(chST/10);
			if (8 >= numA >0 ) {
				numAni(numA);
				document.getElementById(numbox[numA-1]).innerHTML = showArr[8-numA];
			} else {
				numAni(8);
			};
			setTimeout(numShow,10);
			chST = chST-1;
		} else {
			if (!Audio.paused) {
				Audio.pause();
			};
			resAppend(showNum);
			showArr = new Array('0','0','0','0','0','0','0','0');
			chST = 100;
		};
	}
	$('#test').click(function(event) {
		numVar(567);
	});
	// setInterval(numAni,10);
});