import React from "react";
import PropTypes from "prop-types";
import Datetime from "react-datetime";
import Moment from 'moment';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import BlockComponent from "../../components/Loading/BlockComponent";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import modalStyle from "../../assets/jss/modalStyle.jsx";
import {cardTitle} from "../../assets/jss/autogestion";

const styles = (theme) => ({
	...modalStyle(theme),
	cardTitle: {
		...cardTitle,
		color: "#FFFFFF"
	},
	justifyContentCenter: {
		justifyContent: "center !important"
	}
});

@ withStyles(styles)
export default class RefacturarComponent extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		loading: PropTypes.bool,
		open: PropTypes.bool.isRequired,
		selectedList: PropTypes.array.isRequired,
		onCancelClick: PropTypes.func.isRequired,
		onRefacturarClick: PropTypes.func.isRequired
	};

	state = {
		item: {
			fechaVencimiento: new Date()
		}
	};

	bindDateValue = key => {
		return {
			onChange: m => {
				const item = this.state.item;
				item[key] = m.format('DD/MM/YYYY');
				this.setState({item});
			},
			value: this.state.item[key] || ''
		};
	};

	onSubmitRefacturar = (event) => {
		event.stopPropagation();
		event.preventDefault();
		const {selectedList} = this.props;
		const {item: {fechaVencimiento}} = this.state;
		return this.props.onRefacturarClick(selectedList, Moment(fechaVencimiento).local().format("YYYY-MM-DD"));
	};

	isValidDate = ( current ) => {
		const yesterday = Datetime.moment().subtract( 1, 'day' );
		return current.isAfter( yesterday );
	};

	render() {
		const {classes, loading, onCancelClick} = this.props;
		return (
			<Dialog
				classes={{
					root: classes.center + " " + classes.modalRoot,
					paper: classes.modal
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
							<GridItem xs={12} sm={6} md={4} style={{minWidth: "100%"}}>
								<form autoComplete="off" onSubmit={this.onSubmitRefacturar.bind(this)}>
									<Card login className={classes[this.state.cardAnimaton]}>
										<CardHeader
											className={`${classes.cardHeader} ${classes.textCenter}`}
											color="primary"
										>
											<h4 className={classes.cardTitle}>Refacturar</h4>
										</CardHeader>
										<CardBody>
											<div>
												<InputLabel className={classes.label}>Fecha Vencimiento</InputLabel>
												<br/>
												<FormControl className={classes.selectFormControl}>
													<Datetime
														dateFormat="DD/MM/YYYY"
														timeFormat={false}
														inputProps={{
															required: true
														}}
														locale="es-ES"
														isValidDate={this.isValidDate}
														{...this.bindDateValue('fechaVencimiento')}
													/>
												</FormControl>
											</div>
										</CardBody>
										<CardFooter className={classes.justifyContentCenter}>
											<div className={classes.center} style={{textAlign: 'center'}}>
												<Button round onClick={onCancelClick}>
													Cancelar
												</Button>
												<Button round color="primary" type="submit">
													Refacturar
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
