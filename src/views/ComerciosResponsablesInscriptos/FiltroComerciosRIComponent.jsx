import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import BlockComponent from "../../components/Loading/BlockComponent";
import extendedFormsStyle from "../../assets/jss/views/extendedFormsStyle.jsx";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

import pagesStyle from "../../assets/jss/layouts/pagesStyle";
import {
	tooltip
} from "../../assets/jss/autogestion";
import {getCuentasComerciosRI} from "../../core/cuentasComerciosRI/cuentasComerciosRI-actions";

const styles = (theme) => ({
	...pagesStyle(theme),
	...extendedFormsStyle,
	...tooltip,
});

@connect(
	state => ({
		usuario: state.auth.user,
		cuentasComerciosRI: state.cuentasComerciosRI,
	}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
			getCuentasComerciosRI,
		}, dispatch)
	})
)
@withStyles(styles)
export default class FiltroComerciosRIComponent extends React.Component {
	static propTypes = {
		classes: PropTypes.any,
		style: PropTypes.any,
		comercioIdSelected: PropTypes.string,
		usuario: PropTypes.object.isRequired,
		cuentasComerciosRI: PropTypes.object.isRequired,
		actions: PropTypes.any.isRequired,
		onSearch: PropTypes.func.isRequired,
	};

	state = {
		item: {
			cuentaId: this.props.comercioIdSelected
		},
	};

	constructor(props) {
		super(props);
		this.handleOnSearch = this.handleOnSearch.bind(this);
	}

	componentDidMount() {
		const {usuario: {id: usuario}} = this.props;
		return Promise.all([
			this.props.actions.getCuentasComerciosRI({usuario}),
		])
	}

	bindValue = key => {
		return {
			onChange: e => {
				const item = this.state.item;
				item[key] = e.target.value;
				this.setState({item});
				this.props.onSearch(item.cuentaId);
			},
			value: this.state.item[key] || ''
		};
	};

	handleOnSearch(event) {
		event.stopPropagation();
		event.preventDefault();
		const {item} = this.state;
		return this.props.onSearch(item.cuentaId);
	}

	render() {
		const {classes, cuentasComerciosRI: {data: dataCuentasComerciosRI, loadingCuentasComerciosRI}} = this.props;
		const loading = loadingCuentasComerciosRI;
		return (
			<BlockComponent blocking={loading}>
				<FormControl required className={classes.selectFormControl}>
					<InputLabel htmlFor="cuentasComerciosRIId">Comercio</InputLabel>
					<Select
						{...this.bindValue('cuentaId')}
						name="cuentaId"
						inputProps={{
							id: 'cuentaId',
							style: {maxWidth: "100%"}
						}}
						className={classes.selectEmpty}
						MenuProps={{
							className: classes.selectMenu,
						}}
						native
					>
						<option value="" disabled></option>
						{dataCuentasComerciosRI.map(({idComercio, descripcion}, key) => {
							return (<option key={key} value={idComercio}>{descripcion}</option>);
						})}
					</Select>
				</FormControl>
			</BlockComponent>
		);
	}
}
