const jwt = require('jsonwebtoken');

//=============================
//VERIFICAR TOKEN
//=============================


let checkToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid Token',
                    detail: err
                }
            });
        }
        req.user = decoded.user;
        next();
    })

}


let checkAdmin_Role = (req, res, next) => {
    let user = req.user;
    if (user.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Rol unauthorized'
            }
        });
    }
    next();
}


let checkTokenURL = (req, res, next) => {

    let token = req.query.token;


    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid Token',
                    detail: err
                }
            });
        }
        req.user = decoded.user;
        next();
    })

}

module.exports = {
    checkToken,
    checkAdmin_Role,
    checkTokenURL
};