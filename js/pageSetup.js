//GLOBALS
var pieceId 				= "";
var pageAssets 				= {};
var multipleDetailImages 	= false;
var preloadedImages 		= {};
var preloadedLargeImages 	= new Array();

var loResImagesPath 		= "../../media/images/lo_res/";
var hiResImagesPath 		= "../../media/images/hi_res/";
var videoPath 				= "../../media/video/";
var audioPath 				= "../../media/audio/";
var phpPath 				= "../php/";
var browser 				= getBrowserVersion();
var fadeSpeed				= 500;
var default_video_width		= 640;
var default_video_height	= 480;
var video1_width			= 0;
var video1_height			= 0;
var video2_width			= 0;
var video2_height			= 0;
var is_mobile				= false;

var debug 					= false;

/***************************************************************************************************/
//	function $(document).ready()
/***************************************************************************************************/
$(document).ready(function () {		
	
	
	//http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	 	is_mobile = true;
console.log('is_mobile = ' + is_mobile);
	}
	
	if(is_mobile)
	{
		var getPointerEvent = function(event) {
			return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
		};
		
		$("#thumbnailScroller div.click_nav").each(function(i){

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
							setTimeout(function(){ sendData( $touchArea.attr('id') ); }, 100 );
						}
					},200);
				});
				$touchArea.on('touchend mouseup touchcancel',function (e){
					e.preventDefault();
					// here we can consider finished the touch event
					touchStarted = false;
					console.log('Touchended');
				});
				$touchArea.on('touchmove mousemove',function (e){
					e.preventDefault();
					var pointer = getPointerEvent(e);
					currX = pointer.pageX;
					currY = pointer.pageY;
					if(touchStarted) {
						 // here you are swiping
						 console.log('Swiping');
					}
				   
				});
		});
	}
	else
	{
		//SET DESKTOP CLICK HANDLER FOR THUMBNAIL SCROLLER
		$("#thumbnailScroller div.click_nav").each(function(i){
						$(this).click(function(){
									var _this = $(this);
									setTimeout(function(){ sendData( _this.attr('id') ); }, 100);
						});
		});
		
		//DESKTOP: CHANGE OPACITY ON MOUSEOVER
		$("#thumbnailScroller img").each(function(){
						$(this).bind('mouseover', function(){
								$(this).css({	opacity	: .7,
												cursor	: 'pointer'	
											});
						});
						$(this).bind('mouseout', function(){									
							$(this).css({	opacity: 1 });
						});
		});
	
	}


	if(is_mobile)
	{
		
		//INITIALIZE SMOOTH DIV SCROLL PLUGIN FOR MOBILE
		$("#thumbnailScroller").smoothDivScroll({	mousewheelScrolling: "allDirections",
													manualContinuousScrolling: true,
													startAtElementId: getThumbId(getId()),
													hotSpotScrolling: false,
													touchScrolling: true,
													autoScrollingMode: "" //""
											});
											
		//HIDE THE ADDRESS BAR IN IOS SAFARI
		window.addEventListener("load",function() {
   				
   				setTimeout(function(){
   			 		window.scrollTo(0, 0);
    			}, 0);
    	});	
    	
 							
	}
	else{
		//INITIALIZE SMOOTH DIV SCROLL PLUGIN FOR NON-MOBILE
		$("div#thumbnailScroller").smoothDivScroll({	mousewheelScrolling: "allDirections",
														manualContinuousScrolling: true,
														hotSpotScrolling: true,
														hotSpotScrollingInterval: 25, //default = 10, larger is slower
														startAtElementId: getThumbId(getId()),
														autoScrollingMode: ""
												});	
																				
		$("#thumbnailScroller img").each(function(){
								$(this).bind('mouseover', function(){									
									$(this).css({	opacity: .7,
													cursor: 'pointer'
												});
								});
								$(this).bind('mouseout', function(){									
									$(this).css({	opacity: 1,
												});
								});
						});
											
											
		/*************   SET THE MAX-WIDTH OF mainLayer  ********************/
		//max_main_layer_width (used in setMainLayerMaxWidth()) is a global set at the top if utility.js
		var max_main_layer_width = setMainLayerMaxWidth()
		
		
		// CONSTRAIN THE MAIN LAYER HEIGHT ON LOAD IF AT MAX WIDTH (1200PX IN CSS) OR LESS THAN MIN WIDTH (768PX IN CSS)
		var window_width 		= $(window).width();
		var main_layer_width 	= $('#mainLayer').width();
			
		
		if(main_layer_width == max_main_layer_width)
		{
			
			$('#mainLayer').css({	height 		: 670+'px',
									maxHeight	: 670+'px',
									paddingTop	: '0%'
							});
			
			
			//Center mainLayer
			if( $("body")[0].scrollHeight > $(window).height() )
			{
				var scroll_bar_width = getScrollBarWidth();
				$('#mainLayer').css({ marginLeft: (window_width + scroll_bar_width - main_layer_width)/2 });		
			}
			else{
				$('#mainLayer').css({ marginLeft: (window_width - main_layer_width)/2 });
			}
			
			
			
		}
		else if(main_layer_width < 692)
		{ 
			$('#mainLayer').css({	height 		: 385+'px',			// 385 was found experimentally
									minHeight	: 385+'px',
									paddingTop	: '0%'			
							});
		}
			
		
		// CONSTRAIN THE MAIN LAYER HEIGHT ON PAGE RESIZE
		$(window).resize(function(){
			
			var window_width 		= $(window).width();
			var main_layer_width 	= $('#mainLayer').width();


			if(main_layer_width < 692)
			{
				$('#mainLayer').css({	height 		: 385+'px',
										minHeight	: 385+'px',
										paddingTop	: '0%'			
								});
			}
			else if(main_layer_width >= 692 && main_layer_width < max_main_layer_width)
			{							
				//Center mainLayer
				if( $("body")[0].scrollHeight > $(window).height() ){
					var scroll_bar_width = getScrollBarWidth();
					$('#mainLayer').css({ marginLeft: (window_width + scroll_bar_width - main_layer_width)/2 });		
				}
				else{
					$('#mainLayer').css({ marginLeft: (window_width - main_layer_width)/2 });
				}
				
				$('#mainLayer').css({	height 		: '0%',
										minHeight	: '',
										maxHeight	: '',
										paddingTop	: '50%'
								});
			}
			else if(main_layer_width == max_main_layer_width)
			{

	
				//Center mainLayer
				if( $("body")[0].scrollHeight > $(window).height() ){
					var scroll_bar_width = getScrollBarWidth();
					$('#mainLayer').css({ marginLeft: (window_width + scroll_bar_width - main_layer_width)/2 });		
				}
				else{
					$('#mainLayer').css({ marginLeft: (window_width - main_layer_width)/2 });
				}
				
				
				$('#mainLayer').css({	height 		: 670+'px',
										maxHeight	: 670+'px',
										paddingTop	: '0%'
								});
			}
			
			//$("div#thumbnailScroller").recalculateScrollableArea();
		
		});


	}


												
});
/***************************************************************************************************/
//	function $(window).load()
//	Fires after $(document).ready(), when all image, video, etc. content has loaded.
//	NOTE: 	On Android, videoHeight and videoWidth are 0 after loadedmetadata  event fires.
//			So setting global default_video_width and default_video_height as a fallback/safety.
//			(This is a bug - they should be known prior to firing this event...?)
/***************************************************************************************************/
$(window).load(function() {		

	$('#video1').bind('loadedmetadata', function () {
        		video1_width 	= this.videoWidth;
        		video1_height 	= this.videoHeight;

console.log( 'window.load: video1: loadedmetadata : ht = ' + this.videoHeight );
console.log( 'window.load: video1: loadedmetadata : wd = ' + this.videoWidth );
    
    		});
    $('#video2').bind('loadedmetadata', function () {
        		video2_width 	= this.videoWidth;
        		video2_height 	= this.videoHeight;
        
    		});

	preLoad();

});


