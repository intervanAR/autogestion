import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Person from "@material-ui/icons/Person";
import LockOutline from "@material-ui/icons/LockOutlined";

// core components
import GridContainer from "../Grid/GridContainer.jsx";
import GridItem from "../Grid/GridItem.jsx";
import CustomInput from "../CustomInput/CustomInput.jsx";
import Button from "../CustomButtons/Button.jsx";
import Card from "../Card/Card.jsx";
import CardBody from "../Card/CardBody.jsx";
import CardHeader from "../Card/CardHeader.jsx";
import CardFooter from "../Card/CardFooter.jsx";
import BlockComponent from "../Loading/BlockComponent";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import loginPageStyle from "../../assets/jss/views/loginPageStyle.jsx";
import * as AuthService from "../../core/auth/auth-actions";
import modalStyle from "../../assets/jss/modalStyle.jsx";

const styles = (theme) => ({
	...modalStyle(theme),
	...loginPageStyle(theme),
});

@ withStyles(styles)
export default class LoginComponent extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		loading: PropTypes.bool,
		errorMessage: PropTypes.string,
		open: PropTypes.bool.isRequired,
		onCancelClick: PropTypes.func.isRequired,
		onLogin: PropTypes.func.isRequired,
		history: PropTypes.object
	};

	state = {
		cardAnimaton: "cardHidden",
		item: {}
	};

	componentDidMount() {
		// we add a hidden class to the card and after 700 ms we delete it and the transition appears
		this.timeOutFunction = setTimeout(
			function () {
				this.setState({cardAnimaton: ""});
			}.bind(this),
			700
		);
	}

	componentWillMount() {
		if (AuthService.isLoggedIn()) {
			this.props.onCancelClick();
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeOutFunction);
		this.timeOutFunction = null;
	}

	bindValue = key => {
		return {
			onChange: e => {
				const item = this.state.item;
				item[key] = e.target.value;
				this.setState({item});
			},
			value: this.state.item[key] || ''
		};
	};

	onSubmitLogin = (event) => {
		event.stopPropagation();
		event.preventDefault();
		const {item: {username, password}} = this.state;
		return this.props.onLogin(username, password);
	};

	render() {
		const {classes, errorMessage, loading, onCancelClick} = this.props;
		return (
			<Dialog
				classes={{
					root: classes.center + " " + classes.modalRoot + " " + classes.modalLogin,
					paper: classes.modal + " " + classes.paperModalLogin
				}}
				open={this.props.open}
				aria-labelledby="classic-modal-slide-title"
				aria-describedby="classic-modal-slide-description"
			>
				<BlockComponent blocking={loading}>
					<DialogContent
						id="classic-modal-slide-description"
						className={classes.modalBody}
						style={{background: "none", boxShadow: "none"}}>

							<GridContainer justify="center">
								<GridItem xs={12} sm={6} md={4} style={{minWidth:"100%"}}>
									<form autoComplete="off" onSubmit={this.onSubmitLogin.bind(this)}>
										<Card login className={classes[this.state.cardAnimaton]}>
											<CardHeader
												className={`${classes.cardHeader} ${classes.textCenter}`}
												color="primary"
											>
												<h4 className={classes.cardTitle}>Ingresar</h4>
											</CardHeader>
											<CardBody>
												<CustomInput
													labelText="Usuario"
													id="username"
													formControlProps={{
														fullWidth: true
													}}
													inputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<Person className={classes.inputAdornmentIcon}/>
															</InputAdornment>
														),
														required: true,
														...this.bindValue('username')
													}}
												/>
												<CustomInput
													labelText="Clave"
													id="password"
													formControlProps={{
														fullWidth: true
													}}
													inputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<LockOutline className={classes.inputAdornmentIcon}/>
															</InputAdornment>
														),
														type: "password",
														required: true,
														...this.bindValue('password')
													}}
												/>
												{
													errorMessage &&
													<p style={{color: "red", fontWeight: "bold"}}>
														{errorMessage}
													</p>
												}
											</CardBody>
											<CardFooter className={classes.justifyContentCenter}>
												<div className={classes.center} style={{textAlign: 'center'}}>
													<Button round onClick={onCancelClick}>
														Cancelar
													</Button>
													<Button round color="primary" type="submit">
														Ingresar
													</Button>
												</div>
											</CardFooter>
										</Card>
									</form>
								</GridItem>
							</GridContainer>
					</DialogContent>
				</BlockComponent>
			</Dialog>
		);
	}
}
