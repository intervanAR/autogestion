import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import ReactTable from "react-table";
import Moment from 'moment';
import {remove, sumBy, filter, includes, round} from "lodash";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import BlockComponent from "../../components/Loading/BlockComponent";
import Button from "../../components/CustomButtons/Button";
import Tooltip from "@material-ui/core/Tooltip";
import extendedFormsStyle from "../../assets/jss/views/extendedFormsStyle.jsx";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CheckIcon from "@material-ui/icons/Check";

import pagesStyle from "../../assets/jss/layouts/pagesStyle";
import extendedTablesStyle from "../../assets/jss/views/extendedTablesStyle";
import {
	tooltip
} from "../../assets/jss/autogestion";
import RefacturarComponent from "./RefacturarComponent"
import {downloadFile} from "../../core/downloadService";
import {getFacturaPDF, refacturar} from "../../core/deudas/deudas-actions";
import * as AuthService from "../../core/auth/auth-actions";
import { getScreenType } from '../../core/services/infoScreen.js';

const styles = (theme) => ({
	...pagesStyle(theme),
	...extendedFormsStyle,
	...tooltip,
	extendedTablesStyle,
	totalesContainer: {
		display:"flex",
		paddingTop: "20px"
	},
	total: {
		fontSize: "20px"
	},
	buttonContainer: {
		paddingLeft: "20px"
	},
});

@connect(
	state => ({
	}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
			refacturar,
			getFacturaPDF,
		}, dispatch)
	})
)
@withStyles(styles)
export default class ListadoEstadoDeudaComponent extends React.Component {
	static propTypes = {
		classes: PropTypes.any,
		style: PropTypes.any,
		data: PropTypes.array.isRequired,
		actions: PropTypes.any,
	};

	state = {
		openRefacturarModal: false,
		selectedList: [],
	};

	constructor(props) {
		super(props);
		this.openRefacturar = this.openRefacturar.bind(this);
		this.onCancelClick = this.onCancelClick.bind(this);
		this.onRefacturarClick = this.onRefacturarClick.bind(this);
		this.onDownloadClick = this.onDownloadClick.bind(this);
	}

	componentDidMount() {
		return Promise.all([
		])
	}

	allItemsSelected() {
		const { selectedList } = this.state;
		const {data} = this.props;
		return data.length == selectedList.length;
	}

	handleToggle(id) {
		console.log(id);
		const { selectedList } = this.state;
		const currentIndex = selectedList.indexOf(id);

		if (currentIndex === -1) {
			selectedList.push(id);
		} else {
			remove(selectedList, selected => selected.toString() === id.toString());
		}

		this.setState({
			selectedList
		});
	}

	handleToggleSelectAll() {
		const {data} = this.props;
		this.setState({
			selectedList: this.allItemsSelected() ? [] : data.map(i => i.id)
		});
	}

	getItemsInfo = (items) => {
		console.log(items);
		const {classes} = this.props;
		const { selectedList } = this.state;

		return items.map(item => {
			return ({
				...item,
				check: (
					<Checkbox
						className={classes.positionAbsolute}
						tabIndex={-1}
						checked={selectedList.indexOf(item.id) !== -1}
						onClick={() => this.handleToggle(item.id)}
						checkedIcon={<CheckIcon className={classes.checkedIcon} />}
						icon={<CheckIcon className={classes.uncheckedIcon} />}
						classes={{
							checked: classes.checked
						}}
					/>
				),
				actions: (
					// we've added some custom button actions
					<div className="actions-right">
						<Button
							justIcon
							round
							simple
							onClick={() => this.onDownloadClick(item.idFactura)}
							className="download"
							color="primary"
							disabled={(item.idFactura === null ? true : false)}
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
					</div>
				)
			});
		});
	};

