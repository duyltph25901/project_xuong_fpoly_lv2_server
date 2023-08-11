import { v4 as uuidv4 } from 'uuid'
import pool from '../config/database'
import Flag from './func/FlagController'
import Message from './func/Message'
import Other from './func/Other'

// add method
const signUpBoss = async (req, res) => {
    var { email, password, phoneNumber, userName } = req.body
    email = String(email).trim()
    password = String(password).trim()
    phoneNumber = String(phoneNumber).trim()
    userName = String(userName).trim()
    const id = uuidv4()

    // check input
    console.log(
        `
        \n>>>>> Check Sign Up Boss:
        Id: ${id}
        Email: ${email}
        Password: ${password}
        Phone number: ${phoneNumber}
        User name: ${userName}\n
        `
    )

    const [phoneFound] = await pool.execute(
        `
        select phone_number from boos where phone_number = ?
        `, [phoneNumber]
    )

    // kiem tra so dien thoai da duoc dang ki truoc do hay chua 
    if (phoneFound[0] != undefined || phoneFound[0] != null) {
        console.log(
            `
            \n>>>>>> Message insert boss: ${Message.message_found_phone_number}\n
            `
        )
        return res.status(400).json({
            flag: Flag.flag_insert_fail,
            message: Message.message_found_phone_number
        })
    }

    // kiem tra email da duoc dang ki truoc do hay chua
    const [emailFound] = await pool.execute(
        `
        select email from boos where email = ?
        `, [email]
    )

    if (emailFound[0] != undefined || emailFound[0] != null) {

        console.log(
            `
            \n>>>>> Message insert boss: ${Message.message_found_email}\n
            `
        )

        return res.status(400).json({
            flag: Flag.flag_insert_fail,
            message: Message.message_found_email
        })
    }

    // handle insert boss
    await pool.execute(
        `
        insert into boos (id, email, password, phone_number, user_name)
        values (?, ?, ?, ?, ?)
        `, [id, email, password, phoneNumber, userName]
    )

    // check message insert success
    console.log(
        `
        \n>>>>> Message insert boss: ${Message.message_insert_success}\n
        `
    )

    return res.status(200).json({
        flag: Flag.flag_insert_success,
        message: Message.message_insert_success
    })
}

const signUpAdmin = async (req, res) => {
    var { userName, password, created_at, updated_at } = req.body
    userName = String(userName).trim()
    password = String(password).trim()
    created_at = String(created_at).trim()
    updated_at = String(updated_at).trim()
    const is_active = Flag.is_active
    const created_by = `${Other.id_boss}`
    const id = uuidv4()

    // Check input
    console.log(
        `
        \n>>>> Check Sign Up Admin:
        Id: ${id}
        User name: ${userName}
        Password: ${password}
        Created at: ${created_at}
        Updated at: ${updated_at}
        Is active: ${is_active}
        Created by: ${created_by}\n 
        `
    )

    // check user name
    const [userNameFound] = await pool.execute(
        `
        select user_name from admin where user_name = ?
        `, [userName]
    )

    if (userNameFound[0] != undefined || userNameFound[0] != null) {
        console.log(
            `
            \n>>>>> Message insert admin: ${Message.message_found_user_name}\n
            `
        )

        return res.status(400).json({
            flag: Flag.flag_insert_fail,
            message: `${Message.message_found_user_name}`
        })
    }

    await pool.execute(
        `
        insert into admin (id, user_name, password, created_at, updated_at, is_active, created_by)
        values (?, ?, ?, ?, ?, ?, ?)
        `, [id, userName, password, created_at, updated_at, is_active, created_by]
    )


    return res.status(200).json({
        flag: Flag.flag_insert_success,
        message: Message.message_insert_success
    })
}

const handleAddCategory = async (req, res) => {
    const id = uuidv4()
    var { name, created_at, updated_at } = req.body
    name = String(name).trim()
    created_at = String(created_at).trim()
    updated_at = String(updated_at).trim()
    const created_by = Other.id_boss

    console.log(
        `
        \n>>>>> Check Add Category: 
        Id: ${id}
        Name: ${name}
        Created at: ${created_at}
        Updated at: ${updated_at}
        Created by: ${created_by}\n
        `
    )

    await pool.execute(
        `
        insert into category (id, name, created_at, updated_at, id_boos)
        values (?, ?, ?, ?, ?)
        `, [id, name, created_at, updated_at, created_by]
    )

    return res.status(200).json({
        flag: Flag.flag_insert_success,
        message: Message.message_insert_success
    })
}