/***************************************************************************************************/
//	function preLoad()
/***************************************************************************************************/
function preLoad(){
	
	var time = 50;
	var wait = function(time){

		if(time > 0){	
			if(preloadedImages['fullview'].width == 0 || (preloadedImages['detail_1'] && preloadedImages['detail_1'].width == 0) || (preloadedImages['detail_2'] && preloadedImages['detail_2'].width == 0) ){
				time--;
				setTimeout(function(){wait(time);}, 100);
			}
			else 
				doPageSetup(pageAssets);
		}
		else{
			// PROCEED ANYWAY
			doPageSetup(pageAssets);
		}
	}
	
	if(preloadedImages['fullview'] == undefined || preloadedImages['fullview'].height == 0 ){
		preLoadImages();
		wait(time);
	}

}

/***************************************************************************************************/
//	function preLoadImages()
/***************************************************************************************************/
function preLoadImages()
{	
	pieceId = getId();
	docToGet = phpPath + 'getData.php?q='+ pieceId;	
	xmlDoc = loadXMLDoc(docToGet);
	pageAssets = $.xml2json(xmlDoc);

	//TEST FOR EXISTENCE OF DOM 'IMAGES' ARRAY THAT ALLOWS PRELOADING
	if(document.images) 
	{		
		var img1 						= new Image(); 
		img1.src 							= loResImagesPath + pageAssets['image1'];
		preloadedImages['fullview'] 	= img1;
	
		// STORE IMAGE DIMENSIONS INDEPENDENTLY FOR IE....IE CAN'T READ GLOBAL IMAGE DIMENSIONS CORRECTLY IN CHECKFADE()...?
		// IN ALL BROWSERS, GLOBAL IMAGE DIMENSIONS ARE CHANGED WHEN DYNAMICALLY RESIZING CONTAINING DIV...? BUT IN ALL BUT IE THEY RETURN 
		// TO ORIGINAL DIMENSIONS WHEN THE IMG IS FADED/DISPLAY=NONE...?		
		if (browser.name == 'msie'){
			preloadedImages['fullview_ie']				= {};
			preloadedImages['fullview_ie'].height	 	= img1.height;
			preloadedImages['fullview_ie'].width 		= img1.width;
		}
		
		if(!is_mobile){
			var img1Lg 							= new Image();
			img1Lg.src							= hiResImagesPath + pieceId + '.lg.jpg';
			preloadedLargeImages['fullview_lg'] = img1Lg;
		}
			
		if (pageAssets['image2'] == '')
			{} //DO NOTHING
		//If typeof pageAssets['image2'] == object,  pageAssets['image2'] is multidimensional array)
		else if (typeof pageAssets['image2'] === 'object')
		{		
			for(var i=0; i < pageAssets['image2'].length; i++)
			{
				var tempImg2 = new Image();
				tempImg2.src = loResImagesPath + pageAssets['image2'][i];
				
				//STORE TEMPIMG2 IN PRELOADEDIMAGES[]. ADD 1 TO I BECAUSE WE ALREADY ADDED AN IMAGE (IMG1) AT INDEX 0 
				var name_str = 'detail_' + (i + 1);
				
				preloadedImages[name_str] 					= tempImg2;	
				
				// WRITE IMAGE TO A HIDDEN DIV SO IMAGE DIMENSION CAN BE CALCULATED
				$(preloadedImages[name_str]).appendTo('#preload_image_container');
				
				// STORE IMAGE DIMENSIONS INDEPENDENTLY FOR IE....IE CAN'T READ GLOBAL IMAGE DIMENSIONS CORRECTLY IN CHECKFADE()...?
				if (browser.name == 'msie'){
					preloadedImages[name_str + '_ie']			= {};
					preloadedImages[name_str + '_ie'].height 	= tempImg2.height;
					preloadedImages[name_str + '_ie'].width 	= tempImg2.width;
				}
								
				
			}
			multipleDetailImages = true;
		}
		else if (typeof pageAssets['image2'] == 'string' && pageAssets['image2'].length > 0)
		{
			var img3 = new Image();
			img3.src = loResImagesPath + pageAssets['image2'];
			//preloadedImages[1] = img3; // Add at index 1 because we already added an image at index 0
			
			preloadedImages['detail_1'] 			= img3;
			
			// WRITE IMAGE TO A HIDDEN DIV SO IMAGE DIMENSION CAN BE CALCULATED
			$(preloadedImages['detail_1']).appendTo('#preload_image_container');
			
			// STORE IMAGE DIMENSIONS INDEPENDENTLY FOR IE....IE CAN'T READ GLOBAL IMAGE DIMENSIONS CORRECTLY IN CHECKFADE()...?
			if (browser.name == 'msie'){
				preloadedImages['detail_1_ie']			= {};
				preloadedImages['detail_1_ie'].height 	= img3.height;
				preloadedImages['detail_1_ie'].width 	= img3.width;
			}
		}
		
	}
}
/***************************************************************************************************/
//	function getId()
/***************************************************************************************************/
function getId(){
	var query = window.location.search;
	// SKIP THE LEADING ?, WHICH SHOULD ALWAYS BE THERE, BUT BE CAREFUL ANYWAY
	if (query.substring(0, 1) == '?') {
		query = query.substring(1);
		params = query.split('&');
	}
	
	return params[0];
}
/***************************************************************************************************/
//	function getThumbId()
/***************************************************************************************************/
function getThumbId(piece_id){
	
	var scrll_id_arr 	= [];
	var match_index		= 0;
	var scrll_strt_id 	= '';

	$('#thumbnailScroller div').each(function(i){
				var current_id 		= $(this).attr('id');
				scrll_id_arr[i] 	= current_id;								
				if(current_id == piece_id)
					match_index = i;		
			});
	
	if( match_index - 2 > 0){
		scrll_strt_id	= scrll_id_arr[match_index - 2];
	}
	else{
		// START POSITION DOES NOT WRAP...!!
		scrll_strt_id = 'StickItHollis';
	}
	
	return scrll_strt_id;
}
/***************************************************************************************************/
//	function getOption()
/***************************************************************************************************/
function getOption(){
	var query = window.location.search;
	// SKIP THE LEADING ?, WHICH SHOULD ALWAYS BE THERE, BUT BE CAREFUL ANYWAY
	if (query.substring(0, 1) == '?') {
		query = query.substring(1);
		params = query.split('&');
	}
	
	return params[1];
}

