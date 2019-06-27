import React, { Component } from 'react';
import Grid from "@material-ui/core/Grid";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import InputLabel from "@material-ui/core/InputLabel";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";
import Moment from 'moment';
import Button from "../../components/CustomButtons/Button.jsx";
import TextField from '@material-ui/core/TextField';
import Select from "@material-ui/core/Select";
import MessageComponent from '../../components/Message/MessageComponent';
import BlockComponent from "../../components/Loading/BlockComponent";
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { formatNumber } from '../../core/helpers.js';

const styles = theme => ({

  root: {
   display: 'flex',
   flexWrap: 'wrap',
 },
 formControl: {
   minWidth: 150,
   marginTop: 10,
 },
 selectEmpty: {
   marginTop: theme.spacing,
 },
  textField: {
    marginLeft: theme.spacing,
    marginRight: theme.spacing,
  },
  dense: {
    marginTop: theme.spacing,
  },
  menu: {
    width: 200,
  },
});


@withStyles(styles)
export default class FormPagoFecha extends Component {

  habilitarButtonPagar = () => {
    return !this.props.habilitarButtonPagar;
  }

  handleVolver = () => {
    this.props.handleOnClickVolver()
  }

  handleOnClickAceptar = () => {
    this.tokenizar();
  }
  handlePagar = () => {
    this.props.handleOnClickPagar();
  }
  render (){
    const { classes } = this.props;
    return (
      <Grid container justify="center">
        <Grid item xs={12} sm={12}>
          <div className={classes.root} >
            <Grid container >
              <GridItem xs={12} sm={3}>
                <InputLabel style={{float:'left', paddingTop:'10px'}}>Fecha de Actualización</InputLabel>
                <Datetime
                  timeFormat={false}
                  dateFormat={"DD/MM/YYYY"}
                  inputProps={{
                    required: true,
                  }}
                  locale="es-ES"
                  {...this.props.bindDateValue('fecha_actualizacion')}
                />
              </GridItem>
              <GridItem xs={12} sm={3}>
                <CustomInput
                  labelText="Importe"
                  id="importe"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    required: true,
                    disabled:true,
                    type: "text",
                    value: this.props.importe,
                  }}
                />
              </GridItem>
            </Grid>
            <Grid container >
              <GridItem xs={12} sm={3}>
                <FormControl fullWidth={true}>
                  <Button
                    variant="contained"
                    color="transparent"
                    fullWidth={true}
                    size="lg"
                    onClick={this.handleVolver}>
                    VOLVER
                  </Button>
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={3}>
                <FormControl fullWidth={true} >
                  <Button
                    disabled={this.habilitarButtonPagar()}
                    variant="contained"
                    color="success"
                    fullWidth={true}
                    size="lg"
                    onClick={this.handlePagar}>
                    GENERAR CUPON DE PAGO
                  </Button>
                </FormControl>
              </GridItem>
            </Grid>
          </div>
        </Grid>
      </Grid>
    )
  }
}