	getColumns = () => {
		const {classes} = this.props;
		const columns = [
			{
				Header: () => {
					return (
						<Checkbox
							className={classes.positionAbsolute}
							tabIndex={-1}
							checked={this.allItemsSelected()}
							onClick={() => this.handleToggleSelectAll()}
							checkedIcon={<CheckIcon className={classes.checkedIcon} />}
							icon={<CheckIcon className={classes.uncheckedIcon} />}
							classes={{
								checked: classes.checked
							}}
						/>
					);
				},
				sortable: false,
				accessor: "check",
				width: 60,
				resizable: false
			},
			{
				show: getScreenType() === 'sm' ? false : true,
				Header: "Concepto",
				accessor: "dsImpuesto",
				minWidth: 250
			},
			{
				Header: "Período",
				accessor: "periodo",
				style: { textAlign: "center" },
				sortMethod: (a, b) => {
					const dateA = a.split('/');
					const dateB = b.split('/');
					return new Date(dateA[1], dateA[0] -1) > new Date(dateB[1], dateB[0] -1) ? 1 : -1;
				},
			},
			{
				show: getScreenType() === 'sm' ? false : true,
				Header: "F. Vto",
				accessor: "fechaVencimiento",
				style: { textAlign: "center"},
				sortMethod: (a, b) => {
					return Moment(a).local().format() > Moment(b).local().format() ? 1 : -1;
				},
				Cell: row => (
					<span>
						{row.value && Moment(row.value).local().format("DD/MM/YYYY")}
				  	</span>
				),
			},
			{
				show: getScreenType() === 'sm' ? false : true,
				Header: "Capital",
				accessor: "capital",
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
				show: getScreenType() === 'sm' ? false : true,
				Header: "Interes",
				accessor: "interes",
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
				show: getScreenType() === 'sm' ? false : true,
				Header: "Gastos",
				accessor: "gastos",
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
				Header: "Total",
				accessor: "total",
				style: { textAlign: "end"},
				sortMethod: (a, b) => {
					return Number(a) > Number(b) ? 1 : -1;
				},
				Cell: row => (
					<span>
						$ {Number(row.value).toLocaleString('es-ES')}
				  	</span>
				),
			}
		];
		columns.push({
			Header: "Acciones",
			accessor: "actions",
			sortable: false,
			filterable: false
		});

		return columns;
	};

	openRefacturar() {
		this.setState({openRefacturarModal: true})
	}

	onCancelClick() {
		this.setState({openRefacturarModal: false})
	}

	onRefacturarClick(selectedList, fechaVencimiento) {
		const params = {
			fechaVencimiento : fechaVencimiento,
			idComprobantes: '#'+selectedList.join('#')+'#'
		};
		return Promise.resolve(this.props.actions.refacturar(params))
			.then((data) => {
				downloadFile(data, "refacturarList.pdf")
			})
			.then(this.onCancelClick);
	}

	onDownloadClick(idFactura) {
		const params = {
			idFactura,
			isLoggedIn: AuthService.isLoggedIn()
		};
		return Promise.resolve(this.props.actions.getFacturaPDF(params))
		.then((data) =>{
			downloadFile(data, "factura_"+idFactura+".pdf")
		  }).catch(error => {
    		console.log(error);
		  });
	}

	getTotalDeuda() {
		const {data} = this.props;
		return round(sumBy(data, d => Number(d.total)), 2);
	}

	getTotalDeudaSeleccionada() {
		const {data} = this.props;
		const {selectedList} = this.state;
		return round(sumBy(filter(data, d => includes(selectedList, d.id)), d => Number(d.total)), 2);
	}

	render() {
		const {classes, data} = this.props;
		const {openRefacturarModal, selectedList} = this.state;
		const loading = false;
		return (
			<BlockComponent blocking={loading}>
				{openRefacturarModal && <RefacturarComponent
					open={openRefacturarModal}
					selectedList={selectedList}
					onCancelClick={this.onCancelClick}
					onRefacturarClick={this.onRefacturarClick}
					loading={loading}
				/>}
				<div className={classes.totalesContainer}>
					<div>
						<div><b>Total deuda: </b><span className={classes.total}>${this.getTotalDeuda()}</span></div><br />
						<div><b>Total a refacturar: </b><span className={classes.total}>${this.getTotalDeudaSeleccionada()}</span></div>
					</div>
					<div className={classes.buttonContainer}>
						{!!selectedList.length && <Button color="primary" onClick={this.openRefacturar}>Refacturar</Button>}
					</div>
				</div>
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
			</BlockComponent>
		);
	}
}
