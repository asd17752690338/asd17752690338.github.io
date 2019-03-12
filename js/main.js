jQuery(document).ready(function($) {

  //即可通过标签查 也可以通过id查
  var ctx = document.querySelector('#canvas').getContext('2d');

  console.log(screenWidth);
  console.log(screenHeight);
  ctx.canvas.width = screenWidth
  ctx.canvas.height = screenHeight
  //通过ctx容器直接获取标签
  var canvas = ctx.canvas;
  //获取该标签的属性
  var text = canvas.getAttribute('text');
  var fontSize = canvas.getAttribute('size');
  var fontWidth = ctx.measureText(text).width; //得到字体显示的大小
  //动态扩大宽度
  if ((fontWidth * fontSize + text.length * 100) / 10 > canvas.width) {
    canvas.width = Math.floor((fontWidth * fontSize + text.length * 100) / 10);
  }
  ctx.fillStyle = '#ff9840';
  ctx.font = fontSize + 'px monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, (canvas.width - fontSize) / 2, canvas.height / 2);
  //会影响以前的数据
  var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); //清理文字
  var fontPxiel = []; //存放着文字像素
  //把这些粒子使用分散算法
  for (var i = 0; i < screenWidth; i += 4) {
    for (var j = 0; j < screenHeight; j += 4) {
      var k = 4 * (i + j * screenWidth)
      if (imageData.data[k + 3] > 0) {
        var obj = {
          'x': i,
          'y': j,
          'dx':0,
          'dy':0,
          'red': imageData.data[k],
          'green': imageData.data[k + 1],
          'blue': imageData.data[k + 2],
          'alpha': imageData.data[k + 3],
          'randomX': Math.random() * screenWidth,
          'randomY': Math.random() * screenHeight
        }
        fontPxiel.push(obj);
      }
    }
  }

  var oTimer1 = null; //定时器
  var oTimer2 = null; //定时器
  var animation = {
    radius: 4,
    move: 0.5,
    pull: 0.15,
    dampen: 0.95,
    density: 5
  };

  //将里面的文字像素开始
  function showData(n) { //此时是向外开始恢复过来
    oTimer1 = setTimeout(function() {
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      for (var i = 0; i < fontPxiel.length; i++) {
        var temp = fontPxiel[i];
        var x0 = temp.randomX;
        var y0 = temp.randomY;
        var disX = temp.x - temp.randomX;
        var disY = temp.y - temp.randomY;
        var color = 'rgba(' + temp.red + ',' +
          temp.green +
          ',' + temp.blue + ',' + temp.alpha + ')';
        ctx.fillStyle = color;
        // ctx.fillRect(x0 + disX / n, y0 + disY / n, 1, 1);
        ctx.beginPath();
        ctx.arc(x0 + disX / n, y0 + disY / n, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      showData(n - 1);
      if (n === 1) {
        clearTimeout(oTimer1);
        oTimer2=setInterval(flameMove,1);
      }
    }, 1);

  }



  //火焰移动动画
  function flameMove() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    var newFontPxiel = fontPxiel;
    for (var i = 0; i < newFontPxiel.length; i++) {
      var temp = newFontPxiel[i];
      var distance = distanceFromMouse(temp.x, temp.y);
      var shift = 1 / distance * 6;
      var _arr = ['x', 'y'];

      for (var _i = 0; _i < _arr.length; _i++) {
        var ax = _arr[_i];
        temp[ax] += temp['d' + ax];
        temp['d' + ax] += (Math.random() - 0.5) * animation.move;
        temp['d' + ax] -= Math.sign(temp[ax] - temp['d' + ax]) * animation.pull;
        // temp['d' + ax] *= animation.dampen;
        temp['d' + ax] -= Math.sign(temp[ax]) * shift;

      }
      if(temp.x<(screenWidth-800)/2){
        clearInterval(oTimer2);
        showContent();
        config_startFlag = true;
      }
      var color = 'rgba(' + temp.red + ',' +
        temp.green +
        ',' + temp.blue + ',' + temp.alpha + ')';
      ctx.fillStyle = color;
      // ctx.fillRect(x0 + disX / n, y0 + disY / n, 1, 1);
      ctx.beginPath();
      // console.log(temp.x, temp.y);
      ctx.arc(temp.x, temp.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function distanceFromMouse(x, y) {
    return Math.sqrt(Math.pow(Math.pow(x, 2) + y, 2));
  }

  showData(30); //当这个值越大,散列越开,运行的越慢
  // showContent();
   $("#print").click(()=>{
     $(".no-js").printThis({
       debug: false,
       importCSS: true,
       importStyle: true,
       printContainer: true,
      loadCSS: "./css/main.css",
      pageTitle: "",
      removeInline: false,
      removeInlineSelector: "*",
      printDelay: 333,
      header: null,
      footer: null,
      base: false,
      formValues: true,
      canvas: false,
      doctypeString: '...',
      removeScripts: false,
      copyTagClasses: false,
      beforePrintEvent: null,
      beforePrint: null,
      afterPrint: null
     });
   });

    function showContent(){
      $('#preloader').delay(200).fadeOut('slow');
      $('.wrapper').fadeIn(200);
      $('#custumize-style').fadeIn(200);
    }

    /* ---------------------------------------------------------------------- */
    /* ------------------------------- Taps profile ------------------------- */
    /* ---------------------------------------------------------------------- */

    $('.collapse_tabs').click(function() {

        if ($(this).hasClass('collapsed')) {
            $(this).find('i.glyphicon').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        } else {
            $(this).find('i.glyphicon').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
        }

    });

    /* ---------------------------------------------------------------------- */
    /* -------------------------- easyResponsiveTabs ------------------------ */
    /* ---------------------------------------------------------------------- */

    $('#verticalTab').easyResponsiveTabs({
        type: 'vertical',
        width: 'auto',
        fit: true
    });

    $("h2.resp-accordion").click(function() {
        $(this).find(".icon_menu").addClass("icon_menu_active");
        $("h2.resp-accordion").not(this).find(".icon_menu").removeClass("icon_menu_active");

        /*	Scroll To */
        $('html, body').animate({scrollTop: $('h2.resp-accordion').offset().top - 50}, 600);
    });

    $(".resp-tabs-list li").click(function() {
        $(this).find(".icon_menu").addClass("icon_menu_active");
        $(".resp-tabs-list li").not(this).find(".icon_menu").removeClass("icon_menu_active");
    });


    $(".resp-tabs-list li").hover(function() {
        $(this).find(".icon_menu").addClass("icon_menu_hover");
    }, function() {
        $(this).find(".icon_menu").removeClass("icon_menu_hover");
    });

    $("h2.resp-accordion").hover(function() {
        $(this).find(".icon_menu").addClass("icon_menu_hover");
    }, function() {
        $(this).find(".icon_menu").removeClass("icon_menu_hover");
    });

    /* ---------------------------------------------------------------------- */
    /* --------------------------- Scroll tabs ------------------------------ */
    /* ---------------------------------------------------------------------- */

    $(".content_2").mCustomScrollbar({
        theme: "dark-2",
        contentTouchScroll: true,
        advanced: {
            updateOnContentResize: true,
            updateOnBrowserResize: true,
            autoScrollOnFocus: false
        }
    });

    /* ---------------------------------------------------------------------- */
    /* ------------------------- Effect tabs -------------------------------- */
    /* ---------------------------------------------------------------------- */

    var animation_style = 'bounceIn';

    $('.dropdown-select').change(function() {
        animation_style = $('.dropdown-select').val();
    });


    $('ul.resp-tabs-list li[class^=tabs-]').click(function() {

        var tab_name = $(this).attr('data-tab-name');
        if("portfolio" == tab_name){ //图片懒加载
           $("#portfoliolist img").each(function(index, el) {
               if(index<config_imgCount){
                 let img = $(el);
                 img.attr("src",img.attr("data-src"));
                 if (img[0].complete) {
                   console.log('complete');
                 }
                 img[0].onload = function() {
                   console.log('onload');
                 }

               }

           });
        }

        $('.resp-tabs-container').addClass('animated ' + animation_style);
        $('.resp-tabs-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('.resp-tabs-container').removeClass('animated ' + animation_style);
        });

        //点击标签 默认加载3张
        $("#filters li span").click(function(){
          console.log(this);
          let filterName = $(this).attr('data-filter');
          console.log(filterName);
          let filterNames= filterName.split(" ");
          if(filterNames.length > 1 ){
            $("#portfoliolist img").each(function(index, el) {
                if(index < 3){
                    $(el).attr('src', $(el).attr('data-src')); //开始替换
                }
            });
          }else{
            let loadImgName =  "#portfoliolist ." +filterNames[0] +" img";
            $(loadImgName).each(function(index, el) {
                if(index < 3){
                    $(el).attr('src', $(el).attr('data-src')); //开始替换
                }
            });
          }

        });


        $(".content_2").mCustomScrollbar("destroy");
        $(".content_2").mCustomScrollbar({
            theme: "dark-2",
            contentTouchScroll: true,
            advanced: {
                updateOnContentResize: true,
                updateOnBrowserResize: true,
                autoScrollOnFocus: false
            },
            scrollButtons: {
              enable: true
            },
            callbacks:{
              whileScrolling:function(){
                // console.log(this.mcs.draggerTop);
                // alert(this.mcs.draggerTop); 移到100加载一组图片
                //移动100加载一组图片 并且是根据所选的活跃数加载的
                var _that =this;
                $("#filters li span").each(function(index, el) {
                       let ele =$(el) ;
                       if(ele.hasClass('active')){
                          var chooseArr = ele.attr('data-filter').split(" ");
                          let oldStart = config_imgCount;
                          var partial = _that.mcs.draggerTop/100;
                          config_imgCount  = config_imgCount * (partial + 1);
                          if(chooseArr){
                            if(chooseArr.length>1){ //有两个
                              $("#portfoliolist img").each(function(index, el) {
                                   if(oldStart <= index && index < config_imgCount){
                                      $(el).attr('src', $(el).attr('data-src')); //开始替换
                                   }
                              });
                            }else{
                                 var chooseName = chooseArr[0];
                                 var strName = '#portfoliolist .'+chooseName+' img';
                                 $(strName).each(function(index, el) {
                                      if(oldStart <= index && index < config_imgCount){
                                         $(el).attr('src', $(el).attr('data-src')); //开始替换
                                      }
                                 });
                            }
                          }
                       }




                });
              }
             ,alwaysTriggerOffsets: false
    				}
        });

        if (tab_name == "contact")
            initialize();

        return false;
    });

    $("#verticalTab h2.resp-accordion").click(function() {
        initialize();
    });

    /* ---------------------------------------------------------------------- */
    /* ---------------------- redimensionnement ----------------------------- */
    /* ---------------------------------------------------------------------- */

    function redimensionnement() {

        if (window.matchMedia("(max-width: 800px)").matches) {
            $(".content_2").mCustomScrollbar("destroy");
            $(".resp-vtabs .resp-tabs-container").css("height", "100%");
            $(".content_2").css("height", "100%");
        } else {

            $(".resp-vtabs .resp-tabs-container").css("height", "580px");
            $(".content_2").css("height", "580px");
            $(".content_2").mCustomScrollbar("destroy");
            $(".content_2").mCustomScrollbar({
                theme: "dark-2",
                contentTouchScroll: true,
                advanced: {
                    updateOnContentResize: true,
                    updateOnBrowserResize: true,
                    autoScrollOnFocus: false
                }
            });

        }

    }

    // On lie l'événement resize à la fonction
    window.addEventListener('load', redimensionnement, false);
    window.addEventListener('resize', redimensionnement, false);

    $("#verticalTab h2.resp-accordion").click(function() {
        initialize();
    });

    /* ---------------------------------------------------------------------- */
    /* -------------------------- Contact Form ------------------------------ */
    /* ---------------------------------------------------------------------- */

    // Needed variables
    var $contactform = $('#contactform'),
            $success = ' Your message has been sent. Thank you!';

    $contactform.submit(function() {
        $.ajax({
            type: "POST",
            url: "php/contact.php",
            data: $(this).serialize(),
            success: function(msg)
            {
                var msg_error = msg.split(",");
                var output_error = '';

                if (msg_error.indexOf('error-message') != -1) {
                    $("#contact-message").addClass("has-error");
                    $("#contact-message").removeClass("has-success");
                    output_error = 'Please enter your message.';
                } else {
                    $("#contact-message").addClass("has-success");
                    $("#contact-message").removeClass("has-error");
                }

                if (msg_error.indexOf('error-email') != -1) {

                    $("#contact-email").addClass("has-error");
                    $("#contact-email").removeClass("has-success");
                    output_error = 'Please enter valid e-mail.';
                } else {
                    $("#contact-email").addClass("has-success");
                    $("#contact-email").removeClass("has-error");
                }

                if (msg_error.indexOf('error-name') != -1) {
                    $("#contact-name").addClass("has-error");
                    $("#contact-name").removeClass("has-success");
                    output_error = 'Please enter your name.';
                } else {
                    $("#contact-name").addClass("has-success");
                    $("#contact-name").removeClass("has-error");
                }


                if (msg == 'success') {

                    response = '<div class="alert alert-success success-send">' +
                            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                            '<i class="glyphicon glyphicon-ok" style="margin-right: 5px;"></i> ' + $success
                            + '</div>';


                    $(".reset").trigger('click');
                    $("#contact-name").removeClass("has-success");
                    $("#contact-email").removeClass("has-success");
                    $("#contact-message").removeClass("has-success");

                } else {

                    response = '<div class="alert alert-danger error-send">' +
                            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                            '<i class="glyphicon glyphicon-remove" style="margin-right: 5px;"></i> ' + output_error
                            + '</div>';

                }
                // Hide any previous response text
                $(".error-send,.success-send").remove();
                // Show response message
                $contactform.prepend(response);
            }
        });
        return false;
    });

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- Portfolio ------------------------------ */
    /* ---------------------------------------------------------------------- */


    var filterList = {
        init: function() {

            // MixItUp plugin
            // http://mixitup.io
            $('#portfoliolist').mixitup({
                targetSelector: '.portfolio',
                filterSelector: '.filter',
                effects: ['fade'],
                easing: 'snap',
                // call the hover effect
                onMixEnd: filterList.hoverEffect()
            });

        },
        hoverEffect: function() {

            // Simple parallax effect
            $('#portfoliolist .portfolio').hover(
                    function() {
                        $(this).find('.label').stop().animate({bottom: 0}, 200);
                        $(this).find('img').stop().animate({top: -30}, 500);
                    },
                    function() {
                        $(this).find('.label').stop().animate({bottom: -40}, 200);
                        $(this).find('img').stop().animate({top: 0}, 300);
                    }
            );

        }

    };

    // Run the show!
    filterList.init();

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- prettyPhoto ---------------------------- */
    /* ---------------------------------------------------------------------- */

    // $("a[rel^='portfolio']").prettyPhoto({
    //     animation_speed: 'fast', /* fast/slow/normal */
    //     social_tools: '',
    //     theme: 'pp_default',
    //     horizontal_padding: 5,
    //     deeplinking: false,
    // });



    /* ---------------------------------------------------------------------- */
    /* ------------------------------ Google Maps --------------------------- */
    /* ---------------------------------------------------------------------- */

    var map;
    function initialize() {
        map = new GMaps({
            div: '#map',
            lat: -37.817917,
            lng: 144.965065,
            zoom: 16

        });
        map.addMarker({
            lat: -37.81792,
            lng: 144.96506,
            title: 'Marker with InfoWindow',
            icon: 'images/pins-map/map-marker.png',
            infoWindow: {
                content: '<p>Melbourne Victoria, 300, Australia</p>'
            }
        });
    }

    /* ---------------------------------------------------------------------- */
    /* --------------------------------- Blog ------------------------------- */
    /* ---------------------------------------------------------------------- */

    // More blog
    $('a.read_m').click(function() {
        var pagina = $(this).attr('href');
        var postdetail = pagina + '-page';

        if (pagina.indexOf("#post-") != -1) {

            $('#blog-page').hide();

            $(postdetail).show();
            $(".tabs-blog").trigger('click');
        }

        return false;

    });

    // More blog
    $('a.read_more').click(function() {
        var pagina = $(this).attr('href');
        var postdetail = pagina + '-page';

        if (pagina.indexOf("#post-") != -1) {

            $('#blog-page').hide();

            $(postdetail).show();
            $(".tabs-blog").trigger('click');
        }

        return false;

    });

    //pagination All
    $('.content-post a').click(function() {
        var pagina = $(this).attr('href');

        if (pagina == "#blog") {

            $('.content-post').hide();
            $('#blog-page').show();
            $(".tabs-blog").trigger('click');

        }

        return false;

    });

    //pagination blog
    $('.content-post #pagination').click(function() {


        var pagina = $(this).attr('href');
        var postdetail = pagina + '-page';

        if (pagina.indexOf("#post-") != -1) {

            $('#blog-page').hide();
            $('.content-post').hide();

            $(postdetail).show();
            $(".tabs-blog").trigger('click');
        }

        return false;

    });

    /* ---------------------------------------------------------------------- */
    /* ---------------------------- icon menu ------------------------------- */
    /* ---------------------------------------------------------------------- */

    $(".resp-tabs-container h2.resp-accordion").each(function(){

			if($(this).hasClass('resp-tab-active')){
				$(this).append("<i class='glyphicon glyphicon-chevron-up arrow-tabs'></i>");
			}else {
				$(this).append("<i class='glyphicon glyphicon-chevron-down arrow-tabs'></i>");
			}
	  });

	   $(".resp-tabs-container h2.resp-accordion").click(function(){
			if($(this).hasClass('resp-tab-active')){
				$(this).find("i.arrow-tabs").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
			}

			$(".resp-tabs-container h2.resp-accordion").each(function(){

				if(!$(this).hasClass('resp-tab-active')){
					$(this).find("i.arrow-tabs").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
				}
		  });


	  });


    /* ---------------------------------------------------------------------- */
    /* -------------------------------- skillbar ---------------------------- */
    /* ---------------------------------------------------------------------- */

    $('.tabs-resume').click(function() {

        $('.skillbar').each(function() {
            $(this).find('.skillbar-bar').width(0);
        });

        $('.skillbar').each(function() {
            $(this).find('.skillbar-bar').animate({
                width: $(this).attr('data-percent')
            }, 2000);
        });

    });

    $('#resume').prev('h2.resp-accordion').click(function() {

        $('.skillbar').each(function() {
            $(this).find('.skillbar-bar').width(0);
        });

        $('.skillbar').each(function() {
            $(this).find('.skillbar-bar').animate({
                width: $(this).attr('data-percent')
            }, 2000);
        });
    });


	//Change for demo page
    $('input:radio[name=page_builder]').on('change', function() {

		$('input:radio[name=page_builder]').each(function () {

			var $this = $(this);

			if ($(this).prop('checked')) {
				window.location.replace($this.val());
			}
		});

        return false;
    });


   $("#downlowd").click(()=>{
     html2canvas_2();  //下载本页面视图
   });

    function html2canvas_2() {  //下载
      //获取截取区域的高度和宽度
      // var TargetNode = document.querySelector(".no-js")
      var h = $(document).height()
      var w = $(document).width()
      //设置 canvas 画布的宽高 是容器搞度 2倍、为了是图片清晰
      /**1.创建画布
       * 2.设置canvas 大小
       * */
      var canvas = document.createElement("canvas");
      //这是画布整体的大小
      canvas.width = w * 2;
      canvas.height = h * 2;
      //这是绘画范围的大小
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.style.color = "chartreuse"
      //画布缩小，将图片发大两倍
      var context = canvas.getContext("2d")
      context.scale(2, 2)
      // 再说一次 要截取全部，必须要脱离文档流 position: absolute; 否则只能截取到看到的部分。

      html2canvas($(".no-js"), {

        onrendered: function(canvas) {
          // 图片导出为 png 格式
          var type = 'png';
          var imgData = canvas.toDataURL(type);
          var _fixType = function(type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            var r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
          };

          // png 替换 mime type 为了下载
          imgData = imgData.replace(_fixType(type), 'image/octet-stream');
          /**
           * 在本地进行文件保存
           * @param  {String} data     要保存到本地的图片数据
           * @param  {String} filename 文件名
           */
          var saveFile = function(data, filename) {
            //创建一个命名空间。是 a 标签
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
          };
          // 下载后的问题名
          var filename = 'yirenjie_' + (new Date()).getTime() + '.' + type;
          // download
          saveFile(imgData, filename);
        }
      })
    }

});
