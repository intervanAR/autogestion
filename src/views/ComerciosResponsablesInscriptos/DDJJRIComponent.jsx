import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from 'redux';
import Datetime from "react-datetime";
import Dialog from '@material-ui/core/Dialog';
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import withStyles from "@material-ui/core/styles/withStyles";
import DialogContent from '@material-ui/core/DialogContent';
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import BlockComponent from "../../components/Loading/BlockComponent";
import extendedFormsStyle from "../../assets/jss/views/extendedFormsStyle.jsx";
import modalStyle from "../../assets/jss/modalStyle.jsx";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import CheckIcon from "@material-ui/icons/Check";
import {
	getActividadPorComercio,
	getFechaCalculoAnteriorAlicuotaMinimo,
	getAlicuota,
	getMinimo,
	getDeclaracionesAnterioresObj,
	getDDJJImporte,
	getDDJJCarga,
	getDDJJPendientePago,
	getDDJJActualImporte,
	getDDJJImporteFijo,
	getCodImpuestoFechaCalculoAnteriorAlicuotaMinimo,
} from "../../core/DDJJComerciosRI/DDJJComerciosRI-actions";
import {getTipoDeclaracion} from "../../core/DDJJComerciosRI/tipoDeclaracion";
import ConfirmItemComponent from "../../components/ConfirmItem/ConfirmItemComponent";

const styles = (theme) => ({
	...modalStyle(theme),
	...extendedFormsStyle,
	fieldsContainer: {
		marginTop: "0px",
		marginBottom: "1px",
	}
});

@connect(
	state => ({
		usuario: state.auth.user,
		cuentasComerciosRI: state.cuentasComerciosRI,
		DDJJComerciosRI: state.DDJJComerciosRI,
		configuraciones: state.configuraciones,
	}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
			getActividadPorComercio,
			getFechaCalculoAnteriorAlicuotaMinimo,
			getAlicuota,
			getMinimo,
			getDeclaracionesAnterioresObj,
			getDDJJImporte,
			getDDJJCarga,
			getDDJJPendientePago,
			getDDJJActualImporte,
			getDDJJImporteFijo,
			getCodImpuestoFechaCalculoAnteriorAlicuotaMinimo,
		}, dispatch)
	})
)
@withStyles(styles)
export default class DDJJRIComponent extends React.Component {

	static propTypes = {
		classes: PropTypes.any,
		style: PropTypes.any,
		open: PropTypes.bool.isRequired,
		comercioIdSelected: PropTypes.string,
		item: PropTypes.any,
		handleCloseModal: PropTypes.func.isRequired,
		handleOnSubmit: PropTypes.func.isRequired,
		handleOnConfirmar: PropTypes.func.isRequired,
		handleOnAnular: PropTypes.func.isRequired,
		setErrorMessage: PropTypes.func.isRequired,
		loading: PropTypes.bool,
	};

	state = {
		item: Object.assign({
			estado: 'CAR',
			anio: moment().format('YYYY'),
			cuota: moment().format('MM'),
			idComercio: this.props.comercioIdSelected,
			alicuota: 0,
			minimo: 0,
			fechaCalculoAnterior: null,
			codImpuesto: null,
			idGeneracion: null,
			nroDeclaracionRec: null,
			nroDeclaracionAnt: null,
			idComprobante: null,
			rectificacion: 'N',
			anticipo: 'N',
			importeAnterior: 0,
			importeFijo: 0,
			importe: 0,
			valor: 0,
		}, {
			...this.props.item,
			fecha: this.props.item && this.props.item.fecha ? moment(new Date(this.props.item.fecha), 'DD/MM/YYYY') : moment(new Date(), 'DD/MM/YYYY'),
			saldo: this.props.item && this.props.item.importe - this.props.item.importeAnterior,
			neto: this.props.item && this.props.item.importe - this.props.item.importeAnterior,
		}),
		fechaInicio: this.props.configuraciones.PERIODO_INICIO_NUEVA_DDJJ ? moment(new Date(`01/${this.props.configuraciones.PERIODO_INICIO_NUEVA_DDJJ.substring(0, 2)}/${this.props.configuraciones.PERIODO_INICIO_NUEVA_DDJJ.substring(3, 6)}`), 'DD/MM/YYYY') : moment(new Date(`01/12/2099`), 'DD/MM/YYYY'),
		fechaVto: this.props.item && this.props.item.nroDeclaracion ? moment(new Date(`01/${this.props.item.cuota}/${this.props.item.anio}`), 'DD/MM/YYYY') : moment(new Date(`01/${moment().format('MM')}/${moment().format('YYYY')}`), 'DD/MM/YYYY'),
	};

