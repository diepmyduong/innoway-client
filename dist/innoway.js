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
	var customer_1 = __webpack_require__(2);
	var employee_1 = __webpack_require__(8);
	module.exports = {
	    Customer: customer_1.Customer,
	    Employee: employee_1.Employee
	};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var customer_config_1 = __webpack_require__(3);
	var server_config_1 = __webpack_require__(4);
	var customer_const_1 = __webpack_require__(5);
	var fb_config_1 = __webpack_require__(6);
	var google_config_1 = __webpack_require__(7);
	fb_config_1.FBConfig();
	google_config_1.GoogleConfig();
	var Customer = (function () {
	    function Customer(token) {
	        //Check FB Login
	        //Check Google Login
	        if (token === void 0) { token = null; }
	        this.authenticated = false;
	        if (this instanceof Customer) {
	            if (token == null) {
	                token = localStorage.getItem(customer_config_1.CustomerConfig.authTokenStorage);
	            }
	            if (token != null) {
	                this.loginWithToken(token);
	            }
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
	        $.ajax({
	            type: 'POST',
	            url: customer_config_1.CustomerConfig.getCustomerUrl,
	            dataType: 'json',
	            headers: {
	                'token': token
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
	    //LOGIN WITH GOOGLE
	    Customer.prototype.loginWithGoogle = function (callback) {
	        if (callback === void 0) { callback = function () { }; }
	        var self = this;
	        var auth2 = gapi.auth2.getAuthInstance();
	        // Sign-In
	        auth2.signIn()
	            .then(function (profile) {
	            // var idToken = profile.getAuthResponse().id_token;
	            // callback(null,profile.getId());
	            self.getUserWithProvider('google', profile.getId(), callback);
	        }, function (error) {
	            callback('Authentication failed.', error);
	        });
	    };
	    //LOGIN WITH FACEBOOK
	    Customer.prototype.loginWithFacebook = function (callback) {
	        if (callback === void 0) { callback = function () { }; }
	        var self = this;
	        FB.login(function (response) {
	            if (response.authResponse) {
	                // callback(null,FB.getAccessToken());
	                // callback(null,FB.getUserID());
	                self.getUserWithProvider('facebook', FB.getUserID(), callback);
	            }
	            else {
	                callback('User cancelled login or did not fully authorize.', null);
	            }
	        });
	    };
	    Customer.prototype.getUserWithProvider = function (provider, token, callback) {
	        var _this = this;
	        if (callback === void 0) { callback = function () { }; }
	        var form = new FormData();
	        form.append("Method", provider);
	        form.append("Token", token);
	        var settings = {
	            "async": true,
	            "crossDomain": true,
	            "url": customer_config_1.CustomerConfig.loginUrl,
	            "method": "POST",
	            "processData": false,
	            "contentType": false,
	            "mimeType": "multipart/form-data",
	            "data": form,
	            success: function (result, status, res) {
	                var resJson = JSON.parse(res.responseText);
	                if (resJson.StatusCode === 200) {
	                    _this.user = resJson.Data;
	                    _this._token = resJson.Data.Token;
	                    _this.authenticated = true;
	                    $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                    localStorage.setItem(customer_config_1.CustomerConfig.authTokenStorage, resJson.Data.Token);
	                    callback(null, resJson.Data);
	                }
	                else {
	                    _this.authenticated = false;
	                    $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                    callback('User not signup', token);
	                }
	            },
	            error: function (res, status, err) {
	                var resJson = JSON.parse(res.responseText);
	                _this.authenticated = false;
	                $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                callback('User not signup', token);
	            }
	        };
	        $.ajax(settings);
	    };
	    //LOGOUT
	    Customer.prototype.logout = function () {
	        FB.logout();
	        // Get `GoogleAuth` instance
	        var auth2 = gapi.auth2.getAuthInstance();
	        auth2.signOut();
	        localStorage.removeItem(customer_config_1.CustomerConfig.authTokenStorage);
	        this._token = null;
	        this.user = null;
	        this.authenticated = false;
	    };
	    //SIGNUP
	    Customer.prototype.signUp = function (data, callback) {
	        var _this = this;
	        if (callback === void 0) { callback = function () { }; }
	        var form = new FormData();
	        form.append("Phone", data.phone);
	        form.append("Password", data.password);
	        form.append("Fullname", data.fullName);
	        form.append("Email", data.email);
	        form.append("FacebookToken", "");
	        form.append("GoogleToken", "");
	        var settings = {
	            async: true,
	            crossDomain: true,
	            url: customer_config_1.CustomerConfig.signUpUrl,
	            method: "POST",
	            processData: false,
	            contentType: false,
	            mimeType: "multipart/form-data",
	            data: form,
	            success: function (result, status, res) {
	                var resJson = JSON.parse(res.responseText);
	                if (resJson.StatusCode === 200) {
	                    _this.user = resJson.Data;
	                    _this._token = resJson.Data.Token;
	                    _this.authenticated = true;
	                    $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                    localStorage.setItem(customer_config_1.CustomerConfig.authTokenStorage, resJson.Data.Token);
	                    callback(null, resJson.Data);
	                }
	                else {
	                    _this.authenticated = false;
	                    $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                    callback(resJson.StatusCode, resJson.StatusMessage);
	                }
	            },
	            error: function (res, status, err) {
	                var resJson = JSON.parse(res.responseText);
	                _this.authenticated = false;
	                $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                callback(resJson.StatusCode, resJson.StatusMessage);
	            }
	        };
	        $.ajax(settings);
	    };
	    Customer.prototype.signUpWithProvider = function (provider, token, data, callback) {
	        var _this = this;
	        if (callback === void 0) { callback = function () { }; }
	        var form = new FormData();
	        form.append("Phone", data.phone);
	        form.append("Password", "");
	        form.append("Fullname", data.fullName);
	        form.append("Email", data.email);
	        switch (provider) {
	            case 'facebook':
	                form.append("FacebookToken", token);
	                form.append("GoogleToken", "");
	                break;
	            case 'google':
	                form.append("FacebookToken", "");
	                form.append("GoogleToken", token);
	                break;
	        }
	        var settings = {
	            async: true,
	            crossDomain: true,
	            url: customer_config_1.CustomerConfig.signUpUrl,
	            method: "POST",
	            processData: false,
	            contentType: false,
	            mimeType: "multipart/form-data",
	            data: form,
	            success: function (result, status, res) {
	                var resJson = JSON.parse(res.responseText);
	                if (resJson.StatusCode === 200) {
	                    _this.user = resJson.Data;
	                    _this._token = resJson.Data.Token;
	                    _this.authenticated = true;
	                    $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                    localStorage.setItem(customer_config_1.CustomerConfig.authTokenStorage, resJson.Data.Token);
	                    callback(null, resJson.Data);
	                }
	                else {
	                    _this.authenticated = false;
	                    $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                    callback(resJson.StatusCode, resJson.StatusMessage);
	                }
	            },
	            error: function (res, status, err) {
	                var resJson = JSON.parse(res.responseText);
	                _this.authenticated = false;
	                $(_this).trigger(customer_const_1.CustomerEvents.AuthStateChange, _this.authenticated);
	                callback(resJson.StatusCode, resJson.StatusMessage);
	            }
	        };
	        $.ajax(settings);
	    };
	    //Update Customer
	    Customer.prototype.update = function (data, callback) {
	        var _this = this;
	        if (callback === void 0) { callback = function () { }; }
	        if (this.requiedAuthenticate(callback)) {
	            $.ajax({
	                type: 'POST',
	                url: customer_config_1.CustomerConfig.updateCustomerUrl,
	                dataType: 'json',
	                data: data,
	                headers: {
	                    'token': this._token
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
	        }
	    };
	    //====== BILLS
	    //== CARDS
	    //GET CARDS
	    Customer.getCards = function () {
	        this.cards = JSON.parse(localStorage.getItem(customer_config_1.CustomerConfig.cardsStorage));
	        if (!this.cards) {
	            this.cards = [];
	        }
	        $(this).trigger(customer_const_1.CustomerEvents.CardsChange, { data: this.cards });
	        return this.cards;
	    };
	    Customer.saveCards = function () {
	        localStorage.setItem(customer_config_1.CustomerConfig.cardsStorage, JSON.stringify(this.cards));
	    };
	    //Add to Cards
	    Customer.addToCard = function (product) {
	        var existedIndex = 0;
	        var existed = this.cards.filter(function (pr, index) {
	            if (pr.Id == product.Id) {
	                existedIndex = index;
	                return true;
	            }
	            return false;
	        });
	        if (existed.length > 0) {
	            this.cards[existedIndex].Quantity++;
	        }
	        else {
	            product.Quantity = 1;
	            this.cards.push(product);
	        }
	        this.saveCards();
	        $(this).trigger(customer_const_1.CustomerEvents.CardsChange, { data: this.cards });
	    };
	    //Remove form Cards
	    Customer.removeCard = function (product) {
	        var existedIndex = 0;
	        var existed = this.cards.filter(function (pr, index) {
	            if (pr.Id == product.Id) {
	                existedIndex = index;
	                return true;
	            }
	            return false;
	        });
	        if (existed.length > 0) {
	            this.cards.splice(existedIndex, 1);
	            this.saveCards();
	            $(this).trigger(customer_const_1.CustomerEvents.CardsChange, { data: this.cards });
	        }
	    };
	    Customer.clearCard = function () {
	        this.cards = [];
	        this.saveCards();
	        $(this).trigger(customer_const_1.CustomerEvents.CardsChange, { data: this.cards });
	    };
	    //Decrease Card Quantity
	    Customer.decreaseCard = function (product) {
	        var existedIndex = 0;
	        var existed = this.cards.filter(function (pr, index) {
	            if (pr.Id == product.Id) {
	                existedIndex = index;
	                return true;
	            }
	            return false;
	        });
	        if (existed.length > 0) {
	            if (this.cards[existedIndex].Quantity == 1) {
	                this.cards.splice(existedIndex, 1);
	            }
	            else {
	                this.cards[existedIndex].Quantity--;
	            }
	            this.saveCards();
	            $(this).trigger(customer_const_1.CustomerEvents.CardsChange, { data: this.cards });
	        }
	    };
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
	                    res.Data.forEach(function (bill) {
	                        switch (bill.Status) {
	                            case "-1":
	                                bill.Status = Customer.billStatus.DELETED;
	                                break;
	                            case "0":
	                                bill.Status = Customer.billStatus.DELIVERING;
	                                break;
	                            case "1":
	                                bill.Status = Customer.billStatus.WAITING;
	                                break;
	                            case "2":
	                                bill.Status = Customer.billStatus.NOT_DELIVERING;
	                                break;
	                            case "4":
	                                bill.Status = Customer.billStatus.PAYED;
	                                break;
	                            default:
	                                bill.Status = Customer.billStatus.UNKNOW;
	                        }
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
	        }
	    };
	    //GET BILL DETAIL
	    Customer.prototype.getBillDetail = function (billId, callback) {
	        if (!this.requiedAuthenticate(callback))
	            return;
	        var form = new FormData();
	        form.append("BillId", billId);
	        var settings = {
	            "async": true,
	            "crossDomain": true,
	            "url": customer_config_1.CustomerConfig.getBillUrl,
	            "method": "POST",
	            "headers": {
	                "Token": this._token
	            },
	            "processData": false,
	            "contentType": false,
	            "mimeType": "multipart/form-data",
	            "data": form,
	            success: function (result, status, res) {
	                var resJson = JSON.parse(res.responseText);
	                if (resJson.StatusCode === 200) {
	                    //Set status
	                    switch (resJson.Data.Status) {
	                        case "-1":
	                            resJson.Data.Status = Customer.billStatus.DELETED;
	                            break;
	                        case "0":
	                            resJson.Data.Status = Customer.billStatus.DELIVERING;
	                            break;
	                        case "1":
	                            resJson.Data.Status = Customer.billStatus.WAITING;
	                            break;
	                        case "2":
	                            resJson.Data.Status = Customer.billStatus.NOT_DELIVERING;
	                            break;
	                        case "4":
	                            resJson.Data.Status = Customer.billStatus.PAYED;
	                            break;
	                        default:
	                            resJson.Data.Status = Customer.billStatus.UNKNOW;
	                    }
	                    if (resJson.Data.PromotionId) {
	                        resJson.Data.Promotion = "Có";
	                    }
	                    else {
	                        resJson.Data.Promotion = "Không Có";
	                    }
	                    //Set thumbnail
	                    resJson.Data.BillDetails.forEach(function (product) {
	                        product.ProductThumb = server_config_1.ServerConfig.host + server_config_1.ServerConfig.filesPath + product.ProductThumb;
	                    });
	                    callback(null, resJson.Data);
	                }
	                else {
	                    callback(resJson.StatusCode, resJson.StatusMessage);
	                }
	            },
	            error: function (res, status, err) {
	                var resJson = JSON.parse(res.responseText);
	                callback(resJson.StatusCode, resJson.StatusMessage);
	            }
	        };
	        $.ajax(settings);
	    };
	    Customer.prototype.sendBill = function (bill, callback) {
	        if (callback === void 0) { callback = function () { }; }
	        if (!this.requiedAuthenticate(callback))
	            return;
	        var form = new FormData();
	        form.append("Latitude", bill.latitude);
	        form.append("Longitude", bill.longitude);
	        form.append("BillDetails", JSON.stringify(bill.details));
	        form.append("PromotionCode", bill.promotionCode);
	        form.append("Address", bill.address);
	        form.append("Area", bill.area);
	        console.log(this._token);
	        var settings = {
	            "async": true,
	            "crossDomain": true,
	            "url": customer_config_1.CustomerConfig.sendBillUrl,
	            "method": "POST",
	            "headers": {
	                "token": this._token
	            },
	            "processData": false,
	            "contentType": false,
	            "mimeType": "multipart/form-data",
	            "data": form,
	            success: function (result, status, res) {
	                var resJson = JSON.parse(res.responseText);
	                if (resJson.StatusCode === 200) {
	                    callback(null, resJson.Data);
	                }
	                else {
	                    callback(resJson.StatusCode, resJson.StatusMessage);
	                }
	            },
	            error: function (res, status, err) {
	                var resJson = JSON.parse(res.responseText);
	                callback(resJson.StatusCode, resJson.StatusMessage);
	            }
	        };
	        $.ajax(settings);
	    };
	    //PROMOTIONS
	    //GET PROMOTIONS
	    Customer.prototype.getPromotions = function (callback) {
	        if (!this.requiedAuthenticate(callback))
	            return;
	        var settings = {
	            "async": true,
	            "crossDomain": true,
	            "url": customer_config_1.CustomerConfig.getPromotionsUrl,
	            "method": "GET",
	            "headers": {
	                "token": this._token
	            }
	        };
	        $.ajax(settings).done(function (res) {
	            if (res.StatusCode === 200) {
	                res.Data.forEach(function (promotion) {
	                    promotion.Photo = server_config_1.ServerConfig.host + server_config_1.ServerConfig.filesPath + promotion.Photo;
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
	    Customer.getAllBlogs = function (callback) {
	        var settings = {
	            "async": true,
	            "crossDomain": true,
	            "url": customer_config_1.CustomerConfig.getBlogsUrl,
	            "method": "GET"
	        };
	        $.ajax(settings).done(function (response) {
	            callback(null, response);
	        }).fail(function (request, err, status) {
	            callback(err, status);
	        });
	    };
	    //Events
	    Customer.events = customer_const_1.CustomerEvents;
	    Customer.billStatus = customer_const_1.BillStatus;
	    //Bill Info
	    Customer.cards = [];
	    return Customer;
	}());
	exports.Customer = Customer;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var server_config_1 = __webpack_require__(4);
	exports.CustomerConfig = {
	    //KEYS
	    authTokenStorage: 'innoway.Customer.auth.token',
	    cardsStorage: 'innoway.Customer.cards',
	    //API
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
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	exports.ServerConfig = {
	    host: 'http://phincafe.vn',
	    filesPath: '/uploads/',
	    apiPath: '/apis/v1/',
	    FBAPI: '893757327425340',
	    GoogleAPI: '235416124042-2papc83kbjf14g3m9on0cal3bmihdqm9.apps.googleusercontent.com' //Local
	};
	exports.APIPath = exports.ServerConfig.host + exports.ServerConfig.apiPath;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";
	exports.CustomerEvents = {
	    AuthStateChange: 'AuthStateChange',
	    CustomerEdited: 'CustomerEdited',
	    //CARD EVENT
	    CardsChange: 'CardsChange',
	};
	exports.BillStatus = {
	    NOT_DELIVERING: "Đang điều phối",
	    WAITING: "Đã điều phối",
	    DELIVERING: "Đang giao",
	    PAYED: "Đã thanh toán",
	    DELETED: "Đã huỷ",
	    UNKNOW: "Không xác định"
	};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var server_config_1 = __webpack_require__(4);
	//Facebook Config
	exports.FBConfig = function () {
	    var d = document;
	    var s = 'script';
	    var id = 'facebook-jssdk';
	    window.fbAsyncInit = function () {
	        FB.init({
	            appId: server_config_1.ServerConfig.FBAPI,
	            xfbml: true,
	            version: 'v2.9'
	        });
	        FB.AppEvents.logPageView();
	    };
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) {
	        return;
	    }
	    js = d.createElement(s);
	    js.id = id;
	    js.src = "//connect.facebook.net/en_US/sdk.js";
	    fjs.parentNode.insertBefore(js, fjs);
	};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var server_config_1 = __webpack_require__(4);
	exports.GoogleConfig = function () {
	    var d = document;
	    var s = 'script';
	    var id = 'google-jssdk';
	    var m = d.getElementsByTagName('head')[0];
	    var meta = d.createElement('meta');
	    meta.name = 'google-signin-client_id';
	    meta.content = server_config_1.ServerConfig.GoogleAPI;
	    m.parentNode.insertBefore(meta, m);
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) {
	        return;
	    }
	    js = d.createElement(s);
	    js.id = id;
	    js.src = "https://apis.google.com/js/api.js";
	    js.async = true;
	    js.onload = function () {
	        gapi.load('auth2', function () {
	            // Initialize `auth2`
	            gapi.auth2.init();
	        });
	    };
	    fjs.parentNode.insertBefore(js, fjs);
	};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var employee_config_1 = __webpack_require__(9);
	var Employee = (function () {
	    function Employee() {
	    }
	    Employee.getAllCategory = function (callback) {
	        var settings = {
	            "async": true,
	            "crossDomain": true,
	            "url": employee_config_1.EmployeeConfig.GetAllCategoryUrl,
	            "method": "GET",
	            success: function (result, status, res) {
	                var resJson = JSON.parse(res.responseText);
	                if (resJson.StatusCode === 200) {
	                    callback(null, resJson.Data);
	                }
	                else {
	                    callback(resJson.StatusCode, resJson.StatusMessage);
	                }
	            },
	            error: function (res, status, err) {
	                var resJson = JSON.parse(res.responseText);
	                callback(resJson.StatusCode, resJson.StatusMessage);
	            }
	        };
	        $.ajax(settings);
	    };
	    return Employee;
	}());
	exports.Employee = Employee;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var server_config_1 = __webpack_require__(4);
	exports.EmployeeConfig = {
	    GetAllCategoryUrl: server_config_1.APIPath + 'GetAllCategory',
	};


/***/ })
/******/ ])
});
;
//# sourceMappingURL=innoway.js.map