import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "../../components/Header/Header.jsx";
import BlockComponent from "../../components/Loading/BlockComponent";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader";
import extendedFormsStyle from "../../assets/jss/views/extendedFormsStyle.jsx";
import pagesStyle from "../../assets/jss/layouts/pagesStyle";
import {
	tooltip
} from "../../assets/jss/autogestion";
import {getDDJJComerciosRI, getActividadesComercio, getDeclaraPorActividad, getTiposDeclaraciones} from "../../core/DDJJComerciosRI/DDJJComerciosRI-actions";
import {SELECCIONAR_COMERCIO} from "../../core/cuentasComerciosRI/cuentasComerciosRI-actions";
import {getValorConfiguracion} from "../../core/configuraciones/configuraciones-actions";
import FiltroComerciosRIComponent from "./FiltroComerciosRIComponent";
import ListadoComerciosRIComponent from "./ListadoComerciosRIComponent";
import DDJJManager from './DDJJManager';

const styles = (theme) => ({
	...pagesStyle(theme),
	...extendedFormsStyle,
	...tooltip,
});

@connect(
	state => ({
		DDJJComerciosRI: state.DDJJComerciosRI,
		cuentasComerciosRI: state.cuentasComerciosRI,
	}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
			getDDJJComerciosRI,
			SELECCIONAR_COMERCIO,
			getActividadesComercio,
			getDeclaraPorActividad,
			getTiposDeclaraciones,
			getValorConfiguracion,
		}, dispatch)
	})
)
@withStyles(styles)
export default class ComerciosResponsablesInscriptosPage extends React.Component {
	static propTypes = {
		classes: PropTypes.any,
		DDJJComerciosRI: PropTypes.object.isRequired,
		style: PropTypes.any,
		actions: PropTypes.any.isRequired,
		headerProps: PropTypes.any.isRequired,
	};

	state = {
	};

	constructor(props) {
		super(props);
		this.state = {
			openStepper : false,
		}
		this.onSearch = this.onSearch.bind(this);
	}

	componentDidMount() {
		return Promise.all([
			this.props.actions.getActividadesComercio({}),
			this.props.actions.getDeclaraPorActividad({}),
			this.props.actions.getTiposDeclaraciones({}),
			this.props.actions.getValorConfiguracion({campo: 'PERIODO_INICIO_NUEVA_DDJJ'}),
		])
	}

	onSearch(idComercio) {
		return Promise.resolve(this.props.actions.SELECCIONAR_COMERCIO({idComercio}))
			.then(() => this.props.actions.getDDJJComerciosRI({idComercio}));
	}

	/* ------------ */
	handleOnClickNuevaDDJJ = (e) => {
		this.setState({openStepper: !this.state.openStepper});
	}
	handleCerrarStepper = () => {
		this.setState({openStepper: false });
	}

	/* ------------ */


	render() {
		const {classes, headerProps, DDJJComerciosRI: {data: dataDDJJComerciosRI, loadingDDJJComerciosRI}, cuentasComerciosRI: {comercioIdSelected}} = this.props;
		const loading = loadingDDJJComerciosRI;

		return (
			<div>
				<Header
					{...headerProps}
					showTitle={true}
				>
					<div></div>
				</Header>
				<BlockComponent blocking={loading}>
					<div className={classes.wrapper}>
						<Card className={classes.card}>
							<CardHeader>
								<h4>
									{ this.state.openStepper
										? "Comercios - Nueva DDJJ"
										: "Comercios - Presentaciones de DDJJ"
									}
								</h4>
							{
								! this.state.openStepper ?
								  (
									<FiltroComerciosRIComponent
										comercioIdSelected={comercioIdSelected}
										onSearch={this.onSearch}
									/>)
								: ''
							}
							</CardHeader>

							<CardBody>
								{ this.state.openStepper
									?
									  (<DDJJManager
											comercioIdSelected={comercioIdSelected}
											handleCerrarStepper = {this.handleCerrarStepper}
										/>)
									: (<ListadoComerciosRIComponent
										comercioIdSelected={comercioIdSelected}
										data={dataDDJJComerciosRI}
										handleOnClickNuevaDDJJ={this.handleOnClickNuevaDDJJ}
										/>)
								}


							</CardBody>
						</Card>
					</div>
				</BlockComponent>
			</div>
		);
	}
}
