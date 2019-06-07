import React from 'react';
import PropTypes from 'prop-types';
import BlockComponent from "./BlockComponent";

export default class SpinnerComponent extends React.Component {

    static propTypes = {
        blocking: PropTypes.bool,
    };

    state = {};

    render() {
        if (this.props.blocking) return null;
        return (<BlockComponent {...this.props}/>);
    }
}
