
import { CustomerConfig } from './configs/customer.config';
import { ServerConfig } from './configs/server.config';
import { CustomerEvents } from './constants/customer.const';
declare var $:any;


export class Customer {

    //Events
    private _token:string;
    public user:any;
    public authenticated: boolean = false;
    public static events = CustomerEvents;

    constructor(token:string = null){
        if(token == null){
            token = localStorage.getItem(CustomerConfig.authTokenStorage);
        }
        if(token != null){
            this.loginWithToken(token);
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
        console.log('TOKEN',token);
        $.ajax({
            type: 'POST',
            url: CustomerConfig.getCustomerUrl,
            dataType: 'json',
            headers: {
                'token': token
            }
        })
        .done((res:any) => {
            console.log(res);
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
            console.log('FAIL',request);
            this.authenticated = false;
            $(this).trigger(CustomerEvents.AuthStateChange,this.authenticated);
            callback(err,status);
        })
    }

    //LOGIN WITH GOOGLE
    public loginWithGoolge(){

    }

    //LOGIN WITH FACEBOOK
    public loginWithFacebook(){
        
    }

    //SIGNUP
    public signUp(data:any,callback:any = ()=>{}){
        $.ajax({
            type: 'POST',
            url: CustomerConfig.signUpUrl,
            dataType: 'json',
            data: data
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

    //Update Customer
    public update(token:string,data:any,callback:any = ()=>{}){
        $.ajax({
            type: 'POST',
            url: CustomerConfig.updateCustomerUrl,
            dataType: 'json',
            data: data,
            headers: {
                'token': token
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
    //====== BILLS
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

    

    
}