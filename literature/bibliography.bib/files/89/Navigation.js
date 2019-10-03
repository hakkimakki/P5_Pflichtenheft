var winW = $(window).width();


/**
 *JQuery offscreen check
*/
(function ($) {
    $.extend($.expr[':'], {
        'off-top': function (el) {
            return $(el).offset().top < $(window).scrollTop();
        },
        'off-right': function (el) {
            return $(el).offset().left + $(el).outerWidth() - $(window).scrollLeft() > $(window).width();
        },
        'off-bottom': function (el) {
            return $(el).offset().top + $(el).outerHeight() - $(window).scrollTop() > $(window).height();
        },
        'off-left': function (el) {
            return $(el).offset().left < $(window).scrollLeft();
        },
        'off-screen': function (el) {
            return $(el).is(':off-top, :off-right, :off-bottom, :off-left');
        }
    });
})(jQuery);


/**
 * jquery.slimmenu.js
 * http://adnantopal.github.io/slimmenu/
 * Author: @adnantopal
 * Copyright 2013-2015, Adnan Topal (adnan.co)
 * Licensed under the MIT license.
 */

(function ($, window, document, undefined) {
    "use strict";

    var pluginName = 'nordicmainmenu',
        oldWindowWidth = 0,
        defaults = {
            resizeWidth: '1024',
            initiallyVisible: false,
            collapserTitle: 'Main Menu',
            animSpeed: 'medium',
            easingEffect: null,
            indentChildren: false,
            childrenIndenter: '&nbsp;&nbsp;',
            expandIcon: '<span class="icon-chevron-down"></span>',
            collapseIcon: '<span class="icon-chevron-up"></span>'
        };

    function Plugin(element, options) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend(defaults, options);
        this.init();
    }

    Plugin.prototype = {

        init: function () {
            var $window = $(window),
                options = this.options,
                $menu = this.$elem,
                $collapser = '<div class="menu-collapser">' + options.collapserTitle + '<div class="collapse-button"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></div></div>',
                $menuCollapser;
            $menu.before($collapser);
            $menuCollapser = $menu.prev('.menu-collapser');

            /* $menu.on('click', '.sub-toggle', function (e) {
                 e.preventDefault();
                 e.stopPropagation();
 
                 var $parentLi = $(this).closest('li');
 
                 if ($(this).hasClass('expanded')) {
                     $(this).removeClass('expanded').html(options.expandIcon);
                     $parentLi.find('>ul').slideUp(options.animSpeed, options.easingEffect);
                 } else {
                     $(this).addClass('expanded').html(options.collapseIcon);
 
                     $parentLi.find('>ul').slideDown(options.animSpeed, options.easingEffect);
                 }
 
             });*/

            $menuCollapser.on('click', '.collapse-button', function (e) {
                e.preventDefault();
                $menu.slideToggle(options.animSpeed, options.easingEffect);
            });

            this.resizeMenu();
            $window.on('resize', this.resizeMenu.bind(this));
            $window.trigger('resize');
        },

        resizeMenu: function () {
            var self = this,
                $window = $(window),
                windowWidth = $window.width(),
                $options = this.options,
                $menu = $(this.element),
                $menuCollapser = $('body').find('.menu-collapser');

            if (window['innerWidth'] !== undefined) {
                if (window['innerWidth'] > windowWidth) {
                    windowWidth = window['innerWidth'];
                }
            }

            if (windowWidth !== oldWindowWidth) {
                oldWindowWidth = windowWidth;

                $menu.find('li').each(function () {
                    if ($(this).has('ul').length) {
                        if ($(this).addClass('has-submenu').has('.sub-toggle').length) {
                            $(this).children('.sub-toggle').html($options.expandIcon);

                        } else {
                            $(this).addClass('has-submenu').append('<span class="sub-toggle">' + $options.expandIcon + '</span>');
                        }
                    }

                    // $(this).children('ul').hide().end().find('.sub-toggle').removeClass('expanded').html($options.expandIcon);
                });

                if ($options.resizeWidth >= windowWidth) {
                    if ($options.indentChildren) {
                        $menu.find('ul').each(function () {
                            var $depth = $(this).parents('ul').length;
                            if (!$(this).children('li').children('a').has('i').length) {
                                $(this).children('li').children('a').prepend(self.indent($depth, $options));
                            }
                        });
                    }

                    $menu.addClass('collapsed').find('li').has('ul').off('mouseenter mouseleave');
                    $menuCollapser.show();

                    if (!$options.initiallyVisible) {
                        $menu.hide();
                    }
                } else {
                    $menu.find('li').has('ul')
                        .on('toggle', function () {
                            $(this).find('>ul').stop().slideDown($options.animSpeed, $options.easingEffect);
                        });
                    /*.on('click', function () {
                        $(this).find('>ul').stop().slideUp($options.animSpeed, $options.easingEffect);
                    });*/

                    $menu.find('li > a > i').remove();
                    $menu.removeClass('collapsed').show();
                    $menuCollapser.hide();
                }
            }
        },

        indent: function (num, options) {
            var i = 0,
                $indent = '';
            for (; i < num; i++) {
                $indent += options.childrenIndenter;
            }
            return '<i>' + $indent + '</i> ';
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

}(jQuery, window, document));







$(document).ready(function () {




    var nav = $('nav#nordicMainNav');

    $('.nordic-hamburger').unbind('click');

    onResize = function () {







        winW = $(window).width();

        console.log("onResize: ", winW);

        //remove all clicks so that we can add them based on the screen size
        $(document).off('click', '.nordic-hamburger, nav#nordicMainNav li, .back, .sub-toggle, .trigger-sub-toggle, .sub-toggle, .anchorToggle, .trigger-sub-toggle, li.first-item');
        $('.nordic-hamburger, nav#nordicMainNav li, .back, .sub-toggle, .trigger-sub-toggle, .sub-toggle, .anchorToggle, .trigger-sub-toggle, li.first-item').off("click");



        //TODO reset hamburger
        /*$(".nordic-hamburger").removeClass("is-active"); 
        $("#nordicMainNav").removeClass("expandus");
        $(".nordicmainmenu").removeClass("expandables");
        $(".nordicmainmenu").parent().parent('.expanded').parent('li').removeClass('on');
        $(".nordicmainmenu").parent().parent('ul').removeClass('expanded');
        $(".nordicmainmenu").closest(".sub2Items").removeClass('expanded');*/

        if (winW < 1024) {

            var dropdown = $('.nordicmainmenu'),
                menu1 = dropdown.find('.sub2Items'),
                menu2 = dropdown.find('.subRightItem');

            menu1.removeClass('force-menu1-right');
            menu2.removeClass('force-menu-right');


            //var activeStateBurger;

            $(".nordic-hamburger").on("click", function () {

                var dropdown = $('.nordicmainmenu'),
                    menu1 = dropdown.find('.sub2Items'),
                    menu2 = dropdown.find('.subRightItem');

                    menu1.removeClass('force-menu1-right');
                    menu2.removeClass('force-menu-right');


                $(this).toggleClass("is-active"); // moved here from another JS file (mobileMenu init)
                $("body").toggleClass("fixedPosition noscroll");
                $(".navbar").toggleClass("nav-open");

                var toScroll = $('#nordicMainNav .navbar-header').height();


                $("#nordicMainNav").toggleClass("expandus");
                $(".nordicmainmenu").toggleClass("expandables");
                $(".nordicmainmenu").find('.expanded').removeClass('expanded').parent('li').addClass('on');
                $(".expandables").css({ 'top': toScroll + 20 + 'px' });


                var activeStateBurger = $('.nordicmainmenu.expandables').find('.active');
                var activeStateBurgerSpan = $('.nordicmainmenu.expandables').find('.active span');
                activeStateBurger.parent().parent('ul').addClass('expanded');

                activeStateBurger.parent().parent('.expanded').parent('li').addClass('on');

                if (activeStateBurger.parent().parent('ul').hasClass('subRightItem') || activeStateBurger.parent().parent('ul').hasClass('sub3Items')) {
                    activeStateBurger.closest(".sub2Items").addClass('expanded');
                }
            });


            var windowHeight = $(window).height();






            $menu = nav.find('li');
            $(document).on('click', '.back', function () {
                activeStateBurger = $(this).closest('.on').parent('ul');
                $(this).parent().removeClass('expanded');
                $(this).parent().parent('li').removeClass('on');
                $(this).parent().parents('li.first-item').find('.expanded').parent('li').addClass('on');
                //console.log('BackBtn: ' + activeStateBurger.closest('ul').attr('class'))
            });


            $menu.on('click', '.sub-toggle, .trigger-sub-toggle', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $this = $(this);
                var $parentLi = $(this).closest('li');

                var topPos = $(this).parent().offset().top;
                var topElemPos = topPos - $('.navbar-header').outerHeight();
                nav.find('li:not(.first-item)').removeClass('on');





                if ($this.next('ul').hasClass('sub2Items')) {
                    //$parentLi.parent('.expandables').removeClass('expandables');
                    //$this.next('ul.sub2Items').toggleClass('expanded');


                    if ($this.next('ul.sub2Items').hasClass('expanded')) {
                        $this.next('ul.sub2Items').removeClass('expanded');
                    } else {
                        $this.next('ul.sub2Items').addClass('expanded');
                    }

                    $this.parent('li').toggleClass('on');
                    $this.next('ul.sub2Items').css({ 'min-height': '100vh', 'height': windowHeight - $('.navbar-header').outerHeight() })
                }

                if ($this.parent().next('ul').hasClass('sub2RightItems')) {
                    $('ul.sub3RightItems').removeClass('expanded');
                    $this.parent('li').removeClass('on');
                    $this.parent().next('ul.sub2RightItems').removeClass('expanded');
                    $this.parent().next('ul.sub2RightItems').toggleClass('expanded');
                    //$this.parent('li').toggleClass('on');

                    var totalHeight = 0;
                    $("ul.sub2RightItems.expanded li").each(function () {
                        totalHeight += $(this).outerHeight(); // to include margins

                    });


                    $this.parent().next('ul.sub2RightItems').css({ 'overflow': 'hidden', 'min-height': '100vh', 'height': totalHeight + topElemPos + 'px' });

                }


                if ($this.parent().next('ul').hasClass('sub3RightItems')) {
                    $('ul.sub2RightItems').removeClass('expanded');
                    $this.parent().parent().siblings().find('.expanded').removeClass('expanded');
                    $this.parent().next('ul.sub3RightItems').toggleClass('expanded');
                    $this.parent('li').toggleClass('on');

                    totalHeight = 0;
                    $("ul.sub3RightItems.expanded li").each(function () {
                        totalHeight += $(this).outerHeight(); // to include margins

                    });


                    $this.parent().next('ul.sub3RightItems').css({ 'overflow': 'hidden', 'min-height': '100vh', 'height': totalHeight + topElemPos + 'px' })
                    $this.parent().next('ul.sub3RightItems').css({ 'top': '0' });
                    //$this.parent().next('ul.sub3RightItems').css({ 'overflow': 'hidden', 'min-height': windowHeight - $('.navbar-header').outerHeight() })

                }

                if ($this.next('ul').hasClass('sub2RightItems')) {
                    $('ul.sub3RightItems').removeClass('expanded');
                    $this.parent('li').removeClass('on');
                    $this.next('ul.sub2RightItems').removeClass('expanded');
                    $this.next('ul.sub2RightItems').toggleClass('expanded');
                    //$this.parent('li').toggleClass('on');
                    $this.next('ul.sub2RightItems').css({ 'overflow': 'hidden', 'min-height': '100vh', 'height': windowHeight - $('.navbar-header').outerHeight()});
                    $this.next('ul.sub2RightItems').css({ 'top': '0'});

                }


                if ($this.next('ul').hasClass('sub3RightItems')) {
                    $('ul.sub2RightItems').removeClass('expanded');
                    $this.parent().siblings().find('.expanded').removeClass('expanded');
                    $this.next('ul.sub3RightItems').toggleClass('expanded');
                    $this.parent('li').toggleClass('on');
                    $this.next('ul.sub3RightItems').css({ 'overflow': 'hidden', 'min-height': '100vh', 'height': windowHeight - $('.navbar-header').outerHeight() })

                }






                if ($this.parent().parent('li:not(.first-item)').find('ul').hasClass('expanded') || $this.parent('li:not(.first-item)').find('ul').hasClass('expanded')) {
                    $parentLi.addClass('on');
                }

                if ($(e.target).hasClass('first') && !$('li.first-item').hasClass('on')) {
                    nav.find('ul').removeClass('expanded');
                }
                //$(".nordicmainmenu").css({ 'height': '0px' })
                //var setNewHeight = $(".nordicmainmenu").find('.expanded').outerHeight();
                //$(".nordicmainmenu").css({ 'height': setNewHeight + 'px' })
                //function setHeight() {
                //    windowHeight = $(window).innerHeight();
                //    $(".expanded:last").css('min-height', windowHeight);
                //};
                //setHeight();


            });

            var wrap = $(".nordicmainmenu");

            wrap.on("scroll", function (e) {

                var scrolledTop = wrap.scrollTop();

                wrap.find('.on').children('.expanded').children('.back').css({ 'top': scrolledTop + 'px' });

                //wrap.find('.on').children('.expanded').children('.back').addClass("fix-lis");
                //if (this.scrollTop === 0) {
                //    wrap.find('.on').children('.expanded').children('.back').removeClass("fix-lis");
                //} else {
                //    wrap.find('.on').children('.expanded').children('.back').addClass("fix-lis");
                //}
            });



            $(".anchorToggle").on('click', function (e) {
                window.location = $(this).attr("href");
            });




        } else {

            $(".anchorToggle").off('click');
            $(".nordic-hamburger").off("click");


            $menu = nav.find('li');
            $triggersubtoggle = $('.trigger-sub-toggle')

            //$menu.on('click', '.trigger-sub-toggle', function (e) {
            //    var $this = $(this);
            //    $this.children('.sub-toggle').click();
            //    console.log($this.text())
            //});


            $menu.on('click', '.sub-toggle, .anchorToggle, .trigger-sub-toggle', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $this = $(this);
                var $parentLi = $(this).closest('li');

                var topPos = $(this).offset().top - $(window).scrollTop();
                var topElemPos = topPos - $('.nordicmainmenu').outerHeight() - 22;

                var subRightHeight = $('.sub2Items.expanded').outerHeight();

                nav.find('li:not(.first-item)').removeClass('on');

                $('span.chevron').removeClass('top').addClass('bottom');

                $('.nordicmainmenu').find('.sub2Items').removeClass('force-menu1-right');
                $('.nordicmainmenu').find('.subRightItem').removeClass('force-menu-right');
                $this.next('ul.sub2Items').css({ 'min-height': '1px', 'height': 'auto'});


                var searchBox = $('.searchbox');
                
                if (searchBox.hasClass('searchbox-open')) {
                    searchBox.removeClass('searchbox-open')
                }



                // console.log($this);

                if ($this.siblings('ul').hasClass('sub2Items')) {
                    // console.log("DO IT MTF!");
                    $parentLi.siblings().find('ul.sub2Items').removeClass('expanded');
                    // console.log($parentLi.siblings().find('ul.sub2Items'));
                    // console.log($this.siblings('ul.sub2Items'));
                    //$this.siblings('ul.sub2Items').toggleClass('expanded');
                    
                    if ($this.siblings('ul.sub2Items').hasClass('expanded')) {
                        $this.siblings('ul.sub2Items').removeClass('expanded');
                    } else {
                        $this.siblings('ul.sub2Items').addClass('expanded');
                    }


                    // console.log($this.siblings('ul.sub2Items'));
                    $this.parent('li').toggleClass('on');
                    $this.parent('li').siblings().removeClass('on');
                    //$this.parent('li').find('span.chevron').removeClass('bottom').addClass('top');
                }

                if ($this.parent().next('ul').hasClass('sub2RightItems')) {
                    $('ul.sub3RightItems').removeClass('expanded');
                    $parentLi.siblings().find('ul.sub2RightItems').removeClass('expanded');
                    $this.parent().next('ul.sub2RightItems').toggleClass('expanded');
                    //$this.parent('li').toggleClass('on');
                    var docHeight = $(window).height() - topElemPos;
                    var totalHeight = 0;
                    $("ul.sub2RightItems li").each(function () {
                        totalHeight += $(this).height(); // to include margins

                    });
                    if (docHeight < totalHeight) {
                        totalHeight = docHeight;
                        $this.parent().next('ul.sub2RightItems').addClass('scrollOnSmall');
                        $this.parent().next('ul.sub2RightItems').css({ 'min-height': 0 + 'px' });

                    } else {
                        $this.parent().next('ul.sub2RightItems').removeClass('scrollOnSmall');
                        $this.parent().next('ul.sub2RightItems').css({ 'min-height': subRightHeight + 'px' });
                    }

                    $this.parent().next('ul.sub2RightItems').css({ 'top': -topElemPos, 'height': totalHeight + 'px' });

                }


                if ($this.parent().next('ul').hasClass('sub3RightItems')) {
                    $('ul.sub2RightItems').removeClass('expanded');
                    $this.parent().parent().siblings().find('.expanded').removeClass('expanded');
                    $this.parent().next('ul.sub3RightItems').toggleClass('expanded');
                    //$this.parent('li').toggleClass('on');
                    var docHeight2 = $(window).height() - topElemPos;
                    var totalHeight2 = 0;
                    $("ul.sub3RightItems li").each(function () {
                        totalHeight2 += $(this).outerHeight(true); // to include margins
                    });

                    if (docHeight2 < totalHeight2) {
                        console.log("docheight er mindre");
                        totalHeight2 = docHeight2;
                        $this.parent().next('ul.sub3RightItems').addClass('scrollOnSmall');
                        $this.parent().next('ul.sub3RightItems').css({ 'min-height': 0 + 'px' });

                    } else {
                        console.log("docheight er større");
                        $this.parent().next('ul.sub3RightItems').removeClass('scrollOnSmall');
                        $this.parent().next('ul.sub3RightItems').css({ 'min-height': subRightHeight + 'px' });
                    }

                    $this.parent().next('ul.sub3RightItems').css({ 'top': -topElemPos, 'height': totalHeight2 + 'px' });
                }

                if ($this.next('ul').hasClass('sub3RightItems')) {
                    $('ul.sub2RightItems').removeClass('expanded');
                    $this.parent().siblings().find('.expanded').removeClass('expanded');
                    $this.next('ul.sub3RightItems').toggleClass('expanded');
                    $this.next('ul.sub3RightItems').css({ 'top': -topElemPos, 'min-height': subRightHeight + 'px' })
                }

                if ($this.next('ul').hasClass('sub2RightItems')) {
                    $('ul.sub3RightItems').removeClass('expanded');
                    $this.parent().siblings().find('.expanded').removeClass('expanded');
                    $this.next('ul.sub2RightItems').toggleClass('expanded');
                    $this.next('ul.sub2RightItems').css({ 'top': -topElemPos, 'min-height': subRightHeight + 'px' })
                }





                if ($('li.first-item').hasClass('on')) {
                    $('.overlayOnMenuClick').addClass('visible');
                    $('body').addClass('noscroll');
                    $('#nordicMainNav').addClass('opening');
                    $this.parent('li').find('span.chevron').removeClass('bottom').addClass('top');
                } else {
                    $('.overlayOnMenuClick').removeClass('visible');
                    $('body').removeClass('noscroll');
                    $('#nordicMainNav').removeClass('opening');
                    $this.parent('li').find('span.chevron').removeClass('top').addClass('bottom');
                }

                var dropdown = $('.nordicmainmenu'),
                    menu1 = dropdown.find('.sub2Items'),
                    menu2 = dropdown.find('.subRightItem');

                if (menu2.is(':off-right')) {
                    menu1.addClass('force-menu1-right');
                    menu2.addClass('force-menu-right');
                }

                if (menu2.is(':off-left')) {
                    menu1.removeClass('force-menu1-right');
                    menu2.removeClass('force-menu-right');
                }



                $(window).resize(function () {
                    if (menu2.is(':off-right')) {
                        menu1.addClass('force-menu1-right');
                        menu2.addClass('force-menu-right');
                    }
                });


                if ($this.parent().parent('li:not(.first-item)').find('ul').hasClass('expanded') || $this.parent('li:not(.first-item)').find('ul').hasClass('expanded')) {
                    $parentLi.addClass('on');
                }


                if ($(e.target).hasClass('first') && !$('li.first-item').hasClass('on')) {
                    // nav.find('ul').removeClass('expanded');
                }
        $(document).on('click', ':not(.nav-social)', function closeMenu(e) {
                    if ($('.nordicmainmenu').has(e.target).length === 0) {
                        $('.nordicmainmenu ul').removeClass('expanded');
                        $('.nordicmainmenu li').removeClass('on');
                        $('.overlayOnMenuClick').removeClass('visible');
                        $('#nordicMainNav').removeClass('opening');
                        $this.parent('li').find('span.chevron').removeClass('top').addClass('bottom');
                        $('body').removeClass('noscroll');
                    } else {

                        $('.nordicmainmenu').find('.sub2Items').removeClass('force-menu1-right');
                        $('.nordicmainmenu').find('.subRightItem').removeClass('force-menu-right');

                $(document).on('click',':not(.searchbox-icon)', closeMenu);
                        
                    }
                });


                $('.on a').find('.sub-toggle').hover(function () {
                    //$(this).addClass('hover_border');
                    $(this).parent('a').addClass('nor');

                },
                    function () {

                        $(this).parent('a').removeClass('nor');

                    });
            });




            /*
             
              $menu.on('click', '.sub-toggle.first, .anchorToggle', function (e) {
    
            var dropdown = $('.nordicmainmenu'),
                menu1 = dropdown.find('.sub2Items'),
                menu2 = dropdown.find('.subRightItem');
    
            if (menu1.hasClass('expanded') && menu2.hasClass('expanded')) {
                menu2.removeClass('expanded');
            }
            //reset out of viewport
            menu1.removeClass('force-menu1-right');
            menu2.removeClass('force-menu-right');
    
        });
    
             */


                dropdown = $('.nordicmainmenu'),
                menu1 = dropdown.find('.sub2Items'),
                menu2 = dropdown.find('.subRightItem');


            //reset out of viewport
            menu1.removeClass('force-menu1-right');
            menu2.removeClass('force-menu-right');



        }
        if ($(".nordic-hamburger").css('display') == 'none' || $(".nordic-hamburger").css("visibility") == "hidden") {
            $(".nordicmainmenu").css({ 'top': '0px' });
        }

    };



    onResize();
    $(window).resize(onResize);



});