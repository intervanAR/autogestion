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
import {getDeudas} from "../../core/deudas/deudas-actions";
import FiltroEstadoDeudaComponent from "./FiltroEstadoDeudaComponent";
import ListadoEstadoDeudaComponent from "./ListadoEstadoDeudaComponent";

const styles = (theme) => ({
	...pagesStyle(theme),
	...extendedFormsStyle,
	...tooltip,
});

@connect(
	state => ({
		deudas: state.deudas,
	}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
			getDeudas,
		}, dispatch)
	})
)
@withStyles(styles)
export default class EstadoDeudaPage extends React.Component {
	static propTypes = {
		classes: PropTypes.any,
		deudas: PropTypes.object.isRequired,
		style: PropTypes.any,
		actions: PropTypes.any.isRequired,
		headerProps: PropTypes.any.isRequired,
	};

	state = {
	};

	constructor(props) {
		super(props);
		this.onSearch = this.onSearch.bind(this);
	}

	componentDidMount() {
		return Promise.all([
			this.props.actions.getDeudas({})
		])
	}

	onSearch(tipoImponible, nroImponible) {
		return this.props.actions.getDeudas({tipoImponible, nroImponible});
	}

	render() {
		const {classes, headerProps, deudas: {data: dataDeudas, loadingDeudas}} = this.props;
		const loading = loadingDeudas;
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
								<FiltroEstadoDeudaComponent
									onSearch={this.onSearch}
								/>
							</CardHeader>
							<CardBody>
								<ListadoEstadoDeudaComponent
									data={dataDeudas}
								/>
							</CardBody>
						</Card>
					</div>
				</BlockComponent>
			</div>
		);
	}
}
