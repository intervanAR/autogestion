import React from 'react';

import PropTypes from 'prop-types';
import * as AuthService from './auth-actions';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { requireAuthentication } from "./auth-actions";

@connect(
    null,
    dispatch => ({ // mapDispatchToProps
        actions: bindActionCreators({ requireAuthentication }, dispatch)
    })
)
export default class PrivateRouteComponent extends React.Component {

    static propTypes = {
        actions: PropTypes.any,
        componentProps: PropTypes.any,
        component: PropTypes.any
    };

    componentWillMount () {
        if (!AuthService.isLoggedIn()) {
            this.props.actions.requireAuthentication();
        }
    }

    render = () => {
        const { component: Component, componentProps, ...rest } = this.props;

        return (
            <Route {...rest} render={props => {
                const allProps = { ...props, ...componentProps };
                return (<Component {...allProps}/>);
            }}/>
        );
    };
}
