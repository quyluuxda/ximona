(function () {
    var $;
    $ = this.jQuery || window.jQuery;
    win = $(window), body = $('body'), doc = $(document);

    $.fn.hc_accordion = function () {
        var acd = $(this);
        acd.find('ul>li').each(function (index, el) {
            if ($(el).find('ul li').length > 0) $(el).prepend('<button type="button" class="acd-drop"></button>');
        });
        acd.on('click', '.acd-drop', function (e) {
            e.preventDefault();
            var ul = $(this).nextAll("ul");
            if (ul.is(":hidden") === true) {
                ul.parent('li').parent('ul').children('li').children('ul').slideUp(180);
                ul.parent('li').parent('ul').children('li').children('.acd-drop').removeClass("active");
                $(this).addClass("active");
                ul.slideDown(180);
            } else {
                $(this).removeClass("active");
                ul.slideUp(180);
            }
        });
    }

    $.fn.hc_menu = function (options) {
        var settings = $.extend({
            open: '.open-mnav',
        }, options),
            this_ = $(this);
        var m_nav = $('<div class="m-nav"><button class="m-nav-close"><i class="fal fa-times"></i></button><div class="nav-ct"></div></div>');
        var m_nav_over = $('<div class="m-nav-over"></div>');
        body.append(m_nav);
        body.append(m_nav_over);

        m_nav.find('.m-nav-close').click(function (e) {
            e.preventDefault();
            mnav_close();
        });
        m_nav.find('.nav-ct').append($('.logo').clone());
        m_nav.find('.nav-ct').append(this_.children().clone());

        var mnav_open = function () {
            m_nav.addClass('active');
            m_nav_over.addClass('active');
            body.css('overflow', 'hidden');
        }
        var mnav_close = function () {
            m_nav.removeClass('active');
            m_nav_over.removeClass('active');
            body.css('overflow', '');
        }

        doc.on('click', settings.open, function (e) {
            e.preventDefault();
            if (win.width() <= 1199) mnav_open();
        }).on('click', '.m-nav-over', function (e) {
            e.preventDefault();
            mnav_close();
        });

        m_nav.hc_accordion();
    }

    $.fn.hc_countdown = function (options) {
        var settings = $.extend({
            date: new Date().getTime() + 1000 * 60 * 60 * 24,
        }, options),
            this_ = $(this);

        var countDownDate = new Date(settings.date).getTime();

        var count = setInterval(function () {
            var now = new Date().getTime();
            var distance = countDownDate - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            this_.html('<div class="item"><span>' + days + '</span> ngày</div>' +
                '<div class="item"><span>' + hours + '</span> giờ</div>' +
                '<div class="item"><span>' + minutes + '</span> phút </div>' +
                '<div class="item"><span>' + seconds + '</span> giây </div>'
            );
            if (distance < 0) {
                clearInterval(count);
            }
        }, 1000);
    }

    $.fn.hc_upload = function (options) {
        var settings = $.extend({
            multiple: false,
            result: '.hc-upload-pane',
        }, options),
            this_ = $(this);

        var input_name = this_.attr('name');
        this_.removeAttr('name');

        this_.change(function (e) {
            if ($(settings.result).length > 0) {
                var files = event.target.files;
                if (settings.multiple) {
                    for (var i = 0, files_len = files.length; i < files_len; i++) {
                        var path = URL.createObjectURL(files[i]);
                        var name = files[i].name;
                        var size = Math.round(files[i].size / 1024 / 1024 * 100) / 100;
                        var type = files[i].type.slice(files[i].type.indexOf('/') + 1);

                        var img = $('<img src="' + path + '">');
                        var input = $('<input type="hidden" name="' + input_name + '[]"' +
                            '" value="' + path +
                            '" data-name="' + name +
                            '" data-size="' + size +
                            '" data-type="' + type +
                            '" data-path="' + path +
                            '">');
                        var elm = $('<div class="hc-upload"><button type="button" class="hc-del smooth">&times;</button></div>').append(img).append(input);
                        $(settings.result).append(elm);
                    }
                } else {
                    var path = URL.createObjectURL(files[0]);
                    var img = $('<img src="' + path + '">');
                    var elm = $('<div class="hc-upload"><button type="button" class="hc-del smooth">&times;</button></div>').append(img);
                    $(settings.result).html(elm);
                }
            }
        });

        body.on('click', '.hc-upload .hc-del', function (e) {
            e.preventDefault();
            this_.val('');
            $(this).closest('.hc-upload').remove();
        });
    }

}).call(this);


