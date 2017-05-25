import { ServerConfig } from './server.config';
declare var $:any,window:any,gapi:any;

export const GoogleConfig = ()=>{
    var d = document;
    var s = 'script';
    var id = 'google-jssdk';
	var m = d.getElementsByTagName('head')[0];
	var meta = d.createElement('meta');
	meta.name = 'google-signin-client_id';
	meta.content = ServerConfig.GoogleAPI;
	m.parentNode.insertBefore(meta,m)
    var js:any, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://apis.google.com/js/api.js";
    js.async = true;
    js.onload = function(){
        gapi.load('auth2', () => {
            // Initialize `auth2`
            gapi.auth2.init();
        });
    };
    fjs.parentNode.insertBefore(js, fjs);
}
