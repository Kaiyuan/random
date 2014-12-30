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
	var chMin = chMax = chNO = echoNumLength = 0;
	var Audio = document.getElementById('Audio');
	var AuVol = localStorage.randomVolume;
	// 异步函数
	var jsqueue = function(funcs, scope) {
	    (function next() {
	          if(funcs.length > 0) {
	              funcs.shift().apply(scope || {}, [next].concat(Array.prototype.slice.call(arguments, 0)));
	          }
	    })();
	};

	if (!AuVol) {
		Audio.volume = 0;
		localStorage.randomVolume = AuVol = 'off';
	};
	if (AuVol==='up') {
		Audio.volume = 1;
		$('#AudioBn button').removeClass('volume-off').addClass('volume-up');
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


	$(document).on('click','.volume-up',function(event) {
		localStorage.randomVolume = AuVol = 'off';
		Audio.volume = 0;
		$('#AudioBn button').removeClass('volume-up').addClass('volume-off');
	});	
	$(document).on('click','.volume-off',function(event) {
		localStorage.randomVolume = AuVol  = 'up';
		Audio.volume = 1;
		$('#AudioBn button').removeClass('volume-off').addClass('volume-up');
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

	$(document).on('click','.pressed',function(event) {
		/* 结果输出进行时 */
		mesBox('正在生成数字');
	});
	$(document).on('click','.click',function(event) {
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
			theRes.sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort);
			console.log('打散数组 50 次');

			chMin = minNO;
			chMax = maxNO;
			chNO = 0;
		};
		
		

		if (chNO<theRes.length) {
			if (lengthNO>1) {
				// 输出随机数数量
				echoNumLength = lengthNO;
			};

			// 输出随机数
			showNum();
		} else{
			resAppend();
		};
		
	}

	// 随机顺序
	function randomSort(a, b){
	    return Math.random()>.5 ? -1:1;	
	}

	// 显示数字
	function resAppend (thisNO) {
		if (thisNO!=null&&thisNO!='undefined') {
			Resukt.append('<li class="hide"><span>'+thisNO+'</span></li>');
			console.log('输出随机数 %d',thisNO);
			$('#Result>li:last-child').slideDown('fast', function() {
				$(this).removeClass('hide');
			});
		} else {
			mesBox('不重复的随机数没了',true);
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

	function numVar (thisNum) {
		// 把数字转为字符串数组
		if (thisNum) {
			var retArr = new Array('0','0','0','0','0','0','0','0');
			var thisSrt = thisNum.toString();	// 把数字转为字符串
			var numL = thisSrt.length;	//数字位数
			for (var i = numL - 1; i >= 0; i--) {
				// 数组长度－1再减去 i 得到数字位置
				retArr[7-i] = thisSrt.substr(numL-i-1,1);
			};
		}
		return(retArr);
	}


	$('#test').click(function(event) {
		numVar(567);
	});

	function echoEnd (argument) {
		console.log('输出随机数结束');
		$('#button').removeClass('pressed').addClass('click');
	}


	// 随机数动画1
	function nunS (freq) {
		if (freq>1) {
			for (var i = freq-1; i >= 0; i--) {
				document.getElementById(numbox[i]).innerHTML = Math.ceil(Math.random()*9);
			};
		};
	}
	// 随机数动画2
	function numSs (freq) {
		//  异步显示数字动画
		jsqueue([
		    function(c) { 
		    	nunS(freq)
		        setTimeout(c, 10)
		    },
		    function(c) { 
		    	nunS(freq)
		        setTimeout(c, 10)
		    },
		    function(c) { 
		    	nunS(freq)
		        setTimeout(c, 10)
		    },
		    function(c) { 
		    	nunS(freq)
		        setTimeout(c, 10)
		    },
		    function(c) { 
		    	nunS(freq)
		        setTimeout(c, 10)
		    },
		    function(c) { 
		    	nunS(freq)
		        setTimeout(c, 10)
		    },
		    function(c) { 
		    	nunS(freq)
		        setTimeout(c, 10)
		    },
		    function() {
		    	nunS(freq)
		    }
		], this);
	}
	// 输出随机数字
	function showNum () {
		var showNumAttay = numVar(theRes[chNO]);
		$('#button').removeClass('click').addClass('pressed');
		jsqueue([
		    function(c) { 
		    	// 如果开启声音就播放声音
				if (Audio.paused&&AuVol==='up') {
					Audio.currentTime = 0;
					Audio.play();
					console.log('播放声音');
				};
		    	numSs(8)
		        setTimeout(c, 100)
		    },
		    function(c) { 
		    	numSs(8)
		        setTimeout(c, 100)
		    },
		    function(c) { 
		    	numSs(6)
		    	document.getElementById(numbox[7]).innerHTML = showNumAttay[0];
		        setTimeout(c, 100)
		    },
		    function(c) { 
		    	numSs(5)
		    	document.getElementById(numbox[7]).innerHTML = showNumAttay[0];
		    	document.getElementById(numbox[6]).innerHTML = showNumAttay[1];
		        setTimeout(c, 100)
		    },
		    function(c) { 
		    	numSs(4)
		    	document.getElementById(numbox[7]).innerHTML = showNumAttay[0];
		    	document.getElementById(numbox[6]).innerHTML = showNumAttay[1];
		    	document.getElementById(numbox[5]).innerHTML = showNumAttay[2];
		        setTimeout(c, 100)
		    },
		    function(c) { 
		    	numSs(3)
		    	document.getElementById(numbox[7]).innerHTML = showNumAttay[0];
		    	document.getElementById(numbox[6]).innerHTML = showNumAttay[1];
		    	document.getElementById(numbox[5]).innerHTML = showNumAttay[2];
		    	document.getElementById(numbox[4]).innerHTML = showNumAttay[3];
		        setTimeout(c, 100)
		    },
		    function(c) { 
		    	numSs(2)
		    	document.getElementById(numbox[7]).innerHTML = showNumAttay[0];
		    	document.getElementById(numbox[6]).innerHTML = showNumAttay[1];
		    	document.getElementById(numbox[5]).innerHTML = showNumAttay[2];
		    	document.getElementById(numbox[4]).innerHTML = showNumAttay[3];
		    	document.getElementById(numbox[3]).innerHTML = showNumAttay[4];
		        setTimeout(c, 100)
		    },
		    function(c) { 
		    	numSs(1)
		    	document.getElementById(numbox[7]).innerHTML = showNumAttay[0];
		    	document.getElementById(numbox[6]).innerHTML = showNumAttay[1];
		    	document.getElementById(numbox[5]).innerHTML = showNumAttay[2];
		    	document.getElementById(numbox[4]).innerHTML = showNumAttay[3];
		    	document.getElementById(numbox[3]).innerHTML = showNumAttay[4];
		    	document.getElementById(numbox[2]).innerHTML = showNumAttay[5];
		        setTimeout(c, 100)
		    },
		    function(c) { 
		    	document.getElementById(numbox[7]).innerHTML = showNumAttay[0];
		    	document.getElementById(numbox[6]).innerHTML = showNumAttay[1];
		    	document.getElementById(numbox[5]).innerHTML = showNumAttay[2];
		    	document.getElementById(numbox[4]).innerHTML = showNumAttay[3];
		    	document.getElementById(numbox[3]).innerHTML = showNumAttay[4];
		    	document.getElementById(numbox[2]).innerHTML = showNumAttay[5];
		    	document.getElementById(numbox[1]).innerHTML = showNumAttay[6];
		        setTimeout(c, 100)
		    },
		    function(c) { 
		    	document.getElementById(numbox[7]).innerHTML = showNumAttay[0];
		    	document.getElementById(numbox[6]).innerHTML = showNumAttay[1];
		    	document.getElementById(numbox[5]).innerHTML = showNumAttay[2];
		    	document.getElementById(numbox[4]).innerHTML = showNumAttay[3];
		    	document.getElementById(numbox[3]).innerHTML = showNumAttay[4];
		    	document.getElementById(numbox[2]).innerHTML = showNumAttay[5];
		    	document.getElementById(numbox[1]).innerHTML = showNumAttay[6];
		    	document.getElementById(numbox[0]).innerHTML = showNumAttay[7];
		        setTimeout(c, 100)
		    },
		    function() {
		    	// 之所以要些一堆，是避免低配置设备修改对应数字失败
		    	document.getElementById(numbox[7]).innerHTML = showNumAttay[0];
		    	document.getElementById(numbox[6]).innerHTML = showNumAttay[1];
		    	document.getElementById(numbox[5]).innerHTML = showNumAttay[2];
		    	document.getElementById(numbox[4]).innerHTML = showNumAttay[3];
		    	document.getElementById(numbox[3]).innerHTML = showNumAttay[4];
		    	document.getElementById(numbox[2]).innerHTML = showNumAttay[5];
		    	document.getElementById(numbox[1]).innerHTML = showNumAttay[6];
		    	document.getElementById(numbox[0]).innerHTML = showNumAttay[7];
		    	if (!Audio.paused) {
					Audio.pause();
					console.log('停止声音');
				};
				resAppend(theRes[chNO]);
				chNO = chNO+1;
				echoNumLength = echoNumLength-1;	// 输出个数 -1
				if (chNO<theRes.length) {
					// 如果随机数还有
					if (echoNumLength>0) {
						// 还需要继续输出随机数的话在 0.6 秒后在执行一次输出
						setTimeout(showNum, 600);
					} else {
						// 不需要继续输出则结束
						echoEnd();
					};
				} else{
					mesBox('不重复随机数没有了',true);
					echoEnd();
				};
				
		    }
		], this);
	}

	// 保存记录
	function saveNum (thisNum) {
		// body...
	}



});