(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("innoway", [], factory);
	else if(typeof exports === 'object')
		exports["innoway"] = factory();
	else
		root["innoway"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var customer_config_1 = __webpack_require__(2);
	var server_config_1 = __webpack_require__(3);
	var customer_const_1 = __webpack_require__(4);
	var Customer = (function () {
	    function Customer(token) {
	        if (token === void 0) { token = null; }
	        this.authenticated = false;
	        if (token == null) {
	            token = localStorage.getItem(customer_config_1.CustomerConfig.authTokenStorage);
	        }
	        if (token != null) {
	            this.loginWithToken(token);
	        }
	    }
	    Customer.prototype.requiedAuthenticate = function (callback) {
	        if (callback === void 0) { callback = function () { }; }
	        if (!this.authenticated) {
	            callback('PERMISSION ERROR', "You don't have permission to access");
	        }
	        return this.authenticated;
	    };
	    //====== Auth
	    //LOGIN
	    Customer.prototype.login = function (phone, password, callback) {
	        var _this = this;
	        if (callback === void 0) { callback = function () { }; }
	        $.ajax({
	            type: 'POST',
	            url: customer_config_1.CustomerConfig.loginUrl,
	            dataType: 'json',
	            data: {
	                Phone: phone,
	                Password: password
	            }
	        })
	            .done(function (res) {
	            if (res.StatusCode === 200) {
	                _this.user = res.Data;
	                _this._token = res.Data.Token;
	                _this.authenticated = true;
	                $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                localStorage.setItem(customer_config_1.CustomerConfig.authTokenStorage, res.Data.Token);
	                callback(null, res.Data);
	            }
	            else {
	                _this.authenticated = false;
	                $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                callback(res.StatusCode, res.StatusMessage);
	            }
	        })
	            .fail(function (request, err, status) {
	            _this.authenticated = false;
	            $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	            callback(err, status);
	        });
	    };
	    //GET CUSTOMER
	    Customer.prototype.loginWithToken = function (token, callback) {
	        var _this = this;
	        if (callback === void 0) { callback = function () { }; }
	        console.log('TOKEN', token);
	        $.ajax({
	            type: 'POST',
	            url: customer_config_1.CustomerConfig.getCustomerUrl,
	            dataType: 'json',
	            headers: {
	                'token': token
	            }
	        })
	            .done(function (res) {
	            console.log(res);
	            if (res.StatusCode === 200) {
	                _this.user = res.Data;
	                _this._token = res.Data.Token;
	                _this.authenticated = true;
	                $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                localStorage.setItem(customer_config_1.CustomerConfig.authTokenStorage, res.Data.Token);
	                callback(null, res.Data);
	            }
	            else {
	                _this.authenticated = false;
	                $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                callback(res.StatusCode, res.StatusMessage);
	            }
	        })
	            .fail(function (request, err, status) {
	            console.log('FAIL', request);
	            _this.authenticated = false;
	            $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	            callback(err, status);
	        });
	    };
	    //LOGIN WITH GOOGLE
	    Customer.prototype.loginWithGoolge = function () {
	    };
	    //LOGIN WITH FACEBOOK
	    Customer.prototype.loginWithFacebook = function () {
	    };
	    //SIGNUP
	    Customer.prototype.signUp = function (data, callback) {
	        var _this = this;
	        if (callback === void 0) { callback = function () { }; }
	        $.ajax({
	            type: 'POST',
	            url: customer_config_1.CustomerConfig.signUpUrl,
	            dataType: 'json',
	            data: data
	        })
	            .done(function (res) {
	            if (res.StatusCode === 200) {
	                _this.user = res.Data;
	                _this._token = res.Data.Token;
	                _this.authenticated = true;
	                $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                localStorage.setItem(customer_config_1.CustomerConfig.authTokenStorage, res.Data.Token);
	                callback(null, res.Data);
	            }
	            else {
	                _this.authenticated = false;
	                $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                callback(res.StatusCode, res.StatusMessage);
	            }
	        })
	            .fail(function (request, err, status) {
	            _this.authenticated = false;
	            $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	            callback(err, status);
	        });
	    };
	    //Update Customer
	    Customer.prototype.update = function (token, data, callback) {
	        var _this = this;
	        if (callback === void 0) { callback = function () { }; }
	        $.ajax({
	            type: 'POST',
	            url: customer_config_1.CustomerConfig.updateCustomerUrl,
	            dataType: 'json',
	            data: data,
	            headers: {
	                'token': token
	            }
	        })
	            .done(function (res) {
	            if (res.StatusCode === 200) {
	                $(_this).trigger(customer_const_1.CustomerEvents.CustomerEdited, res.Data);
	                _this.user = res.Data;
	                callback(null, res.Data);
	            }
	            else {
	                callback(res.StatusCode, res.StatusMessage);
	            }
	        })
	            .fail(function (request, err, status) {
	            callback(err, status);
	        });
	    };
	    //====== BILLS
	    //GET LIST BILLS
	    Customer.prototype.getBills = function (callback) {
	        if (callback === void 0) { callback = function () { }; }
	        if (this.requiedAuthenticate(callback)) {
	            $.ajax({
	                type: 'POST',
	                url: customer_config_1.CustomerConfig.getBillsUrl,
	                dataType: 'json',
	                headers: {
	                    'token': this._token
	                }
	            })
	                .done(function (res) {
	                if (res.StatusCode === 200) {
	                    callback(null, res.Data);
	                }
	                else {
	                    callback(res.StatusCode, res.StatusMessage);
	                }
	            })
	                .fail(function (request, err, status) {
	                callback(err, status);
	            });
	        }
	    };
	    //=========== STATIC METHODS ==================
	    //====== PRODUCTS
	    //GET ALL PRODUCTS
	    Customer.getAllProducts = function (callback) {
	        $.ajax({
	            type: 'GET',
	            url: customer_config_1.CustomerConfig.getAllProductsUrl,
	            dataType: 'json',
	            crossDomain: true
	        })
	            .done(function (res) {
	            if (res.StatusCode === 200) {
	                res.Data.forEach(function (product) {
	                    product.Thumbnail = server_config_1.ServerConfig.host + server_config_1.ServerConfig.filesPath + product.Thumbnail;
	                });
	                callback(null, res.Data);
	            }
	            else {
	                callback(res.StatusCode, res.StatusMessage);
	            }
	        })
	            .fail(function (request, err, status) {
	            callback(err, status);
	        });
	    };
	    Customer.events = customer_const_1.CustomerEvents;
	    return Customer;
	}());
	exports.Customer = Customer;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var server_config_1 = __webpack_require__(3);
	exports.CustomerConfig = {
	    authTokenStorage: 'innoway.Customer.auth.token',
	    loginUrl: server_config_1.APIPath + 'CustomerLogin',
	    signUpUrl: server_config_1.APIPath + 'Register',
	    updateCustomerUrl: server_config_1.APIPath + 'EditCustomer',
	    getBillsUrl: server_config_1.APIPath + 'GetListBillFromCustomer',
	    getBillUrl: server_config_1.APIPath + 'GetBill',
	    getAllProductsUrl: server_config_1.APIPath + 'GetAllProduct',
	    sendBillUrl: server_config_1.APIPath + 'SendBill',
	    addFeedbackUrl: server_config_1.APIPath + 'AddFeedback',
	    getPromotionsUrl: server_config_1.APIPath + 'Promotions',
	    getCustomerUrl: server_config_1.APIPath + 'GetCustomer',
	    getBlogsUrl: server_config_1.ServerConfig.host + '/blog/wp-json/posts',
	};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	exports.ServerConfig = {
	    host: 'http://phincafe.vn',
	    filesPath: '/uploads/',
	    apiPath: '/apis/v1/'
	};
	exports.APIPath = exports.ServerConfig.host + exports.ServerConfig.apiPath;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	exports.CustomerEvents = {
	    AuthStateChange: 'AuthStateChange',
	    CustomerEdited: 'CustomerEdited',
	};


/***/ })
/******/ ])
});
;
//# sourceMappingURL=innoway.js.map