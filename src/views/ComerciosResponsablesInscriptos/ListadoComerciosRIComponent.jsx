import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import ReactTable from "react-table";
import {remove} from "lodash";

import ConfirmItemComponent from "../../components/ConfirmItem/ConfirmItemComponent";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import BlockComponent from "../../components/Loading/BlockComponent";
import Button from "../../components/CustomButtons/Button";
import Tooltip from "@material-ui/core/Tooltip";
import extendedFormsStyle from "../../assets/jss/views/extendedFormsStyle.jsx";

// @material-ui/icons
import SearchIcon from "@material-ui/icons/Search";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Cancel from "@material-ui/icons/Cancel";


import pagesStyle from "../../assets/jss/layouts/pagesStyle";
import extendedTablesStyle from "../../assets/jss/views/extendedTablesStyle";
import {
	tooltip
} from "../../assets/jss/autogestion";
import DDJJRIComponent from "./DDJJRIComponent";
import RemoveItemComponent from '../../components/RemoveItem/RemoveItemComponent';
import MessageComponent from '../../components/Message/MessageComponent';
import {downloadFile} from "../../core/downloadService";

import {
	crearDDJJ,
	confirmarDDJJ,
	anularDDJJ
} from "../../core/DDJJComerciosRI/DDJJComerciosRI-actions";
import {getFacturaPDF} from "../../core/deudas/deudas-actions";
import {getTipoDeclaracion} from "../../core/DDJJComerciosRI/tipoDeclaracion";

const styles = (theme) => ({
	...pagesStyle(theme),
	...extendedFormsStyle,
	...tooltip,
	extendedTablesStyle,
});

@connect(
	state => ({
		DDJJComerciosRI: state.DDJJComerciosRI,
	}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
			crearDDJJ,
			confirmarDDJJ,
			anularDDJJ,
			getFacturaPDF,
		}, dispatch)
	})
)
@withStyles(styles)
export default class ListadoComerciosRIComponent extends React.Component {
	static propTypes = {
		classes: PropTypes.any,
		style: PropTypes.any,
		DDJJComerciosRI: PropTypes.any,
		comercioIdSelected: PropTypes.string,
		data: PropTypes.array.isRequired,
	};

	state = {
		itemSelected: null,
		openModal: false,
		openRemoveModal: false,
	};

	constructor(props) {
		super(props);
		this.setErrorMessage = this.setErrorMessage.bind(this);
	}

	componentDidMount() {
		return Promise.all([
		])
	}

	getItemsInfo = (items) => {
		const {DDJJComerciosRI: {tiposDeclaraciones}} = this.props;
		const {classes} = this.props;
		return items.map(item => {
			return ({
				...item,
				tipoDeclaracionDescripcion: (getTipoDeclaracion(tiposDeclaraciones, item.tipoDeclaracion)||{}).descripcion,
				actions: (
					<div className="actions-right">
						{ item.estado !== 'ANU' && item.estado === 'CON' ?
							(<Button
								justIcon
								round
								simple
								onClick={() => {
									this.setState({itemSelected: item, openRemoveModal: true});
								}}
								color="warning"
								className="remove"
								disabled={(item.estado !== 'CON' ? true : false)}
							>
								<Tooltip
									id="tooltip-remove"
									title="Anular"
									placement="top"
									classes={{tooltip: classes.tooltip}}
								>
									<Cancel/>
								</Tooltip>
							</Button>)
							: ''
						}
						<Button
							justIcon
							round
							simple
							onClick={() => this.onDownloadClick(item.idFactura)}
							className="download"
							color="primary"
							disabled={(item.estado !== 'CON' ? true : false)}
						>
							<Tooltip
								id="tooltip-download"
								title="Descargar Factura"
								placement="top"
								classes={{tooltip: classes.tooltip}}
							>
									<CloudDownloadIcon/>
							</Tooltip>
						</Button>{" "}

						{/*item.estado !== 'ANU' && <Button
							justIcon
							round
							simple
							onClick={() => {
								this.setState({itemSelected: item, openRemoveModal: true});
							}}
							color="danger"
							className="remove"
						>
							<Tooltip
								id="tooltip-remove"
								title="Anular"
								placement="top"
								classes={{tooltip: classes.tooltip}}
							>
								<Cancel/>
							</Tooltip>
						</Button>*/}
					</div>
				)
			});
		});
	};

