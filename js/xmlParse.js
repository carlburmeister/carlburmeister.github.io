////////////  SAMPLE USAGE  ///////////////////////////
/*
	xmlDoc = loadXMLDoc("books.xml");	
	
	//Load .xml file (w/ header!! -- beware of 'encoding=') and strip any newlines and tabs
	// use this if doc is is in 'standard' indented format with xml header: <?xml version="1.0"?>
	//DON'T USE THIS for xml strings
	xmlString = XMLDocToString(xmlDoc);	 
	
	//USE THIS for xml strings
	//loads xmlString into browser's XML parser
	xmlStringAsDoc = loadXMLString(xmlString); //load xmlString into browser's XML parser
	
	xmlToArray(xmlStringAsDoc);  //store xml doc in multidemensional array
*/

//TESTING FOR IE.... USAGE: 'IF (IE){...}', ETC.
var ie = (function(){
 
    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
 
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
 
    return v > 4 ? v : undef;
 
}());

function dump(arr,level) 
{
	var dumped_text = "";
	if(!level) level = 0;
	
	//THE PADDING GIVEN AT THE BEGINNING OF THE LINE.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') 
	{ //ARRAY/HASHES/OBJECTS
		for(var item in arr) 
		{
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} 
			else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
	  		}
		}
	} 
	else { //STINGS/CHARS/NUMBERS ETC.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
} 

function loadXMLDoc(dname)
{	
	if (window.XMLHttpRequest)
	  {
		var xhttp = new XMLHttpRequest();
	  }
	else
	  {
		var xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	  }
	  
	 xhttp.onreadystatechange=function() {
		if (xhttp.readyState==4) {
			//alert('In loadXMLDoc: xhttp.responseText = ' + xhttp.responseText);
			//alert('In loadXMLDoc: xhttp.responseXML = ' + xhttp.responseXML)
		}
	 }
	
	xhttp.open("GET", dname, false);
	xhttp.send();
	
	//return xhttp.responseXML;  //RETURNS A DOCUMENT OBJECT IF 'DNAME' IS A .XML FILE
	return xhttp.responseText;   //RETURN THIS FOR XML STRINGS (SUCH AS DYNAMICALLY CREATED WITH PHP)
}

function XMLDocToString(xmlDocObject)
{
	if(ie) //if IE (see browser detection function which is auto called at top)
	{
		var xmlString = xmlDocObject.xml;
		
		//STRIP NEWLINES AND TABS
		//xmlString = xmlString.replace(/\s+|\s+/g, ''); //REMOVES ALL WHITESPACES IN DOC
		var xmlString = xmlString.replace(/\n/g, '');
		var xmlString = xmlString.replace(/\t/g, '');
		
		return xmlString;
	}
	else //not IE
	{
		var xmlString = (new XMLSerializer()).serializeToString(xmlDocObject);
		
		//strip newlines and tabs
		//xmlString = xmlString.replace(/\s+|\s+/g, ''); //REMOVES ALL WHITESPACES IN DOC
		var xmlString = xmlString.replace(/\n/g, '');
		var xmlString = xmlString.replace(/\t/g, '');
		
		//alert('In XMLDocToString: xmlString = '+ xmlString);
		
		return xmlString;
	}
}

//LOADS A TEXT STRING INTO THE BROWSER'S XML PARSER
function loadXMLString(txt) 
{
	if (window.DOMParser)
	  {
	  	var parser = new DOMParser();
	  	var xmlDocAsString = parser.parseFromString(txt,"text/xml"); //xmlDocAsString is global/window level element
	  }
	else // INTERNET EXPLORER
	  {
	  	var xmlDocAsString = new ActiveXObject("Microsoft.XMLDOM");
	  	xmlDocAsString.async="false";
	  	xmlDocAsString.loadXML(txt); 
	  }	
	  
	  return xmlDocAsString;
}

function xmlStringToArray(xmlDocString)
{	
	var mainArray = new Array();	
	//XMLDOC.DOCUMENTELEMENT IS THE HIGHEST LEVEL TAG ('BASE' TAG)		
	ParseXML(xmlDocString.documentElement, mainArray); 
	
	return mainArray;	
}

