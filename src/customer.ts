import { CustomerConfig } from './configs/customer.config';
import { ServerConfig } from './configs/server.config';
import { CustomerEvents,BillStatus } from './constants/customer.const';
import { FBConfig  } from './configs/fb.config';
import { GoogleConfig } from './configs/google.config';
declare var $:any,FB:any,gapi:any,window:any;
FBConfig();
GoogleConfig();
export class Customer {
    //Events
    public static events = CustomerEvents;
    public static billStatus = BillStatus;
    //User Info
    private _token:string;
    public user:any;
    public authenticated: boolean = false;
    //Bill Info
    public static cards:any[] = [];

    constructor(token:string = null){
        //Check FB Login
        //Check Google Login
        
        if(this instanceof Customer){
            if(token == null){
                token = localStorage.getItem(CustomerConfig.authTokenStorage);
            }
            if(token != null){
                this.loginWithToken(token);
            }
        }
        
    } 
    private requiedAuthenticate(callback:any = ()=>{}){
        if(!this.authenticated){
            callback('PERMISSION ERROR',"You don't have permission to access");
        }
        return this.authenticated
    }
    //====== Auth
    //LOGIN
    public login(phone:string,password:string,callback:any = ()=>{}){
        $.ajax({
            type: 'POST',
            url: CustomerConfig.loginUrl,
            dataType:'json',
            data: {
                Phone   : phone,
                Password: password
            }
        })
        .done((res:any) => {
            if(res.StatusCode === 200){
                this.user = res.Data;
                this._token = res.Data.Token;
                this.authenticated = true;
                $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                localStorage.setItem(CustomerConfig.authTokenStorage,res.Data.Token);
                callback(null,res.Data);
            }else{
                this.authenticated = false;
                $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                callback(res.StatusCode,res.StatusMessage);
            }
            
        })
        .fail((request:any,err:any,status:any)=>{
            this.authenticated = false;
            $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
            callback(err,status);
        });
    }
    //GET CUSTOMER
    public loginWithToken(token:string,callback:any = ()=>{}){
        $.ajax({
            type: 'POST',
            url: CustomerConfig.getCustomerUrl,
            dataType: 'json',
            headers: {
                'token': token
            }
        })
        .done((res:any) => {
            if(res.StatusCode === 200){
                this.user = res.Data;
                this._token = res.Data.Token;
                this.authenticated = true;
                $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                localStorage.setItem(CustomerConfig.authTokenStorage,res.Data.Token);
                callback(null,res.Data);
            }else{
                this.authenticated = false;
                $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                callback(res.StatusCode,res.StatusMessage);
            }
        })
        .fail((request:any,err:any,status:any)=>{
            this.authenticated = false;
            $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
            callback(err,status);
        })
    }
    //LOGIN WITH GOOGLE
    public loginWithGoogle(callback:any=()=>{}){
        var self = this;
        var auth2 = gapi.auth2.getAuthInstance();
        // Sign-In
        auth2.signIn()
        .then((profile:any)=>{
            // var idToken = profile.getAuthResponse().id_token;
            // callback(null,profile.getId());
            self.getUserWithProvider('google',profile.getId(),callback);
        },(error:any)=>{
            callback('Authentication failed.',error);
        });
    }
    //LOGIN WITH FACEBOOK
    public loginWithFacebook(callback:any = ()=>{}){
        var self = this;
        FB.login(function(response:any) {
            if (response.authResponse) {
                // callback(null,FB.getAccessToken());
                // callback(null,FB.getUserID());
                self.getUserWithProvider('facebook',FB.getUserID(),callback);
            } else {
                callback('User cancelled login or did not fully authorize.',null);
            }
        });
    }

    private getUserWithProvider(provider:string,token:string,callback:any = ()=>{}){
        var form = new FormData();
        form.append("Method", provider);
        form.append("Token", token);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": CustomerConfig.loginUrl,
            "method": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form,
            success: (result:any,status:any,res:any)=>{
                var resJson = JSON.parse(res.responseText);
                if(resJson.StatusCode === 200){
                    this.user = resJson.Data;
                    this._token = resJson.Data.Token;
                    this.authenticated = true;
                    $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                    localStorage.setItem(CustomerConfig.authTokenStorage,resJson.Data.Token);
                    callback(null,resJson.Data);
                }else{
                    this.authenticated = false;
                    $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                    callback('User not signup',token);
                }
            },
            error: (res:any,status:any,err:any)=>{
                var resJson = JSON.parse(res.responseText);
                this.authenticated = false;
                $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                callback('User not signup',token);
            }
        }

