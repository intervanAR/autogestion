import { makeAPICall } from "./http-request";

/**
 *
 *
 * dispatch({
 *      type: 'XXX',
 *      payload: {
 *          API: {  // can be a func that gets(getState)
 *              types:[request, success, fail],
 *              endpoint: { url: '/public/login', method: 'post', data: { email, password } },
 *              needsToken: false,
 *              processBody: response => transform(response)
 *          }
 *      })
 */

export const APICallMiddleware = store => next => action => {
    if (!action.payload || !action.payload.API) {
        return next(action);
    }

    let APIConf = action.payload.API;


    if (typeof APIConf === 'function') {
        APIConf = APIConf(store.getState);
    }
    let { endpoint, types, needsToken = true,
        processBody = r => r,
        processError = e => e,
        isCached = () => false,
    } = APIConf;

    if(isCached(store.getState())) {
        console.log('request cached, returning');
        return Promise.resolve();
    }


    // if (typeof endpoint !== 'string') {
    //     throw new Error('Specify a string endpoint URL.')
    // }

    if (!Array.isArray(types) || types.length !== 3) {
        types = [null, null, null];
    }

    const actionWith = data => {
        const payload = { ...action.payload, ...data.payload };
        delete payload.API;
        return { type: data.type, payload };
    };

    const requestType = types[0] || action.type + '_LOADING';
    const successType = types[1] || action.type;
    const failureType = types[2] || action.type + '_ERROR';
    // const [requestType, successType, failureType] = types;
    next(actionWith({ type: requestType, payload: { error: false, loading: true } }));

    return makeAPICall({ requestConfig: endpoint, needsToken })
        .then(( { data, status }) => {
            if (data.error) throw new Error(data.error);
            const _data = processBody(data, status);
            next(actionWith({
                payload: { data: _data, status, error: false, loading: false, params: endpoint.params, requestPayload: endpoint.data },
                type: successType
            }));
            return _data;
        })
        .catch(errorResponse => {
            console.log(errorResponse);
            const status =  errorResponse.status;
            const data = processError(errorResponse.data || {}, status);
            next(actionWith({
                type: failureType,
                payload: {
                    loading: false,
                    status,
                    error: data.message || errorResponse.message || 'Something bad happened',
                    data
                }
            }));
            throw data;
        });
};