//PARSEXML(ELEMENT, ARRAY) TAKES AN XML DOC IN STRING FORM AND FILLS 'ARRAY' WITH A MULTIDEMENSIONAL
//ASSOCIATIVE ARRAY (AND INTEGER INDEXED WHERE APPROPRIATE).
//THE XML DOC SENT TO THIS FUNCTION MUST BE IN STRING FORM (LOADED WITH LOADXMLSTRING())
//AND IT CANNOT CONTAIN ANY EXTRANEOUS WHITESPACES, TABS, OR NEWLINES OUTSIDE OF <TAGS> OR TEXT NODE
//OBJECTS.
function ParseXML(element, array)
{		
	var count = 0;
	
	for(var i=0; i < element.childNodes.length; i++) //iterate over childNodes if there are any
	{				
		for (var j=0; j < element.childNodes.length; j++)
		{		
			if( i != j  &&  element.childNodes[i].tagName == element.childNodes[j].tagName ) //if a match is found
			{
				if (!array[element.childNodes[i].tagName])
				{
					array[element.childNodes[i].tagName] = new Array();
					
					//search for and store all matching tags in the new array, starting from first childNode 
					//(i.e. iterate through all childNodes and store all matching tags in the new array 
					for(var k=0; k < element.childNodes.length; k++) 
					{					
						if ( element.childNodes[i].tagName == element.childNodes[k].tagName)
						{
							//'k' is the index we are checking. 
							//'count' is the index we are storing in.
							
							if(!element.childNodes[k].childNodes[0]) //look ahead for text object: if text OBJECT does NOT exist: store empty value;
							{
								array[element.childNodes[i].tagName][count] = '';
								//alert('In if, count='+count+': '+ array[element.childNodes[i].tagName][count]);
							}
							else if (element.childNodes[k].childNodes[0].nodeValue ) //if text exists (text = nodeValue)
							{
								array[element.childNodes[i].tagName][count] = element.childNodes[k].childNodes[0].nodeValue;
								//alert('In else, count='+count+': ' + array[element.childNodes[i].tagName][count]);
							}
							else
							{	
								//alert('i='+i+':'+element.childNodes[i].tagName+',j='+j+':' +element.childNodes[j].tagName+ ',k=' +k+ ':' + element.childNodes[k].tagName + ', count='+count);
								
								array[element.childNodes[i].tagName][count] = new Array();
								//'k' is the new node to iterate through (NOT 'count'!!)
								ParseXML(element.childNodes[k], array[element.childNodes[i].tagName][count]);
								//XmlStringToArray(element.childNodes[count], array[element.childNodes[i].tagName][count]);
							}

							count++;		
						}
					}
					count = 0; //done with count, so reset it

				}// end if !array[tagName]
				
			}// end if: (found matching nodeName)
				
		}//end for j (check for same nodeName)
		
		
		//if (!array[element.childNodes[i].tagName]) //i.e. if array[tagname] does not yet exist
		//	array[element.childNodes[i].tagName] = element.childNodes[i].childNodes[0].nodeValue;
			
		
		if (!array[element.childNodes[i].tagName]) //i.e. if array[tagname] does not yet exist
		{
			//alert('no match found: elChildNm='+element.childNodes[i].tagName+' ' + dump(mainArray,1));
			
			if(!element.childNodes[i].childNodes[0]) //look ahead for text object: if text OBJECT does NOT exist: store empty value;
				array[element.childNodes[i].tagName] = '';				
			else if (element.childNodes[i].childNodes[0].nodeValue ) //if text exists (text = nodeValue)				
				array[element.childNodes[i].tagName] = element.childNodes[i].childNodes[0].nodeValue;
			else
			{	
				array[element.childNodes[i].tagName] = new Array();
				ParseXML(element.childNodes[i], array[element.childNodes[i].tagName]);
			}	
		}	
	
	}//end for i			
}

////////////  SAMPLE USAGE  ///////////////////////////
/*
	xmlDoc = loadXMLDoc("books.xml");	
	xmlString = XMLDocToString(xmlDoc);
	//alert(xmlString);
	
	xmlStringAsDoc = loadXMLString(xmlString); //load xmlString into browser's XML parser
	
	xmlToArray(xmlStringAsDoc);

*/