const handleAddBook = async (req, res) => {
    var { name, quantity, created_at, updated_at, image, id_category, price, created_by, is_admin } = req.body
    name = String(name).trim()
    image = String(image).trim()
    const id = uuidv4()
    const purchases = 0
    const columName = (is_admin) ? 'created_by_admin' : 'created_by_boss '

    console.log(
        `
        \n>>>>> Check Add Book:
        Id: ${id}
        Name: ${name}
        Quantity: ${quantity}
        Created at: ${created_at}
        Updated at: ${updated_at}
        Id category: ${id_category}
        Purchases: ${purchases}
        ${is_admin ? 'Created by admin' : 'Created by boss'}: ${created_by}
        Price: ${price}vnd\n
        `
    )

    await pool.execute(
        `
        insert into book (id, name, quantity, created_at, updated_at, id_category, purchases, ${columName}, image, price)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, name, Number(quantity), created_at, updated_at, id_category, Number(purchases), created_by, image, Number(price)]
    )

    return res.status(200).json({
        flag: Flag.flag_insert_success,
        message: Message.message_insert_success
    })
}

const handleAddCustomer = async (req, res) => {
    const id = uuidv4()
    const point = Flag.point_user_max
    var { userName, phoneNumber, email, dob, countries, gender, image } = req.body
    userName = String(userName).trim()
    phoneNumber = String(phoneNumber).trim()
    email = String(email).trim()
    dob = String(dob).trim()
    countries = String(countries).trim()
    image = String(image).trim()

    console.log(
        `
        \n>>>> Check Add Customer
        Id: ${id}
        User name: ${userName}
        Phone number: ${phoneNumber}
        Email: ${email}
        Date Of Birth: ${dob}
        Countries: ${countries}
        Gender: ${gender == 1 ? 'Male' : 'Female'}
        Point: ${point}/100
        Image Link: ${image}\n
        `
    )

    // kiem tra so dien thoai
    const [phoneSearch] = await pool.execute(
        `
        select phone_number 
        from customer
        where phone_number = ?
        `, [phoneNumber]
    )

    console.log(
        `
        \n>>>>> Check search phone number: ${JSON.stringify(phoneSearch[0])}\n
        `
    )

    if (phoneSearch[0]) {
        return res.status(Flag.flag_insert_fail).json({
            flag: Flag.flag_insert_fail,
            message: Message.message_found_phone_number
        })
    }

    // kiem tra email
    const [emailSearch] = await pool.execute(
        `
        select email from customer
        where email = ?
        `, [email]
    )

    console.log(
        `
        \n>>>>>> Check email search: ${JSON.stringify(emailSearch[0])}\n
        `
    )

    if (emailSearch[0]) {
        return res.status(Flag.flag_insert_fail).json({
            flag: Flag.flag_insert_fail,
            message: Message.message_found_email
        })
    }

    await pool.execute(
        `
        insert into customer (id, user_name, phone_number, email, dob, countries, gender, point, image)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, userName, phoneNumber, email, dob, countries, gender, point, image]
    )

    return res.status(200).json({
        flag: Flag.flag_insert_success,
        message: Message.message_insert_success
    })
}

const handleAddDiscount = async (req, res) => {
    const id = uuidv4()
    var { code, value, timeStart, timeEnd, createdAt, idAdmin, isAdmin } = req.body
    code = String(code).trim()
    timeStart = String(timeStart).trim()
    timeEnd = String(timeEnd).trim()
    createdAt = String(createdAt).trim()
    const usage = 0
    const columnName = isAdmin ? 'created_by_admin' : 'created_by_boss'

    console.log(
        `
        \n>>>>> Check Add Discount:
        Id: ${id}
        Code Discount: ${code}
        Discount value: ${value}%
        Time start: ${timeStart}
        End start: ${timeEnd}
        Usage: ${usage} times
        Creted at: ${createdAt}
        Created by: ${idAdmin}
        Is admin: ${isAdmin}\n
        `
    )

    await pool.execute(
        `
        insert into discount (id, code, value_discount, time_start, time_end, ${columnName}, times, created_at)
        values (?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, code, value, timeStart, timeEnd, idAdmin, usage, createdAt]
    )

    return res.status(200).json({
        flag: Flag.flag_insert_success,
        message: Message.message_insert_success
    })
}

const handleAddLoanSlip = async (req, res) => {
    const id = uuidv4()
    var { createdAt, payDay, idBook, idDiscount, endPrice, idCustomer, createdBy } = req.body
    createdBy = String(createdBy).trim()
    createdAt = String(createdAt).trim()
    payDay = String(payDay).trim()
    idBook = String(idBook).trim()
    idDiscount = String(idDiscount).trim()
    endPrice = String(endPrice).trim()
    idCustomer = String(idCustomer).trim()

    if (idDiscount == 'null') {
        idDiscount = 'zero'
    }

    console.log(
        `
        \n>>>>> Check Add Loan Slip:
        Id: ${id}
        Created at: ${createdAt}
        Pay day: ${payDay}
        Id book: ${idBook}
        Id discount: ${idDiscount}
        End Price: ${endPrice}
        Created by: ${createdBy}
        Id Customer: ${idCustomer}\n
        `
    )

    const [book] = await pool.execute(
        `
        select * from book where id = ?
        `, [idBook]
    )

    console.log(
        `
        \n>>>>> Check book search by id: ${JSON.stringify(book[0])}\n
        `
    )

    if (book[0].quantity <= 0) {
        console.log(
            `
            \n>>>>> Message insert fail loan slip: ${Message.not_enough_quanity_book}\n
            `
        )

        return res.status(Flag.flag_insert_fail).json({
            flag: Flag.flag_insert_fail,
            message: Message.not_enough_quanity_book
        })
    } else {

        // thực hiện thêm mới phiếu mượn
        await pool.execute(
            `
            insert into loan_slip (id, created_at, pay_day, id_book, id_discount_code, end_price, created_by_admin , id_customer, status)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [id, createdAt, payDay, idBook, idDiscount, endPrice, createdBy, idCustomer, 0]
        )

        // giảm số lượng sách tồn kho đi 1 cuốn, tăng số lần mượn lên 1
        await pool.execute(
            `
            update book
            set quantity = quantity - 1, purchases = purchases + 1
            where id = ?
            `, [idBook]
        )

        // tăng lượt sử dụng của mã giảm giá lên 1 lần
        await pool.execute(
            `
            update discount
            set times = times + 1
            where id = ?
            `, [idDiscount]
        )

        return res.status(200).json({
            flag: Flag.flag_insert_success,
            message: Message.message_insert_success
        })
    }
}

