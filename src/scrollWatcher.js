Scrollable._scrollWatcher = function (os) {
	return setupScrollWatcher;


	//NOTE: this should only be used for iOS native scrolling
	function setupScrollWatcher (scroller) {
		var willScroll         = false,
			isScrolling        = false,
			lastScrollPosition = scroller.scrollTop;

		scroller.addEventListener('touchstart' , onTouchStart );
		scroller.addEventListener('touchmove'  , onTouchMove  );
		scroller.addEventListener('touchcancel', onTouchCancel);
		scroller.addEventListener('touchend'   , onTouchEnd   );
		scroller.addEventListener('scroll'     , onScroll     );

		updateScrollingFlag();
		return;


		function updateScrollingFlag () {
			scroller._isScrolling = (isScrolling || willScroll);
		}

		function multitouchBlock (e, maxTouches, maxChanges) {
			if ((e.touches.length <= maxTouches) && ((typeof maxChanges === 'undefined') || (e.changedTouches.length <= maxChanges))) {
				return false;
			}

			e.preventDefault();

			willScroll  = false;
			isScrolling = false;
			updateScrollingFlag();

			return true;
		}

		function onTouchStart (e) {
			if ( multitouchBlock(e, 1) ) {
				return;
			}

			willScroll = false;
			updateScrollingFlag();
		}

		function onTouchMove (e) {
			if ( multitouchBlock(e, 1) ) {
				return;
			}

			willScroll = true;
			lastScrollPosition = scroller.scrollTop;
			updateScrollingFlag();
		}

		function onTouchCancel (e) {
			if ( multitouchBlock(e, 0, 1) ) {
				return;
			}

			willScroll  = false;
			isScrolling = false;
			updateScrollingFlag();
		}

		function onTouchEnd (e) {
			if ( multitouchBlock(e, 0, 1) ) {
				return;
			}

			var offset;

			if (willScroll) {
				offset = Math.abs(scroller.scrollTop - lastScrollPosition);

				if (offset > 5) {
					isScrolling = true;
				}

				willScroll = false;

				updateScrollingFlag();
			}
		}

		function onScroll () {
			if (!willScroll && isScrolling) {
				willScroll  = false;
				isScrolling = false;
				updateScrollingFlag();
			}
		}
	}
}(
	Scrollable._os // from utils.js
);
