getMessage = (err) => {
    errorsCode = [1054, 1366]
    message = "";
    if (err.errors)
        message  = err.errors[0].instance + " " + err.errors[0].type;
    else if(err.sqlMessage)
        message = err.sqlMessage;
    else 
        message = err;
}

module.exports = {getMessage};