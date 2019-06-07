import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "../../components/Header/Header.jsx";
import BlockComponent from "../../components/Loading/BlockComponent";

import pagesStyle from "../../assets/jss/layouts/pagesStyle";
import imagen from "../../assets/img/smartcity.jpg";

@connect(
	state => ({}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
		}, dispatch)
	})
)
@withStyles(pagesStyle)
export default class HomePage extends React.Component {
	static propTypes = {
		classes: PropTypes.any,
		style: PropTypes.any,
		actions: PropTypes.any.isRequired,
		headerProps: PropTypes.any.isRequired,
	};

	state = {};

	componentDidMount() {
	}

	render() {
		const {classes, headerProps} = this.props;
		const loading = false;
		return (
			<div>
				<Header
					{...headerProps}
					showTitle={true}
				>
					<div></div>
				</Header>
				<BlockComponent blocking={loading}>
				  <div className={classes.centrado}>
					  <p><img src={imagen} alt="Ciudad Inteligente"/> </p>
						<h1>Ciudad Inteligente</h1>
				  </div>
					<div className={classes.justificado}>
					   <p><b>Autogestion</b> es una aplicacion que implementa el concepto de Ciudad Inteligente o Ciudad Digital.</p>
						 <p>Una <b>Ciudad Inteligente</b> busca el protagonismo de la ciudadanía en la gestión, ampliando las relaciones entre la ciudadanía y el estado, posibilitada por la disponibilidad y aplicación de las tecnologías de la información y la comunicación. Inscriptas en la corriente del gobierno electrónico y digital se suman innovaciones que amplían la esfera de lo público avanzando hacia los retos que plantea el paradigma o filosofía de Gobierno Abierto. El Municipio se propone crear un nivel de mayor apertura renovando su compromiso con la gestión de políticas públicas inclusivas y participativas, asumiendo el desafío de integrar a todas las personas a partir de la democratización de la información y el conocimiento.</p>
						 <p><b>Ciudad Inteligente</b> brinda servicios inteligentes expandiendo las posibilidades de canales de interacción entre actores sociales y estatales que propicien vínculos más transparentes, participativos y colaborativos. En este sentido la propuesta se cimenta en una ampliación de la información pública, en mayores y mejores niveles de acceso a datos sobre los servicios públicos y sus canales de entrega, en incrementar los procesos de transparencia en la gestión pública proporcionando niveles de apertura que generen oportunidades de desarrollo y procesos de participación con mayor protagonismo por parte de los/as vecinos/as en el territorio. Todo ello en el marco de una visión que sostiene que la transparencia refuerza la democracia, promueve la eficiencia y efectividad gubernamental y los niveles de desarrollo social.</p>
					</div>
				</BlockComponent>
			</div>
		);
	}
}
