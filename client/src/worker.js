import axios from 'axios';

const API_SERVER = process.env.REACT_APP_API_SERVER || `/api`;

export default function checkProgress() {
    var progress = {};
    var employerId = -1;

    const addProgress = () => {
        axios.get(`${API_SERVER}/employer/${employerId}/employee/precentReady`)
            .then(payload => {
                if (payload.precent) {
                    if (payload.precent === 100) {
                        clearInterval(progress);
                    }
                    postMessage(payload);
                }
                else {
                    clearInterval(progress);
                    postMessage({ err: "בעיה במערכת, תשובה מהשרת לא תקינה" });
                }
            }).catch(err => {
                clearInterval(progress);
                let message = "";
                if (err.response.status === 500) {
                    message = "בעיה במערכת";
                }
                else
                    message = err.response.data;
                postMessage({ err: message });
            });
    }


    self.addEventListener("message", event => { /* eslint-disable-line no-restricted-globals */
        employerId = event.data.employerID;
        progress = setInterval(addProgress, 5000);
    });
}