        $.ajax(settings);
    }

    //LOGOUT
    public logout(){
        FB.logout();
        // Get `GoogleAuth` instance
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();
        localStorage.removeItem(CustomerConfig.authTokenStorage);
        this._token = null;
        this.user = null;
        this.authenticated = false;
    }
    //SIGNUP
    public signUp(data:any,callback:any = ()=>{}){

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
            url: CustomerConfig.signUpUrl,
            method: "POST",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: form,
            success: (result:any,status:any,res:any)=>{
                var resJson = JSON.parse(res.responseText);
                if(resJson.StatusCode === 200){
                    this.user = resJson.Data;
                    this._token = resJson.Data.Token;
                    this.authenticated = true;
                    $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                    localStorage.setItem(CustomerConfig.authTokenStorage,resJson.Data.Token);
                    callback(null,resJson.Data);
                }else{
                    this.authenticated = false;
                    $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                    callback(resJson.StatusCode,resJson.StatusMessage);
                }
            },
            error: (res:any,status:any,err:any)=>{
                var resJson = JSON.parse(res.responseText);
                this.authenticated = false;
                $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                callback(resJson.StatusCode,resJson.StatusMessage);
            }
        }
        $.ajax(settings);
    }
    public signUpWithProvider(provider:string,token:string,data:any,callback:any = ()=>{}){
        var form = new FormData();
        form.append("Phone", data.phone);
        form.append("Password", "");
        form.append("Fullname", data.fullName);
        form.append("Email", data.email);
        switch(provider){
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
            url: CustomerConfig.signUpUrl,
            method: "POST",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: form,
            success: (result:any,status:any,res:any)=>{
                var resJson = JSON.parse(res.responseText);
                if(resJson.StatusCode === 200){
                    this.user = resJson.Data;
                    this._token = resJson.Data.Token;
                    this.authenticated = true;
                    $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                    localStorage.setItem(CustomerConfig.authTokenStorage,resJson.Data.Token);
                    callback(null,resJson.Data);
                }else{
                    this.authenticated = false;
                    $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                    callback(resJson.StatusCode,resJson.StatusMessage);
                }
            },
            error: (res:any,status:any,err:any)=>{
                var resJson = JSON.parse(res.responseText);
                this.authenticated = false;
                $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
                callback(resJson.StatusCode,resJson.StatusMessage);
            }
        }
        $.ajax(settings);
    }
    //Update Customer
    public update(data:any,callback:any = ()=>{}){
        if(this.requiedAuthenticate(callback)){
            $.ajax({
                type: 'POST',
                url: CustomerConfig.updateCustomerUrl,
                dataType: 'json',
                data: data,
                headers: {
                    'token': this._token
                }
            })
            .done((res:any) => {
                if(res.StatusCode === 200){
                    $(this).trigger(CustomerEvents.CustomerEdited,res.Data);
                    this.user = res.Data;
                    callback(null,res.Data);
                }else{
                    callback(res.StatusCode,res.StatusMessage);
                }
            })
            .fail((request:any,err:any,status:any)=>{
                callback(err,status);
            });
        }
    }
    //====== BILLS
    //== CARDS
    //GET CARDS
    public static getCards(){
        this.cards = JSON.parse(localStorage.getItem(CustomerConfig.cardsStorage));
        if(!this.cards){
            this.cards = [];
        }
        $(this).trigger(CustomerEvents.CardsChange,{ data: this.cards });
        return this.cards;
    }
    public static saveCards(){
        localStorage.setItem(CustomerConfig.cardsStorage,JSON.stringify(this.cards));
    }
    //Add to Cards
    public static addToCard(product:any){
        var existedIndex = 0;
        var existed = this.cards.filter((pr:any,index:number)=>{
            if(pr.Id == product.Id){
                existedIndex = index;
                return true;
            }
            return false;
        })
        if(existed.length > 0){
            this.cards[existedIndex].Quantity++;
        }else{
            product.Quantity = 1;
            this.cards.push(product);
        }
        this.saveCards();
        $(this).trigger(CustomerEvents.CardsChange,{ data: this.cards });
    }
    //Remove form Cards
    public static removeCard(product:any){
        var existedIndex = 0;
        var existed = this.cards.filter((pr:any,index:number)=>{
            if(pr.Id == product.Id){
                existedIndex = index;
                return true;
            }
            return false;
        })
        if(existed.length > 0){
            this.cards.splice(existedIndex,1);
            this.saveCards();
            $(this).trigger(CustomerEvents.CardsChange,{ data: this.cards });
        }
    }

    public static clearCard(){
        this.cards = [];
        this.saveCards();
        $(this).trigger(CustomerEvents.CardsChange,{ data: this.cards });
    }

    //Decrease Card Quantity
    public static decreaseCard(product:any){
        var existedIndex = 0;
        var existed = this.cards.filter((pr:any,index:number)=>{
            if(pr.Id == product.Id){
                existedIndex = index;
                return true;
            }
            return false;
        })
        if(existed.length > 0){
            if(this.cards[existedIndex].Quantity == 1){
                this.cards.splice(existedIndex,1);
            }else{
                this.cards[existedIndex].Quantity--;
            }
            this.saveCards();
            $(this).trigger(CustomerEvents.CardsChange,{ data: this.cards });
        }
    }
    //GET LIST BILLS
    public getBills(callback:any = ()=>{}){
        if(this.requiedAuthenticate(callback)){
            $.ajax({
                type: 'POST',
                url: CustomerConfig.getBillsUrl,
                dataType: 'json',
                headers: {
                    'token': this._token
                }
            })
            .done((res:any) => {
                if(res.StatusCode === 200){
                    res.Data.forEach((bill:any) => {
                        switch(bill.Status){
                            case "-1":
                                bill.Status = Customer.billStatus.DELETED
                                break;
                            case "0":
                                bill.Status = Customer.billStatus.DELIVERING
                                break;
                            case "1":
                                bill.Status = Customer.billStatus.WAITING
                                break;
                            case "2":
                                bill.Status = Customer.billStatus.NOT_DELIVERING
                                break;
                            case "4":
                                bill.Status = Customer.billStatus.PAYED
                                break;
                            default:
                                bill.Status = Customer.billStatus.UNKNOW
                        }
                    });
                    callback(null,res.Data);
                }else{
                    callback(res.StatusCode,res.StatusMessage);
                }
            })
            .fail((request:any,err:any,status:any)=>{
                callback(err,status);
            });
        } 
    }

    //GET BILL DETAIL
    public getBillDetail(billId:string,callback:any){
        if(!this.requiedAuthenticate(callback)) return;
        var form = new FormData();
        form.append("BillId", billId);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": CustomerConfig.getBillUrl,
            "method": "POST",
            "headers": {
                "Token": this._token
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form,
            success: (result:any,status:any,res:any)=>{
                var resJson = JSON.parse(res.responseText);
                if(resJson.StatusCode === 200){
                    //Set status
                    switch(resJson.Data.Status){
                        case "-1":
                            resJson.Data.Status = Customer.billStatus.DELETED
                            break;
                        case "0":
                            resJson.Data.Status = Customer.billStatus.DELIVERING
                            break;
                        case "1":
                            resJson.Data.Status = Customer.billStatus.WAITING
                            break;
                        case "2":
                            resJson.Data.Status = Customer.billStatus.NOT_DELIVERING
                            break;
                        case "4":
                            resJson.Data.Status = Customer.billStatus.PAYED
                            break;
                        default:
                            resJson.Data.Status = Customer.billStatus.UNKNOW
                    }
                    if(resJson.Data.PromotionId){
                        resJson.Data.Promotion = "Có";
                    }else{
                        resJson.Data.Promotion = "Không Có";
                    }
                    //Set thumbnail
                    resJson.Data.BillDetails.forEach((product:any) => {
                        product.ProductThumb = ServerConfig.host+ServerConfig.filesPath+product.ProductThumb;
                    });
                    callback(null,resJson.Data);
                }else{
                    callback(resJson.StatusCode,resJson.StatusMessage);
                }
            },
            error: (res:any,status:any,err:any)=>{
                var resJson = JSON.parse(res.responseText);
                callback(resJson.StatusCode,resJson.StatusMessage);
            }
        }
        $.ajax(settings);
    }

    public sendBill(bill:any,callback:any = ()=>{}){
        if(!this.requiedAuthenticate(callback)) return;
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
            "url": CustomerConfig.sendBillUrl,
            "method": "POST",
            "headers": {
                "token": this._token
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form,
            success: (result:any,status:any,res:any)=>{
                var resJson = JSON.parse(res.responseText);
                if(resJson.StatusCode === 200){
                    callback(null,resJson.Data);
                }else{
                    callback(resJson.StatusCode,resJson.StatusMessage);
                }
            },
            error: (res:any,status:any,err:any)=>{
                var resJson = JSON.parse(res.responseText);
                callback(resJson.StatusCode,resJson.StatusMessage);
            }
        }
        $.ajax(settings);
    }
    //PROMOTIONS
    //GET PROMOTIONS
    public getPromotions(callback:any){
        if(!this.requiedAuthenticate(callback)) return;
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": CustomerConfig.getPromotionsUrl,
            "method": "GET",
            "headers": {
                "token": this._token
            }
        }

        $.ajax(settings).done(function (res:any) {
            if(res.StatusCode === 200){
                res.Data.forEach((promotion:any) => {
                    promotion.Photo = ServerConfig.host+ServerConfig.filesPath+promotion.Photo;
                });
                callback(null,res.Data);
            }else{
                callback(res.StatusCode,res.StatusMessage);
            }
        })
        .fail((request:any,err:any,status:any)=>{
            callback(err,status);
        });
    }
    //=========== STATIC METHODS ==================
    //====== PRODUCTS
    //GET ALL PRODUCTS
    public static getAllProducts(callback:any){
    
        $.ajax({
            type: 'GET',
            url: CustomerConfig.getAllProductsUrl,
            dataType: 'json',
            crossDomain: true
        })
        .done((res:any) => {
            if(res.StatusCode === 200){
                res.Data.forEach((product:any) => {
                    product.Thumbnail = ServerConfig.host+ServerConfig.filesPath+product.Thumbnail;
                });
                callback(null,res.Data);
            }else{
                callback(res.StatusCode,res.StatusMessage);
            }
        })
        .fail((request:any,err:any,status:any)=>{
            callback(err,status);
        });
    }  

    public static getAllBlogs(callback:any){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": CustomerConfig.getBlogsUrl,
            "method": "GET"
        }

        $.ajax(settings).done(function (response:any) {
            callback(null,response);
        }).fail((request:any,err:any,status:any)=>{
            callback(err,status);
        });
    }

}

