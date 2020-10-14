import {SERVER} from './Constants';

let response = {};

export default function fetchPost(url, method = 'GET', data = null) {

    let init = {
        method,
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    if (data) init.body = JSON.stringify(data);

    return fetch(SERVER + '/' + url, init)
        .then(res => {
            response = {
                status: res.status,
                ok: res.ok
            };
            return res;
        })
        .then(res => res.json())
        .then(res => {
            response.body = res;
            return response;
        })
        .catch(error => {
            if (!response.ok) response.error = error;
            return response;
        })

}
