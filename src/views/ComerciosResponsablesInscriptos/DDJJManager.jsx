import React, { Component } from 'react';
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from 'redux';
import DDJJStepperForm from './DDJJStepperForm';
import MessageComponent from '../../components/Message/MessageComponent';
import * as AuthService from "../../core/auth/auth-actions";
import {getFacturaPDF} from "../../core/deudas/deudas-actions";
import {downloadFile} from "../../core/downloadService";

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
	getTiposDeclaraciones,
	crearDDJJ,
} from "../../core/DDJJComerciosRI/DDJJComerciosRI-actions";
import {getTipoDeclaracion} from "../../core/DDJJComerciosRI/tipoDeclaracion";


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
			getTiposDeclaraciones,
			crearDDJJ,
			getFacturaPDF,
		}, dispatch)
	})
)

export default class DDJJManager extends Component {
  state = {
		message:null,
		messageColor:null,
		item: Object.assign({
			estado: 'CAR',
			anio: moment().format('YYYY'),
			cuota: moment().format('MM'),
			idComercio: this.props.comercioIdSelected,
			idActividad:null,
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

	componentWillMount (){
		const item = this.state.item;
		return Promise.all([
			item.idComercio ? this.props.actions.getActividadPorComercio(item) : null,
		]).then(([idActividad]) => {
			this.setState({
				item:{
					...item,
					idActividad:idActividad,
				},
			});
		});
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

	setErrorMessage(message) {
		this.setMessage({messageColor: 'danger', message});
	}

	setMessage = ({message, messageColor}) => {
		this.setState({message, messageColor});
		setTimeout(this.resetMessage, 6000);
	};

	resetMessage = () => {
		this.setState({message: null, messageColor: null});
	};

	bindValue = key => {
		return {
			onChange: this.handleOnChangeValue.bind(this)(key),
			value: this.state.item[key] || ''
		};
	};

	getItemValue = key => {
		return this.state.item[key] || ''
	}

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

	handleOnChangeValue(key) {
		return (e) => {
			const {item} = this.state;
			item[key] = e.target.value;
			this.setState({
				item: {
					...item,
				}
			});
		}
	}

	handleFin = () =>{
		this.props.handleCerrarStepper();
	}

	onChangeStep = (step, nextStep) => {
		const item = this.state.item;
		switch (step) {
			case 0:
				if (!item.idComercio || !item.tipoDeclaracion || !item.cuota || !item.anio){
					this.setErrorMessage('Debe completar todos los campos.');
					return false;
				}
				//Consulta de datos
				Promise.all([
					this.props.actions.getFechaCalculoAnteriorAlicuotaMinimo(item),
					this.props.actions.getDeclaracionesAnterioresObj(item),
					this.props.actions.getCodImpuestoFechaCalculoAnteriorAlicuotaMinimo(item),
				]).then(([response,declaracionesAnterioresObj, codImpuestoFechaCalculoAnteriorAlicuotaMinimo])=>{
					this.setState({
						item: {
							...item,
							...response,
							...declaracionesAnterioresObj,
							...codImpuestoFechaCalculoAnteriorAlicuotaMinimo,
						}
					});
					nextStep();
				}).catch((error)=>{
					this.setErrorMessage(error);
					return false;
				});
				break;

			case 1:
				if (!item.valor){
					this.setErrorMessage('Debe ingresar un valor');
					return false;
				}
				Promise.all([
					//this.props.actions.getAlicuota(item),
					this.props.actions.getDDJJImporteFijo(item),
					//this.props.actions.getMinimo(item),
					this.props.actions.getDDJJActualImporte(item),
				]).then(([importeFijo, importe]) => {
					//console.log("alicuota: ",alicuota);
					//console.log("minimo: ",minimo);
					item.saldo = importe - item.importeAnterior;
					item.neto = item.saldo;
					this.setState({
						item: {
							...item,
							importeFijo,
							importe,
						}
					});
					nextStep();
				}).catch(error => {
					this.setErrorMessage(error);
					return false;
				});
				break;

			case 2:
				//Crear y Confirmar
				const {idComercio, idActividad: codActividad, tipoDeclaracion, anio, cuota} = item;
				return Promise.all([
					this.props.actions.getDDJJCarga({idComercio, codActividad, tipoDeclaracion, anio, cuota}),
					this.props.actions.getDDJJPendientePago({idComercio, codActividad, tipoDeclaracion, anio, cuota}),
				])
					.then(responses => {
						const tieneDDJJCarga = responses[0] && responses[0][0] && responses[0][0].value ? responses[0][0].value === 'S' : false;
						const tieneDDJJPendientePago = responses[1] && responses[1][0] && responses[1][0].value ? responses[1][0].value === 'S' : false;

						if (tieneDDJJCarga){
							this.props.setErrorMessage('Ya hay una Declaracion Jurada en "carga" para igual periodo');
							return false;
						}

						if (tieneDDJJPendientePago){
							this.props.setErrorMessage('Ya hay una Declaracion Jurada para ese mes pendiente pago');
							return false;
						}

						const { nroDeclaracion, ...data } = item;
						const promise = nroDeclaracion ? this._handleUpdate(nroDeclaracion, data) : this._handleAdd(data);
						const successMessage = nroDeclaracion ? `DDJJ Actualizada Exitosamente.` : `DDJJ Creada Exitosamente.`;
						const errorMessage = nroDeclaracion ? `Error Actualizando DDJJ.` : `Error Creando DDJJ.`;
						return Promise.resolve(promise)
							.then(({nroDeclaracion,idFactura}) => {
								this.setMessage({ messageColor: 'success', message: successMessage });
								item.nroDeclaracion = nroDeclaracion;
								item.idFactura = idFactura;
								this.setState({...item});
								nextStep();
								return nroDeclaracion;
							})
							.catch((error) => {
								this.setMessage({ messageColor: 'danger', message: error.error || errorMessage });
								return false;
							});
					});
				break;
			default:
				return false;
		}
	}

	_handleAdd = (data) => {
		delete data.fecha;
		delete data.fechaCalculoAnterior;
		delete data.idActividad;
		return this.props.actions.crearDDJJ(data)
	};

	_handleUpdate = (id, data) => {
		return Promise.resolve({});
	};

	handleDescargar = () => {
		const item = this.state;
		const params = {
			idFactura: item.idFactura,
			isLoggedIn: AuthService.isLoggedIn()
		};
		console.log(params);
		return Promise.resolve(this.props.actions.getFacturaPDF(params))
		.then((data) =>{
			downloadFile(data, "factura_"+item.idFactura+".pdf")
		  }).catch(error => {
    		console.log(error);
		  });
	}

  render(){
		const {classes, headerProps, DDJJComerciosRI: {data: dataDDJJComerciosRI,tiposDeclaraciones, loadingDDJJComerciosRI}, cuentasComerciosRI: {comercioIdSelected}} = this.props;

		const message = this.state.message;
		const messageColor = this.state.messageColor;

    return(
      <div>
        <DDJJStepperForm
					tiposDeclaraciones = {tiposDeclaraciones}
					bindValue = {this.bindValue}
					bindDateValue = {this.bindDateValue}
					bindNumberValue = {this.bindNumberValue}
					getItemValue = {this.getItemValue}
					onChangeStep = {this.onChangeStep}
					handleDescargar = {this.handleDescargar}
					handleFin = {this.handleFin}
				/>
				<MessageComponent
					color={messageColor}
					message={message}
				/>
      </div>
    )
  }
}
