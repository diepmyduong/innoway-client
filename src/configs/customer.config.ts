import { ServerConfig ,APIPath} from './server.config'

export const CustomerConfig = {
    authTokenStorage    : 'innoway.Customer.auth.token',
    loginUrl            : APIPath+'CustomerLogin',
    signUpUrl           : APIPath+'Register',
    updateCustomerUrl     : APIPath+'EditCustomer',
    getBillsUrl         : APIPath+'GetListBillFromCustomer',
    getBillUrl          : APIPath+'GetBill',
    getAllProductsUrl   : APIPath+'GetAllProduct',
    sendBillUrl         : APIPath+'SendBill',
    addFeedbackUrl      : APIPath+'AddFeedback',
    getPromotionsUrl    : APIPath+'Promotions',
    getCustomerUrl      : APIPath+'GetCustomer',
    getBlogsUrl         : ServerConfig.host+'/blog/wp-json/posts',
}