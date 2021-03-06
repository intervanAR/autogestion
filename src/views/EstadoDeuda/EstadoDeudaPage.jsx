import React, { Component } from 'react';
import NodoDeuda from './NodoDeuda.jsx';
import Header from "../../components/Header/Header.jsx";
import {getResumenDeuda, postPagoResumen} from "../../core/deudas/deudas-actions";
import {setResumenPrevio} from "../../core/pagos/pagos-actions";
import FiltroEstadoDeudaComponent from "./FiltroEstadoDeudaComponent";
import * as AuthService from '../../core/auth/auth-actions';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import extendedFormsStyle from "../../assets/jss/views/extendedFormsStyle.jsx";
import pagesStyle from "../../assets/jss/layouts/pagesStyle";
import BlockComponent from "../../components/Loading/BlockComponent";
import {browserHistory} from "../../core/globals"


const styles = (theme) => ({
	...pagesStyle(theme),
	...extendedFormsStyle,
});

@connect(
	state => ({
		resumenDeudas: state.resumenDeudas,
    user: state.auth.user,
	}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
			getResumenDeuda,
      postPagoResumen,
			setResumenPrevio,
		}, dispatch)
	})
)

@withStyles(styles)
export default class EstadoDeudaPage extends Component {

	constructor(props){
		super(props)
		this.state = {
			resumenDeudas:[],
		}
	}
  componentDidMount() {
    if (AuthService.isLoggedIn()){
      const usuario = this.props.user.id != undefined ? this.props.user.id : null;
  		return Promise.all([
  			this.props.actions.getResumenDeuda({usuario})
  		]).then(data =>{
				this.setState({resumenDeudas : data[0]})
			})
    }
	}


  onSearch = (tipoImponible, nroImponible) =>{
    const usuario = this.props.user != undefined ? this.props.user.id : null;
		return this.props.actions.getResumenDeuda({tipoImponible, nroImponible, usuario });
	}

  handlePagarDeudas = (deuda) => {
		Promise.all([
			this.props.actions.setResumenPrevio(deuda),
		])
		browserHistory.push('/estado-deuda-pago');
  }

  render (){
    const {classes, headerProps} = this.props;
		const resumenDeudas = this.state.resumenDeudas;
    const loading = resumenDeudas.loadingResumenDeudas;

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
            {
              ! AuthService.isLoggedIn() &&
                <div>
                  <Card className={classes.card}>
                    <CardHeader>
                      <FiltroEstadoDeudaComponent
                        onSearch={this.onSearch}
                      />
                    </CardHeader>
                    <CardBody>

                    </CardBody>
                  </Card>
                </div>
            }
            {
              resumenDeudas.map((deuda, key)=>{
                return (<NodoDeuda
                  key={key}
                  datos={deuda}
                  handleOnClickPagar={this.handlePagarDeudas}
                />)
              })
            }
          </div>
        </BlockComponent>
      </div>
    )
  }
}
