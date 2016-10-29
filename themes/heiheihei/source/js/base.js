	$(function(){


		$('.hamburger > i').on('click', function(e){
			$('body').toggleClass('bodyBlur');
			$('.hamburger').toggleClass('open');
			$('p').toggleClass('blur');
			$('#insert').toggleClass('blur');
			$('.outer').toggleClass('blur');
			// $('.lightbox').toggleClass("fadeIn");遮罩不用了
			e.stopPropagation();
		});

		$('.home').on('click', function(){
			window.sessionStorage.notes_click = false;
			window.sessionStorage.home_click = true;
			// $.cookie("notes_click", false);
			// $.cookie("home_click", true);
		});

		$(document).on('click', function(){
			// $('#bg').removeClass('blur');背景不用了
			$('body').removeClass('bodyBlur');
			$('.hamburger').removeClass('open');
			$('p').removeClass('blur');
			$('#insert').removeClass('blur');
			$('.outer').removeClass('blur');
			// $('.lightbox').removeClass("fadeIn");遮罩不用了
		});

		$('.home_notes_showon').on('click', function(){

			$('body').removeClass('bodyBlur');
			$('.hamburger').removeClass('open');
			$('p').removeClass('blur');
			$('#insert').removeClass('blur');
			$('.outer').removeClass('blur');
			window.sessionStorage.notes_click = true;
			window.sessionStorage.home_click = false;
			// $.cookie("notes_click", true);
			// $.cookie("home_click", false);
		});




		//判断点击home进入首页index还是点击Notes进入首页index,根据这个来该变主题内容和header上的landmark
		if (window.sessionStorage.notes_click =="true") {
			$('.home_p').addClass('off');
			$('.home_notes_list').addClass('show');
			$('#insert').html('<a href="/">Notes</a>');
			$('#insert').addClass('landmark notes animated fadeInLeft');
			$('#insert').removeClass('home_logo');
			$('body').addClass('bodyNotes');

		}
		if (window.sessionStorage.home_click =="true") {
			$('.home_p').removeClass('off');
			$('.home_notes_list').removeClass('show');
			// $('#insert').addClass('home_logo');
		}

		//逻辑上正确，但实际操作是没必要，因为总是先点击了hamburger中的Notes，将sessionStorage中的
		//两个变量都改过了。
		$('#insert').on('click', function(){
			// window.sessionStorage.notes_click = true;
			// window.sessionStorage.home_click = false;
		});

		//判断动画完成了没有，完成了就把animated class 去掉
		window.onload=function(){
  			window.sessionStorage.remove_hamburger_animate = true;
		}

		if (window.sessionStorage.remove_hamburger_animate == "true") {
			$('.hamburger').removeClass('animated');
		}

		var insert = document.getElementById("insert");
		insert.addEventListener("webkitAnimationEnd", function(){
			window.sessionStorage.remove_landmark_animated = true;
		}, false);

		if (window.sessionStorage.remove_landmark_animated == "true") {
			$('.landmark').removeClass('animated');
		}




	});

