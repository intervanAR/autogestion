import React from "react";
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "../../components/CustomButtons/Button.jsx";
import BlockComponent from "../../components/Loading/BlockComponent";

export default class RemoveItemComponent extends React.Component {

	static propTypes = {
		classes: PropTypes.any,
		style: PropTypes.any,
		open: PropTypes.bool.isRequired,
		item: PropTypes.any.isRequired,
		handleClose: PropTypes.func.isRequired,
		handleOnRemove: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		loading: PropTypes.bool
	};

	state = {
	};

	handleClose = () => {
		if (this.props.handleClose) this.props.handleClose();
	};

	handleContinue = () => {
		const { item } = this.props;
		if (this.props.handleOnRemove) this.props.handleOnRemove(item);
	};

	render() {
		const { title, description, loading } = this.props;
		return (
			<Dialog
				open={this.props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<BlockComponent blocking={loading}>
					<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{description}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose}>
							Cancelar
						</Button>
						<Button onClick={this.handleContinue} color="danger" autoFocus>
							Si
						</Button>
					</DialogActions>
				</BlockComponent>
			</Dialog>
		);
	}
}
