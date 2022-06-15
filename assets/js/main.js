/* 기본설정 */
(function () {
	if ( typeof window.CustomEvent === "function" ) return false; //If not IE
  
	function CustomEvent ( event, params ) {
	  params = params || { bubbles: false, cancelable: false, detail: undefined };
	  var evt = document.createEvent( 'CustomEvent' );
	  evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
	  return evt;
	 }
  
	CustomEvent.prototype = window.Event.prototype;
  
	window.CustomEvent = CustomEvent;
})();


var Joytown = Joytown || {};

Joytown.deepExtend = function (out) {
	out = out || {};
  
	for (var i = 1; i < arguments.length; i++) {
	  var obj = arguments[i];
  
	  if (!obj) continue;
  
	  for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
		  if (typeof obj[key] === "object" && obj[key] !== null) {
			if (obj[key] instanceof Array) out[key] = obj[key].slice(0);
			else out[key] = Joytown.deepExtend(out[key], obj[key]);
		  } else out[key] = obj[key];
		}
	  }
	}
  
	return out;
};

Joytown.InView = function(prop){
	var _self = this;
	var _target = null;
	var _latitude = 'bottom';
	var _isScreenIn = false;

	var _height = 0;
	var _startTop = 0;
	var _scrollRange = {'min':0,'max':0};

	var _margin = {'top':0, 'bottom':0};
	var margin = {'top':0, 'bottom':0};

	var winY = 0;
	var winX = 0;
	var _top = 0;
	var _left = 0;
	var _height = 0;
	var _width = 0;

	function init(){
		// if (document.body.dataset.domloaded === undefined) { // dom load 되기 전 실행되면 load 하고 실행
		// 	document.addEventListener('DOMContentLoaded', function(){
		// 		setTarget();
		// 		setLatitude();
		// 		setLoc();
		// 		setScrollEvent();
		// 		setScreenInOutEvent();
		// 		setScreenOnEvent();
		// 	});

		// 	return;
		// }
		setTarget();
		setLatitude();
		setLoc();
		setScrollEvent();
		setScreenInOutEvent();
		setScreenOnEvent();
	}

    function setTarget(){
		_target = prop['target'];
		_target.module = _self;
		console.log(_target, '!')
	}

	function setLatitude(){
		if( prop['latitude'] == null || prop['latitude'] == undefined) return null;
		_latitude = prop['latitude'];
	}

	function setScrollEvent(){
		onScrollEvent();
		window.addEventListener('scroll', onScrollEvent);
	}

	function onScrollEvent(e){
		_self.update();

		_flag = _top < (winY + window.innerHeight - margin.bottom) &&
		_left < (winX + window.innerWidth) &&
		(_top + _height) > winY + margin.top &&
		(_left + _width) > winX;


		if (_flag) {
			if(!_isScreenIn){
				_isScreenIn = true;
				_target.dispatchEvent(new CustomEvent('screenIn'));
			}
			_target.dispatchEvent(new CustomEvent('screenOn'));

			return;
		}
	
		if(_isScreenIn){
			_isScreenIn = false;
			_target.dispatchEvent(new CustomEvent('screenOut'));
		}
		
		_target.dispatchEvent(new CustomEvent('screenOff'));
	}

	function setScreenInOutEvent(){
		_target.addEventListener('screenIn', onScreenInHandler);
		_target.addEventListener('screenOut', onScreenOutHandler);
	}

	function onScreenInHandler(e){
		//console.log("## onScreenInHandler");
	}

	function onScreenOutHandler(e){
		//console.log("## onScreenOutHandler");
	}

	function setScreenOnEvent(){
		_target.addEventListener('screenOn', onScreenOnHandler);
	}

	function onScreenOnHandler(e){
		//console.log("## onScreenOnHandler");
	}

	function setLoc(){
		_self.update();
	}

	this.update = function(){
		var docHeight = 0;

		if (document.querySelector('.dock-menu') !== null) {
			var $docbar = document.querySelector('.dock-menu');
			docHeight = $docbar.querySelector('.dock-depth2') !== null ? $docbar.offsetHeight + $docbar.querySelector('.dock-depth2').offsetHeight : $docbar.offsetHeight;
		}

		var windowHeight = window.innerHeight - docHeight;

		function convertSize(before) {
			if (typeof(before) === 'string') {
				before = before.trim();
				if (before.substr(-1) === '%') {
					return Math.floor(windowHeight * (parseInt(before)/100));
				}
				return parseInt(before);
			}
			return before;
		}

		_margin = Joytown.deepExtend({}, _margin, prop['margin']);
		margin.top = convertSize(_margin.top);
		margin.bottom = convertSize(_margin.bottom) + docHeight;

		_self.updatePosition();
	}

	this.updatePosition = function(){
		var rect = _target.getBoundingClientRect();

		winY = document.documentElement.scrollTop;
		winX = document.documentElement.scrollLeft;

		_top = rect.top + document.documentElement.scrollTop;
		_left = rect.left + document.documentElement.scrollLeft;
		_height = _target.offsetHeight;
		_width = _target.offsetWidth;
	}

	this.accept = function (visitor) {
		visitor.visit(_self);
	};

	this.getRange = function(){
		return _scrollRange;
	}

	init();
}