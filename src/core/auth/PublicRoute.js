import React from 'react';

import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

@connect(
    null,
    dispatch => ({ // mapDispatchToProps
        actions: bindActionCreators({ }, dispatch)
    })
)
export default class PublicRouteComponent extends React.Component {

    static propTypes = {
        actions: PropTypes.any,
        componentProps: PropTypes.any,
        component: PropTypes.any
    };

    componentWillMount () {
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
