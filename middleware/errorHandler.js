const {constants} = require('./../constants');
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 502; 

    switch (statusCode) {
        case constants.Validation_Error:
            res.json({
                title: "Validation Error",
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case constants.Not_Found:
            res.json({
                title: "Not Found",
                message: err.message,
                stackTrace: err.stack
            });
            break;   
        case constants.Forbidden:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case constants.Unauthorized:
            res.json({
                title: "Unauthorized",
                message: err.message,
                stackTrace: err.stack
            });
            break;         
        case constants.Server_Error:
            res.json({
                title: "Server_Error",
                message: err.message,
                stackTrace: err.stack
            });
        default:
            console.log("All goods! Mathai Nosto!!!!!!!!!");
            break;
    }
};

module.exports = errorHandler;