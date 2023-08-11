// code http
const flag_insert_success = 200
const flag_update_success = flag_insert_success
const flag_delete_success = flag_insert_success
const flag_insert_fail = 400
const flag_update_fail = flag_insert_fail
const flag_delete_fail = flag_insert_fail
const flag_get_data_success = flag_insert_success
const flag_get_data_fail = 500
const flag_login_success = 201
const flag_login_fail = 404

// code active user
const is_active = 1
const is_not_active = 0

// point user
const point_user_max = 100

const Flag = {
    flag_insert_success,
    flag_insert_fail,
    is_active,
    is_not_active,
    point_user_max,
    flag_update_fail,
    flag_update_success,
    flag_delete_fail,
    flag_delete_success,
    flag_get_data_fail,
    flag_get_data_success,
    flag_login_success,
    flag_login_fail
}

export default Flag