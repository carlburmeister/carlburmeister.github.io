//////////////////////////////////////////////////////////////////////////////////////////////////
///  UTILITY FUNCTIONS
//////////////////////////////////////////////////////////////////////////////////////////////////

//NOTE: imageDetailCount IS GLOBAL VAR, USED TO SELECT NEXT DETAIL IMAGE IN exchangeImage()
var imageDetailCount = 1;
var max_main_layer_width	= 1200;

//////////////////////////////////////////////////////////////////////////////////////////////////

function sendData(id, option)
	{
		var browser = getBrowserVersion();		
		
		if (browser.name == 'msie' && browser.version < 8){
			if(option === 'from_index')
				window.location="html/CarlBurmeister.ie.html?" + id;
			 else 
				window.location="CarlBurmeister.ie.html?" + id;
		}
		else{
			if(option === 'from_index')
				window.location="html/CarlBurmeister.html?" + id;
			 else 
				window.location="CarlBurmeister.html?" + id;
			
		}
	}
	
//////////////////////////////////////////////////////////////////////////////////////////////////

//BROWSER DETECTION FROM JAVASCRIPT, THE DEFINITIVE GUIDE (DAVID FLANNAGAN)
function getBrowserVersion(){
		var s = navigator.userAgent.toLowerCase();
		var match = /(webkit)[ \/]([\w.]+)/.exec(s) || 
				/(opera)(?:.*version)?[ \/]([\w.]+)/.exec(s) ||
				/(msie) ([\w.]+)/.exec(s) ||
				!/compatible/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
				[];
			return { name: match[1] || "", version: match[2] || "0"};
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function checkFade()   //eid is the name of clicked element to be faded in 
{

////////////////////		fullButton		////////////////////////////////////////////////
	if( $(this).attr('id') == 'fullButton' ){
		$('.fadeable').each(function(){
						if($(this).attr('id') != 'image')
							if( $(this).attr('id') == 'audioContainer' )
								$(this).fadeOut(fadeSpeed);
							else 
								$(this).hide();
						});	
		pausePlayMedia($(this).attr('id'));

		if( !$('#image').is(':visible') ){		
			if (browser.name == 'msie'){
				setImageBlockWidth(preloadedImages['fullview_ie']);
			}
			else 
				setImageBlockWidth(preloadedImages['fullview']);
		}
		
		$('#image').fadeIn(fadeSpeed); 
		$('#detailButton').html('Detail View').unbind('click').bind('click', checkFade );
		if(!is_mobile)
			$('#zoomEnableButton').fadeIn(fadeSpeed);
	}
////////////////////		detailButton		////////////////////////////////////////////////
	else if( $(this).attr('id') == 'detailButton' ){
		$('.fadeable').each(function(){
						if($(this).attr('id') != 'imageDetail')
							if( $(this).attr('id') == 'audioContainer' )
								$(this).fadeOut(fadeSpeed);
							else 
								$(this).hide();
						});
		pausePlayMedia($(this).attr('id'));	
		if (typeof pageAssets['image2'] === 'object'){
			getNextImage();
			if(imageDetailCount > 1)
				$('#detailButton').html('Next Detail').unbind('click').bind('click', getNextImage );	
		}
		else{	
			if( !$('#imageDetail').is(':visible') ){	
				if (browser.name == 'msie'){
					setImageBlockWidth(preloadedImages['detail_1_ie']);
				}
				else 
					setImageBlockWidth(preloadedImages['detail_1']);
				 
				$('#imageDetail').fadeIn(fadeSpeed);
			}	
		}
		
		disableZoom();
		if($('#zoomEnableButton').is(':visible') )
			$('#zoomEnableButton').fadeOut(fadeSpeed);
		
	}	
////////////////////		videoButton		////////////////////////////////////////////////
	else if( $(this).attr('id') == 'videoButton' ){
		$('.fadeable').each(function(){
						if( $(this).attr('id') != 'video1Container' )
							if( $(this).attr('id') == 'audioContainer' )
								$(this).fadeOut(fadeSpeed);
							else 
								$(this).hide();
						});
		
		pausePlayMedia($(this).attr('id'));
		
		if( !$('#video1Container').is(':visible') )
			setImageBlockWidth( $('#video1').get(0) );
		
		$('#video1Container').fadeIn(fadeSpeed);


		$('#detailButton').html('Detail View').unbind('click').bind('click', checkFade );
		disableZoom();
		if($('#zoomEnableButton').is(':visible') )
			$('#zoomEnableButton').fadeOut(fadeSpeed);
	}
////////////////////		videoDetailButton		////////////////////////////////////////////////	
	else if( $(this).attr('id') == 'videoDetailButton' ){
		$('.fadeable').each(function(){
						if( $(this).attr('id') != 'video2Container' )
							if( $(this).attr('id') == 'audioContainer' )
								$(this).fadeOut(fadeSpeed);
							else 
								$(this).hide();
						});		
		pausePlayMedia($(this).attr('id'));

		if( !$('#video2Container').is(':visible') )	
			setImageBlockWidth( $('#video2').get(0) );
		$('#video2Container').fadeIn(fadeSpeed);
		
		$('#detailButton').html('Detail View').unbind('click').bind('click', checkFade );
		disableZoom();
		if($('#zoomEnableButton').is(':visible') )
			$('#zoomEnableButton').fadeOut(fadeSpeed);
	}
////////////////////		audioButton		////////////////////////////////////////////////		
	else if( $(this).attr('id') == 'audioButton' ){
		$('.fadeable').each(function(){
						if( $(this).attr('id') != 'image' && $(this).attr('id') != 'audioContainer' )
							if( $(this).attr('id') == 'audioContainer' )
								$(this).fadeOut(fadeSpeed);
							else 
								$(this).hide();
						});	
		pausePlayMedia($(this).attr('id'));

		$('#audioContainer').fadeIn(fadeSpeed);
		if( !$('#audioContainer').is(':visible') || !$('#image').is(':visible') )	
			setImageBlockWidth(preloadedImages['fullview']);
		$('#image').fadeIn(fadeSpeed);
		$('#detailButton').html('Detail View').unbind('click').bind('click', checkFade );
		if(!is_mobile)
			$('#zoomEnableButton').fadeIn(fadeSpeed);
	}

}

//////////////////////////////////////////////////////////////////////////////////////////////////

function getNextImage()
{	
	$('#imageDetail').hide().css({display: 'none'}).children('img:first').remove();
	
	var name_str = 'detail_' + imageDetailCount;
	$(preloadedImages[name_str]).appendTo('#imageDetail');
	
	var img_det_height			= parseInt(preloadedImages[name_str]['height']);
	var img_det_width			= parseInt(preloadedImages[name_str]['width']);
	var imageBlockHeight		= parseInt($('#imageBlock').outerHeight());
	
	
	// RESET IMAGEBLOCK WIDTH/HEIGHT
	if (browser.name == 'msie')
		setImageBlockWidth(preloadedImages[name_str + '_ie']);
	else 
		setImageBlockWidth(preloadedImages[name_str]);
	
		
	// ALLOWS PROPORTIONAL SCALING OF IMAGE BASED ON MAXIMUM WIDTH
	$('#imageDetail > img').css({	width: 'inherit',  
									maxWidth: '100%', 	
									height: 'auto' 	
							});
	
	$('#imageDetail').fadeIn(fadeSpeed);

	//IF WE HAVE GOTTEN TO THE LAST IMAGEDETAIL, RESET TO THE FIRST IMAGEDETAIL INDEX
	// imageDetailCount IS GLOBAL VAR, USED TO SELECT NEXT DETAIL IMAGE IN exchangeImage()
	if (imageDetailCount == pageAssets['image2'].length){
		imageDetailCount = 1;		
	}
	//else progress through imageDetail array (imageDetailCount is used in exchangeImage())
	else 
		imageDetailCount++;

}

//////////////////////////////////////////////////////////////////////////////////////////////////

function pausePlayMedia(id){

	if (browser.name == 'msie' && browser.version <= 8) 
	{
		//DO SOMETHING FOR IE 8 AND LESS
	}
	else
	{
		if (id == 'videoButton'){
			$('.pauseable').each(function(){
							if( $(this).attr('id') != 'video1')	
								$(this).get(0).pause()}
							);
			$('#video1').get(0).play();
		}
		else if(id == 'videoDetailButton'){
			$('.pauseable').each(function(){
							if( $(this).attr('id') != 'video2')	
								$(this).get(0).pause()}
							);
			$('#video2').get(0).play();
		}
		else if(id == 'audioButton'){
			$('.pauseable').each(function(){
							if( $(this).attr('id') != 'audio')	
								$(this).get(0).pause()}
							);	
			$('#audio').get(0).play();
		}
		else{
			$('.pauseable').each(function(){
								$(this).get(0).pause()}
							);
		}
			
	} // End else !IE8	
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function enableZoom(){

	if(!is_mobile){
		$('#zoomEnableButton').fadeIn(fadeSpeed).html('Disable Zoom').unbind('click').bind('click', disableZoom );
		
		$('#zoomControlScreen').css({	 zIndex: 1000 });
		
//TO DO: DON'T WANT TO CREATE NEW OBJECT ON EVERY CALL TO enableZoom()...?		
			var zoom_obj = loadZoomImage();
			$(window).resize(function(){
								var img_height			= parseInt(preloadedImages['fullview']['height']);
								var img_width			= parseInt(preloadedImages['fullview']['width']);
		
								if(img_height < img_width){
									$('#zoomSmallImage').css({	width: '100%' });
								}
								else{
									//$('#zoomSmallImage').css({	width: parseInt($('#zoomSmallImage > img').width()) + 'px' });
								}
								
								zoom_obj.positionZoomElements();
			});
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function disableZoom(){

	if(!is_mobile){	
		$('#zoomEnableButton').html('Enable Zoom').unbind('click').bind('click', enableZoom);
		$('#zoomControlScreen').css({	 zIndex: -1000 });
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function setImageBlockWidth(el){

	if(is_mobile){
		setImageBlockWidthMobile(el);
		//Reset lower page elements on mobile 
		var img_blk_ht	= $('#imageBlock').outerHeight(true);
		setLowerElements(window.orientation, img_blk_ht);
		return;
	}
	
	var new_img_blk_ht	= 0;
	var new_img_blk_wd 	= 0;

	if( el.videoHeight !== undefined ){
		
		//Use global defaults if videoHeight and videoWidth are not known vie the video.loadmetadata event (see video section in doPageSetup()).
		if(el.videoHeight == 0){
			new_img_blk_ht				= default_video_height;
			new_img_blk_wd				= default_video_width;
		}
		else{	
			new_img_blk_ht				= el.videoHeight;
			new_img_blk_wd				= el.videoWidth;
		}
	}
	else{
		new_img_blk_ht				= parseInt(el['height']);
		new_img_blk_wd				= parseInt(el['width']);
	}
	
	var imageBlockHeight		= parseInt($('#imageBlock').height());
	var imageBlockWidth			= parseInt($('#imageBlock').width());
	

	var x						= $('#mainLayer').width() * .73;
	
	var scale					= ((new_img_blk_ht - imageBlockHeight)/new_img_blk_ht -1) * -1;
	var width_trgt				= new_img_blk_wd * scale;
	
	if(is_mobile)
		var img_blk_wd_perc_trgt	= (width_trgt/x) * 100;
	else 
		var img_blk_wd_perc_trgt	= (width_trgt/x) * 100 * .73;
	

	//$('#imageBlock').css({ 	width: img_blk_wd_perc_trgt + '%', height: '100%'	});
	//$('#imageBlock').css({ 	width: img_blk_wd_perc_trgt + '%', height: 'auto'	});
	$('#imageBlock').css({ 	width: img_blk_wd_perc_trgt + '%'	});

}

//////////////////////////////////////////////////////////////////////////////////////////////////
function setImageBlockWidthMobile(el){
	
	var new_img_blk_ht				= 0;
	var new_img_blk_wd 				= 0;

	if( el.videoHeight !== undefined ){

//console.log('In setImageBlockWidthMobile():: el.videoHeight = ' + el.videoHeight + ', el.videoWidth = ' + el.videoWidth );
//console.log('In setImageBlockWidthMobile():: video1_height = ' + video1_height + ', video1_width = ' + video1_height );	
		
		//Use global defaults if videoHeight and videoWidth are not known vie the video.loadmetadata event (see video section in doPageSetup()).
		if(el.videoHeight == 0){
			new_img_blk_ht		= default_video_height;
			new_img_blk_wd		= default_video_width;
		}
		else{	
			new_img_blk_ht		= el.videoHeight;
			new_img_blk_wd		= el.videoWidth;
		}
	}
	else{
		new_img_blk_ht		= parseInt(el.height);
		new_img_blk_wd		= parseInt(el.width);
		
	}
		
	var img_aspect_ratio		= new_img_blk_wd/new_img_blk_ht;
	
	var imageBlockHeight	= parseInt($('#imageBlock').height());
	var imageBlockWidth		= parseInt($('#imageBlock').width());
	
	var window_height 		= $(window).height();
	var window_width 		= $(window).width();
	

	if(new_img_blk_wd > new_img_blk_ht){ 
		
		if(	new_img_blk_wd >= window_width){
			//$('#imageBlock').css({ 	width: '95%', height: 'auto', left: '2.5%' });
			var new_img_wd	= (window_width * .95);
			var new_img_ht	= new_img_wd * new_img_blk_ht/new_img_blk_wd;
			$('#imageBlock').css({ 	width: new_img_wd, height: new_img_ht, left: (window_width - new_img_wd)/2 });
		}
		else{ 
			
			if(new_img_blk_ht > imageBlockHeight){
				var new_img_ht	= imageBlockHeight;
				var new_img_wd	= new_img_blk_wd * new_img_ht/new_img_blk_ht;
				
				$('#imageBlock').css({ 	width: new_img_wd, height: new_img_ht, left: (window_width - new_img_wd)/2 });

			}
			else{
				var scale = .95;
				var new_img_wd	= (window_width * scale);
				var new_img_ht	= new_img_wd * new_img_blk_ht/new_img_blk_wd;
				
				while(new_img_ht > imageBlockHeight){
					scale -= .05;
					new_img_wd	= (window_width * scale);
					new_img_ht	= new_img_wd * new_img_blk_ht/new_img_blk_wd;
				}
				
				
				//$('#imageBlock').css({ 	width: new_img_blk_wd, height: new_img_blk_ht, left: (window_width - new_img_blk_wd)/2 });
				$('#imageBlock').css({ 	width: new_img_wd, height: new_img_ht, left: (window_width - new_img_wd)/2 });
			}
		}	
	}
	else{	
		//var new_img_ht	= (window_width * .50) * new_img_blk_ht/new_img_blk_wd;
		//$('#imageBlock').css({ 	width: '50%', height: new_img_ht, left: '25%' });

		/* Cover case where img is wider than device width (e.g. on iphone where device width is 320px */
		if( parseInt(el.width) > .95 * window_width ){
			new_img_blk_wd = .95 * window_width;
			/* And scale the height accordingly */
			new_img_blk_ht = el.height * (.95 * window_width/el.width);

//console.log('< IMG WIDTH: window_width:'+ window_width + ' new_img_blk_wd:' + new_img_blk_wd);
//console.log('< IMG WIDTH: width:'+ new_img_blk_wd + ' height:' + new_img_blk_ht + ' left:'+ (window_width - new_img_blk_wd)/2 );			
			$('#imageBlock').css({ 	width: new_img_blk_wd, height: new_img_blk_ht, left: '2.5%' });
		}
		else{

//console.log('window_width:'+ window_width + ' new_img_blk_wd:' + new_img_blk_wd);
//console.log('width:'+ new_img_blk_wd + ' height:' + new_img_blk_ht + ' left:'+ (window_width - new_img_blk_wd)/2 );
			$('#imageBlock').css({ 	width: new_img_blk_wd, height: new_img_blk_ht, left: (window_width - new_img_blk_wd)/2 });
		}
	}

}


//////////////////////////////////////////////////////////////////////////////////////////////////
function updateOrientation(){

	var el = '';
	var el_str = getCurrentVisibleElement();
	if(el_str.split('_')[0] === 'detail')
		el = 'detail';
	else 
		el = el_str;

	
	var window_height = $(window).height();
	var window_width = $(window).width();
	var imageBlockHeight = $('#imageBlock').height();
	
//console.log('window_width = ' + window_width + ', window_height = ' + window_height + ', imageBlockHeight = ' + imageBlockHeight );		
	
	switch(window.orientation)
	{	
		case 0:
//console.log('case 0 : device height = ' + $(window).height() );
		
			$('#mainLayer').css({	height	:  window_height });
			$('body').css({ fontSize	: '150%' });
			
			switch(el){
				case 'fullview':
					setImageBlockWidth(preloadedImages['fullview']);
					break;
				case 'detail':
					setImageBlockWidth(preloadedImages[el_str]);
					break;
				case 'video1':
					setImageBlockWidth( $('#video1').get(0) );
					break;
				case 'video2':
					setImageBlockWidth( $('#video2').get(0) );
					break;
				default:
					break;
			}
		setLowerElements(window.orientation);		
		break;

		
		case -90:

			$('#mainLayer').css({	height	:  window_height });

			switch(el){
				case 'fullview':
					setImageBlockWidth(preloadedImages['fullview']);
					break;
				case 'detail':
					setImageBlockWidth(preloadedImages[el_str]);
					break;
				case 'video1':
					setImageBlockWidth( $('#video1').get(0) );
					break;
				case 'video2':
					setImageBlockWidth( $('#video2').get(0) );
					break;
				default:
					break;	
			}

		var img_blk_ht	= $('#imageBlock').outerHeight(true);
		setLowerElements(window.orientation, img_blk_ht);	
		break;
		
		case 90:

			$('#mainLayer').css({	height	:  window_height });			
			
			switch(el){
				case 'fullview':
					setImageBlockWidth(preloadedImages['fullview']);
					break;
				case 'detail':
					setImageBlockWidth(preloadedImages[el_str]);
					break;
				case 'video1':
					setImageBlockWidth( $('#video1').get(0) );
					break;
				case 'video2':
					setImageBlockWidth( $('#video2').get(0) );
					break;
				default:
					break;
			}
		var img_blk_ht	= $('#imageBlock').outerHeight(true);
		setLowerElements(window.orientation, img_blk_ht);	
		break;
		
		case 180:		
			$('#mainLayer').css({	height	:  window_height });
			$('body').css({ fontSize	: '150%' });
			
			switch(el){
				case 'fullview':
					setImageBlockWidth(preloadedImages['fullview']);
					break;
				case 'detail':
					setImageBlockWidth(preloadedImages[el_str]);
					break;
				case 'video1':
					setImageBlockWidth( $('#video1').get(0) );
					break;
				case 'video2':
					setImageBlockWidth( $('#video2').get(0) );
					break;
				default:
					break;	
			}
		setLowerElements(window.orientation);
		break;
	}


}

//////////////////////////////////////////////////////////////////////////////////////////////////
function setLowerElements(orientation, img_blk_ht){

	var window_height 			= $(window).height();

	var nav_ht					= parseInt($('#navigationBlock').height());
	if(img_blk_ht == undefined)
		var img_blk_ht			= $('#imageBlock').outerHeight(true);
	var upper_area_ht			= img_blk_ht + nav_ht;
	var links_ht				= parseInt($('#linksBlock').height());
	var titles_ht				= parseInt($('#titlesContainer').height());

		
	if( orientation == 90 || orientation == -90 ){
		if( $('#titlesContainer').is(':visible') )
		{
			$('#titlesContainer').css({ top: upper_area_ht + (window_height*.04) });
			var titles_offset_top = $('#titlesContainer').offset().top;
			$('#linksBlock').css({ top: titles_offset_top + titles_ht + (window_height*.04) });
			var links_offset_top = $('#linksBlock').offset().top;
			$('#thumbnailScroller').css({	top : links_offset_top + links_ht + (window_height*.15) });	
		}
	}
	else{
		if( $('#titlesContainer').is(':visible') )
		{
			$('#titlesContainer').css({ top: upper_area_ht + (window_height*.03) });
			var titles_offset_top = $('#titlesContainer').offset().top;
			$('#linksBlock').css({ top: titles_offset_top + titles_ht + (window_height*.03) });
			var links_offset_top = $('#linksBlock').offset().top;
			$('#thumbnailScroller').css({	top : links_offset_top + links_ht + (window_height*.06) });
		}
	}
		
}


//////////////////////////////////////////////////////////////////////////////////////////////////
function getCurrentVisibleElement(){
	
	var ret_str = '';
	
	$('#imageBlock div').each(function(i,v){
				
		if( $(v).is(':visible'))
		{
			var v_child = $(v).children()[0];
			
			if(v_child !== undefined)
			{
				if($(v_child).attr('src') !== undefined ){
					console.log('\tv.id = '+ v.id +' : v[0]=' + v_child);
					switch (v.id)
					{
						case 'zoomSmallImage':
							ret_str = 'fullview';
							break;
						case 'imageDetail':
							var src_arr = $(v_child).attr('src').split('/');
							var file_name_arr = src_arr[src_arr.length - 1].split('.');
							if(file_name_arr[1] === 'detail'){
								console.log('detail#= ' + file_name_arr[1] + file_name_arr[2]);
								ret_str = file_name_arr[1] + '_' +  file_name_arr[2];
							}
							break;
					}

				}
				else if($($(v_child).children()[0]).attr('src') !== undefined ){
					console.log('\tNO SRC(VIDEO):: v.id = '+ v.id +' : v[0][0]=' + $(v_child).children()[0]);
					if(v.id === 'video1Container')
						ret_str = 'video1';
					else if(v.id === 'video2Container')	
						ret_str = 'video2';
				}
			}	
		}
	});
	
	return ret_str;
	
}
//////////////////////////////////////////////////////////////////////////////////////////////////
function centerObjVertical(obj){
	//THIS FUNCTION TAKES A JQUERY OBJECT AS AN ARGUMENT

	var parent 			= $(obj).parent();
	var parentHeight 	= parseInt(parent.css('height'));
	var objHeight 		= parseInt(obj.css('height'));
	var topOffset		= (parentHeight - objHeight)/2;
	
	obj.css({top: topOffset});

}

//////////////////////////////////////////////////////////////////////////////////////////////////
function centerObjHorizontal(obj){
	//THIS FUNCTION TAKES A JQUERY OBJECT AS AN ARGUMENT
	
	var parent 			= $(obj).parent();
	var parentWidth 	= parseInt(parent.css('width'));
	var objWidth		= parseInt(obj.css('width'));
	var leftOffset 		= (parentWidth - objWidth)/2;
		
	obj.css({left: leftOffset});
		
}
//////////////////////////////////////////////////////////////////////////////////////////////////
function setMainLayerMaxWidth(){
	
	//max_main_layer_width is a global set at the top if utility.js
	$('#mainLayer').css({ maxWidth: max_main_layer_width });
	return max_main_layer_width;
}
//////////////////////////////////////////////////////////////////////////////////////////////////
function centerMainLayerOnPage(){
	
	var window_width 		= $(window).width();
	var main_layer_width 	= $('#mainLayer').width();
		
	if( $("body")[0].scrollHeight > $(window).height() )
	{
		var scroll_bar_width = getScrollBarWidth();	
		$('#mainLayer').css({ marginLeft: (window_width + scroll_bar_width - main_layer_width)/2 });		
	}
	else{
		$('#mainLayer').css({ marginLeft: (window_width - main_layer_width)/2 });
	}
	$(window).resize( function(){
		var window_width 		= $(window).width();
		var main_layer_width 	= $('#mainLayer').width();

		if( $("body")[0].scrollHeight > $(window).height() ){
			var scroll_bar_width = getScrollBarWidth();
			$('#mainLayer').css({ marginLeft: (window_width + scroll_bar_width - main_layer_width)/2 });		
		}
		else{
			$('#mainLayer').css({ marginLeft: (window_width - main_layer_width)/2 });
		}
	});
	
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//	http://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
//////////////////////////////////////////////////////////////////////////////////////////////////
function getScrollBarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}


//////////////////////////////////////////////////////////////////////////////////////////////////
function pauseMiliseconds(millis) 
{
	var date = new Date();
	var curDate = null;

	do { 
		curDate = new Date(); 
	} while(curDate-date < millis);
} 

//////////////////////////////////////////////////////////////////////////////////////////////////
//GETS CURSOR POSITION FOR IE AND OTHER BROWSERS
function getCursorPosition(e) { 
	cursor = {x:0, y:0}; //keep these global so they can be referenced in printCursorPosition()

    if (!e) var e = window.event;
      
    if (e.pageX || e.pageY) {  			//Safari, Chrome
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    } 
    else {
        var de = document.documentElement;
        var b = document.body;
        cursor.x = e.clientX + 
            (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        cursor.y = e.clientY + 
            (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
    return cursor;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function getStyleEl(el,styleProp)
{	
	var x = document.getElementById(el);
	
	if (x.currentStyle)    // for IE
	{
		var y = x.currentStyle[styleProp];
	}	
	
	else if (window.getComputedStyle)		//for Mozilla, Opera, Safari(?)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	
	return y;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//DOESN'T ALWAYS WORK!!!!! USE getStyleEl() instead!!
function getStyleObj(obj, cAttribute) {

    if (obj.currentStyle) 
    {
        this.getStyle = function (obj, cAttribute) {
        	return obj.currentStyle[cAttribute];
        };
    } 
    else 
    { 
        this.getStyle = function (obj, cAttribute) {
        	return document.defaultView.getComputedStyle(obj, null)[cAttribute];
        };
    }
    return getStyle(obj, cAttribute);
}
