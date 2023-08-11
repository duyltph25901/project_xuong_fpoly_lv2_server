import sql from 'mysql2/promise'

const pool = sql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'xuong_thuc_hanh_poly_lv2'
})

export default pool