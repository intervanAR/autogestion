import React from "react";
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Snackbar from "../Snackbar/Snackbar";

const styles = { };

@withStyles(styles)
export default class MessageComponent extends React.Component {

	static propTypes = {
		style: PropTypes.any,
		color: PropTypes.string,
		message: PropTypes.string
	};

	state = {
		openSnackBar: true
	};


	timeout = null;

	componentWillReceiveProps () {
		this.showSnackBar();
	}

	componentWillUnmount () {
		if (this.timeout) clearTimeout(this.timeout);
	}

	showSnackBar = () => {
		this.setState({ openSnackBar: true });
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(this.closeSnackBar, 3000);
	};

	closeSnackBar = () => this.setState({ openSnackBar: false });

	render() {
		const { color, message } = this.props;
		const {openSnackBar} = this.state;
		if (!message || !openSnackBar) return <span/>;
		return (
			<div>
				<Snackbar
					place="br"
					color={color}
					message={message}
					open={openSnackBar}
					closeNotification={this.closeSnackBar}
					close
				/>
			</div>
		);
	}
}
