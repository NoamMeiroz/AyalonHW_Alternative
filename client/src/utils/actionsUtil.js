
const MAJOR_FAILURE = "בעיה במערכת. נא לפנות לתמיכה";

export const getAxiosHeader = () => {
    return { headers : { 'authorization': localStorage.getItem('token') }};
}

export const handleErrorResponse = (response) => {
    switch (response.status) {
        case 400:
            return response.data;
        case 401:
            return "שם משתמש או סיסמה שגויים";
        case 422:
            return "המערכת לא הצליחה ליצור משתמש חדש.";
        case 500:
            return MAJOR_FAILURE;
        case 504:
            return "המערכת לא יכולה להחזיר תשובה בפרק זמן סביר";
        default:
            return MAJOR_FAILURE;
    }
};

/**
 * Convert error to meaningfull message
 * @param {Error} error 
 */
export const handleError = (error) => {
    let errorMessage = "";
    if (!error.response) {
        if (error.message)
            if (error.message === "Network Error")
                errorMessage = "קיימת בעיית תקשורת עם השרת";
            else
                errorMessage = error.message;
        else
            errorMessage = "בעיה במערכת";
    }
    else if (error.response.status) {
        errorMessage = handleErrorResponse(error.response);
    }
    else
        errorMessage = MAJOR_FAILURE;
    return errorMessage;
}