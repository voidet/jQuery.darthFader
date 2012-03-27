(function($){

	var nextZIndex;

	var methods = {
		init : function(options) {
			return this.each(function(){

				$this = $(this);

				$this.settings = $.extend({
					'carousel': '#carousel',
					'nav': '#carousel-nav',
					'speed': 9000
					}, options);

				$this.items = $(' > *', $this);
				$this.itemCount = $this.items.length;
				$this.currentIndex = 0;

				nextZIndex = $this.itemCount;

				//Setup nav
				$($this.settings.nav).append('<div class="previous"></div><div class="dots"></div>');
				for (var i=0; i < $this.itemCount; i++) {
					$('.dots', $this.settings.nav).append('<div class="dot">');
				}
				$($this.settings.nav).append('<div class="next"></div>');
				$('.dot:first', $this.settings.nav).addClass('activedot');
				$('.dot:last', $this.settings.nav).css({'margin-right': 0});

				methods.resetZIndex($this.currentIndex);

				$('.dot', $this.settings.nav).on('click', function() {
					$('li', $this.settings.carousel).not(':eq('+$this.currentIndex+')').hide();
					$this.currentIndex = $(this).index();
					methods.resetTimer();
					methods.jumpTo($this.currentIndex);
				});

				$('#carousel-nav .previous').on('click', function() {
					methods.previous();
				});

				$('#carousel-nav .next').on('click', function() {
					methods.next();
				});

				$this.timer = setInterval(methods.cycleItems, $this.settings.speed);

			});
		},
		previous: function() {
			$($this.items).not(':eq('+$this.currentIndex+')').hide();
			if (--$this.currentIndex < 0) {
				$this.currentIndex = $this.itemCount - 1;
			}
			methods.resetTimer();
			methods.jumpTo($this.currentIndex);
		},
		next: function() {
			$($this.items).not(':eq('+$this.currentIndex+')').hide();
			if (++$this.currentIndex >= $this.itemCount) {
				$this.currentIndex = 0;
			}
			methods.resetTimer();
			methods.jumpTo($this.currentIndex);
		},
		cycleItems: function() {
			$($this.items).not(':eq('+$this.currentIndex+')').hide();
			if (++$this.currentIndex >= $this.itemCount) {
				$this.currentIndex = 0;
			}
			methods.jumpTo($this.currentIndex);
		},
		resetTimer: function() {
			clearInterval($this.timer);
			$this.timer = setInterval(methods.cycleItems, $this.settings.speed);
		},
		pause: function() {
			clearInterval($this.timer);
		},
		jumpTo: function(index) {
			changeDots();
			var item = $($this.items).get(index);
			item = $(item).css({zIndex: $(' > *', $this).length}).hide().clone();
			$($this).append(item);
		
			$(item).fadeIn(1000, function() {
				$(this).remove();
				$($this.items).eq(index).css({zIndex:nextZIndex++}).show();
			});

			methods.resetZIndex($this.currentIndex);
			
		},
		resetZIndex: function(targetIndex) {
			var zIndex = $this.itemCount - 1;
			for (var i=0; i < $this.itemCount; i++) {
				$($this.items).eq(targetIndex++).css({'z-index': zIndex--});
				if (targetIndex == $this.itemCount) {
					targetIndex = 0;
					nextZIndex = $this.itemCount - 1;
				}
			}
		}
	};

	function changeDots() {
		$('.dot', $this.settings.nav).removeClass('activedot');
		$('.dot', $this.settings.nav).eq($this.currentIndex).addClass('activedot');
	}

	$.fn.darthFader = function( method ) {
		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.darthFader' );
		}

	};

	$.fn.darthFader.pause = function() {
		methods.pause();
	}

	$.fn.darthFader.resume = function() {
		methods.resetTimer();
	}
})(jQuery);