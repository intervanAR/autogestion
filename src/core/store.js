import { getRootReducer } from './reducers.main';
import { createStore, compose, applyMiddleware } from "redux";
import {thunk} from './services/redux-middleware';
import {APICallMiddleware} from './services/ApiMiddleware';

let store;
export const getStore = () => {
    if (!store) {
        const reducers = getRootReducer();
        store = configureStore(reducers);
    }
    return store;
};


function configureStore (rootReducer) {

    const isDev = (__GLOBALS__.__DEV__);
    const composeFn = (isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||  compose;

    const composeArgs = [
        applyMiddleware(
            APICallMiddleware,
            thunk,
        )
    ];

    const store = createStore(
        rootReducer,
        composeFn.apply(this, composeArgs)
    );

    return store;
}
