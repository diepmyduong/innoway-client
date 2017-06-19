import { ServerConfig } from './server.config';
declare var $:any,window:any,FB:any;

//Facebook Config


export const FBConfig= () => {
    (function(d:any, s:any, id:any){
        var js:any, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'Messenger'));
    var d = document;
    var s = 'script';
    var id = 'facebook-jssdk';
    window.fbAsyncInit = function() {
        FB.init({
        appId      : ServerConfig.FBAPI,
        xfbml      : true,
        version    : 'v2.9'
        });
        FB.AppEvents.logPageView();
    };
    var js:any, fjs:any = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
};