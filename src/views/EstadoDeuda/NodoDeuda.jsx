import React, { Component } from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import extendedFormsStyle from "../../assets/jss/views/extendedFormsStyle.jsx";
import pagesStyle from "../../assets/jss/layouts/pagesStyle";
import {
	tooltip
} from "../../assets/jss/autogestion";

import NavPath from "../../components/NavPath";
import CardDeuda from './CardDeuda.jsx';
import * as AuthService from '../../core/auth/auth-actions';

const styles = (theme) => ({
	...pagesStyle(theme),
	...extendedFormsStyle,
	...tooltip,
});


@withStyles(styles)
export default class NodoDeuda extends React.Component {

  constructor(props) {
		super(props);
    this.state = {
      deuda:[],
      importeDeuda:0,
      camino:[],
    }
		this.handleSeleccion(this.props.datos)
	}

  retornarDeuda(nodo, deudas){
    if (nodo.tipo.detalle != undefined && nodo.tipo.detalle == 'det' ){
      nodo.detalle.map(det =>deudas.push(det));
    }
    if (nodo.detalle != undefined && nodo.tipo.detalle == 'res'){
      nodo.detalle.map(det=>{
        deudas = this.retornarDeuda(det, deudas);
      })
    }
    return deudas;
  }

  sumarImportesDeudas(deudas){
    let total=0;
    deudas.map(deuda => total = total+deuda.total)
    return total;
  }

	/* Al seleccionar un nodo que tiene un unico camino hacia su hoja,
		 Lo reccore agregando los nodos intermedios al camino.
	 */
	push = (camino, nodo)=>{
		camino.push(nodo);
		if (camino.length !== 1 && nodo.detalle.length == 1 && nodo.tipo.detalle == 'res'){
			camino = this.push(camino, nodo.detalle[0]);
		}
		return camino;
	}

  handleSeleccion = (nodoSelected) => {
    const state = this.state;
    var camino = state.camino
		state.camino = this.push(camino, nodoSelected);
		state.deuda = this.retornarDeuda(state.camino[state.camino.length-1], []);
		state.camino.length === 1
			? state.importeDeuda = nodoSelected.total
			: state.importeDeuda = this.sumarImportesDeudas(state.deuda);
    this.setState({
      ...state
    });
  }

  handleOnClickIniPath = (path) => {
    const state = this.state
		state.camino = []
    this.setState({...state})
  }

  handleOnClickPath = (path) => {
    const state = this.state
    const item = this.state.camino.filter(item => item.id == path.item.id )[0]
    const index = this.state.camino.indexOf(item);
    state.camino = state.camino.slice(0, index+1);
    state.deuda = this.retornarDeuda(state.camino[state.camino.length - 1], []);
		state.camino.length === 1
			? state.importeDeuda = state.camino[0].total
			: state.importeDeuda = this.sumarImportesDeudas(state.deuda)
    this.setState({...state});
  }

  handleCheckBox = (item) => {
    const state = this.state;
    state.deuda.includes(item)
      ? state.deuda = state.deuda.filter(deuda => deuda.id !== item.id)
      : state.deuda.push(item);
    state.importeDeuda = this.sumarImportesDeudas(state.deuda);
    this.setState({
      ...state,
    });
  }

	handleOnClickPagar = () =>{
		const deuda = this.state.deuda.length === 0 ? [this.props.datos] : this.state.deuda
		this.props.handleOnClickPagar(deuda);
	}

  render() {
		const {classes, datos } = this.props;
		return (
			<div>
            <Card className={classes.card}>
              <CardHeader>
                {
                  datos != undefined &&
                  <NavPath
                    handleOnClick={this.handleOnClickPath}
                    handleOnClickIni={this.handleOnClickIniPath}
                    paths={this.state.camino.map(item =>{ return {texto:item.descripcion1, item}})}
                  />
                }
							</CardHeader>
              <CardBody>
                <div>
                	<CardDeuda
                    data={this.state.camino[this.state.camino.length - 1]}
                    importeDeuda={this.state.importeDeuda}
                    deuda={this.state.deuda}
                    handleSeleccion={this.handleSeleccion}
                    handleOnClickPagar={this.handleOnClickPagar}
                    handleCheckBox={this.handleCheckBox}
                  />
                </div>
              </CardBody>
            </Card>
			</div>
		);
	}

}
