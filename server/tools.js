function isInteger(id) {
    if (parseInt(id))
        return true;
    else
        return false;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

module.exports = { isInteger, sleep }; 