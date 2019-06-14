import React from "react";
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "../../components/CustomButtons/Button.jsx";
import BlockComponent from "../../components/Loading/BlockComponent";
import Typography from '@material-ui/core/Typography';

export default class DialogMessage extends React.Component {

	static propTypes = {
		classes: PropTypes.any,
		style: PropTypes.any,
		open: PropTypes.bool.isRequired,
		handleClose: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
    color:PropTypes.string,
	};

	state = {
	};

	handleClose = () => {
		if (this.props.handleClose) this.props.handleClose();
	};

	render() {
		const { title, description, loading, color } = this.props;
		return (
			<Dialog
				open={this.props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
					<DialogTitle id="alert-dialog-title"><i style={{color:color,fontSize: '24px'}} class="material-icons">
              error_outline
            </i></DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
              <Typography gutterBottom variant="headline">{description}</Typography>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose}>
							Aceptar
						</Button>
					</DialogActions>
			</Dialog>
		);
	}
}
