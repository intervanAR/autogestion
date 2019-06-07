import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import BlockComponent from "../../components/Loading/BlockComponent";
import Button from "../../components/CustomButtons/Button";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import extendedFormsStyle from "../../assets/jss/views/extendedFormsStyle.jsx";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

import pagesStyle from "../../assets/jss/layouts/pagesStyle";
import {
	tooltip
} from "../../assets/jss/autogestion";
import {getTiposCuentas} from "../../core/tiposCuentas/tiposCuentas-actions";
import {getCuentas} from "../../core/cuentas/cuentas-actions";

import * as AuthService from "../../core/auth/auth-actions";

const styles = (theme) => ({
	...pagesStyle(theme),
	...extendedFormsStyle,
	...tooltip,
	selectEmpty :{
		minWidth:'150px'
	},
});

@connect(
	state => ({
		tiposCuentas: state.tiposCuentas,
		cuentas: state.cuentas,
		user: state.auth.user,
	}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
			getTiposCuentas,
			getCuentas,
		}, dispatch)
	})
)
@withStyles(styles)
export default class FiltroEstadoDeudaComponent extends React.Component {
	static propTypes = {
		classes: PropTypes.any,
		style: PropTypes.any,
		cuentas: PropTypes.object,
		tiposCuentas: PropTypes.object.isRequired,
		actions: PropTypes.any.isRequired,
		onSearch: PropTypes.func.isRequired,
	};

	state = {
		item: {},
		errorMessage: '',
	};

	constructor(props) {
		super(props);
		this.handleOnSearch = this.handleOnSearch.bind(this);
	}

	componentDidMount() {
		const usuario = this.props.user != undefined ? this.props.user.id : null;
		return Promise.all([
			this.props.actions.getTiposCuentas({}),
			this.props.actions.getCuentas({usuario}),
		])
	}

	bindValue = key => {
		//Cuando isLoggedIn se mapean datos de la cuenta.
		if (key == 'cuenta'){
			return {
				onChange: e => {
					const cuenta = this.props.cuentas.data.filter((item) => item.idCuenta == e.target.value).shift();
					const item = this.state.item;
					item['cuentaNro'] = null;
					item['tipoCuentaId'] = null;
					if (cuenta != undefined){
						item['cuentaNro'] = cuenta.cuentaNro;
						item['tipoCuentaId'] = cuenta.tipoCuentaId;
					}
					this.setState({item});
				}
			};
		}

		return {
			onChange: e => {
				const item = this.state.item;
				item[key] = e.target.value;
				this.setState({item});
			},
			value: this.state.item[key] || ''
		};
	};

	handleOnSearch(event) {
		event.stopPropagation();
		event.preventDefault();
		const {item} = this.state;
		if (this.validarDatos(item))
			return this.props.onSearch(item.tipoCuentaId, item.cuentaNro);
	}

	validarDatos(item){
		if (AuthService.isLoggedIn() && (!item.cuentaNro || !item.tipoCuentaId)){
			this.setState({errorMessage: 'Debe seleccionar una Cuenta'});
			return false;
		}
		if (!AuthService.isLoggedIn()){
			if (!item.tipoCuentaId) {
				this.setState({errorMessage: 'Ingrese Tipo de Cuenta'});
				return false;
			}
			if (!item.cuentaNro){
				this.setState({errorMessage: 'Ingrese Número de Cuenta'});
				return false;
			}
		}
		this.setState({errorMessage: ''});
		return true;
	}

	render() {
		const {classes, tiposCuentas: {data: dataTiposCuentas, loadingTiposCuentas},
		cuentas :{data:dataCuentas, loadingCuentas}} = this.props;
		const {errorMessage} = this.state;
		const loading = loadingTiposCuentas;

		return (
			<BlockComponent blocking={loading}>
				<GridContainer>
					<GridItem xs={4} sm={4} md={4}>
						<FormControl required className={classes.selectFormControl}>
							{ AuthService.isLoggedIn()
								?
									<div>
										<InputLabel htmlFor="cuenta">Seleccione una Cuenta</InputLabel>
										<Select
											{...this.bindValue('cuenta')}
											name="cuentaNro"
											inputProps={{
												id: 'cuenta',
											}}
											className={classes.selectEmpty}
											MenuProps={{
												className: classes.selectMenu,
											}}
											native
										>
										<option value="" ></option>
										{dataCuentas.map(({idCuenta, descripcion}, key) => {
											return (<option
																key={key}
																type='number'
																value={idCuenta}
															>{descripcion}</option>);
										})}
										</Select>
									</div>
							  :
									<div>
										<InputLabel htmlFor="tipoCuentaId">Tipo de Cuenta</InputLabel>
										<Select

											{...this.bindValue('tipoCuentaId')}
											name="tipoCuentaId"
											inputProps={{
												id: 'tipoCuentaId',
											}}
											className={classes.selectEmpty}
											MenuProps={{
												className: classes.selectMenu,
											}}
											native
										>
											<option value="" disabled></option>
											{dataTiposCuentas.map(({id, descripcion}, key) => {
												return (<option key={key} value={id}>{descripcion}</option>);
											})}
										</Select>
									</div>
							}

						</FormControl>
					</GridItem>
					{ ! AuthService.isLoggedIn()
						?
							<div>
								<GridItem xs={4} sm={4} md={4}>
									<CustomInput
										labelText="Número"
										id="nummero"
										formControlProps={{
											fullWidth: false,
											style: {marginLeft: "30px", paddingTop: "18px"}
										}}
										inputProps={{
											required: true,
											...this.bindValue('cuentaNro'),
											type: 'Number'
										}}
										labelProps={{
											style: {top: "0px"}
										}}
									/>
								</GridItem>
							</div>
						:
							<div></div>
					}
					<GridItem xs={12} sm={4} md={4}>
						<Button color="primary" onClick={this.handleOnSearch}>Consultar</Button>
					</GridItem>
				</GridContainer>
				<div style={{color: "red"}}>{errorMessage}</div>
			</BlockComponent>
		);
	}
}