/*
//////////////////   EXTRA/ALTERNATE FUNCTIONS   ////////////////////////////////////////  

////////////////  'FAUX INDEXING' VERSION   ///////////////////////////////////////////////////
var currentTagName;
function XmlStringToArray_OLD(element, array) // needs currentTagName defined outside of function
{
	for(var i=0; i < element.childNodes.length; i++) //iterate over childNodes if there are any
	{	  
		currentTagName = element.childNodes[i].tagName; // get the tagName
			
		if ((i > 0 && currentTagName == element.childNodes[i-1].tagName) || (element.childNodes[i+1] && currentTagName == element.childNodes[i+1].tagName) )
			currentTagName = currentTagName + i + '';					
	
		if(!element.childNodes[i].childNodes[0]) //look ahead for text object: if text OBJECT does NOT exist: store empty value;
			array[currentTagName] = '';				
		else if (element.childNodes[i].childNodes[0].nodeValue ) //if text exists (text = nodeValue)				
			array[currentTagName] = element.childNodes[i].childNodes[0].nodeValue;	//get the text
		else
		{	
			array[currentTagName] = new Array();
			XmlStringToArray(element.childNodes[i], array[currentTagName]);
		}	
	}
}

var currentTagName;
function XmlDocToArray_OLD2(element, array) //need currentTagName defined outside of function
{
	//nodeList = element.childNodes; //nodeList is an integer indexed array of childNodes
	
	for(var i=0; i < element.childNodes.length; i++) //iterate over childNodes if there are any
	{	  
		currentTagName = element.childNodes[i].tagName; // get the tagName
				
		if(!element.childNodes[i].childNodes[0]) //look ahead for last(text) object: if text OBJECT does NOT exist: store empty value;
		{
			if (i > 0 && currentTagName == element.childNodes[i-1].tagName)
				array[currentTagName][i] = '';
			else
				array[currentTagName] = '';
			
			alert('In if: tagName = '+ currentTagName + ', i='+i);
		}					
		else if (element.childNodes[i].childNodes[0].nodeValue ) //if text exists (text = nodeValue)
		{	
			if (i > 0 && currentTagName == element.childNodes[i-1].tagName)
				array[currentTagName][i] = element.childNodes[i].childNodes[0].nodeValue;	//get the text
			else
				array[currentTagName] = element.childNodes[i].childNodes[0].nodeValue;	//get the text
		
			alert('In else if: tagName = '+ currentTagName + ', i='+i);
		}	
		else
		{	
			alert('In else: tagName = '+ currentTagName + ', i='+i);

			if (i > 0 && currentTagName == element.childNodes[i-1].tagName){
				array[currentTagName][i] = new Array();
				XmlDocToArray(element.childNodes[i], array[currentTagName][i]);
			}
			else{
				array[currentTagName] = new Array();		
				XmlDocToArray(element.childNodes[i], array[currentTagName]);
			}		
		}	
	}
}


//////////   EXAMPLES OF GETTING XML ELEMENT INFO  //////////////////////////	
function readXml()
{

		alert("XML Root Tag Name: " + xmlDoc.documentElement.tagName);

		alert("First Child: " + xmlDoc.documentElement.childNodes[1].firstChild.tagName);

		alert("Last Child: " + xmlDoc.documentElement.childNodes[1].lastChild.tagName);
		alert("Last Child Text: " + xmlDoc.documentElement.childNodes[1].lastChild.childNodes[0].nodeValue);
		
		//Using nodeValue and Attributes Properties
		//Here both the statement will return you the same result
		alert("Node Value: " + xmlDoc.documentElement.childNodes[0].attributes[0].nodeValue);
		alert("Node Value: " + xmlDoc.documentElement.childNodes[0].attributes.getNamedItem("id").nodeValue);
		
		alert("getElementsByTagName: " + xmlDoc.getElementsByTagName("year")[0].attributes.getNamedItem("id").nodeValue);
		
		//Using text Properties
		alert("Text Content for Employee Tag: " + xmlDoc.documentElement.childNodes[0].childNodes[0].nodeValue);
		
		//Using hasChildNodes Properties
		alert("Checking Child Nodes: " + xmlDoc.documentElement.childNodes[0].hasChildNodes());
		alert("Checking Child Nodes: " + xmlDoc.documentElement.childNodes[1].childNodes[0].hasChildNodes());
		alert("Checking Child Nodes: " + xmlDoc.documentElement.childNodes[1].childNodes[0].childNodes[0].nodeValue);
}

*/