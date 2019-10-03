

(function($) {

	var scrollTopTracker = 0;
	var scrollTopStickyNavTracker = 0;
	var mapSettings = {};


	$(document).ready(function() {

		$.wptheme.initHeader();
		$.wptheme.initMobileMenu();
		$.wptheme.initUserMenu();
		$.wptheme.initTables();
		$.wptheme.initBreadcrumbs();
		$.wptheme.initGalleries();
		$.wptheme.initSliders();
		$.wptheme.initVideoContainers();
		$.wptheme.initModals();
		$.wptheme.initMaps();
		$.wptheme.initCalendars();
		$.wptheme.initIndexFilters();
		$.wptheme.initPricingTables();

		$('.card-grid').cardGrid({});

		var fileDownloadUrl = getQueryStringValue('filedownloadurl');
		if(fileDownloadUrl) {
			window.location.href = fileDownloadUrl;
		}

		$('section.page-section.toc').on('click', 'a', function(e) {
			var href = $(this).attr('href');
			if(href.match(/^#/)) {
				var targetEl = $(href);
				if(targetEl.length && !targetEl.hasClass('modal')) {
					e.preventDefault();
					$.wptheme.smoothScrollToElement(targetEl, 1000, -($('body').offset().top) - 54 - 15);
					if(history.replaceState != null) {
						history.replaceState('', document.title, href);
					}
				}
			}
		});

	});


	$(window).load(function() {

		

	});


	$.wptheme = (function(wptheme) {


		wptheme.initHeader = function() {

			$('#header .search-container.dropdown').on('show.bs.dropdown', function(e) {
				setTimeout(function() { $('#header .search-container.dropdown input[type=search]').select(); }, 0);
			});

			// $('#header-primary-navigation li.menu-item').hoverIntent({
			// 	timeout: 200,
			// 	over: function(e) {
			// 		var menuItem = $(this);
			// 		menuItem.addClass('hover');
			// 	},
			// 	out: function(e) {
			// 		var menuItem = $(this);
			// 		menuItem.removeClass('hover');
			// 		$('.thumbnail-container .thumbnail.active', menuItem).removeClass('active');
			// 	}
			// });
			
			$('#header-primary-navigation').on('click', 'li.menu-item > a', function(e) {
				var menuItem = $(this).parent();
				var subMenu = $('> .sub-menu-container', menuItem);
				if(subMenu.length && !menuItem.hasClass('active')) {
					e.preventDefault();

					// if(menuItem.parent().hasClass('menu')) {
					// 	var initialHeight = 0;
					// 	menuItem.siblings('.active').each(function(i, el) {
					// 		initialHeight = Math.max(initialHeight, $('> .sub-menu-container > .inner', el).height());
					// 	});
					// 	$('> .inner', subMenu).stop().css({ height: 'auto' });
					// 	var finalHeight = $('> .inner', subMenu).height();
					// 	$('> .inner', subMenu).height(initialHeight);
					// 	$('> .inner', subMenu).animate({ height: finalHeight }, 500, 'easeOutExpo', function() { $(this).css({ height: 'auto' }) });
					// }

					menuItem.siblings('.active').each(function(i, el) {
						$(el).removeClass('active');
						$('li.menu-item.active', el).removeClass('active');
						$('.sub-menus-container .sub-menu-container.active', el).not('.level-1').removeClass('active');
					});

					if(menuItem.closest('.sub-menus-container').length) {
						var clonedSubMenu = menuItem.closest('.sub-menus-container').find('> .sub-menu-container-' + subMenu.data('sub-menu-container-id'));
						if(!clonedSubMenu.length) {
							clonedSubMenu = subMenu.clone();
							menuItem.closest('.sub-menus-container').append(clonedSubMenu);
						}
						clonedSubMenu.siblings().filter(function(i, el) { return parseInt($(el).data('level')) >= parseInt(subMenu.data('level')); }).each(function(i, el) {
							$(el).removeClass('active');
						});
						setTimeout(function() { clonedSubMenu.addClass('active'); }, 0);
					}

					menuItem.addClass('active');
					$('body').addClass('header-primary-navigation-dropdown-active');
				}
				$('#header-primary-navigation').trigger('refresh');
			});

			$(document).on('click', function(e) {
				if($(e.target).closest('#header-primary-navigation').length && $(e.target).closest('li.menu-item').length) return;
				// $('#header-primary-navigation ul.menu > li.menu-item.active > .sub-menu-container > .inner').animate({ height: 0 }, 500, 'easeOutExpo');
				$('#header-primary-navigation li.menu-item.active').removeClass('active');
				$('#header-primary-navigation .sub-menus-container .sub-menu-container.active').not('.level-1').removeClass('active');
				$('body').removeClass('header-primary-navigation-dropdown-active');
			});

			// $('#header-primary-navigation').on('mouseenter', '.sub-menus-container .menu-item', function(e) {
			// 	var thumbnailUrl = $(this).data('thumbnail-url');
			// 	if(thumbnailUrl != '') {
			// 		var thumbnailContainer = $(this).closest('.sub-menus-container').siblings('.cta-container').find('.thumbnail-container');
			// 		var thumbnailClass = $(this).attr('id') + '-thumbnail';
			// 		var thumbnail = null;
			// 		if($('.' + thumbnailClass, thumbnailContainer).length) {
			// 			thumbnail = $('.' + thumbnailClass, thumbnailContainer);
			// 		} else {
			// 			thumbnail = $('<div class="thumbnail ' + thumbnailClass + '" style="background-image: url(' + thumbnailUrl + ');"></div>');
			// 			thumbnailContainer.append(thumbnail);
			// 		}
			// 		setTimeout(function() {
			// 			$('.thumbnail.active', thumbnailContainer).removeClass('active');
			// 			thumbnail.addClass('active');
			// 		}, 50);
			// 	}
			// });
			
			$('#header-primary-navigation').on('refresh', function(e) {
				containerMaxHeight = Math.max(300, $(window).height() - ($('#header').outerHeight() + $('#header').offset().top));
				$('#header-primary-navigation .sub-menu-container .sub-menus-container').each(function(i, el) {
					var container = $(el);
					var containerHeight = 0;
					$('.sub-menu-container', container).each(function(j, el2) {
						var menuHeight = $('> .sub-menu-header', el2).outerHeight() + $('> .sub-menu-options > .inner > .sub-menu', el2).outerHeight() + 2;
						containerHeight = Math.max(containerHeight, menuHeight);
					});
					var maxHeightAdjustment = $('body').width() < 1200 && container.siblings('.cta-container').length ? container.siblings('.cta-container').outerHeight() : 0;
					container.css({ height: containerHeight, maxHeight: containerMaxHeight - maxHeightAdjustment });
					// container.css({ flex: '1 0 ' + containerHeight + 'px', maxHeight: containerMaxHeight - maxHeightAdjustment });
				});
			});

			$('#header-primary-navigation').trigger('refresh');
			$(window).load(function(e) { $('#header-primary-navigation').trigger('refresh'); });
			$(window).resize(function(e) { $('#header-primary-navigation').trigger('refresh'); });

		};


		wptheme.initMobileMenu = function() {

			$('#mobile-menu-toggle').on('click', function(e) {
				$('body').toggleClass('mobile-menu-active');
			});

			$('#mobile-primary-navigation, #mobile-secondary-navigation').on('click', 'a', function(e) {
				var menuItem = $(this).parent();
				var subMenu = $('> .sub-menu-container', menuItem);
				if(subMenu.length) {
					e.preventDefault();
					$('#mobile-menu').addClass('sub-menu-active');
					var clonedSubMenu = $('#mobile-primary-navigation > .sub-menu-container-' + subMenu.data('sub-menu-container-id'));
					if(!clonedSubMenu.length) {
						clonedSubMenu = subMenu.clone();
						$('#mobile-primary-navigation').append(clonedSubMenu);
					}
					var subMenuOffset = $('#mobile-menu .menus-container > .inner').scrollTop();
					clonedSubMenu.css({ transform: 'translateY(' + subMenuOffset + 'px)' });
					clonedSubMenu.addClass('active');
					$('#mobile-primary-navigation').append()
				}
			});

			$('#mobile-primary-navigation').on('click', '.sub-menu-header button.menu-close', function(e) {
				var subMenu = $(this).closest('.sub-menu-container');
				subMenu.removeClass('active');
				if(!$('#mobile-primary-navigation .sub-menu-container.active').length) {
					$('#mobile-menu').removeClass('sub-menu-active');
				}
			});

			$('#mobile-secondary-navigation .menu-item.current-menu-ancestor, #mobile-secondary-navigation .menu-item.current-menu-item').each(function(i, el) {
				$('> a', el).trigger('click');
			});
			$('#mobile-primary-navigation .menu-item.current-menu-ancestor, #mobile-primary-navigation .menu-item.current-menu-item').each(function(i, el) {
				$('> a', el).trigger('click');
			});

		};


		wptheme.initUserMenu = function() {

			$('#header .user-controls .user-menu-toggle, #mobile-menu .user-controls .user-menu-toggle').on('click', function(e) {
				$('body').toggleClass('user-menu-active');
			});

			$('#user-menu .menu-header .menu-close').on('click', function(e) {
				$('body').removeClass('user-menu-active');
			});

			$('#page').on('click', function(e) {
				if($('body').width() < 768) {
					$('body').removeClass('user-menu-active');
				}
			});

		};


		wptheme.initTables = function() {
			var tables = $('table.table').filter(function(i, el) {
				if($(el).parent().hasClass('table-responsive')) return false;
				return true;
			});
			tables.wrap('<div class="table-responsive"></div>');
		};


		wptheme.initBreadcrumbs = function() {

			if($('.site-breadcrumb-navigation').length) {

				var stickyBreadcrumbNav = $('.site-breadcrumb-navigation').clone();
				stickyBreadcrumbNav.addClass('sticky');
				$('body').append(stickyBreadcrumbNav);

				var refreshStichyBreadcrumbNav = function() {
					var stickyBreadcrumbNav = $('.site-breadcrumb-navigation.sticky');
					stickyBreadcrumbNav.removeClass('dual-row');
					if(stickyBreadcrumbNav.height() > 54) {
						stickyBreadcrumbNav.addClass('dual-row');
					}
				};

				refreshStichyBreadcrumbNav();
				$(window).load(refreshStichyBreadcrumbNav);
				$(window).resize(refreshStichyBreadcrumbNav);

				$(window).scroll(function(e) {
					var scrollTop = $(window).scrollTop();
					var breadcrumbNav = $('.site-breadcrumb-navigation').not('.sticky');
					var stickyBreadcrumbNav = $('.site-breadcrumb-navigation.sticky');
					var stickyNavScrollTopActivation = 100;
					var stickyNavScrollUpActivation = 40;

					var active = false;
					if(scrollTop >= stickyNavScrollTopActivation) active = true;
					// if(scrollTop < scrollTopStickyNavTracker - stickyNavScrollUpActivation) active = false;
					if(scrollTop <= breadcrumbNav.offset().top + stickyNavScrollTopActivation) active = false;

					if(active && !stickyBreadcrumbNav.hasClass('active')) {
						stickyBreadcrumbNav.addClass('active');
					} else if(!active && stickyBreadcrumbNav.hasClass('active')) {
						stickyBreadcrumbNav.removeClass('active');
					}

					if(scrollTop > scrollTopTracker) scrollTopStickyNavTracker = scrollTop;
					scrollTopTracker = scrollTop;
				});
				$(window).trigger('scroll');

			}

			$(document).on('click', '.site-breadcrumb-navigation .breadcrumbs .crumb > a, .site-breadcrumb-navigation .breadcrumbs .crumb > span', function(e) {
				var crumb = $(this).parent();
				var subMenu = $('> .sub-menu-container', crumb);
				crumb.siblings('.active').removeClass('active');
				if(subMenu.length && !crumb.hasClass('active')) {
					e.preventDefault();
					crumb.addClass('active');
				}
			});

			$(document).on('click', function(e) {
				if($(e.target).closest('.site-breadcrumb-navigation').length && $(e.target).closest('.crumb').length) return;
				$('.site-breadcrumb-navigation .breadcrumbs .crumb.active').removeClass('active');
			});

			$(document).on('click', '.site-breadcrumb-navigation .back-to-top a', function(e) {
				e.preventDefault();
				wptheme.smoothScrollToPos(0);
			});

		};


		wptheme.initGalleries = function() {

			// $(document).on('click', '.gallery .gallery-icon a', function(e) {
			// 	e.preventDefault();
			// 	var gallery = $(this).closest('.gallery');
			// 	var galleryLinks = [];
			// 	$('.gallery-item', gallery).each(function(i, el) {
			// 		galleryLinks.push({
			// 			title: $('.gallery-icon img', el).attr('alt'),
			// 			href: $('.gallery-icon a', el).attr('href'),
			// 			thumbnail: $('.gallery-icon img', el).attr('src')
			// 		});
			// 	});
			// 	blueimp.Gallery(galleryLinks, {
			// 		index: $(this).closest('.gallery-item').index()
			// 	});
			// });

			// $(document).on('click', '.section-gallery a', function(e) {
			// 	e.preventDefault();
			// 	var gallery = $(this).closest('.section-gallery');
			// 	var galleryLinks = [];
			// 	$('.image-container', gallery).each(function(i, el) {
			// 		galleryLinks.push({
			// 			title: $('img', el).attr('alt'),
			// 			href: $('a', el).attr('href'),
			// 			thumbnail: $('img', el).attr('src')
			// 		});
			// 	});
			// 	blueimp.Gallery(galleryLinks, {
			// 		index: $(this).closest('.image-container').index()
			// 	});
			// });
			
			var refreshGalleries = function() {
				$('section.page-section.image-gallery-section .section-gallery').not('.expanded').each(function(i, el) {
					var gallery = $(el);
					var images = $('.image-container', gallery).not('.disabled');
					var rowsToDisplay = parseInt(gallery.data('initial-rows-to-display'));
					var currentRow = 0;
					var firstImageInLastRow = null;
					images.each(function(j, el2) {
						if(firstImageInLastRow == null || firstImageInLastRow.offset().top < $(el2).offset().top) {
							currentRow++;
							if(currentRow > rowsToDisplay) return false;
							firstImageInLastRow = $(el2);
						}
					});
					$('.gallery-images', gallery).height((firstImageInLastRow.offset().top - $('.gallery-images', gallery).offset().top) + firstImageInLastRow.outerHeight());
					if(currentRow > rowsToDisplay) {
						$('.load-more', gallery).addClass('active');
					} else {
						$('.load-more', gallery).removeClass('active');
					}
				});
			};

			refreshGalleries();
			$(window).load(refreshGalleries);
			$(window).resize(refreshGalleries);
			$(document).on('refresh', 'section.page-section.image-gallery-section .section-gallery', refreshGalleries);

			$('section.page-section.image-gallery-section .section-gallery .load-more button').on('click', function(e) {
				var gallery = $(this).closest('.section-gallery');
				gallery.addClass('expanded');
			});

			$('section.page-section.image-gallery-section .section-filters select[name=media_category]').on('change', function(e) {
				var selectedValue = $(this).val();
				var section = $(this).closest('section.page-section');
				var gallery = $('.section-gallery', section);
				$('.image-container', gallery).removeClass('disabled');
				if(selectedValue != '') {
					$('.image-container', gallery).not('.media_category-' + selectedValue).addClass('disabled');
				}
				gallery.trigger('refresh');
			});

		};


		wptheme.initSliders = function() {

			// $('section.page-section.hero-slider-section .section-slider').each(function(i, el) {
			// 	var slider = $(el);
			// 	slider.slick({
			// 		arrows: false,
			// 		dots: true,
			// 		mobileFirst: true,
			// 		responsive: [
			// 			{
			// 				breakpoint: 1330,
			// 				settings: {
			// 					arrows: true,
			// 				}
			// 			}
			// 		]
			// 	}).on('setPosition', function(event, slick) {
			// 		var track = $('.slick-track', slick.$slider);
			// 		var slides = $('.slick-slide', slick.$slider);
			// 		slides.css({ height: 'auto' });
			// 		slides.css({ height: track.height() });
			// 	});
			// });

			// $('section.page-section.image-slider-section .section-slider').each(function(i, el) {
			// 	var slider = $(el);
			// 	slider.slick({
			// 		dots: false
			// 	});
			// });

			// $('section.page-section.logo-slider-section .section-slider').each(function(i, el) {
			// 	var slider = $(el);
			// 	slider.slick({
			// 		infinite: true,
			// 		slidesToShow: 4,
			// 		slidesToScroll: 4,
			// 		mobileFirst: true,
			// 		responsive: [
			// 			{
			// 				breakpoint: 768,
			// 				settings: {
			// 					slidesToShow: 6,
			// 					slidesToScroll: 6
			// 				}
			// 			}
			// 		]
			// 	});
			// });

			// $('section.page-section.testimonial-slider-section .section-slider').each(function(i, el) {
			// 	var slider = $(el);
			// 	slider.slick({}).on('setPosition', function(event, slick) {
			// 		var track = $('.slick-track', slick.$slider);
			// 		var slides = $('.slick-slide', slick.$slider);
			// 		slides.css({ height: 'auto' });
			// 		slides.css({ height: track.height() });
			// 	});
			// });
			
			$('section.page-section.resource-slider-section, section.page-section.event-slider-section, section.page-section.blog-post-slider-section, section.page-section.press-release-slider-section').each(function(i, el) {
				var section = $(el);
				var slider = $('.section-slider .slider', section);
				var sliderNav = $('.section-slider .slider-nav', section);

				var sliderOptions = {
					arrows: true,
					dots: true,
					infinite: false,
					slidesToShow: 1,
					slidesToScroll: 1,
					mobileFirst: true,
					appendDots: sliderNav,
					responsive: [
						{
							breakpoint: 768 - 1,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						},
						{
							breakpoint: 992 - 1,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3
							}
						}
					]
				};
				slider.slick(sliderOptions).on('setPosition', function(event, slick) {
					var track = $('.slick-track', slick.$slider);
					var slideInners = $('.slick-slide > .inner', slick.$slider);
					slideInners.css({ height: 'auto' });
					slideInners.css({ height: track.height() });
				});
				if(slider.data('max-items')) {
					slider.slick('slickFilter', function(i, el) {
						return i < slider.data('max-items');
					});
				}

				$('.section-filters select', section).on('change', function(e) {
					e.preventDefault();
					var section = $(this).closest('section.page-section');
					var slider = $('.section-slider .slider', section);
					var slickSlider = slider.slick('getSlick');
					var selectedValue = $(this).val();
					slider.slick('slickUnfilter');
					if(selectedValue != '') {
						// slider.slick('slickFilter', '.' + selectedValue);
						var activeItems = 0;
						slider.slick('slickFilter', function(i, el) {
							if(slider.data('min-per-type') && activeItems >= slider.data('min-per-type')) return false;
							if($(el).hasClass(selectedValue)) {
								activeItems++;
								return true;
							}
						});
					} else if(slider.data('max-items')) {
						slider.slick('slickFilter', function(i, el) {
							return i < slider.data('max-items');
						});
					}
					$('.section-slider', section).removeClass('item-count-' + $('.section-slider', section).data('item-count'));
					$('.section-slider', section).addClass('item-count-' + slickSlider.slideCount).data('item-count', slickSlider.slideCount);
					if($('.section-filters .toggle-menu', section).length) {
						$('.section-filters .toggle-menu li.active', section).removeClass('active');
						$('.section-filters .toggle-menu button', section).filter(function(i, el) { return $(el).val() == selectedValue; }).parent().addClass('active');
						// if(!$('.section-filters .toggle-menu li.active', section).length) $('.section-filters .toggle-menu li:eq(0)', section).addClass('active');
					}
					if($('.section-cta .cta-link.filtered', section).length) {
						var activeLink = selectedValue != '' ? $('.section-cta .cta-link.filtered.' + selectedValue, section) : null;
						if(activeLink && activeLink.length) {
							$('.section-cta .cta-link.default', section).addClass('inactive');
							$('.section-cta .cta-link.filtered.active', section).removeClass('active');
							activeLink.addClass('active');
						} else {
							$('.section-cta .cta-link.default', section).removeClass('inactive');
							$('.section-cta .cta-link.filtered.active', section).removeClass('active');
						}
					}
				});

				$('.section-filters .toggle-menu button', section).on('click', function(e) {
					e.preventDefault();
					var section = $(this).closest('section.page-section');
					var filtersSelect = $('.section-filters select', section);
					var selectedValue = $(this).val();
					filtersSelect.val(filtersSelect.val() == selectedValue ? '' : selectedValue).trigger('change');
				});

				if(section.hasClass('resource-slider-section') && $('.section-filters .toggle-menu button', section).length) {
					$('.section-filters .toggle-menu button', section).first().trigger('click');
				}

			});

			$('section.page-section.video-slider-section').each(function(i, el) {
				var section = $(el);
				var slider = $('.section-slider .slider', section);
				var sliderNav = $('.section-slider .slider-nav', section);

				var sliderOptions = {
					arrows: true,
					dots: true,
					infinite: false,
					slidesToShow: 1,
					slidesToScroll: 1,
					mobileFirst: true,
					appendDots: sliderNav,
					responsive: [
						{
							breakpoint: 992 - 1,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						}
					]
				};
				slider.slick(sliderOptions);

			});

		};


		wptheme.initVideoContainers = function() {
			
			videoIframes = $('iframe').filter(function(i, el) {

				var validSrc = false;
				var src = $(el).attr('src');
				if(src == undefined) return false;
				if(src.match(/^https?:\/\/(www\.)?youtube\.com/)) validSrc = true;
				if(src.match(/^https?:\/\/player\.vimeo\.com/)) validSrc = true;
				if(!validSrc) return false;

				if($(el).parent().hasClass('video-iframe-container')) return false;

				return true;
			});

			videoIframes.wrap('<div class="video-iframe-container"></div>');

		};



		wptheme.initModals = function() {

			$(document).on('click', '.help-modal-menu-item > a', function(e) {
				e.preventDefault();
				$('#help-modal').modal('show');
			});

			$(document).on('click', '.video-modal-link', function(e) {
				var videoEmbed = $(this).data('video-embed');
				var videoTitle = $(this).data('video-title');
				if(videoEmbed) {
					e.preventDefault();

					var videoModal = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span>×</span></button></div><div class="modal-body"></div></div></div></div>');
					videoModal.addClass('video-modal');
					$('.modal-dialog', videoModal).addClass('modal-lg modal-dialog-centered');

					if(videoTitle) $('.modal-header', videoModal).prepend('<h3 class="modal-title">' + videoTitle + '</h3>');

					videoEmbed = $(videoEmbed);
					var videoIframe = videoEmbed;
					if(!videoIframe.is('iframe')) videoIframe = $('iframe', videoIframe).first();
					if(videoIframe.attr('src').match(/https?:\/\/(player\.)?vimeo\.com/)) {
						var videoEmbedSrc = videoIframe.attr('src');
						videoEmbedSrc += (videoEmbedSrc.match(/\?/) ? '&' : '?') + 'autoplay=1';
						videoIframe.attr('src', videoEmbedSrc);
					}
					$('.modal-body', videoModal).append(videoEmbed);
					
					$('body').append(videoModal);
					videoModal.modal('show').on('hidden.bs.modal', function(e) {
						$(this).remove();
					});

					wptheme.initVideoContainers();

				}
			});

		};


		wptheme.initMaps = function() {
			if(typeof google === 'undefined' || typeof google.maps === 'undefined') return;

			mapSettings = {
				markerShapes: {
					default: {
						coords: [ 15,0 , 26,4 , 30,15 , 26,19 , 15,37 , 4,19 , 0,15 , 4,4 ],
						type: 'poly'
					}
				},
				markerImages: {
					blue: {
						url: themeData.themeUrl + '/images/miscellaneous/map-markers.png',
						size: new google.maps.Size(30, 37),
						scaledSize: new google.maps.Size(150, 37),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(15, 37)
					}
				}
			};
			mapSettings.markerImages.green = $.extend(true, {}, mapSettings.markerImages.blue, { origin: new google.maps.Point((30 * 1), 0) });
			mapSettings.markerImages.lightBlue = $.extend(true, {}, mapSettings.markerImages.blue, { origin: new google.maps.Point((30 * 2), 0) });
			mapSettings.markerImages.yellow = $.extend(true, {}, mapSettings.markerImages.blue, { origin: new google.maps.Point((30 * 3), 0) });
			mapSettings.markerImages.red = $.extend(true, {}, mapSettings.markerImages.blue, { origin: new google.maps.Point((30 * 4), 0) });

			$(document).on('mapInitialized', 'section.page-section.locations-map-section .google-map', function(e) {
				var mapData = $(this).data('map-data');
				if(mapData.settings.points.length && !mapData.markers.length) {

					var infoWindow = null;

					infoWindow = new InfoBox({
						pixelOffset: new google.maps.Size(-120, -50),
						alignBottom: true,
						closeBoxURL: ''
					});

					google.maps.event.addListener(mapData.map, 'click', function() {
						infoWindow.close();
					});

					mapData.bounds = new google.maps.LatLngBounds();
					for(var i in mapData.settings.points) {
						var point = mapData.settings.points[i];

						var position = new google.maps.LatLng(point.lat, point.lng);
						var markerSettings = {
							markerIndex: parseInt(i),
							position: position,
							map: mapData.map,
							icon: mapSettings.markerImages.red,
							shape: mapSettings.markerShapes.default,
							title: point.title,
							data: point
						};
						var marker = new google.maps.Marker(markerSettings);

						if(markerSettings.data.infoBoxContent) {
							google.maps.event.addListener(marker, 'click', function() {
								infoWindow.setOptions({ boxClass: 'infoBox' });
								infoWindow.setContent(this.data.infoBoxContent);
								infoWindow.open(this.map, this);
								setTimeout(function() { infoWindow.setOptions({ boxClass: 'infoBox active' }); }, 100);
							});
						}

						mapData.markers.push(marker);
						mapData.bounds.extend(position);
					}

					if(mapData.settings.points.length) {

						mapData.map.fitBounds(mapData.bounds);

						google.maps.event.addListenerOnce(mapData.map, 'idle', function() { 
							var mapData = $(this.getDiv()).data('map-data');
							if(mapData.map.getZoom() > mapData.settings.options.zoom) {
								mapData.map.setZoom(mapData.settings.options.zoom);
							}
						});

					}

				}
			});

		};


		wptheme.initCalendars = function() {

			var initialMonth = null;
			if(sessionStorageAvailable()) {
				var month = sessionStorage.getItem('event_calendar_month');
				if(month) {
					initialMonth = month;
				}
			}

			$('.calendar-equinox').each(function(i, el) {
				var calendar = $(this);
				var events = calendar.data('events');
				calendar.equinox({
					events: events,
					onLoadEnd: function(data) {
						if(sessionStorageAvailable()) {
							sessionStorage.setItem('event_calendar_month', data.activeMonth.format('YYYY-MM-DD'));
						}
					}
				});
				if(initialMonth) {
					var eData = calendar.data('equinox');
					eData.activeMonth = moment(initialMonth);
					calendar.equinox('load');
				}
			});

			if (sessionStorageAvailable()){
				// Get calendar state and switch to calendar view if necessary
				var btn = $('.event-view-toggle[data-view=calendar]');
				var view = sessionStorage.getItem('event_calendar_view');

				if (btn.length && view == 'calendar'){
					setTimeout(function() { // Set a small delay since it doesn't seem to have an effect without it
						btn.click();
					}, 100);
				}

				// $('.calendar-equinox').each(function(i, el) {
				// 	var calendar = $(this);
				// 	var events = calendar.data('events');
				// 	calendar.equinox({
				// 		events: events
				// 	});
				// });

				// Save calendar view (grid/calendar)
				$('.event-view-toggle').on('click', function(e){
					var view = $(this).attr('data-view');

					if (typeof view !== 'undefined'){
						sessionStorage.setItem('event_calendar_view', view);
					}
				});

				// Save event filter state (not currently used for anything)
				$('.event-type-dropdown-item').on('click', function(e){
					var type = $(this).attr('data-key');

					if (typeof type !== 'undefined'){
						sessionStorage.setItem('event_calendar_type', type);
					}
				});

				// // Save calendar month
				// $('.calendar-equinox').on('click', function(e){
				// 	var type = $(this).attr('data-key');

				// 	if (typeof type !== 'undefined'){
				// 		sessionStorage.setItem('event_calendar_type', type);
				// 	}
				// });

			}

		};


		wptheme.initIndexFilters = function() {

			$(document).on('change', 'section.page-section.index-filters-section form select', function(e) {
				var form = $(this).closest('form');
				form.trigger('submit');
			});

			$(document).on('click', 'section.page-section.index-filters-section .view-toggle button', function(e) {
				var group = $(this).closest('.btn-group');
				var view = $(this).data('view');
				var itemsSection = $(this).closest('section.page-section').next('section.page-section.index-items-section');
				$('.btn', group).each(function(i, el) {
					$(el).removeClass('btn-primary').addClass('btn-black');
					itemsSection.removeClass($(el).data('view') + '-view');
				})
				$(this).removeClass('btn-black').addClass('btn-primary');
				itemsSection.addClass(view + '-view');
			});

		};


		wptheme.initPricingTables = function() {

			var refreshPricingTables = function() {
				$('.section-pricing-table').each(function(i, el) {
					$('.table-columns .table-column .column-overlay', el).height($(el).height() - 1);
				});
			};

			refreshPricingTables();
			$(window).load(refreshPricingTables);
			$(window).resize(refreshPricingTables);

		};


		wptheme.smoothScrollToElement = function(element, speed, offset) {
			speed = typeof speed !== 'undefined' ? speed : 1000;
			offset = typeof offset !== 'undefined' ? offset : 0;
			if(element.length > 0) {
				var margin = parseInt(element.css('margin-top'));
				wptheme.smoothScrollToPos(element.offset().top - (margin > 0 ? margin : 0), speed, offset);
			}
		};
		wptheme.smoothScrollToPos = function(y, speed, offset) {
			speed = typeof speed !== 'undefined' ? speed : 1000;
			offset = typeof offset !== 'undefined' ? offset : 0;
			var fixedHeaderOffset = 0;
			$('html, body').stop(true).animate({ scrollTop: y - fixedHeaderOffset + offset }, speed, 'easeOutExpo');
		};


		return wptheme;
		
	})({});

})(jQuery);