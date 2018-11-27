var LoginRadiusCiamWidget = function(ConfigOption,CommonOptions) {
	var module = this;
	var commonoptions={};
	if(CommonOptions)
		commonoptions=CommonOptions;
   // defining the iframe options
	var LRIframeOption = {
		'height': ConfigOption.iframeSettings.height || '85%',
		'width': ConfigOption.iframeSettings.width || '100%',
		'class': ConfigOption.iframeSettings.class || 'iframe'
	}
    
	// Create Base64 Object, thirdparty solution for shortning the query string
	var Base64 = {
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encode: function(e) {
			var t = "";
			var n, r, i, s, o, u, a;
			var f = 0;
			e = Base64._utf8_encode(e);
			while (f < e.length) {
				n = e.charCodeAt(f++);
				r = e.charCodeAt(f++);
				i = e.charCodeAt(f++);
				s = n >> 2;
				o = (n & 3) << 4 | r >> 4;
				u = (r & 15) << 2 | i >> 6;
				a = i & 63;
				if (isNaN(r)) {
					u = a = 64
				} else if (isNaN(i)) {
					a = 64
				}
				t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
			}
			return t
		},
		decode: function(e) {
			var t = "";
			var n, r, i;
			var s, o, u, a;
			var f = 0;
			e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (f < e.length) {
				s = this._keyStr.indexOf(e.charAt(f++));
				o = this._keyStr.indexOf(e.charAt(f++));
				u = this._keyStr.indexOf(e.charAt(f++));
				a = this._keyStr.indexOf(e.charAt(f++));
				n = s << 2 | o >> 4;
				r = (o & 15) << 4 | u >> 2;
				i = (u & 3) << 6 | a;
				t = t + String.fromCharCode(n);
				if (u != 64) {
					t = t + String.fromCharCode(r)
				}
				if (a != 64) {
					t = t + String.fromCharCode(i)
				}
			}
			t = Base64._utf8_decode(t);
			return t
		},
		_utf8_encode: function(e) {
			e = e.replace(/\r\n/g, "\n");
			var t = "";
			for (var n = 0; n < e.length; n++) {
				var r = e.charCodeAt(n);
				if (r < 128) {
					t += String.fromCharCode(r)
				} else if (r > 127 && r < 2048) {
					t += String.fromCharCode(r >> 6 | 192);
					t += String.fromCharCode(r & 63 | 128)
				} else {
					t += String.fromCharCode(r >> 12 | 224);
					t += String.fromCharCode(r >> 6 & 63 | 128);
					t += String.fromCharCode(r & 63 | 128)
				}
			}
			return t
		},
		_utf8_decode: function(e) {
			var t = "";
			var n = 0;
			var r = c1 = c2 = 0;
			while (n < e.length) {
				r = e.charCodeAt(n);
				if (r < 128) {
					t += String.fromCharCode(r);
					n++
				} else if (r > 191 && r < 224) {
					c2 = e.charCodeAt(n + 1);
					t += String.fromCharCode((r & 31) << 6 | c2 & 63);
					n += 2
				} else {
					c2 = e.charCodeAt(n + 1);
					c3 = e.charCodeAt(n + 2);
					t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
					n += 3
				}
			}
			return t
		}
	}
	var LROptionString = Base64.encode(JSON.stringify(commonoptions));

	var callbacks = {};

	// getting url parameters
	function LRGetUrlParameter(sParam) {
		var PageURL = decodeURIComponent(window.location.search.substring(1)),
			URLVariables = PageURL.split('&'),
			ParameterName,
			i;

		for (i = 0; i < URLVariables.length; i++) {
			ParameterName = URLVariables[i].split('=');

			if (ParameterName[0] === sParam) {
				return ParameterName[1] === undefined ? true : ParameterName[1];
			}
		}
	}

	// this function will create iframe
	function loginRadiusCreateIframe(elementid, action, pagetype) {
		var LRIframe = document.createElement('iframe');
		// check querystring params
		var LRVtype = LRGetUrlParameter('vtype') || '';
		var LRVtoken = LRGetUrlParameter('vtoken') || '';
		if (LRVtype && LRVtoken) {
			if(ConfigOption.customdomain){ 
             LRIframe.src = "https://" + ConfigOption.customdomain + '/'+ pagetype +'?action=' + action + "&s=" + LROptionString + "&vtype=" + LRVtype + "&vtoken=" + LRVtoken+"&return_url="+encodeURIComponent("https://" + ConfigOption.customdomain + '/'+ "profile.aspx" +'?action=' + action + "&s=" + LROptionString + "&vtype=" + LRVtype + "&vtoken=" + LRVtoken);
			}else{ 
			LRIframe.src = "https://" + (ConfigOption.appName || 'lr') + ".hub.loginradius.com/"+ pagetype + "?action=" + action + "&s=" + LROptionString + "&vtype=" + LRVtype + "&vtoken=" + LRVtoken+"&return_url="+encodeURIComponent("https://" + (ConfigOption.appName || 'lr') + ".hub.loginradius.com/"+ "profile.aspx" + "?action=" + action + "&s=" + LROptionString + "&vtype=" + LRVtype + "&vtoken=" + LRVtoken);
		    }
		} else { 
			if(ConfigOption.customdomain){ 
			 LRIframe.src = "https://" + ConfigOption.customdomain + '/'+ pagetype +'?action=' + action + "&s=" + LROptionString+"&return_url="+encodeURIComponent("https://" + ConfigOption.customdomain + '/'+ "profile.aspx" +'?action=' + action + "&s=" + LROptionString);
		   }else{ 
				if(action)
					LRIframe.src = "https://" + (ConfigOption.appName || 'lr') + ".hub.loginradius.com/"+ pagetype + "?action=" + action + "&s=" + LROptionString+"&return_url="+encodeURIComponent("https://" + (ConfigOption.appName || 'lr') + ".hub.loginradius.com/"+ "profile.aspx" + "?action=" + action + "&s=" + LROptionString);
				else
					LRIframe.src = "https://" + (ConfigOption.appName || 'lr') + ".hub.loginradius.com/"+ pagetype + "?s=" + LROptionString+"&return_url="+encodeURIComponent("https://" + (ConfigOption.appName || 'lr') + ".hub.loginradius.com/"+ "profile.aspx" + "?s=" + LROptionString);
		   }
		}
		if (LRIframeOption) {
			LRIframe.height = LRIframeOption.height;
			LRIframe.width = LRIframeOption.width;
			LRIframe.className = LRIframeOption.class;
		}


		var elem = document.getElementById(elementid);

		if (elem) {
			elem.appendChild(LRIframe);
		}
	}


	// this function will comes in action when view page get rendered.
	module.render = function(action, id, pagetype, onSuccess, onError) { 
		loginRadiusCreateIframe(id, action, pagetype);
		callbacks = {};
		callbacks.success = onSuccess;
		callbacks.error = onError;

	}

	

	// listen postmessage event from the communication js
	window.addEventListener("message", LRReceiveMessage, false);
   
	// send success or error message to the view page
	function LRReceiveMessage(event) { 
    // condition to check origin 
		if ( event.origin.indexOf((ConfigOption.customdomain || 'hub.loginradius.com')) > -1) { 

			var LRMessageObject = JSON.parse(event.data);
			
			if(LRMessageObject.data.action == "deletecookie"){
               document.cookie = 'accesstoken=' + ";expires=Thu, 01 Jan 1970 00:00:01 GMT ;";
               window.location.reload();
			}else{
				callbacks[LRMessageObject.data.status]({"response":LRMessageObject.data.data,"event":LRMessageObject.data.action});
				
            } 
		}
	}
}
