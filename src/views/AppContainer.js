import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, Switch} from 'react-router-dom';
import {browserHistory} from '../core/globals';
import {getStore} from '../core/store';
import {setDeps, logout, loginFromLocalStorage} from '../core/auth/auth-actions';
import indexRoutes from "../routes";
import SpinnerComponent from '../components/Loading/SpinnerComponent';
import {initializeAPI} from '../core/services/http-request';

const store = getStore();
setDeps(browserHistory);
initializeAPI(() => store.dispatch(logout()));

export default class App extends React.Component {

    componentWillMount() {
        this.setState({loading: true});
        store.dispatch(loginFromLocalStorage())
            .then(() => {
                this.setState({loading: false});
            });
    }

    render() {
        if (this.state.loading)
            return (<SpinnerComponent blocking={true} style={{ minHeight: 400, height: '100%' }}/>);
        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Switch>
                        {indexRoutes.map((prop, key) => {
                            return <Route path={prop.path} component={prop.component} key={key}/>;
                        })}
                    </Switch>
                </Router>
            </Provider>
        );
    }
}
