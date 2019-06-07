import React from 'react';
import PropTypes from 'prop-types';
import BlockUi from 'react-block-ui'; // @TODO - this lib is doing a crazy shit with focus that produces flickering in tall windows

import 'react-block-ui/style.css';
require('./loader.scss');

export default class BlockComponent extends React.Component {

    static propTypes = {
        blocking: PropTypes.bool,
        keepInView: PropTypes.bool,
        showSpinner: PropTypes.bool,
        children: PropTypes.node,
        renderChildren: PropTypes.bool, // default to true
        className: PropTypes.string,
        message: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node,
        ]),
        loader: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.node,
        ]),
        tag: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
    };

    static defaultProps = {
        showSpinner: true,
    };

    state = {};

    render() {
        const {showSpinner, blocking, children} = this.props;

        const MyLoader = () => {
            return showSpinner ? <div className="jp-loader"/> : <div></div>;
        };

        return (
            <BlockUi loader={MyLoader} blocking={blocking} keepInView>
                {children}
            </BlockUi>
        );
    }
}
