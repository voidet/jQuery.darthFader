(function($){

	var methods = {
		init : function(options) {
			return this.each(function(){

				$this = $(this);

				$this.settings = $.extend({
					'carousel': '#carousel',
					'nav': '#carousel-nav',
					'speed': 3000
					}, options);

				$this.items = $(' > *', $this);
				$this.itemCount = $this.items.length;
				$this.currentIndex = 0;

				//Setup nav
				$($this.settings.nav).append('<div class="previous"></div><div class="dots"></div>');
				for (var i=0; i < $this.itemCount; i++) {
					$('.dots', $this.settings.nav).append('<div class="dot">');
				}
				$($this.settings.nav).append('<div class="next"></div>');
				$('.dot:first', $this.settings.nav).addClass('activedot');
				$('.dot:last', $this.settings.nav).css({'margin-right': 0});

				methods.resetZIndex($this.currentIndex);

				$('#carousel-nav .dot').on('click', function() {
					$('#hero-carousel li').not(':eq('+$this.currentIndex+')').hide();
					$this.currentIndex = $(this).index();
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

		},
		jumpTo: function(index) {
			methods.resetZIndex(index);
			changeDots();
			$($this.items).eq(index).fadeIn(1000);
		},
		resetZIndex: function(targetIndex) {
			var zIndex = $this.itemCount - 1;
			for (var i=0; i < $this.itemCount; i++) {
				$($this.items).eq(targetIndex++).css({'z-index': zIndex--});
				if (targetIndex == $this.itemCount) {
					targetIndex = 0;
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
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}

	};
})(jQuery);