// update method
const handlePayBook = async (req, res) => {
    let { id_book, id_loan, is_late, id_customer } = req.body
    id_book = String(id_book).trim()
    id_loan = String(id_loan).trim()
    id_customer = String(id_customer).trim()

    console.log(
        `
        \n>>>>> Check Handle Pay Book:
        ID loan slip: ${id_loan}
        ID Book: ${id_book}
        Is late: ${is_late}
        ID Customer: ${id_customer}\n
        `
    )

    if (is_late) {
        // Trừ người dùng 1 sao
        await pool.execute(
            `
            update customer
            set point = point - 1
            where id = ? and  point > 0
            `, [id_customer]
        )
    } else {
        // Cộng người dùng 1 sao
        await pool.execute(
            `
            update customer
            set point = point + 1
            where id = ? and point < 100
            `, [id_customer]
        )
    }

    await pool.execute(
        `
        update loan_slip
        set status = 1
        where id = ?
        `, [id_loan]
    )

    await pool.execute(
        `
        update book
        set quantity = quantity + 1
        where id = ?
        `, [id_book]
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: 'Hoàn tất trả sách'
    })
}

const updateInformationAdmin = async (req, res) => {
    var { userName, password, id, updated_at } = req.body
    userName = String(userName).trim()
    password = String(password).trim()
    id = String(id).trim()
    updated_at = String(updated_at).trim()

    console.log(
        `
        \n>>>>> Check Update Information Admin:
        Id: ${id}
        User name: ${userName}
        Password: ${password}
        Created at: ${updated_at}\n
        `
    )

    const [userNameFound] = await pool.execute(
        `
        select user_name from admin where user_name = ?
        `, [userName]
    )

    if (userNameFound[0] != undefined || userNameFound[0] != null) {
        console.log(`\n${Message.message_found_user_name}\n`)

        return res.status(400).json({
            flag: Flag.flag_update_fail,
            message: Message.message_update_fail
        })
    }

    await pool.execute(
        `
        update admin set user_name = ?, password = ?, updated_at = ? where id = ?
        `, [userName, password, updated_at, id]
    )

    return res.status(200).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

const enableAccountAdmin = async (req, res) => {
    const id = String(req.params.id).trim()

    console.log(
        `
        \n>>>>> Check Enable Admin:
        Id: ${id}\n
        `
    )

    await pool.execute(
        `
        UPDATE admin SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END 
        `
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

const handleUpdateBook = async (req, res) => {
    var { id, name, quantity, image, price, updated_at, id_category } = req.body
    id = String(id).trim()
    name = String(name).trim()
    image = String(image).trim()
    updated_at = String(updated_at).trim()

    await pool.execute(
        `
        update book set name = ?, quantity = ?, image = ?, price = ?, updated_at = ?, id_category = ? where id = ?
        `, [name, quantity, image, price, updated_at, id_category, id]
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

const handleUpdateBoss = async (req, res) => {
    var { email, password, phoneNumber, userName, id } = req.body
    email = String(email).trim()
    password = String(password).trim()
    phoneNumber = String(phoneNumber).trim()
    userName = String(userName).trim()
    id = String(id).trim()

    await pool.execute(
        `
        update boos set email = ?, phone_number = ?, password = ?, user_name = ? where id = ?
        `, [email, phoneNumber, password, userName, id]
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

const handleUpdateCategory = async (req, res) => {
    var { name, updatedAt, id } = req.body
    name = String(name).trim()
    updatedAt = String(updatedAt).trim()
    id = String(id).trim()

    // Check log input
    console.log(
        `
        \n>>>>> Check Update Category:
        Name: ${name}
        Updated at: ${updatedAt}\n
        `
    )

    await pool.execute(
        `
        update category set name = ?, updated_at = ? where id = ?
        `, [name, updatedAt, id]
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

const handleUpdateCustomer = async (req, res) => {
    var { userName, phoneNumber, email, dob, countries, gender, id } = req.body
    userName = String(userName).trim()
    phoneNumber = String(phoneNumber).trim()
    email = String(email).trim()
    dob = String(dob).trim()
    countries = String(countries).trim()
    id = String(id).trim()

    console.log(
        `
        \n>>>>> Check update customer:
        Id: ${id}
        User name: ${userName}
        Phone number: ${phoneNumber}
        Email: ${email}
        Date Of Birth: ${dob}
        Countries name: ${countries}
        Gender: ${gender == 1 ? 'Male' : 'Female'}\n
        `
    )

    // Kiểm tra số điện thoại đã được đăng kí trước đó hay chưa
    const [phoneNumberFound] = await pool.execute(
        `
        select phone_number, id from customer where phone_number = ?
        `, [phoneNumber]
    )

    console.log(
        `
        \n>>>>> Check phone number found: ${JSON.stringify(phoneNumberFound[0])}
        `
    )

    if (phoneNumberFound.length > 0) {
        setTimeout(() => {
            console.log(phoneNumberFound[0].email + ' / ' + id)
        }, 1500);
        if (phoneNumberFound[0].id !== id) {
            console.log(`\n${Message.message_found_phone_number}\n`)

            return res.status(Flag.flag_update_fail).json({
                flag: Flag.flag_update_fail,
                message: Message.message_found_phone_number
            })
        }
    }

    // Kiểm tra email đã được sử dụng trước đó hay chưa
    const [emailFound] = await pool.execute(
        `select email, id from customer where email = ?`, [email]
    )

    console.log(
        `
        \n>>>>> Check email found: ${JSON.stringify(emailFound)}\n
        `
    )

    if (emailFound.length > 0) {
        if (emailFound[0].id !== id) {
            console.log(`\n${Message.message_found_email}\n`)

            return res.status(Flag.flag_update_fail).json({
                flag: Flag.flag_update_fail,
                message: Message.message_found_email
            })
        }
    }

    // handle update
    await pool.execute(
        `
        update customer set user_name = ?, phone_number = ?, email = ?, dob = ?, countries = ?, gender = ? where id = ?
        `, [userName, phoneNumber, email, dob, countries, gender, id]
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

const creditPointsReduction = async (req, res) => {
    const id = String(req.params.id).trim()

    console.log(
        `
        \n>>>>> Check Credit Points Reduction:
        Id: ${id}\n
        `
    )

    await pool.execute(
        `update customer set point = point - 1`
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

const handleUpdateDiscount = async (req, res) => {
    var { value, timeEnd, id } = req.body

    console.log(
        `
        \n>>>>> Check Update Discount: 
        Id: ${id}
        Time end: ${timeEnd}
        Value: ${value}\n
        `
    )

    await pool.execute(
        `update discount set value_discount = ?, time_end = ? where id = ?`, [value, timeEnd, id]
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

const increaseUsage = async (req, res) => {
    const id = String(req.params.id).trim()

    console.log(
        `
        \n>>>>> Check Increase Usage: 
        Id: ${id}\n
        `
    )

    await pool.execute(
        `update discount set times = times + 1 where id = ?`, [id]
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

const updateAdmin = async (req, res) => {
    let { userName, password, updatedAt, idAdmin } = req.body
    userName = String(userName).trim()
    password = String(password).trim()
    updatedAt = String(updatedAt).trim()

    console.log(
        `
        \n>>>>> Check Update Admin:
        User name: ${userName}
        Password: ${password}
        Updated at: ${updatedAt}
        ID admin: ${idAdmin}\n
        `
    )

    const [userNameFound] = await pool.execute(
        `
        select user_name, id from admin where user_name = ?
        `, [userName]
    )

    console.log(
        `
        \n>>>>> Check User Name Admin Found:
        User name: ${JSON.stringify(userNameFound[0])}\n
        `
    )

    if (userNameFound[0] != undefined) {
        if (String(userNameFound[0].id) != String(idAdmin)) { // tài khoản đã tồn tại
            return res.status(Flag.flag_update_fail).json({
                flag: Flag.flag_update_fail,
                message: Message.account_is_exits
            })
        } else { // tài khoản chưa tồn tại
            await pool.execute(
                `
                update admin
                set user_name = ?, 
                password = ?,
                updated_at = ?
                where id = ?
                `, [userName, password, updatedAt, idAdmin]
            )

            return res.status(Flag.flag_update_success).json({
                flag: Flag.flag_update_success,
                message: Message.message_update_success
            })
        }
    } else {
        await pool.execute(
            `
            update admin
            set user_name = ?, 
            password = ?,
            updated_at = ?
            where id = ?
            `, [userName, password, updatedAt, idAdmin]
        )

        return res.status(Flag.flag_update_success).json({
            flag: Flag.flag_update_success,
            message: Message.message_update_success
        })
    }
}

const updateBoss = async (req, res) => {
    let { email, password } = req.body
    email = String(email).trim()
    password = String(password).trim()

    console.log(
        `
        \n>>>>> Check Update Boss:
        Email: ${email}
        Password: ${password}\n
        `
    )


    const [bossFound] = await pool.execute(
        `
        select email, password
        from boos
        where email = ? and password = ?
        `, [email, password]
    )

    console.log(
        `
        \n>>>>> Check Boss find email and password: ${JSON.stringify(bossFound[0])}\n
        `
    )

    if (bossFound[0] != undefined || bossFound[0] != null) {
        return res.status(Flag.flag_update_fail).json({
            flag: Flag.flag_update_fail,
            message: 'Bạn không thay đổi thông tin!'
        })
    } else {
        await pool.execute(
            `
            update boos
            set email = ?, password = ?
            where id = '27127c3a-5a12-46ad-8'
            `, [email, password]
        )

        return res.status(Flag.flag_update_success).json({
            flag: Flag.flag_update_success,
            message: Message.message_update_success
        })
    }
}

// get method
const getAllAdmin = async (req, res) => {
    const [admin] = await pool.execute(`SELECT admin.*, boos.user_name as user_name_admin
    FROM admin
    INNER JOIN boos ON admin.created_by = boos.id;`)

    return res.status(Flag.flag_get_data_success).json(admin)
}

const getAllBook = async (req, res) => {
    const [book] = await pool.execute(
        `
        select book.*, category.name as category_name, category.id as category_id
        from book
        inner join category on book.id_category = category.id
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        books: book
    })
}

const getAllCategory = async (req, res) => {
    const [categories] = await pool.execute(`select * from category`)

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        categories: categories
    })
}

const getAllCustomer = async (req, res) => {
    const [customer] = await pool.execute(`select * from customer`)

    return res.status(Flag.flag_get_data_success).json({
        customer: customer
    })
}

const getAllDiscount = async (req, res) => {
    const [discount] = await pool.execute(`select * from discount where id != 'zero'`)

    return res.status(Flag.flag_get_data_success).json({
        discounts: discount,
        flag: Flag.flag_get_data_success,
    })
}

const getAllLoan = async (req, res) => {
    const [loan_slip] = await pool.execute(
        `
        select loan_slip.*, discount.code as code, discount.value_discount as value_discount, admin.user_name as user_name_admin, book.name as book_name, customer.user_name as customer_name, book.price as book_price
        from loan_slip
        inner join discount on loan_slip.id_discount_code = discount.id
        inner join admin on admin.id = loan_slip.created_by_admin
        inner join book on book.id = loan_slip.id_book
        inner join customer on customer.id = loan_slip.id_customer
        order by STR_TO_DATE(loan_slip.created_at, '%d/%m/%Y %H:%i:%s') desc
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        loans: loan_slip
    })
}

const getDiscountEnable = async (req, res) => {
    const [discounts] = await pool.execute(
        `
        select * from discount
        where STR_TO_DATE(time_end, '%d/%m/%Y') >= NOW()
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        discounts: discounts
    })
}

const getDiscountDisable = async (req, res) => {
    const [discounts] = await pool.execute(
        `
        select * from discount
        where STR_TO_DATE(time_end, '%d/%m/%Y') < NOW()
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        discounts: discounts
    })
}

const getAllBookOrderByDESCPurchases = async (req, res) => {
    const [book] = await pool.execute(
        `
        select book.*, category.name as category_name, category.id as category_id
        from book
        inner join category on book.id_category = category.id
        order by purchases desc
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        books: book
    })
}

const getAllBookOrderByASCPurchases = async (req, res) => {
    const [book] = await pool.execute(
        `
        select book.*, category.name as category_name, category.id as category_id
        from book
        inner join category on book.id_category = category.id
        order by purchases asc
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        books: book
    })
}

const getAllBookOrderByDESCQuantity = async (req, res) => {
    const [book] = await pool.execute(
        `
        select book.*, category.name as category_name, category.id as category_id
        from book
        inner join category on book.id_category = category.id
        order by quantity desc
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        books: book
    })
}

const getAllBookOrderByASCQuantity = async (req, res) => {
    const [book] = await pool.execute(
        `
        select book.*, category.name as category_name, category.id as category_id
        from book
        inner join category on book.id_category = category.id
        order by quantity asc
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        books: book
    })
}

const getAllLoanNotPay = async (req, res) => {
    const [loan_slip] = await pool.execute(
        `
        select loan_slip.*, discount.code as code, discount.value_discount as value_discount, admin.user_name as user_name_admin, book.name as book_name, customer.user_name as customer_name, book.price as book_price
        from loan_slip
        inner join discount on loan_slip.id_discount_code = discount.id
        inner join admin on admin.id = loan_slip.created_by_admin
        inner join book on book.id = loan_slip.id_book
        inner join customer on customer.id = loan_slip.id_customer
        where loan_slip.status = 0
        order by STR_TO_DATE(loan_slip.created_at, '%d/%m/%Y %H:%i:%s') desc
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        loans: loan_slip
    })
}

const getAllLoanPayed = async (req, res) => {
    const [loan_slip] = await pool.execute(
        `
        select loan_slip.*, discount.code as code, discount.value_discount as value_discount, admin.user_name as user_name_admin, book.name as book_name, customer.user_name as customer_name, book.price as book_price
        from loan_slip
        inner join discount on loan_slip.id_discount_code = discount.id
        inner join admin on admin.id = loan_slip.created_by_admin
        inner join book on book.id = loan_slip.id_book
        inner join customer on customer.id = loan_slip.id_customer
        where loan_slip.status = 1
        order by STR_TO_DATE(loan_slip.created_at, '%d/%m/%Y %H:%i:%s') desc
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        loans: loan_slip
    })
}

const getBlackListCustomer = async (req, res) => {
    const [customer] = await pool.execute(`select * from customer where point <= 30 order by point asc`)

    return res.status(Flag.flag_get_data_success).json({
        customer: customer
    })
}

const getNegativeListCustomer = async (req, res) => {
    const [customer] = await pool.execute(`select * from customer where point > 30 order by point desc`)

    return res.status(Flag.flag_get_data_success).json({
        customer: customer
    })
}

const getDoanhThuTheoThang = async (req, res) => {
    let arr = []
    for (let i = 1; i <= 12; ++i) {
        let query = `SELECT IFNULL(SUM(end_price), 0) AS total_revenue FROM loan_slip WHERE MONTH(STR_TO_DATE(created_at, '%d/%m/%Y %H:%i:%s')) = ${i}`
        const object_sum_price = await pool.execute(query)
        const sum_price = await object_sum_price[0][0].total_revenue
        arr.push(Number(sum_price / 1000))
    }

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        doanh_thu: arr.sort((a, b) => a.index - b.index)
    })
}

const getThuThu = async (req, res) => {
    const [thuThu] = await pool.execute(
        `
        select * from admin
        `
    )

    return res.status(200).json({
        flag: Flag.flag_get_data_success,
        thu_thus: thuThu
    })
}

const getThuThuEnable = async (req, res) => {
    const [thuThu] = await pool.execute(
        `
        select * from admin where is_active = 1
        `
    )

    return res.status(200).json({
        flag: Flag.flag_get_data_success,
        thu_thus: thuThu
    })
}

const getThuThuDisable = async (req, res) => {
    const [thuThu] = await pool.execute(
        `
        select * from admin where is_active != 1
        `
    )

    return res.status(200).json({
        flag: Flag.flag_get_data_success,
        thu_thus: thuThu
    })
}

const getBookForSpinner = async (req, res) => {
    const [books] = await pool.execute(
        `
        select id as 'key', name as 'value', case when quantity > 0 then 'false' else 'true' end as 'disabled'
        from book
        `
    )

    // convert giá trị của trường disabled từ string -> boolean
    books.forEach((item, index) => {
        item.disabled = JSON.parse(item.disabled)
    })

    // sắp xếp mảng object có thuộc tính disabled lên đầu tiên
    books.sort((a, b) => a.disabled - b.disabled)

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        books: books
    })
}

const getCustomerForSpinner = async (req, res) => {
    const [customers] = await pool.execute(
        `
        select id as 'key', user_name as 'value', case when point > 0 then 'false' else 'true' end as 'disabale'
        from customer
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        customers: customers
    })

}

const getDiscountEnableForSpinner = async (req, res) => {
    const [discounts] = await pool.execute(
        `
        select id as 'key', code as 'value'
        from discount
        where STR_TO_DATE(time_end, '%d/%m/%Y') >= NOW()
        `
    )

    // mã giảm giá none là khi thủ thư không muốn áp dụng mã giảm giá vào phiếu mượn
    // nếu mảng rỗng thì không cần thêm mã giảm giá none và ngược lại
    if (discounts.length != 0) {
        discounts.push(
            {
                key: 'null',
                value: 'NONE',
            }
        )

        discounts.sort((a, b) => (a.key === 'null' && a.value === 'NONE') ? -1 : 0)
    }

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        discounts: discounts
    })
}

const getBookById = async (req, res) => {
    let id = req.params.id
    id = String(id).trim()

    console.log(
        `
        \n>>>>> Check id book search:
        ID: ${id}\n
        `
    )

    const [book] = await pool.execute(
        `
        select * from book where id = ?
        `, [id]
    )

    console.log(
        `
        \n>>>>> Check book found by id: 
        Book: ${JSON.stringify(book[0])}\n
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        book: book[0]
    })
}

const getDiscountById = async (req, res) => {
    let id = req.params.id
    id = String(id).trim()

    console.log(
        `
        \n>>>>> Check Id Discount Search:
        ID: ${id}\n
        `
    )

    const [discount] = await pool.execute(
        `
        select * from discount where id = ?
        `, [id]
    )

    console.log(
        `
        \n>>>>> Check discount found by id: 
        ID: ${discount[0]}\n
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        discount: discount[0]
    })
}

const getLoanByCustomerName = async (req, res) => {
    const keySearch = String(req.params.keySearch).trim()

    console.log(
        `
        \n>>>>> Check Key Search Loan Slip By Customer Name:
        Key: ${keySearch}\n
        `
    )

    const [loans] = await pool.execute(
        `
        select loan_slip.*, discount.code as code, discount.value_discount as value_discount, admin.user_name as user_name_admin, book.name as book_name, customer.user_name as customer_name, book.price as book_price
        from loan_slip
        inner join discount on loan_slip.id_discount_code = discount.id
        inner join admin on admin.id = loan_slip.created_by_admin
        inner join book on book.id = loan_slip.id_book
        inner join customer on customer.id = loan_slip.id_customer
        where match(customer.user_name) against('${keySearch}') and loan_slip.status = 0
        order by STR_TO_DATE(loan_slip.created_at, '%d/%m/%Y %H:%i:%s') desc
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        loans: loans
    })
}

const searchBookByCategoryId = async (req, res) => {
    let id = req.params.id
    id = String(id).trim()

    console.log(
        `
        \n>>>>> Check ID category Search Book:
        ID: ${id}\n
        `
    )

    const [books] = await pool.execute(
        `
        select image, id from book where id_category = ?
        `, [id]
    )

    console.log(
        `
        \n>>>>> Check: ${JSON.stringify(books)}\n
        `
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        books: books
    })
}

// delete method
const deleteBook = async (req, res) => {
    const id = String(req.params.id)

    console.log(
        `
        \n>>>>> Check Delete Book:
        Id: ${id}\n
        `
    )

    try {
        await pool.execute(`delete from book where id = ?`, [id])
    } catch (err) {
        return res.status(Flag.flag_delete_fail).json({
            flag: Flag.flag_delete_fail,
            message: err.message
        })
    }

    return res.status(Flag.flag_delete_success).json({
        flag: Flag.flag_delete_success,
        message: Message.message_delete_success
    })
}

const deleteCategory = async (req, res) => {
    const id = String(req.params.id).trim()

    console.log(
        `
        \n>>>>> Check Delete Category: 
        ID: ${id}\n
        `
    )

    try {
        await pool.execute(`delete from category where id = ?`, [id])
    } catch (err) {
        return res.status(Flag.flag_delete_fail).json({
            flag: Flag.flag_delete_fail,
            message: err.message
        })
    }

    return res.status(Flag.flag_delete_success).json({
        flag: Flag.flag_delete_success,
        message: Message.message_delete_success
    })
}

const deleteCustomer = async (req, res) => {
    const id = String(req.params.id).trim()

    console.log(
        `
        \n>>>>> Check Delete Customer:
        ID: ${id}\n
        `
    )

    try {
        await pool.execute(`delete from customer where id = ?`, [id])
    } catch (err) {
        return res.status(Flag.flag_delete_fail).json({
            flag: Flag.flag_delete_fail,
            message: err.message
        })
    }

    return res.status(Flag.flag_delete_success).json({
        flag: Flag.flag_delete_success,
        message: Message.message_delete_success
    })
}

const deleteDiscount = async (req, res) => {
    const id = String(req.params.id).trim()

    console.log(
        `
        \n>>>>> Check Delete Discount: 
        Id: ${id}\n
        `
    )

    try {
        await pool.execute(`delete from discount where id = ?`, [id])
    } catch (err) {
        return res.status(Flag.flag_delete_fail).json({
            flag: Flag.flag_delete_fail,
            message: err.message
        })
    }

    return res.status(Flag.flag_delete_success).json({
        flag: Flag.flag_delete_success,
        message: Message.message_delete_success
    })
}

const disableAdmin = async (req, res) => {
    let { id } = req.body
    id = String(id).trim()

    console.log(
        `
        \n>>>>> Check Disable admin ID:
        ID: ${id}\n
        `
    )

    await pool.execute(
        `
        UPDATE admin
        SET is_active = IF(is_active = 0, 1, 0)
        WHERE id = ?
        `, [id]
    )

    return res.status(Flag.flag_update_success).json({
        flag: Flag.flag_update_success,
        message: Message.message_update_success
    })
}

// post method
const handleLoginAdmin = async (req, res) => {
    var { userName, password } = req.body
    userName = String(userName).trim()
    password = String(password).trim()

    console.log(
        `
        \n>>>>> Check Login Admin:
        User name: ${userName}
        Passowrd: ${password}\n
        `
    )

    const [admin] = await pool.execute(`select * from admin where user_name = ?`, [userName])

    if (admin[0] == undefined || admin[0] == null || !admin[0]) {
        return res.status(Flag.flag_login_fail).json({
            flag: Flag.flag_login_fail,
            message: Message.message_login_fail
        })
    } if (String(admin[0].password) != String(password)) {
        return res.status(Flag.flag_login_fail).json({
            flag: Flag.flag_login_fail,
            message: Message.message_login_fail
        })
    } if (admin[0].is_active != 1) {
        return res.status(Flag.flag_login_fail).json({
            flag: Flag.flag_login_fail,
            message: 'Tài khoản đã bị vô hiệu hóa'
        })
    }

    return res.status(Flag.flag_login_success).json({
        flag: Flag.flag_login_success,
        message: Message.message_login_success,
        object_current: JSON.stringify(admin[0])
    })
}

const handleLoginBoss = async (req, res) => {
    var { email, password } = req.body
    email = String(email).trim()
    password = String(password).trim()

    console.log(
        `
        \n>>>>> Check Login Boss:
        Email: ${email}
        Password: ${password}\n
        `
    )

    const [boss] = await pool.execute(`select * from boos where email = ? and password = ?`, [email, password])

    setTimeout(() => {
        console.log(
            `
            \n>>>>> Check Boss Login Found: 
            Object: ${JSON.stringify(boss[0])}\n
            `
        )
    }, 2000);

    if (boss[0] == undefined || boss[0] == null || !boss[0]) {
        return res.status(Flag.flag_login_fail).json({
            flag: Flag.flag_login_fail,
            message: Message.message_login_fail
        })
    }

    return res.status(Flag.flag_login_success).json({
        flag: Flag.flag_login_success,
        message: Message.message_login_success,
        object_current: JSON.stringify(boss[0])
    })
}

const handleSearchBookByName = async (req, res) => {
    let { keySearch } = req.body
    keySearch = String(keySearch).trim()

    const [books] = await pool.execute(
        `select * from book where match(name) against('${keySearch}')`
    )

    console.log(JSON.stringify(books))

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        books: books
    })
}

const handleSearchCustomer = async (req, res) => {
    let id = req.params.id
    id = String(id).trim()

    console.log(
        `
        \n>>>>> Check ID Custmer Delete: ${id}\n
        `
    )

    const [objectSearch] = await pool.execute(
        `
        select * from customer where id = ?
        `, [id]
    )

    return res.status(Flag.flag_insert_success).json({
        flag: Flag.flag_insert_success,
        object_current: objectSearch[0]
    })
}

const handleSearchCustomerByName = async (req, res) => {
    let { keySearch } = req.body
    keySearch = String(keySearch).trim()

    console.log(
        `
        \n>>>>> Check Key Search Customer By Name:
        Customer name: ${keySearch}\n
        `
    )

    const [customers] = await pool.execute(
        `select * from customer where match(user_name ) against('${keySearch}')`
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        customers: customers
    })
}

const handleSearchCustomerByPhone = async (req, res) => {
    let { keySearch } = req.body
    keySearch = String(keySearch).trim()

    console.log(
        `
        \n>>>>> Check Phone Number Search Customer By Phone:
        Phone number: ${keySearch}\n
        `
    )

    const [customers] = await pool.execute(
        `
        select * from customer where phone_number = ?
        `, [keySearch]
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        customers: customers
    })
}

const handleSearchCustomerByEmail = async (req, res) => {
    let { keySearch } = req.body
    keySearch = String(keySearch).trim()

    console.log(
        `
        \n>>>>> Check Email Search Customer By Email:
        Email: ${keySearch}\n
        `
    )

    const [customers] = await pool.execute(
        `
        select * from customer where email = ?
        `, [keySearch]
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        customers: customers
    })
}