	getColumns = () => {
		const columns = [
			{
				Header: "Número",
				accessor: "nroDeclaracion",
				style: { textAlign: "center"},
				sortMethod: (a, b) => {
					return Number(a) > Number(b) ? 1 : -1;
				}
			},
			{
				Header: "Año",
				accessor: "anio",
				style: { textAlign: "center"},
				sortMethod: (a, b) => {
					return Number(a) > Number(b) ? 1 : -1;
				}
			},
			{
				Header: "Per.",
				accessor: "cuota",
				style: { textAlign: "center"},
				sortMethod: (a, b) => {
					return Number(a) > Number(b) ? 1 : -1;
				}
			},
			// {
			// 	Header: "Act.",
			// 	accessor: "act",
			// 	style: { textAlign: "center"}
			// },
			{
				Header: "Tipo",
				accessor: "tipoDeclaracionDescripcion",
				style: { textAlign: "center"}
			},
			{
				Header: "Rec.",
				accessor: "rectificacion",
				style: { textAlign: "center"}
			},
			{
				Header: "Valor",
				accessor: 'valor',
				style: { textAlign: "end"},
				sortMethod: (a, b) => {
					return Number(a) > Number(b) ? 1 : -1;
				},
				Cell: row => (
					<span>
						$ {Number(row.value).toLocaleString('es-ES')}
				  	</span>
				),
			},
			{
				Header: "Importe",
				accessor: 'importe',
				style: { textAlign: "end"},
				sortMethod: (a, b) => {
					return Number(a) > Number(b) ? 1 : -1;
				},
				Cell: row => (
					<span>
						$ {Number(row.value).toLocaleString('es-ES')}
				  	</span>
				),
			},
			{
				Header: "Saldo",
				accessor: 'saldo',
				style: { textAlign: "end"},
				sortMethod: (a, b) => {
					return Number(a) > Number(b) ? 1 : -1;
				},
				Cell: row => (
					<span>
						$ {Number(row.value || 0).toLocaleString('es-ES')}
				  	</span>
				),
			},
			{
				Header: "Estado",
				accessor: "estado",
				style: { textAlign: "center"}
			},
		];
		columns.push({
			Header: "Acciones",
			accessor: "actions",
			sortable: false,
			filterable: false
		});

		return columns;
	};

	onDownloadClick(idFactura) {
		const params = {
			idFactura
		};
		return Promise.resolve(this.props.actions.getFacturaPDF(params))
		.then((data) =>{
			downloadFile(data, "factura_"+idFactura+".pdf")
			}).catch(error => {
				console.log(error);
			});
	}

	handleAddClick = () => {
		/*
		{comercioIdSelected && <Button color="primary" onClick={this.handleAddClick}>Nueva DDJJ</Button>}
		*/
		this.setState({openModal: true, itemSelected: null });
	};

	_closeModals = () => {
		this.setState({openModal: false, openRemoveModal: false, itemSelected: null});
	};

	handleCloseModal = () => {
		this.setState({openModal: false, itemSelected: null});
	};

	handleCloseRemoveModal = () => {
		this.setState({openRemoveModal: false, itemSelected: null});
	};

	_handleAdd = (data) => {
		delete data.fecha;
		delete data.fechaCalculoAnterior;
		delete data.idActividad;
		return this.props.actions.crearDDJJ(data)
	};

	_handleUpdate = (id, data) => {
		return Promise.resolve({});
	};

