const getCurrentDateTime = () => {
    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng 1
    var year = now.getFullYear();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Chuyển đổi sang chuỗi định dạng
    var formattedDateTime =
        pad(day) +
        '/' +
        pad(month) +
        '/' +
        year +
        ' ' +
        pad(hours) +
        ':' +
        pad(minutes) +
        ':' +
        pad(seconds);

    return formattedDateTime;
}

// Hàm này để thêm số 0 vào trước các giá trị nhỏ hơn 10
const pad = (number) => {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

const Date = {
    getCurrentDateTime
}

export default Date