const handleSearchAdminByUserName = async (req, res) => {
    let { keySearch } = req.body
    keySearch = String(keySearch).trim()

    console.log(
        `
        \n>>>>> Check key search admin: 
        Key search: ${keySearch}\n
        `
    )

    const [admins] = await pool.execute(
        `select * from admin where match(user_name ) against('${keySearch}')`
    )

    return res.status(Flag.flag_get_data_success).json({
        flag: Flag.flag_get_data_success,
        admins: admins
    })
}

const API = {
    signUpBoss,
    signUpAdmin,
    handleAddCategory,
    handleAddBook,
    handleAddCustomer,
    handleAddDiscount,
    handleAddLoanSlip,
    updateInformationAdmin,
    enableAccountAdmin,
    handleUpdateBook,
    handleUpdateBoss,
    handleUpdateCategory,
    handleUpdateCustomer,
    creditPointsReduction,
    handleUpdateDiscount,
    increaseUsage,
    getAllAdmin,
    getAllBook,
    getAllCategory,
    getAllDiscount,
    getAllLoan,
    getAllCustomer,
    deleteBook,
    deleteCategory,
    deleteCustomer,
    deleteDiscount,
    handleLoginAdmin,
    handleLoginBoss,
    handleSearchBookByName,
    handleSearchCustomer,
    getDiscountEnable,
    getDiscountDisable,
    handlePayBook,
    getAllBookOrderByDESCPurchases,
    getAllBookOrderByASCPurchases,
    getAllBookOrderByDESCQuantity,
    getAllBookOrderByASCQuantity,
    getAllLoanPayed,
    getAllLoanNotPay,
    handleSearchCustomerByName,
    handleSearchCustomerByPhone,
    handleSearchCustomerByEmail,
    getBlackListCustomer,
    getNegativeListCustomer,
    getDoanhThuTheoThang,
    getThuThu,
    getThuThuDisable,
    getThuThuEnable,
    handleSearchAdminByUserName,
    disableAdmin,
    updateAdmin,
    updateBoss,
    getBookForSpinner,
    getCustomerForSpinner,
    getDiscountEnableForSpinner,
    getBookById,
    getDiscountById,
    searchBookByCategoryId,
    getLoanByCustomerName
}

export default API