import {makeAPICall} from "./http-request";

const API = {
    login(usuario, clave) {
        return makeAPICall({
            methodCall: () => ({url: '/session', method: 'post', data: {usuario, clave}}),
            needsToken: false
        }).then(response => response.data);
    },
    getMe() {
        return makeAPICall({
                methodCall: () => ({url: `/usuarios/me`}),
                method: 'post',
                needsToken: true
            }).then(response => response.data);
    },
};

export default API;