	componentDidMount() {
		const {DDJJComerciosRI: {declaraPorActividad}} = this.props;
		const {item} = this.state;
		const {nroDeclaracion, idComercio, idActividad} = item;
		if (idComercio && !idActividad && declaraPorActividad)
			Promise.resolve(this.props.actions.getActividadPorComercio(item))
				.then((idActividad) => {
					const {item} = this.state;
					item.idActividad = idActividad;
					this.setState({item})
				});
		if (nroDeclaracion) {
			Promise.all([
				this.props.actions.getFechaCalculoAnteriorAlicuotaMinimo(item),
				this.props.actions.getDeclaracionesAnterioresObj(item),
				this.props.actions.getCodImpuestoFechaCalculoAnteriorAlicuotaMinimo(item),
			])
				.then(([response, declaracionesAnterioresObj, codImpuestoFechaCalculoAnteriorAlicuotaMinimo]) => {
					const {item} = this.state;
					this.setState({
						item: {
							...item,
							...response,
							...declaracionesAnterioresObj,
							...codImpuestoFechaCalculoAnteriorAlicuotaMinimo,
						}
					});
				});
		}
	}

	handleOnChangeValue(key) {
		return (e) => {
			const {item} = this.state;
			item[key] = e.target.value;
			return Promise.all([
				key === 'idComercio' ? this.props.actions.getActividadPorComercio(item) : null,
				key === 'idActividad' ? this.props.actions.getFechaCalculoAnteriorAlicuotaMinimo(item) : {},
				key === 'idComercio' || key === 'idActividad' || key === 'tipoDeclaracion' ? this.props.actions.getDeclaracionesAnterioresObj(item) : {},
				key === 'idComercio' || key === 'tipoDeclaracion' ? this.props.actions.getCodImpuestoFechaCalculoAnteriorAlicuotaMinimo(item) : null,
			])
				.then(([idActividad, response, declaracionesAnterioresObj, codImpuestoFechaCalculoAnteriorAlicuotaMinimo]) => {
					if (idActividad) item.idActividad = idActividad;
					this.setState({
						item: {
							...item,
							...response,
							...declaracionesAnterioresObj,
							...codImpuestoFechaCalculoAnteriorAlicuotaMinimo,
						}
					});
				})
				.then(() => Promise.all([
					this.actualizarImportes()
				]));
		}
	}

	handleOnBlurAnio() {
		const {item} = this.state;
		return Promise.all([
			this.props.actions.getFechaCalculoAnteriorAlicuotaMinimo(item),
			this.getFechaVto(item),
			this.props.actions.getDeclaracionesAnterioresObj(item),
		])
			.then(([response, fechaVto, declaracionesAnterioresObj]) => {
				const item = this.state.item;
				this.setState({
					item: {
						...item,
						...response,
						...declaracionesAnterioresObj,
					},
					fechaVto
				});
			})
			.then(() => Promise.all([
					this.actualizarImportes()
				]));
	}

	handleOnBlurCuota() {
		const {item} = this.state;
		return Promise.all([
			this.props.actions.getFechaCalculoAnteriorAlicuotaMinimo(item),
			this.getFechaVto(item),
			this.props.actions.getDeclaracionesAnterioresObj(item),
		])
			.then(([response, fechaVto, declaracionesAnterioresObj]) => {
				const item = this.state.item;
				this.setState({
					item: {
						...item,
						...response,
						...declaracionesAnterioresObj,
					},
					fechaVto
				});
			})
			.then(() => Promise.all([
					this.actualizarImportes()
				]));
	}

	handleOnBlurValor() {
		this.actualizarImportes();
	}

	actualizarImportes() {
		const {item, fechaInicio} = this.state;
		const {valor, fechaCalculoAnterior: fechaCalculo} = item;
		if (!fechaCalculo || fechaInicio > fechaCalculo)
			return this.setState({
				item: {
					...item,
					alicuota: "0",
					minimo: "0",
					importeFijo: "0",
					importe: valor,
					saldo: "0",
					neto: "0",
				}
			});
		return Promise.all([
			this.props.actions.getAlicuota(item),
			this.props.actions.getDDJJImporteFijo(item),
			this.props.actions.getMinimo(item),
			this.props.actions.getDDJJActualImporte(item),
		])
			.then(([alicuota, importeFijo, minimo, importe]) => {
				const {item} = this.state;
				item.saldo = importe - item.importeAnterior;
				item.neto = item.saldo;
				return this.setState({
					item: {
						...item,
						alicuota,
						importeFijo,
						minimo,
						importe,
					}
				});
			});
	}

