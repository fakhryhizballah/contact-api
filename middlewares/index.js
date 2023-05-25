const jwt = require('jsonwebtoken');

module.exports = {
    login: (req, res, next) => {
        try {
            const token = (req.headers['authorization']).split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: 'youre not authorized!',
                    data: null
                });
            }
            console.log(token);

            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);

            req.user = decoded;

            next();
        } catch (err) {
            if (err.message == 'jwt malformed') {
                return res.status(401).json({
                    status: false,
                    message: err.message,
                    data: null
                });
            }

            // return res.status(401).json({
            //     status: false,
            //     message: err.message,
            //     data: null
            // });
            return res.status(401).json({
                status: false,
                message: "youre not authorized !!!",
                data: null
            });
        }

    }
};