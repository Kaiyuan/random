jQuery(document).ready(function($) {
	var numbox = new Array('#NO1','#NO2','#NO3','#NO4','#NO5','#NO6','#NO7','#NO8');  
	var Resukt = $('#Result');	//结果列表
	var minInput = $('#min');	//最小值 input
	var maxInput = $('#max');	//最大值 input
	var lengthInput = $('#length')	//个数 input
	var mes = $('#Messages');
	var mesTxt = $('#MessagesText');
	var theRes = new Array;
	var chMin = chMax = chNO = 0;	// 这三个变量是缓存

	mes.click(function(event) {
		$(this).fadeOut('fast');
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
			mesBox('最小值请输入数字');
		} else if (isNaN(thisMax)) {
			maxInput.addClass('warn');
			mesBox('最大值请输入数字');
		} else if (isNaN(thisLength)) {
			lengthInput.addClass('warn');
			mesBox('个数请输入数字');
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

			/* 生成随机数组, i>= minNo-1 这里是设定随机数的最小值 */
			for (var i = maxNO - 1; i >= minNO-1; i--) {
				theRes[i]=i+1;
			};
			console.log('生成数组');

			/* 打散数组 http://www.ifrans.cn/javascript-array-random-sort/ */
			theRes.sort(randomSort);
			console.log('打散数组');

			chMin = minNO;
			chMax = maxNO;
			chNO = 0;
		};
		if (lengthNO>1&&maxNO>lengthNO) {
			for (var i = lengthNO - 1; i >= 0; i--) {
				var thisNO = theRes[chNO];
				if (thisNO!=null&&thisNO!='undefined') {
					resAppend(thisNO);
					console.log('输出第 %d 个数 %d',chNO+1,thisNO);
					chNO = chNO+1;
				} else {
					resAppend();
					break;	// 终止循环
				};
			};
		} else {
			if (chNO<theRes.length) {
				var theNo = theRes[chNO];
				resAppend(theNo);
				chNO = chNO+1;
			} else {
				resAppend();
			};
		};
		$('#button').removeClass('pressed').addClass('click');
	}

	function randomSort(a, b){
	    return Math.random()>.5 ? -1:1;	
	}

	function resAppend (thisNO,time) {
		if (thisNO!=null&&thisNO!='undefined') {
			Resukt.append('<li><span>'+thisNO+'</span></li>');
			console.log('输出随机数 %d',thisNO);
		} else {
			mesBox('已经没有不重复的随机数了！',true);
		};
	}

	function mesBox (text,ifh) {
		mes.stop(true);	// 立即结束之前的动画
		mesTxt.html(text);
		if (ifh) {
			mes.fadeIn('fast').delay(2000).fadeOut('fast');
		} else{
			mes.fadeIn('fast');
		};
		
	}

});