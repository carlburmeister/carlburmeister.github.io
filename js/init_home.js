/**************************************************************************************************/
//Home page initialization functions. See pageSetup.js for individual page initialization functions.
/**************************************************************************************************/

$(document).ready(function () {		
	var is_mobile = false;
	
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		is_mobile = true;
console.log('device is mobile');	 		
		
	}

	/**
	//	SET MOBILE (SIMULATED) CLICK HANDLER FOR THUMBNAIL SCROLLER
	// 	FROM: http://www.gianlucaguarini.com/blog/detecting-the-tap-event-on-a-mobile-touch-device-using-javascript/
	//	NOTE: gianlucaguarini's Tocca.js did not work (touch events getting blocked bu jquery-kinetic used by smoothDivScroll...?	
	*/
	if(is_mobile)
	{
		var getPointerEvent = function(event) {
			return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
		};
		
		$("#scroller div.click_nav").each(function(i){
				var $touchArea = $(this),
					touchStarted = false, // detect if a touch event is sarted
					currX = 0,
					currY = 0,
					cachedX = 0,
					cachedY = 0;
				
				//setting the events listeners
				$touchArea.on('touchstart mousedown',function (e){
					e.preventDefault(); 
					var pointer = getPointerEvent(e);
					// caching the current x
					cachedX = currX = pointer.pageX;
					// caching the current y
					cachedY = currY = pointer.pageY;
					// a touch event is detected      
					touchStarted = true;
					
					// detecting if after 200ms the finger is still in the same position
					setTimeout(function (){
						if ((cachedX === currX) && !touchStarted && (cachedY === currY)) {
							// Here you get the Tap event
							//alert($touchArea.attr('id') + ' Tap');
							
							$('#mainLayer').css({ visibility: 'hidden' });
							
							sendData( $touchArea.attr('id'), 'from_index' );
							//setTimeout(function(){ sendData( $touchArea.attr('id'), 'from_index' ); }, 100 );
						}
					}, 200);  //OG was 200 ms
				});
				$touchArea.on('touchend mouseup touchcancel',function (e){
					e.preventDefault();
					// here we can consider finished the touch event
					touchStarted = false;
					//console.log('Touchended');
				});
				$touchArea.on('touchmove mousemove',function (e){
					e.preventDefault();
					var pointer = getPointerEvent(e);
					currX = pointer.pageX;
					currY = pointer.pageY;
					if(touchStarted) {
						 // here you are swiping
						 //console.log('Swiping');
					}
				   
				});
		});
	}
	else
	{
		//SET DESKTOP CLICK HANDLER FOR THUMBNAIL SCROLLER
		$("#scroller div.click_nav").each(function(i){
	
				$(this).click(function(){
						var _this = $(this);
						setTimeout(function(){	sendData( _this.attr('id'), 'from_index' ); }, 100);
				});	
			
		});
	
	
		//DESKTOP: CHANGE OPACITY ON MOUSEOVER
		$("#scroller img").each(function(){
								$(this).bind('mouseover', function(){
										$(this).css({	opacity: .7,
														cursor: 'pointer'
													});
								});
								$(this).bind('mouseout', function(){									
									$(this).css({	opacity: 1 });
								});
		});
	
	}

	/**
	//	INITIALIZE SMOOTH DIV SCROLL PLUGIN
	*/
	if(is_mobile)
	{


			//INITIALIZE SMOOTH DIV SCROLL PLUGIN FOR MOBILE
			$('#scroller').smoothDivScroll({	mousewheelScrolling: "allDirections",
													manualContinuousScrolling: true,
													//startAtElementId: getThumbId(getId()),
													hotSpotScrolling: false,
													//visibleHotSpotBackgrounds: "always",
													touchScrolling: true,
													autoScrollingMode: "onStart" //""
											});
	}
	else
	{
		//INITIALIZE SMOOTH DIV SCROLL PLUGIN FOR NON-MOBILE
		$("div#scroller").smoothDivScroll({	mousewheelScrolling: "allDirections",
													manualContinuousScrolling: true,
													hotSpotScrolling: true,
													hotSpotScrollingInterval: 25, //default = 10, larger is slower
													autoScrollingMode: "" //"onStart"
											});	
	}
		
	$("div#scroller").css('visibility', 'visible').hide().fadeIn(1500);
	
	
	if(is_mobile){
	
		updateOrientation();
		$('#mainLayer').css({ visibility: 'visible' });
	
	}
	else{
		//max_main_layer_width (used in setMainLayerMaxWidth()) is a global set at the top if utility.js
		setMainLayerMaxWidth();
		centerMainLayerOnPage();
		
	}
	
	
	
	
	
});












