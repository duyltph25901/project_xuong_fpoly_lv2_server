import express from 'express'
import API from '../controller/API'

const routes = express.Router()

const initAPIRoutes = (app) => {

    // Post
    routes.post('/sign_up_boss', API.signUpBoss)
    routes.post('/sign_up_admin', API.signUpAdmin)
    routes.post('/handle_add_category', API.handleAddCategory)
    routes.post('/handle_add_book', API.handleAddBook)
    routes.post('/handle_add_customer', API.handleAddCustomer)
    routes.post('/handle_add_discount', API.handleAddDiscount)
    routes.post('/handle_add_loan_slip', API.handleAddLoanSlip)

    // Get
    routes.get('/handle_get_all_admin', API.getAllAdmin)
    routes.get('/handle_get_all_book', API.getAllBook)
    routes.get('/handle_get_all_customer', API.getAllCustomer)
    routes.get('/handle_get_all_category', API.getAllCategory)
    routes.get('/handle_get_all_loan', API.getAllLoan)
    routes.get('/hadle_get_all_discount', API.getAllDiscount)
    routes.get('/handle_search_customer_by_id/:id', API.handleSearchCustomer)
    routes.get('/handle_get_all_discount_enable', API.getDiscountEnable)
    routes.get('/handle_get_all_discount_disable', API.getDiscountDisable)
    routes.get('/books/purchases/desc', API.getAllBookOrderByDESCPurchases)
    routes.get('/books/purchases/asc', API.getAllBookOrderByASCPurchases)
    routes.get('/books/quantity/desc', API.getAllBookOrderByDESCQuantity)
    routes.get('/books/quantity/asc', API.getAllBookOrderByASCQuantity)
    routes.get('/loan_slip/not_pay', API.getAllLoanNotPay)
    routes.get('/loan_slip/payed', API.getAllLoanPayed)
    routes.get('/customers/black_list', API.getBlackListCustomer)
    routes.get('/customers/negative_list', API.getNegativeListCustomer)
    routes.get('/doanh_thu', API.getDoanhThuTheoThang)
    routes.get('/thu_thu', API.getThuThu)
    routes.get('/thu_thu/enable', API.getThuThuEnable)
    routes.get('/thu_thu/disable', API.getThuThuDisable)
    routes.get('/books/for_spinner', API.getBookForSpinner)
    routes.get('/customers/for_spinner', API.getCustomerForSpinner)
    routes.get('/discounts/enable/for_spinner', API.getDiscountEnableForSpinner)
    routes.get('/books/search_by_id/:id', API.getBookById)
    routes.get('/discounts/search_by_id/:id', API.getDiscountById)
    routes.get('/book/search_by_category/:id', API.searchBookByCategoryId)
    routes.get('/loan/search_by_customer_name/:keySearch', API.getLoanByCustomerName)

    // Put
    routes.put('/handle_update_information_admin', API.updateInformationAdmin)
    routes.put('/enable_account_admin/:id', API.enableAccountAdmin)
    routes.put('/handle_update_book', API.handleUpdateBook)
    routes.put('/handle_update_boss', API.handleUpdateBoss)
    routes.put('/handle_update_category', API.handleUpdateCategory)
    routes.put('/handle_update_customer', API.handleUpdateCustomer)
    routes.put('/handle_credit_points_reduction/:id', API.creditPointsReduction)
    routes.put('/handle_update_discount', API.handleUpdateDiscount)
    routes.put('/increase_usage_voucher/:id', API.increaseUsage)
    routes.put('/handle_pay_book', API.handlePayBook)
    routes.put('/admins/disable/', API.disableAdmin)
    routes.put('/admins/update', API.updateAdmin)
    routes.put('/boss/update', API.updateBoss)

    // Delete
    routes.delete('/handle_delete_book/:id', API.deleteBook)
    routes.delete('/handle_delete_customer/:id', API.deleteCustomer)
    routes.delete('/handle_delete_category/:id', API.deleteCategory)
    routes.delete('/handle_delete_discount/:id', API.deleteDiscount)

    // logn
    routes.post('/login_admin', API.handleLoginAdmin)
    routes.post('/login_boss', API.handleLoginBoss)

    // search
    routes.post('/search_book_by_name', API.handleSearchBookByName)
    routes.post('/customers/search_customer_by_name', API.handleSearchCustomerByName)
    routes.post('/customers/search_customer_by_phone', API.handleSearchCustomerByPhone)
    routes.post('/customers/search_customer_by_email', API.handleSearchCustomerByEmail)
    routes.post('/admins/search_admin_by_user_name', API.handleSearchAdminByUserName)

    return app.use('/api/v1', routes)
}

export default initAPIRoutes