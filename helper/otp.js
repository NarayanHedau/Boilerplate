module.exports = {
    generateOTP: function () {
        return Math.floor(1000 + Math.random() * 9000);
    },
    generatePIN: function () {
        return Math.floor(100000000000 + Math.random() * 900000000000);
    }
};