	handleOnSubmit = (item) => {
		const { nroDeclaracion, ...data } = item;
		const promise = nroDeclaracion ? this._handleUpdate(nroDeclaracion, data) : this._handleAdd(data);
		const successMessage = nroDeclaracion ? `DDJJ Actualizada Exitosamente.` : `DDJJ Creada Exitosamente.`;
		const errorMessage = nroDeclaracion ? `Error Actualizando DDJJ.` : `Error Creando DDJJ.`;
		return Promise.resolve(promise)
			.then(({nroDeclaracion}) => {
				this.setMessage({ messageColor: 'success', message: successMessage });
				return nroDeclaracion;
			})
			.catch((error) => {
				console.log('ERROR: ', error);
				this.setMessage({ messageColor: 'danger', message: error.error || errorMessage });
			});
	};

	handleOnConfirmar = (item) => {
		return this.props.actions.confirmarDDJJ(item)
			.then(() =>{
				this.setMessage({ messageColor: 'success', message: 'DDJJ confirmada exitosamente.' });
			})
			.catch((error) => {
				console.log('ERROR: ', error);
				this.setMessage({ messageColor: 'danger', message: 'Error al confirmar DDJJ' });
			});
	};

	handleOnAnular = (item) => {

		return this.props.actions.anularDDJJ(item)
			.then(() =>{
				this.setMessage({ messageColor: 'success', message: 'DDJJ anulada exitosamente.' });
			})
			.catch((error) => {
				console.log('ERROR: ', error);
				this.setMessage({ messageColor: 'danger', message: 'Error al anular DDJJ' });
			});
	};

	handleOnRemove = (item) => {
		this.setState({openRemoveModal:false});
		this.handleOnAnular(item);
	};

	setErrorMessage(message) {
		this.setMessage({messageColor: 'danger', message});
	}

	setMessage = ({message, messageColor}) => {
		this.setState({message, messageColor});
		setTimeout(this.resetMessage, 1000);
	};

	resetMessage = () => {
		this.setState({message: null, messageColor: null});
	};

	render() {
		const {classes, data, comercioIdSelected} = this.props;
		const {itemSelected, openModal, openRemoveModal, messageColor, message} = this.state;
		const loading = false;
		return (
			<BlockComponent blocking={loading}>
				{comercioIdSelected && <Button color="primary" onClick={this.props.handleOnClickNuevaDDJJ}>Nueva DDJJ</Button>}
				
				{openRemoveModal &&
				<RemoveItemComponent
					classes={classes}
					open={openRemoveModal}
					item={itemSelected}
					handleClose={this.handleCloseRemoveModal}
					handleOnRemove={this.handleOnRemove}
					title={`¿Esta seguro que desea anular la DDJJ?`}
					loading={loading}
				/>}
				{openModal &&
				<DDJJRIComponent
					open={openModal}
					item={itemSelected}
					comercioIdSelected={comercioIdSelected}
					handleCloseModal={this.handleCloseModal}
					handleOnSubmit={this.handleOnSubmit}
					handleOnConfirmar={this.handleOnConfirmar}
					handleOnAnular={this.handleOnAnular}
					loading={loading}
					setErrorMessage={this.setErrorMessage}
				/>}
				<ReactTable
					data={this.getItemsInfo(data)}
					filterable
					columns={this.getColumns()}
					defaultPageSize={10}
					showPaginationTop={false}
					showPaginationBottom
					className="-striped -highlight"
					previousText="Anterior"
					nextText="Siguiente"
					loadingText="Cargando..."
					noDataText="No se encontraron datos"
					pageText="Página"
					ofText="de"
					rowsText="filas"
				/>
				<MessageComponent
					color={messageColor}
					message={message}
				/>
			{comercioIdSelected && <Button color="primary" onClick={this.props.handleOnClickNuevaDDJJ}>Nueva DDJJ</Button>}
			</BlockComponent>
		);
	}
}
