
var ua = navigator.userAgent.toLowerCase();


var os = {
	ios: ua.indexOf("ipod") > -1 || ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1,
	android: ua.indexOf("android") > -1 || ua.indexOf("silk") > -1,
	androidHLS: ua.indexOf("android 3") > -1 || ua.indexOf("android 4") > -1 || ua.indexOf("armv7l") > -1,
	androidPhone: ua.indexOf("mobile") > -1,
	
	//IE11 ua string does not contain 'msie'. See getIEVersion();
	//ie: ua.indexOf("msie") > -1,
	
	ie_mobile: ua.indexOf("iemobile") > -1
	
}

var mobile_os = false;
if(os.ios || os.android || os.ie_mobile)
	var mobile_os = true;



if(os.ios)
	os.ios_ver = Number(getiOSVersion(ua));
if(os.android)
	os.android_ver = Number(getAndroidVersion(ua));

//Always run check for IE
os.ie_ver = getIEVersion();
if(os.ie_ver > 0)
	os.ie = 1;

//console.log('ie_ver = ' + os.ie_ver);

var is_touch_device = is_touch_device();
//alert('In OSCheck.js : is_touch_device = ' + is_touch_device);


function is_touch_device() {
 	return 'ontouchstart' in window // works on most browsers 
		|| 'onmsgesturechange' in window; // works on ie10

};
		
function getiOSVersion(ua)
{
	var ver 	= '';
	var ua_index = ua.indexOf( 'os ' );
	
	ver = ua.substr( ua_index + 3, 3 ).replace( '_', '.' );
	
	return ver;
}
function getAndroidVersion(ua)
{
	var ver 	= '';
	var ua_index = ua.indexOf( 'android ' );
	
	ver = ua.substr( ua_index + 8, 3 );
	
	return ver;
}


function getIEVersion(ua)
{
  var rv = -1;
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  else if (navigator.appName == 'Netscape')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

function getIEVersion_OLD(ua){
	
	var ver 	= '';
	var ua_index = ua.indexOf( 'msie ' );
	
	ver = ua.substr( ua_index + 5, 3 );
	
	return ver;
}