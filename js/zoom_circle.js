var browser = getBrowserVersion();

//ZOOMDISPLAY OBJECT DEFINITION/CONSTRUCTOR
function ZoomDisplay(imageDivEl, bigImage){

	this.eSmallImage 		= document.getElementById(imageDivEl);
	this.eBigImageCircle 	= document.getElementById('zoomBigImageCircle');
	this.eControlScreen 	= document.getElementById('zoomControlScreen');
	this.eLens 				= document.getElementById('zoomLens');
	this.eParentElement 	= this.eControlScreen.parentNode;

	this.eInnerRect 		= document.getElementById('innerRect');	
	
	this.smallImageWidth 	= null;  //determined in calculateSizes()
	this.smallImageHeight 	= null;  //determined in calculateSizes()
	
	this.cursor 			= {x:0, y:0};
	
	this.lensTop 			= null;
	this.lensLeft 			= null;
	this.lensHeight 		= null;
	this.lensWidth 			= null;
	
	//	THESE FOUR VAR'S ARE THE BOUNDS OF AN INTERIOR RECT (INSIDE SMALLIMAGE - SUBTRACT 1/2 LENSHEIGHT
	//  AND 1/2 LENSWIDTH FROM SMALLIMAGE DIMENSIONS) THAT ARE USED TO CONTROL LENS MOVEMENT.
	this.topY = null;
	this.bottomY = null;
	this.leftX = null;
	this.rightX = null;
	
	this.scaleFactor = null;

if (browser.name == 'msie' && browser.version <= 8) 
{
	$('#zoomControlScreen').css({cursor: 'crosshair'});
}
	
	//// DO THIS INSTEAD
	this.yOffset = 0;
	this.xOffset = 0;
		
	this.calculateSizes = function()     //(this. esmallImage, this.eBigImage, this.eMagnifiedView, this.eLens, this.eControlScreen)
	{
		this.bigImageWidth 		= bigImage.width;
		this.bigImageHeight 	= bigImage.height;	

		//Get the actual img dimensions (not the containg div - they are not always the same height and that throws off the mag view y offset calculation
		this.smallImageWidth 	= parseInt( $('#'+ this.eSmallImage.id + ' img').width() );
		this.smallImageHeight 	= parseInt( $('#'+ this.eSmallImage.id + ' img').height() );
		
		this.eControlScreen.style.height 	= this.smallImageHeight + 'px';
		this.eControlScreen.style.width 	= this.smallImageWidth + 'px';
		this.eControlScreen.style.top 		= this.yOffset + 'px';
		this.eControlScreen.style.left 		= this.xOffset + 'px';

		this.BigImageCircleWidth 	= parseInt( $('#'+ this.eBigImageCircle.id).css('width') );
		this.BigImageCircleHeight 	= parseInt( $('#'+ this.eBigImageCircle.id).css('height') );
				
	///////// PRE-SET/KNOWN VALUES ARE BIGIMAGE/SMALLIMAGE DIMENSIONS AND BIGIMAGECIRCLE DIMENSIONS   ///////////	
	
	///////////////////////////////////////////////////////////////////////////////////////////////////		
	////////  Dynamically create a square lens based on magnifiedView and bigImage height dimensions
	///////////////////////////////////////////////////////////////////////////////////////////////////
	/////// CRITICAL PROPORTION: this.magnifiedViewWidth/this.bigImageWidth = this.lensWidth/this.smallImageWidth
	///////////////////////////////////////////////////////////////////////////////////////////////////	
		this.lensWidth 			= Math.round( this.BigImageCircleWidth * this.smallImageWidth/this.bigImageWidth );			
//		this.lensWidth 			= Math.floor( this.BigImageCircleWidth * this.smallImageWidth/this.bigImageWidth );			

		this.lensHeight			= this.lensWidth;
		this.eLens.style.height = this.lensHeight + 'px';
		this.eLens.style.width 	= this.lensWidth + 'px';	
		
		//SCALE FACTOR IS USED IN SETLENSLOCATION() TO DETERMINE MAGNIFIEDVIEW LOCATION
		this.scaleFactor = this.bigImageHeight/this.smallImageHeight;
		
		//	THESE FOUR VAR'S ARE THE BOUNDS OF AN INTERIOR RECT (INSIDE SMALLIMAGE - SUBTRACT 1/2 LENSHEIGHT
		//  AND 1/2 LENSWIDTH FROM SMALLIMAGE DIMENSIONS) THAT ARE USED TO CONTROL LENS MOVEMENT.
		this.topY 		= this.yOffset + this.lensHeight/2;
		this.bottomY 	= this.yOffset + parseInt( $('#'+ this.eControlScreen.id).css('height')) - this.lensHeight/2;
		this.leftX 		= this.xOffset + this.lensWidth/2;
		this.rightX 	= this.xOffset + parseInt($('#'+ this.eControlScreen.id).css('width')) - this.lensWidth/2;

		
//////////////////////// Draw innerRect (for debugging/troubleshooting - requires getStyleObj() in utility.js )  //////////////////////////////////////////////////////////////
/*
//	this.eInnerRect.style.width = parseInt(getStyleObj(this.eSmallImage, "width")) - parseInt(getStyleObj(this.eLens, "width")) + 'px';
//	this.eInnerRect.style.height = parseInt(getStyleObj(this.eSmallImage, "height")) - parseInt(getStyleObj(this.eLens, "height")) + 'px';
	
	this.eInnerRect.style.width = this.smallImageWidth - this.lensWidth + 'px';
	this.eInnerRect.style.height = this.smallImageHeight - this.lensHeight + 'px';
	this.eInnerRect.style.top = this.topY + 'px';
	this.eInnerRect.style.left = this.leftX + 'px';
	this.eInnerRect.style.border= '1px solid red';
//*/
////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	} // end calculateSizes()
	
	this.setLensLocation = function(){

		//GET ABSOLUTE XY POSITION OF IMAGE/CONTROLSCREEN ON PAGE
		screenPositionXY = findPosition(this.eControlScreen);
		
		//CALCULATE THESE VARIABLES DYNAMICALLY SO RESIZING PAGE DOESN'T CAUSE ERRORS
		this.masterLeft = screenPositionXY[0];
		this.masterTop 	= screenPositionXY[1]; 
	
		if( ( (this.cursor.y - this.masterTop) >= this.topY && (this.cursor.y - this.masterTop) <= this.bottomY) 
				&& (this.cursor.x - this.masterLeft >= this.leftX && this.cursor.x - this.masterLeft <= this.rightX ) )
		{
			this.eLens.style.top  = (this.cursor.y - this.masterTop - this.lensHeight/2 ) + "px";
			this.eLens.style.left = (this.cursor.x - this.masterLeft - this.lensWidth/2 ) + "px";
		}
		else if( (this.cursor.y - this.masterTop) < this.topY ){
			this.eLens.style.top = (this.topY - this.lensHeight/2) + "px";
			if(this.cursor.x - this.masterLeft < this.leftX)
				this.eLens.style.left = (this.leftX - this.lensWidth/2) + "px";
			else if(this.cursor.x - this.masterLeft > this.rightX)
				this.eLens.style.left = (this.rightX - this.lensWidth/2) + "px";
			else
				this.eLens.style.left = (this.cursor.x - this.masterLeft - this.lensWidth/2) + "px";
		}
		else if( (this.cursor.y - this.masterTop) > this.bottomY ){
			this.eLens.style.top = (this.bottomY - this.lensHeight/2) + "px";
			if(this.cursor.x - this.masterLeft < this.leftX)
				this.eLens.style.left = (this.leftX - this.lensWidth/2) + "px";
			else if(this.cursor.x - this.masterLeft > this.rightX)
				this.eLens.style.left = (this.rightX - this.lensWidth/2) + "px";
			else
				this.eLens.style.left = (this.cursor.x - this.masterLeft - this.lensWidth/2 ) + "px";
		}
		else if( (this.cursor.x - this.masterLeft) < this.leftX ){
			this.eLens.style.top = (this.cursor.y - this.masterTop - this.lensHeight/2) + "px";
			this.eLens.style.left = (this.leftX - this.lensWidth/2) + "px";
		}
		else if( (this.cursor.x - this.masterLeft) > this.rightX){
			this.eLens.style.top = (this.cursor.y - this.masterTop - this.lensHeight/2)+ "px";
			this.eLens.style.left = (this.rightX - this.lensWidth/2 ) + "px";
		}	
	
		this.eLens.style.display = 'block';	
	}
	
	this.setMagViewLocation = function(){

		var screenPositionXY = findPosition(this.eControlScreen);
		
		//CALCULATE THESE VARIABLES DYNAMICALLY SO RESIZING PAGE DOESN'T CAUSE ERRORS
		this.masterLeft = screenPositionXY[0];
		this.masterTop 	= screenPositionXY[1]; ; //this.eParentElement.offsetTop;
	
		if( ( (this.cursor.y - this.masterTop) >= this.topY && (this.cursor.y - this.masterTop) <= this.bottomY) 
				&& (this.cursor.x - this.masterLeft >= this.leftX && this.cursor.x - this.masterLeft <= this.rightX ) )
		{
			this.eBigImageCircle.style.top = (this.cursor.y - this.masterTop - this.BigImageCircleHeight/2 ) + "px";
			this.eBigImageCircle.style.left = (this.cursor.x - this.masterLeft - this.BigImageCircleWidth/2 ) + "px";
		}
		else if( (this.cursor.y - this.masterTop) < this.topY ){
			this.eBigImageCircle.style.top = (this.topY - this.BigImageCircleHeight/2) + "px";
			if(this.cursor.x - this.masterLeft < this.leftX)
				this.eBigImageCircle.style.left = (this.leftX - this.BigImageCircleWidth/2) + "px";
			else if(this.cursor.x - this.masterLeft > this.rightX)
				this.eBigImageCircle.style.left = (this.rightX - this.BigImageCircleWidth/2) + "px";
			else
				this.eBigImageCircle.style.left = (this.cursor.x - this.masterLeft - this.BigImageCircleWidth/2) + "px";
		}
		else if( (this.cursor.y - this.masterTop) > this.bottomY ){
			this.eBigImageCircle.style.top = (this.bottomY - this.BigImageCircleHeight/2) + "px";
			if(this.cursor.x - this.masterLeft < this.leftX)
				this.eBigImageCircle.style.left = (this.leftX - this.BigImageCircleWidth/2) + "px";
			else if(this.cursor.x - this.masterLeft > this.rightX)
				this.eBigImageCircle.style.left = (this.rightX - this.BigImageCircleWidth/2) + "px";
			else
				this.eBigImageCircle.style.left = (this.cursor.x - this.masterLeft - this.BigImageCircleWidth/2 ) + "px";
		}
		else if( (this.cursor.x - this.masterLeft) < this.leftX ){
			this.eBigImageCircle.style.top = (this.cursor.y - this.masterTop - this.BigImageCircleHeight/2) + "px";
			this.eBigImageCircle.style.left = (this.leftX - this.BigImageCircleWidth/2) + "px";
		}
		else if( (this.cursor.x - this.masterLeft) > this.rightX){
			this.eBigImageCircle.style.top = (this.cursor.y - this.masterTop - this.BigImageCircleHeight/2)+ "px";
			this.eBigImageCircle.style.left = (this.rightX - this.BigImageCircleWidth/2 ) + "px";
		}	
	

//HACK TO ADJUST FOR 3 PIXEL DIFFERENCE BETWEEN zoomSmallImage DIV AND THE IMG WHEN USING CSS WIDTH = '100%', HEIGHT = 'auto'
//$('#' + this.eBigImageCircle.id).css({ top	: parseInt($('#' + this.eBigImageCircle.id).css('top')) + 5 } );

	
		this.eBigImageCircle.style.display = 'block';	
	}
	
	this.moveImage = function(){
		
		// USES LOCATION OF LENS SET IN SETLENSLOCATION(), BIGIMAGE MOVEMENT/DISPLAY IN MAGVIEW WINDOW IS THEN HANDLED 
		// CORRECTLY IN THE MARGIN (OUTSIDE OF INNERRECT)
		this.lensTop = parseInt( $('#' + this.eLens.id).css('top'));
		this.lensLeft = parseInt( $('#' + this.eLens.id).css('left'));
		
		var ypos = 0 - ((this.lensTop - this.yOffset)*this.scaleFactor);
		var xpos = 0 - ((this.lensLeft - this.xOffset)*this.scaleFactor);
				
		//MOVE THE LARGE IMAGE (BACKGROUND) WITHIN THE CIRCLE
		this.eBigImageCircle.style.backgroundPosition = xpos + "px " + ypos + "px"; //DON'T FORGET THE SPACE AFTER 'xpos + "px "' !!!
		
	}


//positionZoomElements() assumes parent element is a div containing just the image to be zoomed and, 
//therefore, has the same dimensions as the image. The parent element's (and image's) top and left dimensions
//will be the same for eSmallImage and eControlScreen. 
//This function is called right after creating a new zoom object in whatever js is doing page setup.
	this.positionZoomElements = function(){
		 
		this.calculateSizes();
		
		var top 						= parseInt( $('#' + this.eParentElement.id).css('top'));
		var left 						= parseInt( $('#' + this.eParentElement.id).css('left'));
		this.eSmallImage.style.top 		= top + 'px';
		this.eSmallImage.style.left 	= left + 'px';
		this.eControlScreen.style.top 	= top + 'px';
		this.eControlScreen.style.left 	= left + 'px';
		
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// Define event handler behavior //////////////////////////////////////	
////////////////////////////////////////////////////////////////////////////////////////////////	
	this.controlScreenMouseMove = function(e){
		this.cursor = getCursorPosition(e);
		this.setLensLocation();
		this.setMagViewLocation();
		this.moveImage();
		//printCursorPosition();
		e = null;
	}
	
 	this.removeLens = function(){
		this.eLens = document.getElementById('zoomLens');
		this.eLens.style.display = 'none';
	}
	
	this.removeMagView = function(){
		this.eBigImageCircle = document.getElementById('zoomBigImageCircle');
		this.eBigImageCircle.style.display = 'none';
	}
	
	//NOT USED (GETS CURSOR POSITION ON MASTER LAYER)
	this.masterCursor = function(e){
		getCursorPosition(e);
		//printCursorPosition();
		e = null;
	}

	// DO ALL SET-UP/INITIALIZATION....	
	this.positionZoomElements();
	this.calculateSizes(); 
	
	// ADD THE EVENT HANDLERS (AFTER DEFINING THEM!)
	var self = this; //TRANSFER ZOOM OBJECT REFERENCE...
	//...AND USE AN ANONYMOUS FUNCTION TO ACCESS ZOOM OBJECT'S 'CONTROLSCREENMOUSEMOVE' FUNCTION AFTER BELOW ASSIGNMENT
	this.eControlScreen.onmousemove = function()
	{	//IN THIS SCOPE: 'this' is now 'eControlScreen', so use 'self'
		//arguments[0] is the first(implicit?) argument passed to this anonymous function via the assignment (it is a MouseEvent object)
		//for FF: can't implicitly pass event in THIS SCOPE! Need to get it via arguments[0] and 
		//send it explicitly. '|| window.event' is for IE. (Safari, Chrome understand 'window.event' as well as arguments[0]???)
		var e = arguments[0] || window.event;    
		self.controlScreenMouseMove(e); 
		$('body').css('overflow', 'hidden');
	}
	this.eControlScreen.onmouseout = function(){
				self.removeLens(); 
				self.removeMagView();
				$('body').css('overflow', 'auto');
			}
	
	
}//END ZOOMDISPLAY OBJECT DEFINITION

function loadZoomImage(){

		if( parseInt( preloadedLargeImages['fullview_lg'].height ) )
		{	
			{
				//CONSRUCT ZOOM OBJ WITH IMAGE DIV ELEMENT AND BIG IMAGE
				var zoom_obj = new ZoomDisplay('zoomSmallImage', preloadedLargeImages['fullview_lg']); 
				
				//SET THE PATH TO THE BIG IMAGE TO BE SHOWN IN THE ZOOM CIRCLE
				var zoomBigImageCircle = document.getElementById('zoomBigImageCircle');
				zoomBigImageCircle.style.backgroundImage = 'url('+ hiResImagesPath + pageAssets['id'] + '.lg.jpg)';
			}
			imageLoaded = true;
		}
		
	return zoom_obj;	
}

// UTILITY FUNCTION
function findPosition(obj) {
	var curleft = curtop = 0;
	
	if (obj.offsetParent) 
	{
		do 
		{
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}	
	return [curleft,curtop];
}