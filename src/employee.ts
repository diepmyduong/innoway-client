import { EmployeeConfig } from './configs/employee.config';
import { ServerConfig } from './configs/server.config';
declare var $:any;

export class Employee {

    constructor(){}

    public static getAllCategory(callback:any){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": EmployeeConfig.GetAllCategoryUrl,
            "method": "GET",
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

}