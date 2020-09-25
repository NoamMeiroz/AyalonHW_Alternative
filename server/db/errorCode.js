getMessage = (err) => {
    console.log("in get Message");
    message = "";
    if (err.errors)
        message  = err.errors[0].instance + " " + err.errors[0].type;
    else if(err.sqlMessage)
        message = err.sqlMessage;
    else 
        message = err;
    return message
}

module.exports = {getMessage};