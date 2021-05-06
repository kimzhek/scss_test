console.log('test')
(function ($) {

	var defaults = {
		selectedName: 'selected',
		openText: '보기',
		closeText: '닫기',
	};

	window.ui = {
		// 하단 navi Bar
		naviBar: function () {
			var lastSt = 0,
				donName = 'down'
			delta = 50;
			function naviBarD(st) {
				if (Math.abs(lastSt - st) <= delta) return;
				lastSt !== 0 && (st > lastSt && lastSt >= 0 && st > 0 && st + 100 < ($(document).height() - window.innerHeight) ? nBarDown() : nBarUp())
				lastSt = st;
			};

			// 하단바 올리기
			function nBarUp() {
				$('.navi_bar').removeClass(donName);
			};

			// 하단바 내리기
			function nBarDown() {
				$('.navi_bar').addClass(donName);
			};

			return {
				nbd: naviBarD,
				nBarDown: nBarDown
			};
		},
		// tooltip Btn
		tooltipBtn: function () {
			var tooltipC = '[data-tooltip="cont"]',
				tooltipB = '[data-tooltip="btn"]',
				tooltipW = '[data-tooltip="wrap"]';

			function tooltipIn(_this) {
				ui.openTextchange(_this, defaults.closeText);
				$(tooltipB).not(_this).closest(tooltipW).removeClass(defaults.selectedName);
				ui.closeTextchange($(tooltipB).not(_this).find(tooltipB), defaults.openText);
				_this.closest(tooltipW).find(tooltipC).css({
					top: _this.outerHeight() + 8,
					left: _this.outerWidth() / 2
				})
				_this.closest(tooltipW).addClass(defaults.selectedName);
			};

			function tooltipOut(_this) {
				ui.closeTextchange($('[data-tooltip="wrap"].selected').find(tooltipB), defaults.openText);
				_this.closest(tooltipW).removeClass(defaults.selectedName);
			};

			$('body').on('click', tooltipB, function (e) {
				e.preventDefault();
				!$(this).parent().hasClass(defaults.selectedName) ? tooltipIn($(this)) : tooltipOut($(this));
			});

			$(document).on('touchstart', function (e) {
				$(tooltipW).is('.' + defaults.selectedName)
					&& !$(e.target).closest(tooltipC).is(tooltipC)
					&& !$(e.target).closest(tooltipW).hasClass(defaults.selectedName)
					&& tooltipOut($(tooltipW + '.' + defaults.selectedName).find(tooltipB));
			});
		},
		// toggle Btn
		toggleBtn: function () {
			// 보기
			function ToggleSlideD(_this) {
				if (_this.data('toggle-name')) {
					var siblingTarget = _this.siblings('[data-toggle-name].' + defaults.selectedName);
					siblingTarget.get(0) && (
						ui.closeTextchange($('[data-toggle-target="' + siblingTarget.data('toggle-name') + '"]'), defaults.openText),
						$('[data-toggle-target="' + siblingTarget.data('toggle-name') + '"]').removeClass(defaults.selectedName),
						siblingTarget.slideUp(300).removeClass(defaults.selectedName)
					);
					var _target = $('[data-toggle-target="' + _this.data('toggle-name') + '"]');
					ui.openTextchange(_target, defaults.closeText);
					_target.addClass(defaults.selectedName);
					_this.slideDown(300).addClass(defaults.selectedName);
				} else {
					ui.closeTextchange(_this.parent().find('[data-toggle="toggle"]'), defaults.openText);
					_this.slideDown(300, function () {
						$(this).parent().addClass(defaults.selectedName);
					})
				};
			};
			// 닫기
			function ToggleSlideU(_this) {
				if (_this.data('toggle-name')) {
					var _target = $('[data-toggle-target="' + _this.data('toggle-name') + '"]');
					ui.closeTextchange(_target, defaults.openText);
					_target.removeClass(defaults.selectedName);
					_this.slideUp(300).removeClass(defaults.selectedName);
				} else {
					ui.closeTextchange(_this.parent().find('[data-toggle="toggle"]'), defaults.openText);
					_this.slideUp(300, function () {
						$(this).parent().removeClass(defaults.selectedName);
					})
				};
			};
			return {
				tsD: ToggleSlideD,
				tsU: ToggleSlideU
			};
		},
		// 공통 보기 text
		openTextchange: function (_this, txt) {
			_this.attr('title')
				? _this.attr('title', _this.attr('title').replace(/.{2}$/, txt))
				: _this.text(_this.text().replace(/.{2}$/, txt));
		},
		// 공통 닫기 text
		closeTextchange: function (_this, txt) {
			_this.attr('title')
				? _this.attr('title', _this.attr('title').replace(/.{2}$/, txt))
				: _this.text(_this.text().replace(/.{2}$/, txt));
		},
		// 공통 fixd content
		fixdScroll: function () {
			var _target = $('[data-fixed="fixed"]'),
				fixedName = 'fixed';

			fixedInit();
			function fixedInit() {
				_target.each(function (idx) {
					$(this).height($(this).height());
					$(_target[idx]).data('fixed-gap', $(_target[idx - 1]).height() + $(_target[idx - 1]).data('fixed-gap') || 0);
					$(this).children().css({ top: $(this).data('fixed-gap') });
				});
			};
			function fixdS(st) {
				_target.each(function () {
					var _target = $(this),
						sst = _target.data('fixed-gap') ? st + _target.data('fixed-gap') : st;
					sst >= _target.offset().top
						? _target.addClass(fixedName).children().css({ top: _target.data('fixed-gap') })
						: _target.removeClass(fixedName).children().removeAttr('style');
				});
			};
			return {
				fixdS: fixdS,
				fixedInit: fixedInit
			};
		},
		// go top 버튼
		commonTopBtn: function () {
			var topBtn = $('.btm_btn_wrap .btn_top'),
				topBtnHide = 'top_btn_hide';
			topBtn.parent().addClass(topBtnHide);
			function topBtnScroll(st) {
				st > 100 ? topBtn.parent().removeClass(topBtnHide) : topBtn.parent().addClass(topBtnHide);
			};
			topBtn.on('click', function (e) {
				e.preventDefault();
				$('html, body').stop().animate({ scrollTop: 0 });
			});
			return {
				topBtnScroll: topBtnScroll
			};
		},
		// js 탭
		jsTabs: function () {
			var _this = '.js-tab',
				items = $(_this).find('a'),
				content = 'tab-content',
				selectedContent = 'tab-content-selected';

			items.each(function () {
				var _target = $('[data-tab-content="' + $(this).data('tab-menu') + '"]');
				_target.addClass(content);
				$(this).parent().hasClass(defaults.selectedName) && _target.addClass(selectedContent);
			});

			$('body').on('click', '' + _this + ' a', function (e) {
				e.preventDefault();
				$(this).parent().addClass(defaults.selectedName).siblings().removeClass(defaults.selectedName);
				var _target = $('[data-tab-content="' + $(this).data('tab-menu') + '"]');
				_target.addClass(selectedContent).siblings().removeClass(selectedContent);
				$(this).data('hash-target') && $("html, body").stop().animate({ scrollTop: $('#' + $(this).data('hash-target') + '').offset().top });
			});
		},
		scrollEvGroup: function () {
			var ticking = false;
			var update = function (st) {
				ui.naviBar.nbd(st);
				ui.fixdScroll.fixdS(st);
				ui.commonTopBtn.topBtnScroll(st);
			};
			var onScroll = function () {
				var st = $(window).scrollTop();
				if (!ticking) {
					var raf = window.requestAnimationFrame
						|| window.webkitRequestAnimationFrame
						|| window.mozRequestAnimationFrame
						|| window.msRequestAnimationFrame
						|| function (callback) { return setTimeout(callback, 1000 / 60); };

					raf(function () {
						update(st);
						ticking = false;
					});
					ticking = true;
				};
			};
			$(window).on('scroll', onScroll);
		},
		init: function () {
			this.naviBar = this.naviBar();
			this.fixdScroll = this.fixdScroll();
			this.commonTopBtn = this.commonTopBtn();
			this.toggleBtn = this.toggleBtn();
			this.scrollEvGroup = this.scrollEvGroup();
		}
	};

	$(document).ready(function () {
		ui.init();
		ui.jsTabs();
		ui.tooltipBtn();

		$('body').on('click', '[data-toggle="toggle"]', function (e) {
			e.preventDefault();
			var _target = $(this).data('toggle-target');
			if (_target !== undefined) {
				!$('[data-toggle-name="' + _target + '"]').hasClass(defaults.selectedName)
					? ui.toggleBtn.tsD($('[data-toggle-name="' + _target + '"]'))
					: ui.toggleBtn.tsU($('[data-toggle-name="' + _target + '"]'));
			} else {
				if (!$(this).parent().find('[data-toggle="cont"]').get(0)) {
					!$(this).parent().hasClass(defaults.selectedName)
						? $(this).parent().addClass(defaults.selectedName)
						: $(this).parent().removeClass(defaults.selectedName);
				} else {
					!$(this).parent().hasClass(defaults.selectedName)
						? ui.toggleBtn.tsD($(this).parent().find('[data-toggle="cont"]'))
						: ui.toggleBtn.tsU($(this).parent().find('[data-toggle="cont"]'));
				}
			};
		});

		// 정렬기준 보기
		$('body').on('click', '.newlist_box a', function (e) {
			e.preventDefault();
			$('[data-toggle-target="' + $(this).closest('[data-toggle-name]').data('toggle-name') + '"]').text($(this).text());
			$(this).parent().addClass(defaults.selectedName).siblings().removeClass(defaults.selectedName);
			ui.toggleBtn.tsU($(this).closest('[data-toggle-name]'));
		});

		// 펼쳐보기 간략보기
		$('body').on('click', '.view_type button', function () {
			var type = $('.welcome_tab li').eq($(".welcome_wrap").find("[data-menu-index='" + $(".welcome_tab li.selected").index() + "']").index()).attr("data-menu-name");

			try {
				switch (type) {
					case 'best':
						!$(this).hasClass(defaults.selectedName) && $(this).addClass(defaults.selectedName).siblings().removeClass(defaults.selectedName);

						// '내 분야' 하위 탭에서는 추가적인 div 가 존재하므로 분리
						var contentObject = $(this).parent("div").parent("div").next("div").children(".view_list_box");
						if (contentObject.length <= 0) {
							var contentObject = $(this).parent("div").parent("div").next("div").next("div").children(".view_list_box");
						}
						$(this).hasClass('view_list') ? contentObject.removeClass('sel_change') : contentObject.addClass('sel_change');

						ScrollEvent.listTypeIndex = $(this).index();
						storeWelcome.bestTabSaveAll(ScrollEvent);
						break;
					case 'newproduct':
						!$(this).hasClass(defaults.selectedName) && $(this).addClass(defaults.selectedName).siblings().removeClass(defaults.selectedName);
						$(this).hasClass('view_list') ? $(this).parent("div").parent("div").next("ul.view_list_box").removeClass('sel_change') : $(this).parent("div").parent("div").next("ul.view_list_box").addClass('sel_change');
						$.WelcomeNewProductVars.listType = $(this).index();
						storeWelcome.newproductTabSave($.WelcomeNewProductVars);
						break;
					default:
						!$(this).hasClass(defaults.selectedName) && $(this).addClass(defaults.selectedName).siblings().removeClass(defaults.selectedName);
						$(this).hasClass('view_list') ? $('.view_list_box').removeClass('sel_change') : $('.view_list_box').addClass('sel_change');
						break;
				}
			} catch (e) {
				console.log(e);
			}
		});

		// scroll 하단 gradient
		if ($('.layer_container.scroll_bg').get(0)) {
			$('.layer_container.scroll_bg').on('scroll', function () {
				$(this)[0].scrollHeight - $(this).scrollTop() <= $(this).outerHeight() ? $(this).addClass('scroll_end') : $(this).removeClass('scroll_end');
			});
		};
	});
})(jQuery);