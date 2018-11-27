//declaring the global reusable object

var LRConfigObj = {
	'appName': '', /* Your LoginRadius APP Name */
  'iframeSettings': {
		height : '85%',
		width : '100%',
		class : 'iframe'
  }//,
  /* Enter Your Custom Domain If Want To Use Instead Of LoginRadius Hosted Page URL i.e https://example.com */
//  'customdomain': ''
	}

//This object can be used to pass additional data to the hosted page, please leave empty if unsure.
var LRCommonOptions = {}

// declaring common functions
function getUrlParameteronpage(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	sURLVariables = sPageURL.split('&'),
	sParameterName,
	i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
}

function lrGetCookie(name)
  {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }


