var eaUtils={domUniqueId:0,eventPrefix:"",eventsFallbackAlias:{mouseenter:"mouseover",mouseleave:"mouseout"},cssStyle:{},cssStyleArray:[],rawCssStyle:"",cssPropsAlias:{fontFamily:"font-family",fontWeight:"font-weight",fontStyle:"font-style",fontSize:"font-size",lineHeight:"line-height"},extractRGB:function(a){if(a){a=a.toLowerCase();var b="0123456789abcdef".split(""),c={r:"",g:"",b:""};c.r=parseInt((16*b.indexOf(a[1])+b.indexOf(a[2])).toString());c.g=parseInt((16*b.indexOf(a[3])+b.indexOf(a[4])).toString());
c.b=parseInt((16*b.indexOf(a[5])+b.indexOf(a[6])).toString());return c}},detectHTML5:function(){return Detect.transformOrigin},extractRGBA:function(a){a=a.replace(/[^\d,.]/g,"").split(",");return{r:a[0],g:a[1],b:a[2],a:a[3]}},rgba2hex:function(a,b){return"#"+(0!=b?(256+parseInt(256*Number(a.a))).toString(16).substr(1):"")+(256+parseInt(a.r)).toString(16).substr(1)+(256+parseInt(a.g)).toString(16).substr(1)+(256+parseInt(a.b)).toString(16).substr(1)},getIEVersion:function(){if(void 0!=eaUtils.IEVersion)return eaUtils.IEVersion;
var a=-1;"Microsoft Internet Explorer"==navigator.appName&&null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&(a=parseFloat(RegExp.$1));return eaUtils.IEVersion=a},detectIE:function(){return-1==eaUtils.getIEVersion()?!1:!0},generateLighterColor:function(a,b){if(a){void 0==b&&(b=26);var c=eaUtils.extractRGB(a);c.r=Math.min(255,parseInt(c.r)+b);c.g=Math.min(255,parseInt(c.g)+b);c.b=Math.min(255,parseInt(c.b)+b);return"#"+eaUtils.fixed2(c.r.toString(16))+eaUtils.fixed2(c.g.toString(16))+eaUtils.fixed2(c.b.toString(16))}},
fixed2:function(a){return 2>a.length?"0"+a:a},getTransparentImageURL:function(){return"data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="},getElementStyle:function(a,b){if(a.currentStyle)var c=a.currentStyle[b];else window.getComputedStyle&&(c=window.getComputedStyle(a,null).getPropertyValue(b));return c},addCSSById:function(a,b){var c=document.getElementsByTagName("head")[0],d=document.getElementById("eautils-css");if(void 0==d||null==d)d=document.createElement("style"),
d.type="text/css",d.id="eautils-css",c.appendChild(d);if(void 0!=eaUtils.cssStyle[b])for(eaUtils.rawCssStyle="",eaUtils.cssStyle[b].css=a,c=0;c<eaUtils.cssStyleArray.length;c++){var e=eaUtils.cssStyleArray[c];eaUtils.rawCssStyle+=e.css}else eaUtils.rawCssStyle+=a,e={},e.css=a,eaUtils.cssStyle[b]=e,eaUtils.cssStyleArray.push(e);d.styleSheet?d.styleSheet.cssText=eaUtils.rawCssStyle:d.innerHTML=eaUtils.rawCssStyle},getTextShadowCss:function(a){if(!a)return null;var b={"text-shadow":""};if(1==a.useShadow||
"true"==a.useShadow)b.textShadow=a.hShadow+"px "+a.vShadow+"px "+a.blur+"px "+a.color,b["text-shadow"]=a.hShadow+"px "+a.vShadow+"px "+a.blur+"px "+a.color,b["-moz-text-shadow"]=a.hShadow+"px "+a.vShadow+"px "+a.blur+"px "+a.color,b["-o-text-shadow"]=a.hShadow+"px "+a.vShadow+"px "+a.blur+"px "+a.color,b["-ms-text-shadow"]=a.hShadow+"px "+a.vShadow+"px "+a.blur+"px "+a.color;return b},getBoxShadowCss:function(a){if(!a)return null;var b={"-webkit-box-shadow":"","box-shadow":""};if(1==a.useShadow||
"true"==a.useShadow)b["-webkit-box-shadow"]=b.boxShadow=a.hShadow+"px "+a.vShadow+"px "+a.blur+"px "+a.spread+"px "+a.color;return b},convertCssProps:function(a){var b={},c;for(c in a)b[eaUtils.cssPropsAlias[c]||c]=a[c];return b},fixCSSProp:function(a,b,c){if(void 0!=a)return void 0==b&&(b="fontSize"),void 0==c&&(c="px"),a[b]=parseInt(a[b])+c,a},getCssAsClass:function(a,b){var c="."+b+"{",d;for(d in a){var e=a[d];if(e instanceof Array)for(var f=0,g=e.length;f<g;f++)c+=d+":"+e[f]+";";else c+=d+":"+
e+";"}return c+"}"},getBackgroundCss:function(a){var b={};if(!a)return b;var c=a.type,d=a.scolor;if("lgrad"==c||"rgrad"==c)a.gradColors&&a.gradColors.length?2>a.gradColors.length&&0<a.gradColors.length&&(d=a.gradColors[0].c,c="solid"):(c="solid",d="#fff");"true"==String(a.useBorder)&&(b.border="1px solid "+a.borderColor);switch(c){case "image":b["background-image"]="url("+(a.localUrl?"images/"+a.localUrl:bannerConfig.photosUrl+a.url)+")";b["background-position"]="center";"true"!==String(a.tile)?(b["background-size"]=
"cover",b["background-repeat"]="no-repeat"):(b["background-size"]="initial",b["background-repeat"]="repeat");break;case "solid":-1!=d.indexOf("rgba")&&(a=eaUtils.getIEVersion(),-1<a&&9>a&&(d=eaUtils.rgba2hex(eaUtils.extractRGBA(d),!1)));b["background-color"]=d;break;case "rgrad":case "lgrad":for(var d=a.gradColors,c=[],e=0;e<d.length;e++)c.push(d[e].c+" "+d[e].p+"%");var c=c.join(),e="linear",f=(a.rotation||"0")+"deg";if("rgrad"==a.type){e="radial";f=a.rgradPos||"center";if("custom"==f){f="";a.gradPosX&&
-1!=a.gradPosX.indexOf("%")||(f="px");var g="";a.gradPosY&&-1!=a.gradPosY.indexOf("%")||(g="px");f=(a.gradPosX||"0")+f+" "+(a.gradPosY||"0")+g}f+=", circle cover"}else a.backgroundRotation&&(f=a.backgroundRotation+"deg");d&&0<d.length&&(a=b.background=[],a.push(d[0].c),a.push("-moz-"+e+"-gradient("+f+",  "+c+")"),a.push("-webkit-"+e+"-gradient("+f+",  "+c+")"),a.push("-o-"+e+"-gradient("+f+",  "+c+")"),a.push("-ms-"+e+"-gradient("+f+",  "+c+")"));b.filter="progid:DXImageTransform.Microsoft.gradient( startColorstr='"+
d[0].c+"', endColorstr='"+d[d.length-1].c+"',GradientType=0 )"}return b},getBorderCss:function(a){var b={};!a||1!=a.useBorder&&"true"!=a.useBorder||(b.border="1px solid "+a.borderColor);return b},applyCss:function(a,b){for(var c in b)a.style[c]=b[c]},isURLValid:function(a){return 0<=a.indexOf(" ")||-1==a.indexOf(".")?!1:!0},getAppValidURL:function(a){return eaUtils.isURLValid(a)?a:EAdConfig.baseDomain},getElementUniqueId:function(){return"e_"+eaUtils.domUniqueId++},getImagePath:function(a,b,c){return a?
a.replace("{hash}",b).replace("{wxh}",c):""},getUniqueId:function(){return(Math.random()+(new Date).getTime()).toString(36).replace(".","")},preloadImage:function(a,b){var c=new Image;c.onerror=c.onload=function(){b&&b()};c.src=a},isTouchDevice:function(){try{return document.createEvent("TouchEvent"),"ontouchstart"in document.documentElement}catch(a){return!1}},getSharePageURL:function(a){a=1==a?"":"&v="+(12345+1E3*Math.random()>>0);var b=URLPaths.sharePageUrlFormat.replace("{domain}",EAdConfig.shareSubdomain).replace("{hash}",
EAdConfig.creativeHash);return this.getAppValidURL(b+a)},cloneObject:function(a){return JSON.parse(JSON.stringify(a))},getClickTagValue:function(){var a=window.location.search.substring(1).split("clickTag=");if(!a[1])return!1;a=a[1].replace(/&.+$/,"");return decodeURIComponent(a)},getProtocol:function(){return"http:"!=location.protocol&&"https:"!=location.protocol?"https:":""},addProtocolToUrl:function(a){return-1==a.indexOf("://")?"http://"+a:a}},easingFunction=function(){var a=this;this.linear=
function(a,c,d,e,f){return e*c/f+d};this.easeInBack=function(a,c,d,e,f,g){void 0==g&&(g=1.70158);return e*(c/=f)*c*((g+1)*c-g)+d};this.easeOutBack=function(a,c,d,e,f,g){void 0==g&&(g=1.70158);return e*((c=c/f-1)*c*((g+1)*c+g)+1)+d};this.easeInOutBack=function(a,c,d,e,f,g){void 0==g&&(g=1.70158);return 1>(c/=f/2)?e/2*c*c*(((g*=1.525)+1)*c-g)+d:e/2*((c-=2)*c*(((g*=1.525)+1)*c+g)+2)+d};this.easeOutBounce=function(a,c,d,e,f){return(c/=f)<1/2.75?7.5625*e*c*c+d:c<2/2.75?e*(7.5625*(c-=1.5/2.75)*c+.75)+d:
c<2.5/2.75?e*(7.5625*(c-=2.25/2.75)*c+.9375)+d:e*(7.5625*(c-=2.625/2.75)*c+.984375)+d};this.easeInBounce=function(b,c,d,e,f){return e-a.easeOutBounce(b,f-c,0,e,f)+d};this.easeInOutBounce=function(b,c,d,e,f){return c<f/2?.5*a.easeInBounce(b,2*c,0,e,f)+d:.5*a.easeOutBounce(b,2*c-f,0,e,f)+.5*e+d};this.easeInElastic=function(a,c,d,e,f){a=1.70158;var g=0,h=e;if(0==c)return d;if(1==(c/=f))return d+e;g||(g=.3*f);h<Math.abs(e)?(h=e,a=g/4):a=g/(2*Math.PI)*Math.asin(e/h);return-(h*Math.pow(2,10*--c)*Math.sin(2*
(c*f-a)*Math.PI/g))+d};this.easeOutElastic=function(a,c,d,e,f){a=1.70158;var g=0,h=e;if(0==c)return d;if(1==(c/=f))return d+e;g||(g=.3*f);h<Math.abs(e)?(h=e,a=g/4):a=g/(2*Math.PI)*Math.asin(e/h);return h*Math.pow(2,-10*c)*Math.sin(2*(c*f-a)*Math.PI/g)+e+d};this.easeInOutElastic=function(a,c,d,e,f){a=1.70158;var g=0,h=e;if(0==c)return d;if(2==(c/=f/2))return d+e;g||(g=.3*f*1.5);h<Math.abs(e)?(h=e,a=g/4):a=g/(2*Math.PI)*Math.asin(e/h);return 1>c?-.5*h*Math.pow(2,10*--c)*Math.sin(2*(c*f-a)*Math.PI/g)+
d:h*Math.pow(2,-10*--c)*Math.sin(2*(c*f-a)*Math.PI/g)*.5+e+d};this.easeInStrong=function(a,c,d,e,f){return e*(c/=f)*c*c*c*c+d};this.easeOutStrong=function(a,c,d,e,f){return e*((c=c/f-1)*c*c*c*c+1)+d};this.easeInOutStrong=function(a,c,d,e,f){return 1>(c/=f/2)?e/2*c*c*c*c*c+d:e/2*((c-=2)*c*c*c*c+2)+d}};
function getTweenFunction(a,b){switch(b){case "out":b="easeOut";break;case "in":b="easeIn";break;case "In and out":b="easeInOut"}var c=new easingFunction;if("linear"==a)return c.linear;"easeOut"!=b&&"easeIn"!=b&&"easeInOut"!=b&&(b="easeOut");var d=b.concat(a);return void 0===c[d]?c.linear:c[d]}
function startAnimating(a,b){var c=(new Date).getTime();b.duration||(b.duration=b.Duration);var d=c+1E3*b.duration;if(b.onAnimationStart)b.onAnimationStart();clearInterval(eaAnimations.timeouts[b.fId]);var e=setInterval(function(){var f=Math.min(d,(new Date).getTime()),g=100*(f-c)/(1E3*b.duration),g=getTweenFunction(b.tween,b.ease)(0,g,0,100,100);b.animateFunction(a,g);if(f>=d&&(clearInterval(e),b.onAnimationEnd))b.onAnimationEnd()},30);eaAnimations.timeouts[b.fId]=e}
var eaAnimations={timeouts:{},alphaIn:function(a,b,c){a.style.opacity=0;b.animateFunction=function(a,b){a.style.opacity=b/100;a.style.filter="progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#00000000', endColorstr='#00000000'),alpha(opacity="+parseInt(b)+");"};clearTimeout(eaAnimations.timeouts[b.delayId]);eaAnimations.timeouts[b.delayId]=setTimeout(function(){startAnimating(a,b)},1E3*(Number(b.delay)+c))},alphaOut:function(a,b,c){b.animateFunction=function(a,b){a.style.opacity=
1-b/100;a.style.filter="alpha(opacity="+parseInt(1-b)+");"};clearTimeout(eaAnimations.timeouts[b.delayId]);eaAnimations.timeouts[b.delayId]=setTimeout(function(){startAnimating(a,b)},1E3*(Number(b.delay)+c))},property:function(a,b,c){b.animateFunction=function(a,c){a.style[b.prop]=Math.round(b.start+(b.end-b.start)*c/100)+b.sfx};clearTimeout(eaAnimations.timeouts[b.delayId]);eaAnimations.timeouts[b.delayId]=setTimeout(function(){startAnimating(a,b)},1E3*(Number(b.delay)+c))},scaleIn:function(a,b,
c){function d(a,b){a.style["-webkit-transform"]=b;a.style["-o-transform"]=b;a.style["-ms-transform"]=b;a.style["-moz-transform"]=b;a.style.transform=b}var e=1,f=1,g="top left",h=parseInt(a.style.left),k=parseInt(a.style.top),m=parseInt(a.style.width),p=parseInt(a.style.height),l=h,q=k,n=m,r=p;switch(b.direction){case "l2r":n=e=0;g="left center";break;case "r2l":e=0;l+=m;n=0;g="right center";break;case "t2b":r=f=0;g="center top";break;case "b2t":f=0;q+=p;r=0;g="center bottom";break;case "center":r=
n=f=e=0,l+=m/2,q+=p/2,g="center center"}var t=h-l,u=k-q,v=m-n,w=p-r;Detect.transformOrigin||(a.style.overflow="hidden",a.style.top=q+"px",a.style.left=l+"px",a.style.width=n+"px",a.style.height=r+"px");var x=1-e,y=1-f;a.style.transformOrigin=g;a.style["-webkit-transform-origin"]=g;a.style["-o-transform-origin"]=g;a.style["-ms-transform-origin"]=g;a.style["-moz-transform-origin"]=g;a.style["transform-origin"]=g;d(a,"scaleX("+e+") scaleY("+f+")");b.animateFunction=function(a,b){d(a,"scaleX("+(e+x*b/
100)+") scaleY("+(f+y*b/100)+")");if(!Detect.transformOrigin){var c=l+t*b/100;a.style.top=q+u*b/100+"px";a.style.left=c+"px";c=r+w*b/100;a.style.width=n+v*b/100+"px";a.style.height=c+"px"}};setTimeout(function(){startAnimating(a,b)},1E3*(Number(b.delay)+c))},scaleOut:function(a,b,c){var d=1,e=1,f=d,g=e,h="top left",k=parseInt(a.style.left),m=parseInt(a.style.top),p=parseInt(a.style.width),l=parseInt(a.style.height),q=k,n=m,r=p,t=l;switch(b.direction){case "l2r":p=d=0;h="right center";break;case "r2l":d=
0;k+=p;p=0;h="left center";break;case "t2b":l=e=0;h="center bottom";break;case "b2t":e=0;m+=l;l=0;h="center top";break;case "center":l=p=e=d=0,k+=p/2,m+=l/2,h="center center"}var u=k-q,v=m-n,w=p-r,x=l-t;Detect.transformOrigin||(a.style.overflow="hidden",a.style.top=n+"px",a.style.left=q+"px",a.style.width=r+"px",a.style.height=t+"px");var y=d-f,z=e-g;a.style.transformOrigin=h;a.style["-webkit-transform-origin"]=h;a.style["-o-transform-origin"]=h;a.style["-ms-transform-origin"]=h;a.style["-moz-transform-origin"]=
h;a.style["transform-origin"]=h;b.animateFunction=function(a,b){var c="scaleX("+(f+y*b/100)+") scaleY("+(g+z*b/100)+")";a.style["-webkit-transform"]=c;a.style["-o-transform"]=c;a.style["-ms-transform"]=c;a.style["-moz-transform"]=c;a.style.transform=c;Detect.transformOrigin||(c=q+u*b/100,a.style.top=n+v*b/100+"px",a.style.left=c+"px",c=t+x*b/100,a.style.width=r+w*b/100+"px",a.style.height=c+"px")};setTimeout(function(){startAnimating(a,b)},1E3*(Number(b.delay)+c))},slideIn:function(a,b,c){var d=parseInt(a.style.left)||
0,e=parseInt(a.style.top)||0,f=d,g=e,h=parseInt(b.alphaOffset)/100;switch(b.direction){case "custom":f+=parseInt(b.slidePosX);g+=parseInt(b.slidePosY);break;case "l2r":f-=parseInt(b.slideOffset);break;case "r2l":f+=parseInt(b.slideOffset);break;case "t2b":g-=parseInt(b.slideOffset);break;case "b2t":g+=parseInt(b.slideOffset)}var k=d-f,m=e-g;a.style.top=g+"px";a.style.left=f+"px";a.style.opacity=h;b.animateFunction=function(a,b){var c=f+k*b/100,d=h+b/100*(1-h);a.style.top=g+m*b/100+"px";a.style.left=
c+"px";a.style.opacity=d;a.style.filter="progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#00000000', endColorstr='#00000000'),alpha(opacity="+parseInt(100*d)+");"};setTimeout(function(){startAnimating(a,b)},1E3*(Number(b.delay)+c))},slideOut:function(a,b,c){var d=parseInt(a.style.left),e=parseInt(a.style.top),f=d,g=e;switch(b.direction){case "custom":d+=parseInt(b.slidePosX);e+=parseInt(b.slidePosY);break;case "l2r":d+=parseInt(b.slideOffset);break;case "r2l":d-=parseInt(b.slideOffset);
break;case "t2b":e+=parseInt(b.slideOffset);break;case "b2t":e-=parseInt(b.slideOffset)}var h=d-f,k=e-g;a.style.top=g+"px";a.style.left=f+"px";a.style.opacity=1;b.animateFunction=function(a,c){var d=f+h*c/100,e=g+k*c/100,n=1-(1-parseInt(b.alphaOffset)/100)*(c/100);a.style.top=e+"px";a.style.left=d+"px";a.style.opacity=n;a.style.filter="alpha(opacity="+parseInt(100*n)+");"};setTimeout(function(){startAnimating(a,b)},1E3*(Number(b.delay)+c))},none:function(a,b){},animate:function(a,b,c,d){d=parseFloat(d)||
0;if("none"==b.type){if(b.onAnimationEnd)b.onAnimationEnd()}else{var e="";c&&(e="buildIn"==c?"In":"Out");c=b.type+e;b.delayId="delay_"+b.type+a.getAttribute("id");b.fId="f_"+b.type+a.getAttribute("id");this[c](a,b,d)}}};
Array.prototype.indexOf||(Array.prototype.indexOf=function(a){if(void 0===this||null===this)throw new TypeError;var b=Object(this),c=b.length>>>0;if(0===c)return-1;var d=0;0<arguments.length&&(d=Number(arguments[1]),d!==d?d=0:0!==d&&d!==1/0&&d!==-(1/0)&&(d=(0<d||-1)*Math.floor(Math.abs(d))));if(d>=c)return-1;for(d=0<=d?d:Math.max(c-Math.abs(d),0);d<c;d++)if(d in b&&b[d]===a)return d;return-1});
var Detect=function(){var a="transformOrigin textShadow textStroke boxShadow borderRadius borderImage opacity".split(" "),b=["Webkit","Moz","O","ms","Khtml"],c=document.createElement("detect"),d=[],e,f;for(e in a){var g=f=a[e];a:{if("string"==typeof f){var h=f.substr(0,1).toUpperCase()+f.substr(1);f=(f+" "+b.join(h+" ")+h).split(" ");for(var h=0,k=f.length;h<k;h++)if(""===c.style[f[h]]){f=!0;break a}}f=!1}d[g]=f}return d}();"use strict";var EventDispatcher=function(){};
EventDispatcher.prototype={constructor:EventDispatcher,apply:function(a){a.on=EventDispatcher.prototype.on;a.off=EventDispatcher.prototype.off;a.trigger=EventDispatcher.prototype.trigger},on:function(a,b){void 0===this._listeners&&(this._listeners={});var c=this._listeners,d,e;a=a.split(" ");for(e=0;d=a[e];e++)c[d]=c[d]||[],-1===c[d].indexOf(b)&&c[d].push(b)},off:function(a,b){if(void 0!==this._listeners){var c=this._listeners[a];if(void 0!==c){var d=c.indexOf(b);-1!==d&&c.splice(d,1)}}},trigger:function(a,
b){if(void 0!==this._listeners){var c=this._listeners[a];if(void 0!==c){var d={target:this};d.type=a;d.data=b;for(var e=c.length,f=0;f<e;f++)c[f].call(this,d)}}}};"use strict";function Stats(a){this.hash=a;EventDispatcher.call(this)}Stats.prototype=new EventDispatcher;Stats.prototype.constructor=Stats;
Stats.prototype.isBlockedDomain=function(a){if(!a)return!1;a=a.split("//")[1]||"";a=a.split("/")[0];return-1<["www.bannersnack.com","bannersnack.com","dev.bannersnack.net","bannersnack"].indexOf(a)?!0:!1};
Stats.prototype.track=function(){var a=this.getStatsRequestUrl()+"countAccess.php?terminal=bannersnack",b="bsStats_"+this.hash,c={item_id:this.hash,item_type:3,type:"json",callback:b,domain:document.referrer||location.href},d;for(d in c)a+="&"+d+"="+encodeURIComponent(c[d]);window[b]=function(a){};b=document.createElement("script");b.src=a;document.getElementsByTagName("head")[0].appendChild(b)};
Stats.prototype.getStatsRequestUrl=function(){if(bannerConfig.env&&"live"!==bannerConfig.env){if("dev"===bannerConfig.env)return"//stats.dev.snacktools.net/";if("local"===bannerConfig.env)return"//stats.snacktools/"}return"//stats.snacktools.net/"};"use strict";function BaseDisplay(){EventDispatcher.call(this)}BaseDisplay.prototype=new EventDispatcher;BaseDisplay.prototype.constructor=EventDispatcher;BaseDisplay.prototype.container=null;BaseDisplay.prototype.displayContainer=null;
BaseDisplay.prototype.properties=null;BaseDisplay.prototype.displayData=null;BaseDisplay.prototype.init=function(a){this.displayData=a;return this};BaseDisplay.prototype.render=function(){};BaseDisplay.prototype.reset=function(){};
BaseDisplay.prototype.applyActions=function(a,b){var c=this;if(this.youtubeContainer)return c.onPlayerStateChange(c),!0;if(!a||!b||"none"==a.type)return!1;var d="pointer";"undefined"!=typeof a.useHandCursor&&0==a.useHandCursor&&(d="");b.style.cursor=d;b.addEventListener(a.event,function(b){if(b.clickFlag)return b.clickFlag=!1;b.clickFlag=this;"gotoSlide"==a.type?c.slide.buildOut(c.slide.getSlideByHash(a.slideOrUrl)):window.open(a.slideOrUrl,a.target)})};
BaseDisplay.prototype.createElement=function(a,b,c,d){a=document.createElement(a);a.setAttribute("class",b);0!=c&&(d||this.container)&&(d||this.container).appendChild(a);a.setAttribute("id",eaUtils.getElementUniqueId());return a};BaseDisplay.prototype.setStyle=function(a,b,c){c||(c="");var d={x:"left",y:"top",labelOffsetX:"margin-left",labelOffsetY:"margin-top",lineHeight:"line-height"};b=b.split(",");for(var e in b)b.hasOwnProperty(e)&&(a.style[d[b[e]]||b[e]]=this.properties[b[e]]+c);return this};
BaseDisplay.prototype.getContainer=function(){return this.container};BaseDisplay.prototype.show=function(){this.container.style.display="";return this};BaseDisplay.prototype.hide=function(){this.container.style.display="none";return this};BaseDisplay.prototype.setElementActive=function(a){};BaseDisplay.prototype.hasClass=function(a,b){return a?(new RegExp("(\\s|^)"+b+"(\\s|$)")).test(a.className):!1};
BaseDisplay.prototype.removeClass=function(a,b){this.hasClass(a,b)&&(a.className=a.className.replace(new RegExp("(\\s|^)"+b+"(\\s|$)")," ").replace(/^\s+|\s+$/g,""));return this};BaseDisplay.prototype.addClass=function(a,b){if(!a)return this;this.hasClass(a,b)||(a.className+=(a.className?" ":"")+b);return this};BaseDisplay.prototype.toggleClass=function(a,b){if(!a)return this;this.hasClass(a,b)?this.removeClass(a,b):this.addClass(a,b);return this};
BaseDisplay.prototype.applyBackground=function(a,b){var c=eaUtils.getBackgroundCss(b),d;for(d in c)switch(d){default:a.style[d]=c[d];break;case "background":for(var e=0;e<c[d].length;e++)a.style.background=c[d][e]}};BaseDisplay.prototype.applyBoxShadow=function(a,b){eaUtils.applyCss(a,eaUtils.getBoxShadowCss(b))};BaseDisplay.prototype.getAnimationEl=function(){return this.container};
BaseDisplay.prototype.playAnimation=function(a){var b=this.getAnimationEl(),c=this.displayData.properties,d=c.buildIn,e=c.buildOut;d&&"none"!=d.type?(d.onAnimationEnd=function(){e&&"none"!=e.type&&eaAnimations.animate(b,e,"buildOut")},eaAnimations.animate(b,d,"buildIn",a)):e&&"none"!=e.type&&eaAnimations.animate(b,e,"buildOut",a)};
BaseDisplay.prototype.transform=function(a,b){b||(b=this.container);b.style["-webkit-transform"]=a;b.style["-o-transform"]=a;b.style["-ms-transform"]=a;b.style["-moz-transform"]=a;b.style.transform=a};
BaseDisplay.prototype.createActionProperties=function(){var a=this.properties&&this.properties.actions&&this.properties.actions[0];if(!a)return!1;var b="";if("gotoURL"==a.type){b=a.url;if(!b)return!1;-1==b.indexOf("://")&&(b="http://"+b)}return{event:a.event,slideOrUrl:"gotoSlide"==a.type?a.slide:b,type:a.type,target:a.target,useHandCursor:a.useHandCursor}};"use strict";function ButtonDisplay(){BaseDisplay.call(this)}ButtonDisplay.prototype=new BaseDisplay;ButtonDisplay.prototype.constructor=ButtonDisplay;
ButtonDisplay.prototype.init=function(a){var b=a.properties;this.properties=b;this.properties.originalOpacity=this.properties.opacity;this.container=this.createElement("div","element");this.elementContainer=this.createElement("div","ban-btn "+a.eh);b["border-radius"]=b.borderRadius;this.textContainer=this.createElement("label","ban-btn-label",!0,this.elementContainer);this.textContainer.textContent=b.buttonLabel;b["line-height"]=b.height;this.setStyle(this.textContainer,"line-height,labelOffsetX,labelOffsetY",
"px");b.labelStyle.fontSize+="px";eaUtils.applyCss(this.textContainer,b.labelStyle);eaUtils.applyCss(this.textContainer,eaUtils.getTextShadowCss(b.labelShadow));eaUtils.applyCss(this.elementContainer,eaUtils.getBoxShadowCss(b.dropShadow));this.displayContainer=this.elementContainer;b=".ban-btn."+a.eh;b=b+"{ background-color:"+this.properties.backgroundColor+";}"+b+":hover{ background-color:"+eaUtils.generateLighterColor(this.properties.backgroundColor,15)+";}";eaUtils.addCSSById(b,"ban-btn"+a.eh);eaUtils.detectIE()&&
(this.addDOMListener("mousedown",this.onMouseDown,this.displayContainer),this.addDOMListener("mouseup",this.onMouseUp,this.displayContainer));this.reset();this.applyActions(this.createActionProperties(),this.container);return BaseDisplay.prototype.init.call(this,a)};ButtonDisplay.prototype.onMouseUp=function(){this.removeClass(this.displayContainer,"mousedown")};ButtonDisplay.prototype.onMouseDown=function(){this.addClass(this.displayContainer,"mousedown")};
ButtonDisplay.prototype.reset=function(){this.transform("none");this.properties.opacity=this.properties.originalOpacity/100;this.setStyle(this.container,"opacity");this.setStyle(this.container,"x,y,width,height","px");this.setStyle(this.elementContainer,"opacity");this.setStyle(this.elementContainer,"width,height,border-radius","px")};"use strict";function ImageDisplay(){BaseDisplay.call(this)}ImageDisplay.prototype=new BaseDisplay;ImageDisplay.prototype.constructor=BaseDisplay;
ImageDisplay.prototype.init=function(a){this.triggerReadyOnRender=!1;this.properties=a.properties;this.properties.originalOpacity=this.properties.opacity;this.container=this.createElement("div","element");this.imageContainer=this.createElement("div","ban-image image-"+this.properties.scaleMode);this.container.appendChild(this.imageContainer);this.imageContainer.style.backgroundImage="url("+(this.properties.localUrl?"images/"+this.properties.localUrl:bannerConfig.photosUrl+this.properties.url)+")";
eaUtils.applyCss(this.imageContainer,eaUtils.getBoxShadowCss(this.properties.dropShadow));var b,c;switch(this.properties.verticalAlign){case "top":b="0";break;case "middle":b="50%";break;case "bottom":b="100%"}switch(this.properties.horizontalAlign){case "left":c="0";break;case "center":c="50%";break;case "right":c="100%"}this.imageContainer.style.backgroundPosition=c+" "+b;"tile"==this.properties.scaleMode&&(this.imageContainer.style.backgroundSize=this.properties.contentScale/100*this.properties.oWidth+
"px",this.imageContainer.style.backgroundPositionX=this.properties.contentOffsetX+"%",this.imageContainer.style.backgroundPositionY=this.properties.contentOffsetY+"%");this.transform("rotate("+this.properties.rotation+"deg)",this.imageContainer);this.reset();this.applyActions(this.createActionProperties(),this.imageContainer);return BaseDisplay.prototype.init.call(this,a)};
ImageDisplay.prototype.reset=function(){this.transform("none");this.properties.opacity=this.properties.originalOpacity/100;this.setStyle(this.container,"opacity");this.setStyle(this.container,"x,y,width,height","px")};"use strict";function ShapeDisplay(){BaseDisplay.call(this)}ShapeDisplay.prototype=new BaseDisplay;ShapeDisplay.prototype.constructor=ShapeDisplay;
ShapeDisplay.prototype.init=function(a){var b=a.properties;this.properties=b;this.container=this.createElement("div","element");this.shapeContainer=this.createElement("div","shape "+b.type);if(eaUtils.detectIE()){var c=this.createElement("img","fakeImage");c.src=eaUtils.getTransparentImageURL();this.shapeContainer.appendChild(c)}"rectangle"==b.type&&(this.shapeContainer.style.borderRadius=b.bradius+"px");this.applyBackground(this.shapeContainer,b.backgroundColor);this.displayContainer=this.shapeContainer;
this.displayData=a;this.applyBoxShadow(this.shapeContainer,b.dropShadow);this.transform("rotate("+this.properties.rotation+"deg)",this.shapeContainer);this.reset();this.applyActions(this.createActionProperties(),this.shapeContainer);return BaseDisplay.prototype.init.call(this,a)};
ShapeDisplay.prototype.reset=function(){this.transform("none");var a=this.properties;this.setStyle(this.container,"x,y","px");this.container.style.opacity=this.properties.opacity/100;var b=a["line"==a.type?"thick":"height"];this.container.style.width=a["line"==a.type?"len":"width"]+"px";this.container.style.height=b+"px"};"use strict";function TextDisplay(){BaseDisplay.call(this)}TextDisplay.prototype=new BaseDisplay;TextDisplay.prototype.constructor=TextDisplay;
TextDisplay.prototype.init=function(a){this.properties=a.properties;this.container=this.createElement("div","element");this.text=this.createElement("span","");this.textContainer=this.createElement("p","text");this.textContainer.appendChild(this.text);this.container.appendChild(this.textContainer);this.transform("rotate("+this.properties.rotation+"deg)",this.textContainer);try{this.text.textContent=this.properties.text}catch(b){}eaUtils.applyCss(this.textContainer,eaUtils.getTextShadowCss(this.properties.textShadow));
this.displayContainer=this.textContainer;this.reset();this.applyActions(this.createActionProperties(),this.textContainer);return BaseDisplay.prototype.init.call(this,a)};
TextDisplay.prototype.reset=function(){this.transform("none");var a=this.properties;this.setStyle(this.container,"x,y,width,height","px");this.setStyle(this.textContainer,"fontWeight,fontStyle,opacity,color");this.setStyle(this.textContainer,"fontSize","px");this.textContainer.style.opacity=a.opacity/100;this.textContainer.style.fontFamily="'"+a.fontFamily+"'";this.textContainer.style.textAlign=a.alignment;a.textShadow.useShadow&&(this.textContainer.style.textShadow=a.textShadow.color+" "+a.textShadow.hShadow+
"px "+a.textShadow.vShadow+"px "+a.textShadow.blur+"px")};"use strict";function BannerDisplay(){this.startSlide=0;this.overflowSlide=null;BaseDisplay.call(this)}BannerDisplay.prototype=new BaseDisplay;BannerDisplay.prototype.constructor=BannerDisplay;BannerDisplay.prototype.currentSlide=null;BannerDisplay.prototype.lastSlide=null;BannerDisplay.prototype.fontsToLoad=[];
BannerDisplay.prototype.init=function(a,b,c){this.container=b;this.properties=a.properties;this.config=c;this.startSlide=parseInt(c.startSlide)||0;this.noAnimation=Boolean(c.noAnimation)||!1;this.showOnlyOneSlide=Boolean(c.showOnlyOneSlide)||!1;this.initFonts(a);this.addFontsToDom();this.setStyle(this.container,"width,height","px");if(2>this.properties.width||2>this.properties.height)this.properties.backgroundColor.useBorder=!1;this.applyBackground(this.container,this.properties.backgroundColor);
this.applyActions(this.createActionProperties(),this.container);BaseDisplay.prototype.init.call(this,a);this.initSlides(a.elements)};BannerDisplay.prototype.initSlides=function(a){this.slides=[];var b,c,d=[],e={properties:{},elements:[]};for(b=0;c=a[b];b++)"slide"===c.type?d.push(c):e.elements.push(c);this.overflowSlide=new SlideDisplay;this.overflowSlide.overflowSlide=!0;this.overflowSlide.init(e,this.container);for(b=0;c=d[b];b++)a=new SlideDisplay,a.banner=this,a.init(c,this.container),this.slides.push(a)};
BannerDisplay.prototype.getWidth=function(){return this.properties.width};BannerDisplay.prototype.getHeight=function(){return this.properties.height};BannerDisplay.prototype.play=function(){this.slides[this.startSlide]&&this.slides[this.startSlide].play()};BannerDisplay.prototype.initFonts=function(a){a=a&&a.elements;if(!a)return!1;for(var b=0;b<a.length;b++)"slide"==a[b].type?this.initFonts(a[b]):this.loadFonts(a[b])};
BannerDisplay.prototype.loadFonts=function(a){a=a&&a.properties;if(!a)return!1;a.labelStyle&&this.setFontsToBeLoaded(a.labelStyle.fontFamily,a.labelStyle.fontWeight,a.labelStyle.fontStyle);a.fontFamily&&this.setFontsToBeLoaded(a.fontFamily,a.fontWeight,a.fontStyle);return!0};
BannerDisplay.prototype.setFontsToBeLoaded=function(a,b,c){if(!a||!b||!c)return!1;"italic"==c&&(b+="i");if(!this.fontsToLoad[a])return this.fontsToLoad[a]=b+",",!0;if(-1!=this.fontsToLoad[a].indexOf(b))return!1;this.fontsToLoad[a]+=b+",";return!0};
BannerDisplay.prototype.addFontsToDom=function(){if(!this.fontsToLoad)return!1;var a=[],b;for(b in this.fontsToLoad)a.push([b.replace(/\s/g,"+")+":"+this.fontsToLoad[b].replace(/\,$/,"")]);0!=a.length&&(a=a.join("|"),b=this.createElement("link",""),b.setAttribute("rel","stylesheet"),b.setAttribute("type","text/css"),b.setAttribute("href",eaUtils.getProtocol()+"//fonts.googleapis.com/css?family="+a),this.container.appendChild(b))};
BannerDisplay.prototype.createActionProperties=function(){var a=eaUtils.getClickTagValue();a||(a=window.clickTag?window.clickTag:this.config&&this.config.clickTag);var b={event:"click",slideOrUrl:"",type:"gotoURL",target:"_blank",useHandCursor:!0};if(a)return b.slideOrUrl=b.target=eaUtils.addProtocolToUrl(a),b;a=this.properties;if(!a||!a.useBannerEntireArea||!a.bannerUrl||"http://"==a.bannerUrl||"https://"==a.bannerUrl)return!1;b.slideOrUrl=eaUtils.addProtocolToUrl(a.bannerUrl);b.target=a.urlTarget;
b.useHandCursor=a.useHandCursor;return b};"use strict";function SlideDisplay(){this.banner=null;this.rendered=!1;this.container=this._buildOutTimeout=null;this.elements=[]}SlideDisplay.prototype=new BaseDisplay;SlideDisplay.prototype.constructor=SlideDisplay;
SlideDisplay.prototype.init=function(a,b){if(!this.overflowSlide){var c=a.properties;this.container=this.createElement("div","slide",!0,b);this.ah=a.ah;c.duration=parseFloat(c.duration);.1>c.duration&&(c.duration=.1);var d=c.transition=c.transition||{type:"none",delay:0,duration:.1};this.parseTransition(d);this.applyBackground(this.container,c.backgroundColor);this.reset()}return BaseDisplay.prototype.init.call(this,a)};
SlideDisplay.prototype.parseTransition=function(a){a.duration=parseFloat(a.duration)||0;if("slide"===a.type&&!parseInt(a.slideOffset))switch(a.direction){case "r2l":case "l2r":a.slideOffset=this.banner.getWidth();break;case "t2b":case "b2t":a.slideOffset=this.banner.getHeight()}};SlideDisplay.prototype.isFirstSlide=function(){return 0===this.banner.slides.indexOf(this)};
SlideDisplay.prototype.reset=function(){var a=this.container.style;a.zIndex=0;a.width="100%";a.height="100%";a.top="0";a.left="0";this.transform("none");for(a=0;a<this.elements.length;a++)this.elements[a].reset()};SlideDisplay.prototype.play=function(a){this.banner.lastSlide=this.banner.currentSlide;this.banner.currentSlide=this;this.rendered?this.reset():this.render();this.container.style.opacity=1;this.playSlideAnimation(a)};
SlideDisplay.prototype.render=function(){for(var a=this.getAllElementsData(),b,c=0;c<a.length;c++)b=this.renderElement(a[c]),this.elements.push(b);this.on("buildInStart buildInEnd buildOutStart buildOutEnd",function(a){for(var b=0;b<this.elements.length;b++){var c="slide"+a.type.charAt(0).toUpperCase()+a.type.substr(1);this.elements[b].trigger(c,this)}});this.rendered=!0};
SlideDisplay.prototype.renderElement=function(a){var b,c=a.properties;c.buildIn=c.buildIn||{type:"none",delay:0,duration:0};c.buildOut=c.buildOut||{type:"none",delay:0,duration:0};c.buildIn.duration=parseFloat(c.buildIn.duration);c.buildIn.delay=parseFloat(c.buildIn.delay);c.buildOut.duration=parseFloat(c.buildOut.duration);c.buildOut.delay=parseFloat(c.buildOut.delay);switch(a.layerType){case "text":b=new TextDisplay;break;case "image":b=new ImageDisplay;break;case "button":b=new ButtonDisplay;break;
case "shape":b=new ShapeDisplay;break;case "youtube":b=new YoutubeDisplay}b&&(b.slide=this,a=b.init(a).getContainer(),this.container.appendChild(a),b.render());return b};SlideDisplay.prototype.getNextSlide=function(){var a=this.banner.slides,b=a.indexOf(this);return b+1>=a.length?this.banner.slides[0]:this.banner.slides[b+1]};SlideDisplay.prototype.getPrevSlide=function(){var a=this.banner.slides.indexOf(this);return 0>a-1?this.banner.slides[this.banner.slides.length-1]:this.banner.slides[a-1]};
SlideDisplay.prototype.getAllElementsData=function(){var a=JSON.parse(JSON.stringify(this.banner.overflowSlide.displayData.elements));return this.displayData.elements.concat(a)};
SlideDisplay.prototype.playSlideAnimation=function(a){var b=this.getAnimationEl(),c,d=this,e=this.displayData.properties,f=this.banner.lastSlide?this.banner.lastSlide.container:null,g=this.banner.slides.length,h=0,k;for(c=0;c<this.banner.slides.length;c++)k=this.banner.slides[c].container,k.style.zIndex=0,k.style.display="none";this.container.style.display="";this.container.style.zIndex=0;this.trigger("buildInStart");a&&"none"!==a.type&&!this.banner.noAnimation&&1<g?(h=parseFloat(a.duration)||0,f&&
(f.style.display=""),"hide"!==a.crosstype?eaAnimations.animate(b,a,"buildIn"):f&&(f.style.zIndex=2),setTimeout(function(){d.trigger("buildInEnd")},1E3*a.duration)):this.trigger("buildInEnd");e.stopSlide||this.banner.showOnlyOneSlide||(this._buildOutTimeout=setTimeout(function(){d.buildOut()},1E3*(h+e.duration)));if(!this.banner.noAnimation)for(c=0;c<this.elements.length;c++)this.elements[c].playAnimation(h)};
SlideDisplay.prototype.buildOut=function(a){this._buildOutTimeout&&clearTimeout(this._buildOutTimeout);var b=this.banner.slides.length,c=this.displayData.properties.transition,d=this;d.trigger("buildOutStart");c&&"none"!==c.type&&1<b?("show"!==c.crosstype&&eaAnimations.animate(this.getAnimationEl(),eaUtils.cloneObject(c),"buildOut"),setTimeout(function(){d.container.style.display="none";d.trigger("buildOutEnd")},1E3*c.duration)):d.trigger("buildOutEnd");a||(a=this.getNextSlide());a.play(eaUtils.cloneObject(c))};
SlideDisplay.prototype.getSlideByHash=function(a){if(!a)return!1;for(var b=this.banner.slides,c=0;c<b.length;c++)if(a==b[c].ah)return b[c];return!1};"use strict";function EmbedCanvas(){EventDispatcher.call(this)}EmbedCanvas.prototype=new EventDispatcher;EmbedCanvas.prototype.constructor=EmbedCanvas;
EmbedCanvas.prototype.init=function(a,b,c){this.json=b;this.config=c;this.banner=new BannerDisplay;this.banner.init(b.banner,a,c);this.banner.play();a=new Stats(this.json.hash);a.isBlockedDomain(document.referrer)||c.preview||c.download||a.track();this.stats=a};
