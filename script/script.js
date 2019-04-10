jQuery(document).ready(function($) {
	var numbox = new Array('NO1','NO2','NO3','NO4','NO5','NO6','NO7','NO8');  
	var number = $('#Number');
	var Resukt = $('#Result');	//结果列表
	var minInput = $('#min');	//最小值 input
	var maxInput = $('#max');	//最大值 input
	var lengthInput = $('#length')	//个数 input
	var mes = $('#Messages');
	var mesTxt = document.getElementById('MessagesText');
	var popBn = $('.popup>.pof>.fa');
	var historyBn = $('#historyBn');
	var historyDel = $('#DelHistory');
	var historyBox = $('#HistoryBox');
	var infoBn = $('#infoBn');
	var infoBox = $('#InfoBox');
	var donatBox = $('#DonateBox');
	var donatShow = $('#donatShow');
	var theRes = new Array;
	var chMin = chMax = chNO = echoNumLength = 0;
	var Audio = document.getElementById('Audio');
	var AuVol = localStorage.randomVolume;
	var goTime;	// 点击 GO 的时间
	// 异步函数
	var jsqueue = function(funcs, scope) {
	    (function next() {
	          if(funcs.length > 0) {
	              funcs.shift().apply(scope || {}, [next].concat(Array.prototype.slice.call(arguments, 0)));
	          }
	    })();
	};

	// 数据操作
	var jsdb = {};

	// 往 localStorage 添加数据
	jsdb.add = function (thisTable,thisKey,thisVal) {
		var locaDB = JSON.parse(localStorage.rollDB);
			if (typeof locaDB==='object'&&locaDB.constructor==Object) {
				if (thisKey) {
					locaDB[thisTable][thisKey] = thisVal;
				} else {
					locaDB[thisTable] = thisVal;
				};
				localStorage.rollDB = JSON.stringify(locaDB);
				return(true);
			} else {
				iniDB();
				if (thisKey) {
					locaDB[thisTable][thisKey] = thisVal;
				} else {
					locaDB[thisTable] = thisVal;
				};
				localStorage.rollDB = JSON.stringify(locaDB);
				return(true);
			};
	}

	// 读取 localStorage 数据
	jsdb.get = function (thisTable,thisKey) {
		var locaDB = JSON.parse(localStorage.rollDB);
		if (locaDB[thisTable][thisKey]) {
			return(locaDB[thisTable][thisKey]);
		} else {
			console.log('%s 中的 %s 没有数据',thisTable,thisKey);
			return(false);
		};

	}

	// 直接在 key 为 history 添加数据
	jsdb.add.history = function (thisVal) {
		var locaDB = JSON.parse(localStorage.rollDB);
		if (locaDB['history'][0]['time'] === goTime) {
			locaDB['history'][0]['number'].push(thisVal);
			console.log('在第一个记录添加数字 %d',thisVal);
		} else {
			var addArray = {'time':goTime,'max':chMax,'min':chMin,'number':[thisVal]};
			locaDB['history'].unshift(addArray);
			console.log('创建一个记录并添加数字 %d',thisVal);
		};
		localStorage.rollDB = JSON.stringify(locaDB);
	}
	jsdb.get.history = function () {
		var locaDB = JSON.parse(localStorage.rollDB);
		return(locaDB['history']);
	}
	// 初始化数据
	function iniDB () {
		console.log('初始化数据');
		localStorage['rollDB'] = JSON.stringify({'history':[{'time':'','max':'','min':'','number':''}]});
	}
	if (!localStorage.rollDB) {
		iniDB();
	};

	if (!AuVol) {
		Audio.volume = 0;
		localStorage.randomVolume = AuVol = 'off';
		console.log('默认关闭音效');
	};
	if (AuVol==='up') {
		Audio.volume = 1;
		$('#AudioBn button').removeClass('volume-off').addClass('volume-up');
		console.log('打开音效');
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
		AnaNO(getMin,getMax,getLength);
	};


	$(document).on('click','.volume-up',function(event) {
		localStorage.randomVolume = AuVol = 'off';
		Audio.volume = 0;
		$('#AudioBn button').removeClass('volume-up').addClass('volume-off');
		console.log('关闭音效');
	});	
	$(document).on('click','.volume-off',function(event) {
		localStorage.randomVolume = AuVol  = 'up';
		Audio.volume = 1;
		$('#AudioBn button').removeClass('volume-off').addClass('volume-up');
		console.log('打开音效');
	});
	mes.click(function(event) {
		$(this).fadeOut('fast');
	});

	// 记录按钮
	historyBn.click(function(event) {
		/*
		*	纪录时存储在浏览器 localStorage 的，
		*	通过 jsdb 对象进行读写。
		*	
		*/
		var historyDB = jsdb.get.history();	// 获取记录的对象
		var historyLi = '';
		for (var i =  0; i < historyDB.length; i++) {
			var numberDB = historyDB[i].number;
			if (numberDB) {
				historyLi += '<li><div>Min:'+historyDB[i].min+', Max:'+historyDB[i].max+',<div class="right">'+historyDB[i].time+'</div></div><div class="number">';
				for (var i2 = 0; i2 < numberDB.length; i2++) {
					historyLi += numberDB[i2];
					if (i2<numberDB.length-1) {
						historyLi += ', ';
					};
				};
				historyLi += '</div></li>';
			};
		};
		if (historyLi) {
			$('#HistoryBox .popup-tool').show();
			document.getElementById('HistoryList').innerHTML = historyLi;
		} else {
			$('#HistoryBox .popup-tool').hide();
			document.getElementById('HistoryList').innerHTML = "<div class=\"center\"><i class=\"fa fa-inbox fz2em\"></i><br>没有记录</div>";
		};
		
		// document.getElementById('HistoryList').innerHTML = typeof historyDB;
		historyBox.fadeIn('fast');
		console.log('显示 HistoryBox 窗口');
	});
	historyDel.click(function(event) {
		jsdb.add('history','',new Array({'time':'','max':'','min':'','number':''}));
		$('#HistoryList>li').fadeOut('fast', function() {
			$('#HistoryBox .popup-tool').slideUp('fast');
			document.getElementById('HistoryList').innerHTML = "<div class=\"center\"><i class=\"fa fa-inbox fz2em\"></i><br>没有记录</div>";
		});
	});

	// 说明
	infoBn.click(function(event) {
		infoBox.fadeIn('fast');
		console.log('显示 InfoBox 窗口');
	});

	// 咖啡窗口
	donatShow.click(function(event) {
		donatBox.fadeIn('fast');
		console.log('显示 Donate 窗口');
	});

	// 点击 X 关闭窗口
	popBn.click(function(event) {
		$(this).parent().parent().fadeOut('fast');
		console.log('隐藏 %s 窗口', $(this).parent().parent().attr('id'));
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
		AnaNO(thisMin,thisMax,thisLength);
	});

	// 判断输入数字是否合适
	function AnaNO (thisMin,thisMax,thisLength) {
		// body...
		if (isNaN(thisMin)) {
			minInput.addClass('warn');
			mesBox('请输入数字');
			echoEnd();
		} else if (thisMin<1) {
			minInput.addClass('warn');
			mesBox('最小值必须大于 1！');
			echoEnd();
		} else if (isNaN(thisMax)) {
			maxInput.addClass('warn');
			mesBox('请输入数字');
			echoEnd();
		} else if (thisMax<2||thisMax<thisMin) {
			maxInput.addClass('warn');
			mesBox('最大值必须大于 2 并且大于最小值');
			echoEnd();
		} else if (thisMax>99999999) {
			maxInput.addClass('warn');
			mesBox('最大值不能超过 99999999');
			echoEnd();
		} else if (isNaN(thisLength)) {
			lengthInput.addClass('warn');
			mesBox('请输入数字');
			echoEnd();
		} else if(thisLength>(thisMax-thisMin) && thisLength>0) {
			lengthInput.addClass('warn');
			mesBox('个数必须小于最大值并且不能多出随机数范围！');
			echoEnd();
		} else if(thisLength<1) {
			lengthInput.addClass('warn');
			mesBox('个数必须大于 1！');
			echoEnd();
		} else {
			GRN(thisMin,thisMax,thisLength);
		};
	}

	// 生成随机数
	function GRN (minNO,maxNO,lengthNO) {
		var thisDate = new Date();
		goTime = thisDate.toLocaleString();
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
			echoEnd();
		};
		
	}

	// 随机顺序
	function randomSort(a, b){
	    return Math.random()>.5 ? -1:1;	
	}

	// 显示数字
	function resAppend (thisNO) {
		if (thisNO!=null&&thisNO!='undefined') {
			Resukt.append('<li class="hide"><span>'+thisNO+'</span><span class="right fz12">'+goTime+'</span></li>');
			jsdb.add.history(thisNO);
			console.log('输出随机数 %d，并添加进记录。',thisNO);
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
		goTime = null;
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