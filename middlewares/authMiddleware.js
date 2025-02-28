
const jwt = require('jsonwebtoken');

module.exports.authenticateToken = (req, res, next) => {
    // bỏ qua các đường dẫn
    // const whiteList = ['/about', '/contact', '/products'];
    // if(whiteList.includes(req.originalUrl)) {
    //     return next();
    // }
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            code: "error",
            message: "Không có token xác thực!",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {    
        if (err) {
            return res.status(401).json({
                code: "error",
                message: "Token không hợp lệ!",
            });
        }

        // Gán thông tin người dùng vào req.user
        req.user = decoded; // Đảm bảo rằng bạn gán giá trị decoded (thông tin người dùng) vào req.user
        next();
    });
    
};

// module.exports.authenticateToken = (req, res, next) => {
//     // bỏ qua các đường dẫn
//     // const whiteList = ['/about', '/contact', '/products'];
//     // if(whiteList.includes(req.originalUrl)) {
//     //     return next();
//     // }
//     const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ "Bearer <token>"
//     if (!token) {
//         return res.status(401).json({
//             code: "error",
//             message: "Không có token xác thực!",
//         });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         console.log("check token", decoded)
//         req.user = {
//             email: decoded.email,
//             fullname: decoded.fullname,
//         }
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             code: "error",
//             message: "Token không hợp lệ hoặc đã hết hạn!",
//         });
//     }
    
// };