/***************************************************************************************************/
//	function doPageSetup()
/***************************************************************************************************/
function doPageSetup(pageAssets)
{		
	// STORE IMAGE DIMENSIONS INDEPENDENTLY FOR IE....IE CAN'T READ GLOBAL IMAGE DIMENSIONS CORRECTLY IN CHECKFADE()...?
	// IN ALL BROWSERS, GLOBAL IMAGE DIMENSIONS ARE CHANGED WHEN DYNAMICALLY RESIZING CONTAINING DIV...? BUT IN ALL BUT IE THEY RETURN 
	// TO ORIGINAL DIMENSIONS WHEN THE IMG IS FADED/DISPLAY=NONE...?
	for(i in preloadedImages){		
		if(browser.name == 'msie'){
			var name = i.split('_');
			if(name[1] === 'ie'){
				preloadedImages[i].width	= preloadedImages[name[0]].width;		
				preloadedImages[i].height	= preloadedImages[name[0]].height;
			}
			if(name[2] === 'ie'){
				preloadedImages[i].width	= preloadedImages[name[0] + '_' + name[1]].width;		
				preloadedImages[i].height	= preloadedImages[name[0] + '_' + name[1]].height;
			}
		}
	}	

	//SET THE TITLE OF THE PAGE
	document.title = pageAssets['title'];

	//set the title of the piece
	var pieceTitle 	= pageAssets['title'];
	var materials	= pageAssets['materials']+'<br/>'+ pageAssets['dimensions'];
	$('#titles').html(pieceTitle);
	$('#materials').html(materials);
	
	//Moving this to end of function...
	//$('#titlesContainer').css('visibility', 'visible').hide().fadeIn(fadeSpeed);

	//NEED TO GIVE THESE DIVS HEIGHT AND WIDTH BECAUSE THEY ARE INITIALLY EMPTY BEFORE IMAGE IS INSERTED.
	$('#image').css({		width: 	'100%', 
							height: '100%',
							top: '0%', 
							left: '0%', 
							textAlign: 'left'
					});

	///////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////  FULL VIEW IMAGE //////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////

	$(preloadedImages['fullview']).appendTo('#zoomSmallImage');
	$('#zoomSmallImage').fadeIn(fadeSpeed);
	
	var imageBlockHeight 	= parseInt($('#imageBlock').height());
	var imageBlockWidth  	= parseInt($('#imageBlock').width());
	var img_height			= parseInt(preloadedImages['fullview']['height']);
	var img_width			= parseInt(preloadedImages['fullview']['width']);

	setImageBlockWidth(preloadedImages['fullview']);

	// ALLOWS PROPORTIONAL SCALING OF IMAGE BASED ON MAXIMUM WIDTH
	$('#zoomSmallImage > img').css({	width: 'inherit',  		/* Make images fill their parent's space. Solves IE8. */
										maxWidth: '100%', 		/* Add !important if needed. */
										height: 'auto'	 		/* Add !important if needed. */
									});

	$('#zoomSmallImage').css({			width: '100%' });
	
	$('#fullButton').bind('click', checkFade);
	
	if(!is_mobile){
		$('#zoomEnableButton').show().click(function(){	
							enableZoom();	
						});
	}


	///////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////// IMAGE DETAIL //////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////

	if (preloadedImages['detail_1'])
	{
		$(preloadedImages['detail_1']).appendTo('#imageDetail');
						
		// ALLOWS PROPORTIONAL SCALING OF IMAGE BASED ON MAXIMUM WIDTH
		$('#imageDetail > img').css({	width: 'inherit',  		
										maxWidth: '100%', 
										height: 'auto' 
									});

		$('#detailButton').show();
		$('#detailButton').bind('click', checkFade);
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	/////////////////////// VIDEO (FLASH for IE8) /////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	if (browser.name == 'msie' && browser.version <= 8) 
	{
		if(pageAssets['video1'] != '')
		{
			//DO NOTHING FOR IE8
		}
	}
	else
	{ //ADD HTML5 VIDEO AND AUDIO ELEMENTS
	
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	/////////////////////// VIDEO 1 ///////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////
		if(pageAssets['video1'] != '')
		{

			/* ADD ALL THE DIFFERENT FILE FORMATS AS HTML5 VIDEO <SOURCE>'S */ 
			for(var i=0; i< pageAssets['video1'].length; i++)
			{		
				var video_type_arr = (pageAssets['video1'][i].split('.'));
				var video_type = video_type_arr[video_type_arr.length - 1];
				
				if(video_type == 'mov'){
					video_type = 'quicktime';
				}
				else if(video_type == 'ogv'){
					video_type = 'ogg';
				}
				
				$('<source/>', 
						{src: escape(videoPath + pieceId+'/'+ pageAssets['video1'][i]), type: 'video/' + video_type })
						.appendTo('#video1');
			}
			
			$('#video1').get(0).pause(); // hack for FF 12 with autoplay in video tag on to avoid ugly play button
			$('#video1Container').hide();		
			$('#videoButton').show();
			$('#videoButton').bind('click', checkFade);
			

			
		}
	
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	/////////////////////// VIDEO DETAIL //////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////

		if(pageAssets['video2'] !== '' && !is_mobile)
		{
			// ADD ALL THE DIFFERENT FILE FORMATS AS HTML5 VIDEO <SOURCE>'S 
			for(var i=0; i< pageAssets['video2'].length; i++)
			{		
				var video_type_arr = (pageAssets['video2'][i].split('.'));
				var video_type = video_type_arr[video_type_arr.length - 1];
				
				if(video_type == 'mov'){
					video_type = 'quicktime';
				}
				else if(video_type == 'ogv'){
					video_type = 'ogg';
				}
				
				
				$('<source/>', 
						{src: escape(videoPath + pieceId+'/'+ pageAssets['video2'][i]), type: 'video/' + video_type })
						.appendTo('#video2');
			}
			
			$('#video2Container').hide();
			$('#videoDetailButton').show();
			$('#videoDetailButton').bind('click', checkFade);
			
		}	
	
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	///////////////////////    AUDIO     //////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////

		if(pageAssets['sound1'] != '')
		{	
			//ADD ALL THE DIFFERENT FILE FORMATS AS HTML5 AUDIO <SOURCE>'S
			for(var i=0; i< pageAssets['sound1'].length; i++)
			{		
				var audio_type = (pageAssets['sound1'][i].split('.'))[1];
				if(audio_type == 'mp3'){
					audio_type = 'mpeg';
				}

				$('<source/>', 
						//{ src: escape(audioPath + pieceId+'/'+ pageAssets['sound1'][i]) })
						{ src: escape(audioPath + pieceId+'/'+ pageAssets['sound1'][i]), type: 'audio/' + audio_type })
						.appendTo('#audio');
			}
			
			$('#audioContainer').hide();
			$('#audioButton').show();
			$('#audioButton').bind('click', checkFade);
			
		}	
	
	
	} //END ELSE: ADD HTML5 VIDEO AND AUDIO ELEMENTS
	
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	///////////////////////    MOBILE    //////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////	

	// SET CSS FOR INITIAL ORIENTATION ON LOAD
	if(is_mobile)	
		updateOrientation();

	$('#titlesContainer').css('visibility', 'visible').hide().fadeIn(fadeSpeed);
	$("#linksBlock").css('visibility', 'visible').hide().fadeIn(fadeSpeed);
	$("#thumbnailScroller").css('visibility', 'visible').hide().fadeIn(fadeSpeed);
	
	
	$('#mainLayer').css({ visibility: 'visible' });

}// End doPageSetup()