	handleOnBlurAlicuotaMinimo() {
		const {item, fechaInicio} = this.state;
		const {valor, fechaCalculoAnterior: fechaCalculo} = item;
		if (!fechaCalculo || fechaInicio > fechaCalculo)
			return this.setState({
				item: {
					...item,
					importe: valor,
					saldo: "0",
					neto: "0",
				}
			});
		return Promise.all([
			this.props.actions.getDDJJActualImporte(item),
		])
			.then(([importe]) => {
				const {item} = this.state;
				item.saldo = importe - item.importeAnterior;
				item.neto = item.saldo;
				return this.setState({
					item: {
						...item,
						importe,
					}
				});
			});
	}

	bindValue = key => {
		return {
			onChange: this.handleOnChangeValue.bind(this)(key),
			value: this.state.item[key] || ''
		};
	};

	bindNumberValue = key => {
		return {
			onChange: this.handleOnChangeValue.bind(this)(key),
			value: this.state.item[key] === undefined ? 0 : Number(this.state.item[key] || '')
		};
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

	handleOnSubmit = (event) => {
		event.stopPropagation();
		event.preventDefault();
		const {item} = this.state;
		const {idComercio, idActividad: codActividad, tipoDeclaracion, anio, cuota} = item;
		return Promise.all([
			this.props.actions.getDDJJCarga({idComercio, codActividad, tipoDeclaracion, anio, cuota}),
			this.props.actions.getDDJJPendientePago({idComercio, codActividad, tipoDeclaracion, anio, cuota}),
		])
			.then(responses => {
				const tieneDDJJCarga = responses[0] && responses[0][0] && responses[0][0].value ? responses[0][0].value === 'S' : false;
				const tieneDDJJPendientePago = responses[1] && responses[1][0] && responses[1][0].value ? responses[1][0].value === 'S' : false;
				if (tieneDDJJCarga) return this.props.setErrorMessage('Ya hay una Declaracion Jurada en "carga" para igual periodo');
				if (tieneDDJJPendientePago) return this.props.setErrorMessage('Ya hay una Declaracion Jurada para ese mes pendiente pago');
				return this.props.handleOnSubmit(item)
					.then(nroDeclaracion => {
						if (nroDeclaracion) this.setState({item: {...item, nroDeclaracion, estado: 'CON'}});
					});
			});
	};

	handleOnClickConfirmar = (event) => {
		event.stopPropagation();
		event.preventDefault();
		this.setState({openConfirmModal: true, confirmEvent: 'confirmar'});
	};

	handleOnConfirmar = () => {
		const {item} = this.state;
		return this.props.handleOnConfirmar(item)
			.then(() => {
				const {item} = this.state;
				this.handleCloseConfirmModal();
				return this.setState({
					item: {
						...item,
						estado: 'CON',
					}
				})
			});
	};

	handleOnClickAnular = (event) => {
		event.stopPropagation();
		event.preventDefault();
		this.setState({openConfirmModal: true, confirmEvent: 'anular'});
	};

	handleOnAnular = () => {
		const {item} = this.state;
		return this.props.handleOnAnular(item)
			.then(() => {
				const {item} = this.state;
				this.handleCloseConfirmModal();
				return this.setState({
					item: {
						...item,
						estado: 'ANU',
					}
				})
			});
	};

	handleCloseConfirmModal() {
		this.setState({openConfirmModal: false, confirmEvent: null})
	}

	handleOnConfirm() {
		const {confirmEvent} = this.state;
		if (confirmEvent === 'confirmar') return this.handleOnConfirmar();
		if (confirmEvent === 'anular') return this.handleOnAnular();
	}

	getConfirmTitle() {
		const {confirmEvent} = this.state;
		if (confirmEvent === 'confirmar') return `¿Está seguro que desea Confirmar la DDJJ?`;
		if (confirmEvent === 'anular') return `¿Está seguro que desea Anular la DDJJ?`;
		return ``;
	}

	esAlta() {
		const {item: {nroDeclaracion}} = this.state;
		return !nroDeclaracion;
	}

	getFechaVto(item) {
		const {cuota, anio} = item;
		if (cuota && anio)
			return moment(new Date(`01/${cuota}/${anio}`), 'DD/MM/YYYY');
		return null;
	}

	showBotonPrincipal() {
		const {item: {estado}} = this.state;
		return estado === 'CAR';
		;
	}

	showBotonEliminar() {
		const {fechaInicio, fechaVto} = this.state;
		return fechaVto < fechaInicio;
	}

	showBotonImprimir() {
		const {item: {estado}} = this.state;
		return estado !== 'CAR';
	}

	showBotonConfirmar() {
		const {fechaInicio, fechaVto, item: {estado}} = this.state;
		return fechaVto >= fechaInicio && estado === 'CAR';
	}

	showBotonAnular() {
		const {fechaInicio, fechaVto, item: {estado}} = this.state;
		return fechaVto >= fechaInicio && estado === 'CON';
	}

	desahabilitarFecha() {
		return true;
	}

	desahabilitarTipoDeclaracion() {
		const {item: {estado}} = this.state;
		return estado !== 'CAR' || !this.esAlta();
	}

	desahabilitarAnio() {
		const {item: {estado}} = this.state;
		return estado !== 'CAR' || !this.esAlta();
	}

	desahabilitarCuota() {
		const {item: {estado}} = this.state;
		return estado !== 'CAR' || !this.esAlta();
	}

	desahabilitarIdActividad() {
		const {DDJJComerciosRI: {declaraPorActividad}} = this.props;
		const {item: {estado}} = this.state;
		return !declaraPorActividad || estado !== 'CAR';
	}

	desahabilitarAlicuota() {
		const {DDJJComerciosRI: {tiposDeclaraciones}} = this.props;
		const {item: {estado, tipoDeclaracion: id}} = this.state;
		const tipoDeclaracion = getTipoDeclaracion(tiposDeclaraciones, id);
		return estado !== 'CAR' || !tipoDeclaracion || tipoDeclaracion.habCambiarAlicuota === 'N';
	}

	desahabilitarMinimo() {
		const {DDJJComerciosRI: {tiposDeclaraciones}} = this.props;
		const {item: {estado, tipoDeclaracion: id}} = this.state;
		const tipoDeclaracion = getTipoDeclaracion(tiposDeclaraciones, id);
		return estado !== 'CAR' || !tipoDeclaracion || tipoDeclaracion.habCambiarMinimo === 'N';
	}

	desahabilitarValor() {
		const {item: {estado}} = this.state;
		return estado !== 'CAR' || !this.esAlta();
	}

	render() {
		const {classes, cuentasComerciosRI: {data: dataCuentasComerciosRI}, DDJJComerciosRI: {actividades, declaraPorActividad, tiposDeclaraciones, loadingDDJJComerciosRI}} = this.props;
		const {item, openConfirmModal} = this.state;
		const {nroDeclaracion, rectificacion, anticipo, estado} = item;
		const loading = loadingDDJJComerciosRI;
		const title = nroDeclaracion ? `DDJJ` : `Nueva DDJJ`;
		const buttonLabel = nroDeclaracion ? 'Guardar' : 'Crear';
		return (
			<Dialog
				open={this.props.open}
				maxWidth={false}
				fullWidth={true}
			>
				<BlockComponent blocking={loading}>
					<DialogContent
						id="classic-modal-slide-description"
						className={classes.modalBody}>
						{openConfirmModal &&
						<ConfirmItemComponent
							classes={classes}
							open={openConfirmModal}
							item={item}
							handleClose={this.handleCloseConfirmModal.bind(this)}
							handleOnConfirm={this.handleOnConfirm.bind(this)}
							title={this.getConfirmTitle.bind(this)()}
							loading={loading}
						/>}
						<Card>
							<CardHeader color="info" icon>
								<CardIcon color="primary">
									<InsertDriveFileIcon/>
								</CardIcon>
								<h4 className={classes.cardIconTitle}>{title}</h4>
							</CardHeader>
							<CardBody>
								<form autoComplete="off" onSubmit={this.handleOnSubmit}>
									<Card className={classes.fieldsContainer}>
										<CardBody>
											<GridContainer>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Nro Declaración"
														id="nroDeclaracion"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: false,
															...this.bindValue('nroDeclaracion'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<div>
														<InputLabel className={classes.label}>Fecha</InputLabel>
														<br/>
														<FormControl className={classes.selectFormControl}>
															<Datetime
																timeFormat={false}
																dateFormat={"DD/MM/YYYY"}
																inputProps={{
																	required: true,
																	disabled: this.desahabilitarFecha()
																}}
																locale="es-ES"
																{...this.bindDateValue('fecha')}
															/>
														</FormControl>
													</div>
												</GridItem>
											</GridContainer>
											<FormControl required className={classes.selectFormControl}>
												<InputLabel htmlFor="idComercio">Comercio</InputLabel>
												<Select
													{...this.bindValue('idComercio')}
													name="idComercio"
													inputProps={{
														id: 'idComercio',
														style: {maxWidth: "100%"},
														disabled: true,
													}}
													className={classes.selectEmpty}
													MenuProps={{
														className: classes.selectMenu,
													}}
													native
													required
												>
													<option value="" disabled></option>
													{dataCuentasComerciosRI.map(({idComercio, descripcion}, key) => {
														return (<option key={key} value={idComercio}>{descripcion}</option>);
													})}
												</Select>
											</FormControl>
											<FormControl required={declaraPorActividad}
														 className={classes.selectFormControl}>
												<InputLabel htmlFor="idActividad">Actividad</InputLabel>
												<Select
													{...this.bindValue('idActividad')}
													name="idActividad"
													inputProps={{
														id: 'idActividad',
														style: {maxWidth: "100%"},
														disabled: this.desahabilitarIdActividad(),
													}}
													className={classes.selectEmpty}
													MenuProps={{
														className: classes.selectMenu,
													}}
													native
													required={declaraPorActividad}
												>
													<option value="" disabled></option>
													{actividades.map(({cod_actividad, descripcion}, key) => {
														return (<option key={key}
																		value={cod_actividad}>{descripcion}</option>);
													})}
												</Select>
											</FormControl>
										</CardBody>
									</Card>
									<Card className={classes.fieldsContainer}>
										<CardBody>
											<FormControl required className={classes.selectFormControl}>
												<InputLabel htmlFor="tipoDeclaracion">Tipo Declaración</InputLabel>
												<Select
													{...this.bindValue('tipoDeclaracion')}
													name="tipoDeclaracion"
													inputProps={{
														id: 'tipoDeclaracion',
														style: {maxWidth: "100%"},
														disabled: this.desahabilitarTipoDeclaracion(),
													}}
													className={classes.selectEmpty}
													MenuProps={{
														className: classes.selectMenu,
													}}
													native
													required
												>
													<option value="" disabled></option>
													{tiposDeclaraciones.map(({tipoDeclaracion, descripcion}, key) => {
														return (<option key={key}
																		value={tipoDeclaracion}>{descripcion}</option>);
													})}
												</Select>
											</FormControl>
											<CustomInput
												labelText="Año"
												id="anio"
												formControlProps={{
													fullWidth: false
												}}
												inputProps={{
													required: true,
													...this.bindValue('anio'),
													type: "number",
													disabled: this.desahabilitarAnio(),
													onBlur: this.handleOnBlurAnio.bind(this)
												}}
												inputHtmlProps={{
													min: Number(moment().format('YYYY')) - 10,
													max: Number(moment().format('YYYY')),
												}}
											/>
											<CustomInput
												labelText="Cuota"
												id="cuota"
												formControlProps={{
													fullWidth: false
												}}
												inputProps={{
													required: true,
													...this.bindValue('cuota'),
													type: "number",
													disabled: this.desahabilitarCuota(),
													onBlur: this.handleOnBlurCuota.bind(this)
												}}
												inputHtmlProps={{
													min: 1,
													max: 12,
												}}
											/>
											<GridContainer>
												<GridItem xs={12} sm={3}>
													<div style={{display: 'flex', paddingTop: "20px"}}>
														<Checkbox
															className={classes.positionAbsolute}
															tabIndex={-1}
															checked={rectificacion === 'S'}
															checkedIcon={<CheckIcon className={classes.checkedIcon}/>}
															icon={<CheckIcon className={classes.uncheckedIcon}/>}
															classes={{
																checked: classes.checked
															}}
															disabled
														/>
														<div style={{marginTop: "14px"}}>
															Rectificación
														</div>
													</div>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="DDJJ Retifica"
														id="nroDeclaracionRec"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: false,
															...this.bindValue('nroDeclaracionRec'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<div style={{display: 'flex', paddingTop: "20px"}}>
														<Checkbox
															className={classes.positionAbsolute}
															tabIndex={-1}
															checked={anticipo === 'S'}
															checkedIcon={<CheckIcon className={classes.checkedIcon}/>}
															icon={<CheckIcon className={classes.uncheckedIcon}/>}
															classes={{
																checked: classes.checked
															}}
															disabled
														/>
														<div style={{marginTop: "14px"}}>
															Anticipo
														</div>
													</div>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="DDJJ Anticipo"
														id="nroDeclaracionAnt"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: false,
															...this.bindValue('nroDeclaracionAnt'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
											</GridContainer>
											<CustomInput
												labelText="Importe Anterior"
												id="importeAnterior"
												formControlProps={{
													fullWidth: false
												}}
												inputProps={{
													required: false,
													...this.bindNumberValue('importeAnterior'),
													type: "number",
													disabled: true
												}}
											/>
										</CardBody>
									</Card>
									<Card className={classes.fieldsContainer}>
										<CardBody>
											<GridContainer>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Valor"
														id="valor"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: true,
															...this.bindNumberValue('valor'),
															type: "number",
															disabled: this.desahabilitarValor(),
															onBlur: this.handleOnBlurValor.bind(this),
														}}
													/>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Importe Fijo"
														id="importeFijo"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: true,
															...this.bindNumberValue('importeFijo'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Minimo"
														id="minimo"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: true,
															...this.bindNumberValue('minimo'),
															type: "number",
															disabled: this.desahabilitarMinimo(),
															onBlur: this.handleOnBlurAlicuotaMinimo.bind(this),
														}}
													/>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Alicuota"
														id="alicuota"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: true,
															...this.bindNumberValue('alicuota'),
															type: "number",
															disabled: this.desahabilitarAlicuota(),
															onBlur: this.handleOnBlurAlicuotaMinimo.bind(this),
														}}
													/>
												</GridItem>
											</GridContainer>
											<GridContainer>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Importe"
														id="importe"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: true,
															...this.bindNumberValue('importe'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Retenciones"
														id="retenciones"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: true,
															...this.bindNumberValue('retenciones'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Saldo"
														id="saldo"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: true,
															...this.bindNumberValue('saldo'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
											</GridContainer>
											<GridContainer>
												<GridItem xs={12} sm={3}>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Saldo A Favor"
														id="saldoAfavor"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: true,
															...this.bindNumberValue('saldoAfavor'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="Neto"
														id="neto"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: true,
															...this.bindNumberValue('neto'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
											</GridContainer>
										</CardBody>
									</Card>
									<Card className={classes.fieldsContainer}>
										<CardBody>
											<GridContainer>
												<GridItem xs={12} sm={3}>
													<div style={{
														display: 'flex',
														paddingTop: "20px"
													}}>Estado: {estado}</div>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="ID Comprobante"
														id="idComprobante"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: false,
															...this.bindValue('idComprobante'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
												<GridItem xs={12} sm={3}>
													<CustomInput
														labelText="ID Generación"
														id="idGeneracion"
														formControlProps={{
															fullWidth: false
														}}
														inputProps={{
															required: false,
															...this.bindValue('idGeneracion'),
															type: "number",
															disabled: true
														}}
													/>
												</GridItem>
											</GridContainer>
										</CardBody>
									</Card>
									<GridContainer justify="flex-end">
										<GridItem xs={12} sm={12} md={9}>
											<Button onClick={this.props.handleCloseModal}>
												Cancel
											</Button>
											{!nroDeclaracion && this.showBotonPrincipal() &&
											<Button color="primary" type="submit">{buttonLabel}</Button>}
											{nroDeclaracion && this.showBotonConfirmar() && <Button color="primary"
																									onClick={this.handleOnClickConfirmar.bind(this)}>Confirmar</Button>}
											{false && nroDeclaracion && this.showBotonImprimir() &&
											<Button color="primary" onClick={this.props.handleCloseModal}>
												Imprimir
											</Button>}
											{nroDeclaracion && this.showBotonAnular() &&
											<Button color="danger" onClick={this.handleOnClickAnular.bind(this)}>
												Anular
											</Button>}
											{false && nroDeclaracion && this.showBotonEliminar() &&
											<Button color="danger" onClick={this.props.handleCloseModal}>
												Eliminar
											</Button>}
										</GridItem>
									</GridContainer>
								</form>
							</CardBody>
						</Card>
					</DialogContent>
				</BlockComponent>
			</Dialog>
		);
	}
}