jQuery(function ($) {
    var win = $(window),
        body = $('body'),
        doc = $(document);

    var FU = {
        get_Ytid: function (url) {
            var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
            if (url) var arr = url.match(rx);
            if (arr) return arr[1];
        },
        get_currency: function (str) {
            if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        animate: function (elems) {
            var animEndEv = 'webkitAnimationEnd animationend';
            elems.each(function () {
                var $this = $(this),
                    $animationType = $this.data('animation');
                $this.addClass($animationType).one(animEndEv, function () {
                    $this.removeClass($animationType);
                });
            });
        },
    };

    var UI = {
        mMenu: function () {

        },
        header: function () {
            var elm = $('header'),
                h = elm.innerHeight(),
                offset = 200,
                mOffset = 0;
            var fixed = function () {
                elm.addClass('fixed');
                body.css('margin-top', h);
            }
            var unfixed = function () {
                elm.removeClass('fixed');
                body.css('margin-top', '');
            }
            var Mfixed = function () {
                elm.addClass('m-fixed');
                body.css('margin-top', h);
            }
            var unMfixed = function () {
                elm.removeClass('m-fixed');
                body.css('margin-top', '');
            }
            if (win.width() > 991) {
                win.scrollTop() > offset ? fixed() : unfixed();
            } else {
                win.scrollTop() > mOffset ? Mfixed() : unMfixed();
            }
            win.scroll(function (e) {
                if (win.width() > 991) {
                    win.scrollTop() > offset ? fixed() : unfixed();
                } else {
                    win.scrollTop() > mOffset ? Mfixed() : unMfixed();
                }
            });
        },
        backTop: function () {
            var back_top = $('.back-to-top'),
                offset = 800;

            back_top.click(function () {
                $("html, body").animate({ scrollTop: 0 }, 800);
                return false;
            });

            if (win.scrollTop() > offset) {
                back_top.fadeIn(200);
            }

            win.scroll(function () {
                if (win.scrollTop() > offset) back_top.fadeIn(200);
                else back_top.fadeOut(200);
            });
        },
        slider: function () {
            var slideCount = $('.slideCount');
            var slideBanner = $('.cas-home');
            if (slideBanner.length) {
                slideBanner.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
                    //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
                    var i = (currentSlide ? currentSlide : 0) + 1;
                    $(this).next('.slideCount').html('<b class="slideCountItem fz50">' + '0' + i + '</b>');
                });
                slideBanner.slick({
                    autoplay: true,
                    speed: 1000,
                    autoplaySpeed: 8000,
                    pauseOnHover: false,
                    swipeToSlide: true,
                    fade: true,
                    // nextArrow: '<i class="fa fa-angle-right smooth next"></i>',
                    // prevArrow: '<i class="fa fa-angle-left smooth prev"></i>',
                    arrows: false,
                    dots: false,
                })
                FU.animate($(".cas-home .slick-current [data-animation ^= 'animated']"));
                slideBanner.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                    if (currentSlide != nextSlide) {
                        var aniElm = $(this).find('.slick-slide[data-slick-index="' + nextSlide + '"]').find("[data-animation ^= 'animated']");
                        FU.animate(aniElm);
                    }
                });
            }
            if ($('.cas-partner').length) {
                $('.cas-partner').slick({
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    dots: false,
                    arrows: true,
                    nextArrow: '<div class="smooth next"><div href="" class="view-more-primary fz16"><span><i class="fas fa-long-arrow-alt-right"></i></span></div></div>',
                    prevArrow: '<div class="smooth prev"><div href="" class="view-more-primary fz16"><span><i class="fas fa-long-arrow-alt-left"></i></span></div></div>',
                    autoplay: true,
                    autoplaySpeed: 5000,
                    swipeToSlide: true,
                    infinite: true,
                    speed: 1000,
                    responsive: [
                        {
                            breakpoint: 1599,
                            settings: {
                                slidesToShow: 5,
                            }
                        },
                        {
                            breakpoint: 1199,
                            settings: {
                                slidesToShow: 4,
                            }
                        },
                        {
                            breakpoint: 991,
                            settings: {
                                slidesToShow: 3,
                            }
                        },
                        {
                            breakpoint: 676,
                            settings: {
                                slidesToShow: 2,
                            }
                        }
                    ],
                })
            }
        },
        input_number: function () {
            doc.on('keydown', '.numberic', function (event) {
                if (!(!event.shiftKey &&
                    !(event.keyCode < 48 || event.keyCode > 57) ||
                    !(event.keyCode < 96 || event.keyCode > 105) ||
                    event.keyCode == 46 ||
                    event.keyCode == 8 ||
                    event.keyCode == 190 ||
                    event.keyCode == 9 ||
                    event.keyCode == 116 ||
                    (event.keyCode >= 35 && event.keyCode <= 39)
                )) {
                    event.preventDefault();
                }
            });
            doc.on('click', '.i-number .up', function (e) {
                e.preventDefault();
                var input = $(this).parents('.i-number').children('input');
                var max = Number(input.attr('max')),
                    val = Number(input.val());
                if (!isNaN(val)) {
                    if (!isNaN(max) && input.attr('max').trim() != '') {
                        if (val >= max) {
                            return false;
                        }
                    }
                    input.val(val + 1);
                    input.trigger('change');
                }
            });
            doc.on('click', '.i-number .down', function (e) {
                e.preventDefault();
                var input = $(this).parents('.i-number').children('input');
                var min = Number(input.attr('min')),
                    val = Number(input.val());
                if (!isNaN(val)) {
                    if (!isNaN(min) && input.attr('max').trim() != '') {
                        if (val <= min) {
                            return false;
                        }
                    }
                    input.val(val - 1);
                    input.trigger('change');
                }
            });
        },
        yt_play: function () {
            doc.on('click', '.yt-box .play', function (e) {
                var id = FU.get_Ytid($(this).closest('.yt-box').attr('data-url'));
                $(this).closest('.yt-box iframe').remove();
                $(this).closest('.yt-box').append('<iframe src="https://www.youtube.com/embed/' + id + '?rel=0&amp;autoplay=1&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
            });
        },
        psy: function () {
            var btn = '.psy-btn',
                sec = $('.psy-section'),
                pane = '.psy-pane';
            doc.on('click', btn, function (e) {
                e.preventDefault();
                $(this).closest(pane).find(btn).removeClass('active');
                $(this).addClass('active');
                $("html, body").animate({ scrollTop: $($(this).attr('href')).offset().top - 80 }, 600);
            });

            var section_act = function () {
                sec.each(function (index, el) {
                    if (win.scrollTop() + (win.height() / 2) >= $(el).offset().top) {
                        var id = $(el).attr('id');
                        $(pane).find(btn).removeClass('active');
                        $(pane).find(btn + '[href="#' + id + '"]').addClass('active');
                    }
                });
            }
            section_act();
            win.scroll(function () {
                section_act();
            });
        },
        drop: function () {
            $('.drop').each(function () {
                var this_ = $(this);
                var label = this_.children('.label');
                var ct = this_.children('ul');
                var item = ct.children('li').children('a.drop-item');

                this_.click(function () {
                    ct.slideToggle(150);
                    label.toggleClass('active');
                });

                item.click(function (e) {
                    // e.preventDefault();
                    // label.html($(this).html());
                });

                win.click(function (e) {
                    if (this_.has(e.target).length == 0 && !this_.is(e.target)) {
                        this_.children('ul').slideUp(150);
                        label.removeClass('active');
                    }
                })
            });
        },
        toggle: function () {
            var ani = 100;
            $('[data-show]').each(function (index, el) {
                var ct = $($(el).attr('data-show'));
                $(el).click(function (e) {
                    e.preventDefault();
                    ct.fadeToggle(ani);
                });
            });
            win.click(function (e) {
                $('[data-show]').each(function (index, el) {
                    var ct = $($(el).attr('data-show'));
                    if (ct.has(e.target).length == 0 && !ct.is(e.target) && $(el).has(e.target).length == 0 && !$(el).is(e.target)) {
                        ct.fadeOut(ani);
                    }
                });
            });
        },
        uiCounterup: function () {
            var item = $('.hc-counter'),
                flag = true;
            if (item.length > 0) {
                run(item);
                win.scroll(function () {
                    if (flag == true) {
                        run(item);
                    }
                });

                function run(item) {
                    if (win.scrollTop() + 70 < item.offset().top && item.offset().top + item.innerHeight() < win.scrollTop() + win.height()) {
                        count(item);
                        flag = false;
                    }
                }

                function count(item) {
                    item.each(function () {
                        var this_ = $(this);
                        var num = Number(this_.text().replace(".", ""));
                        var incre = num / 80;

                        function start(counter) {
                            if (counter <= num) {
                                setTimeout(function () {
                                    this_.text(FU.get_currency(Math.ceil(counter)));
                                    counter = counter + incre;
                                    start(counter);
                                }, 20);
                            } else {
                                this_.text(FU.get_currency(num));
                            }
                        }
                        start(0);
                    });
                }
            }
        },
        uiParalax: function () {
            var paralax = function () {
                $('.prl').each(function (index, el) {
                    var num = 20;
                    if ($(el).hasClass('v1')) num = 3;
                    if ($(el).hasClass('v2')) num = 3;
                    if ($(el).hasClass('v3')) num = 3;
                    if ($(el).hasClass('v-ab')) num = 4;
                    if ($(el).hasClass('v-video')) num = 20;
                    if ($(el).hasClass('v-sv1')) num = 20;
                    if ($(el).hasClass('v-sv2')) num = 25;
                    if ($(el).hasClass('v-sv3')) num = 30;
                    var he = $(el).innerHeight(),
                        vtop = $(el).offset().top;
                    win.scroll(function (e) {
                        var top = $(window).scrollTop();
                        $(el).css({
                            'transform': 'translateY(' + (top / num) + 'px)',
                        })
                        if ($(el).hasClass('v-video')) {
                            $(el).css({
                                'transform': 'translate(' + (2 * top - vtop) / 30 + 'px,' + (top - vtop) / num + 'px)',
                            })
                        }
                        if ($(el).hasClass('v-left')) {
                            $(el).css({
                                'transform': 'translate(' + (2 * top - vtop) / 70 + 'px,' + (top - vtop) / num + 'px)',
                            })
                        }
                        if ($(el).hasClass('v-right')) {
                            $(el).css({
                                'transform': 'translate(' + (2 * top - vtop) / 70 * -1 + 'px,' + (top - vtop) / num + 'px)',
                            })
                        }
                    });
                });
            }
            if ($(win).width() > 767) {
                paralax();
            }
        },
        ready: function () {
            //UI.mMenu();
            //UI.header();
            UI.slider();
            // UI.backTop();
            // UI.toggle();
            UI.drop();
            //UI.input_number();
            // UI.uiCounterup();
            //UI.yt_play();
            // UI.psy();
            // UI.uiParalax();
        },
    }


    UI.ready();


    /*custom here*/
    WOW.prototype.addBox = function (element) {
        this.boxes.push(element);
    };

    var wow = new WOW({
        mobile: false
    });
    wow.init();
    /*if ($(window).width() > 1199) {
        $('.wow').on('scrollSpy:exit', function() {
            $(this).css({
                'visibility': 'hidden',
                'animation-name': 'none'
            }).removeClass('animated');
            wow.addBox(this);
        }).scrollSpy();
    }*/

    $('.d-nav').hc_menu({
        open: '.open-mnav',
    })
    /*$('.d-nav').find('ul>li').each(function(index, el) {
        if ($(el).find('ul li').length > 0) $(el).addClass('sub');
    });*/
    $(win).scroll(function () {
        if ($(win).scrollTop() > 0) {
            $('header').addClass('scroll');
        } else {
            $('header').removeClass('scroll');
        }
    });
    if (win.width() < 768) {
        $('.ft-item .title').click(function (event) {
            $(this).next('.link-ft').stop().slideToggle();
            $(this).children('i').toggleClass('fa-angle-down fa-angle-up');
        });
    }

    // set margin
    var wContainer = $('.container').width();
    var wWindow = $(window).width();
    var setMargin = ((wWindow - wContainer) / 2);
    if ($(win).width() > 1199) {
        $('.slideCount').css('right', setMargin);
        win.resize(function (event) {
            var wContainer = $('.container').width();
            var wWindow = $(window).width();
            var setMargin = ((wWindow - wContainer) / 2);
            $('.slideCount').css('right', setMargin);
        })
    }

    if ($(window).width() > 991) {
        if ($('.stick').length > 0) {
            $('.stick').stick_in_parent({
                offset_top: 100,
            });
        }
    }

})
if ($('#map').length) {
    function initMap() {
        var map, markers = [], infowindow;
        var arr = [], item = $('.map-item');

        item.each(function(index, el) {
            var lat = Number($(el).attr('data-map').split(',')[0]);
            var lng = Number($(el).attr('data-map').split(',')[1]);
            var data = {
                lat: lat,
                lng: lng,
                branch: "Toà nhà charmvit",
                infodata: "117 Trần Duy Hưng, Cầu Giấy, Hà Nội",
            }
            arr.push(data);

            $(el).click(function(e) {
                e.preventDefault();
                item.removeClass('act');
                $(this).addClass('act');
                var lat = Number($(this).attr('data-map').split(',')[0]);
                var lng = Number($(this).attr('data-map').split(',')[1]);
                // map.setCenter({lat: lat  ,lng: lng});
                google.maps.event.trigger(markers[index],'click');
            });
        });

        var m = document.getElementById('map');

        if(m){
            map = new google.maps.Map(m, {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl:false,
                streetViewControl: false,
            });
            map.setCenter({lat: arr[0].lat  ,lng: arr[0].lng});

            infowindow = new google.maps.InfoWindow({
                maxWidth: 250,
            });

            function createMarker(latlng,html) {
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    icon: "images/icon.png",
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(html);
                    infowindow.open(map, marker);
                });

                return marker;          
            }

            for (var i = 0; i < arr.length; i++) {
                var latlng = new google.maps.LatLng(arr[i].lat,arr[i].lng);
                var html = '<p class="brand">'+arr[i].branch+'</p><p class="infor">'+arr[i].infodata+'</p>';
                markers[i] = createMarker(latlng,html);
            } 
            google.maps.event.trigger(markers[0], 'click')
        }
    }

    window.addEventListener('load',function(){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAeERZGTMeCEHUw7dIEac2DPzJZUtv_PrU&callback=initMap';
        document.body.appendChild(script);
    });
}