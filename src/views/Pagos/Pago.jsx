import React, { Component } from 'react';
import Header from "../../components/Header/Header.jsx";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import FormPago from './FormPago';
//Actions connect
import { postResumenPago , postPagar } from '../../core/pagos/pagos-actions.js';

//Utils
import MessageComponent from '../../components/Message/MessageComponent';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '../../components/CustomButtons/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardContent from '@material-ui/core/CardContent';
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import BlockComponent from "../../components/Loading/BlockComponent";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import CheckIcon from "@material-ui/icons/Check";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Datetime from "react-datetime";
import moment from "moment";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import MedioPago from './MedioPago';
import {creditoDecidir, debitoDecidir} from './mediosPago.js';


const styles = theme => ({
  root: {
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor:'white',
    paddingBottom: '50px',
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  subtitle : {
    marginTop:'20px',
    fontSize: '18px',
  },

});

@connect(
	state => ({
		pagos: state.pagos,
    user: state.auth.user,
	}),
	dispatch => ({ // mapDispatchToProps
		actions: bindActionCreators({
      postResumenPago,
      postPagar,
		}, dispatch)
	})
)

@withStyles(styles)
export default class Pago extends Component {
  static propTypes = {
    classes: PropTypes.any,
    headerProps: PropTypes.any.isRequired,
  };
  constructor (props){
    super(props);
    this.state = Object.assign({
      messageColor:null,
      message:null,
      activeStep: 0,
      mediosPago : debitoDecidir.concat(creditoDecidir),
      selectedMedioPago : null,
      fecha_actualizacion:  moment(new Date(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
      id_operacion:null,
      pago:null,
    })
    this.nextStep = this.nextStep.bind(this);
  }
  /* Mensajes de Validacion */
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

  getSteps() {
    return ['Medio de Pago', 'Datos de Pago', 'Finalizar'];
  }
  nextStep(e){
    this.setState({
      ...this.state,
      activeStep : this.state.activeStep + 1,
    });
  }
  handleNext = () => {
    this.nextStep(null);
  };
  handleBack = () => {
    console.log("handleBack");
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };
  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };
  handleFin = () => {

  }
  handleOnClickMedioPago = (item) => {
    console.log(item);
    this.setState({
      ...this.state,
      selectedMedioPago:item
    });
  }
  handleNextMedioPago = (e) => {
    const state = this.state;
    const params = Object.assign({
      usuario:  this.props.user != undefined ? this.props.user.id : null,
      fecha_actualizacion: state.fecha_actualizacion,
      deudas:this.props.pagos.resumenPrevio.map(deuda =>{return {id:deuda.id}}),
    });

    return Promise.all([
      this.props.actions.postResumenPago(params),
    ]).then(data =>{
      console.log("DATA :", data);
      if (data[0].id_operacion != undefined){
        this.setState({...this.state,
                        id_operacion:data[0].id_operacion,
                        importe:data[0].importe});
        this.nextStep(e);
      }
    }).catch(error => {
      this.setErrorMessage(error.message);
    });
  }

  handlePagar = (token) => {
    const data = {
      id_operacion: this.state.id_operacion,
      medio_pago: this.state.selectedMedioPago.id,
      token: token,
    }
    //Pasamos a la etapa de procesamiento del pago.
    this.setState({
      activeStep: 2,
    });
    Promise.all([
      this.props.actions.postPagar(data),
    ]).then(data =>{
      this.state.pago = data[0];
    }).catch(error => {
      this.setErrorMessage(error.message);
    });
  }

  habilitarButtonConinuar = ()=>{
    return this.state.selectedMedioPago != undefined
        || this.state.selectedMedioPago != null ? false : true;
  }

  getMediosPagoContent(){
    const classes = this.props.classes;
    const alignItems="flex-start"; //flex-start
    const justify = "flex-start"; //flex-start
    const spacing=8;
    return(
    <React.Fragment>
      <Grid container xs={12} >
        <Grid item xs={12} sm={9} >
          <Grid
            container
            direction="row"
            justify={justify}
            alignItems={alignItems}
            item xs={12} sm={12}>
            <div className={classes.subtitle}>Tarjetas de Credito</div>
          </Grid>
          <Grid
            container
            justify={justify}
            alignItems={alignItems}
            direction="row"
            spacing={spacing}
          >
            {
              this.state.mediosPago.filter(i => i.tipo == 'TC').map((item, index)=>{
                return (
                  <MedioPago
                    handleClick={() => this.handleOnClickMedioPago(item)}
                    key={index}
                    icono={item.icono}
                    selected={
                      this.state.selectedMedioPago == item ? true : false}
                    item={item}
                  />
                )
              })
            }
          </Grid>

          <Grid
            container
            alignItems={alignItems}
            direction="row"
            justify={justify}
            alignItems={alignItems}
            item xs={12} sm={12}>
            <div className={classes.subtitle}>Tarjetas de Debito</div>
          </Grid>
          <Grid
            container
            alignItems={alignItems}
            direction="row"
            spacing={spacing}
            justify={justify}
          >
            {
              this.state.mediosPago.filter(i => i.tipo == 'TD').map((item, index)=>{
                return (
                  <MedioPago
                    handleClick={() => this.handleOnClickMedioPago(item)}
                    key={index}
                    icono={item.icono}
                    selected={
                      this.state.selectedMedioPago == item ? true : false}
                    item={item}
                  />
                )
              })
            }

          </Grid>

          <Grid
            container
            alignItems={alignItems}
            direction="row"
            justify={justify}
            alignItems={alignItems}
            item xs={12} sm={12}>
            <div className={classes.subtitle}>Otros medios de Pago</div>
          </Grid>
          <Grid
            container
            alignItems={alignItems}
            justify={justify}
            direction="row"
            spacing={spacing}
          >
            {
              this.state.mediosPago.filter(i => i.tipo == 'OT').map((item, index)=>{
                return (
                  <MedioPago
                    handleClick={() => this.handleOnClickMedioPago(item)}
                    key={index}
                    icono={item.icono}
                    selected={
                      this.state.selectedMedioPago == item ? true : false}
                    item={item}
                  />
                )
              })
            }
          </Grid>
        </Grid>
        <Grid
          display="flex"
          alignItems="flex-end"
          container
          justify="center"
          item xs={12} sm={3}
          >
          <Grid xs={12} sm={12} alignItems="center" justify="center">
            <Button
              disabled={this.habilitarButtonConinuar()}
              variant="contained"
              color="success"
              fullWidth={true}
              size="large"
              onClick={this.handleNextMedioPago}>
              CONTINUAR
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
        </Grid>
      </Grid>
    </React.Fragment>
    )
  }

  getStepContent(stepIndex) {
    const {pagos, headerProps, classes} = this.props;
    switch (stepIndex) {
      case 0:
        return this.getMediosPagoContent();
        break;
      case 1:
        return (
          <React.Fragment>
            <FormPago
              medioPago = {this.state.selectedMedioPago}
              importe={this.state.importe}
              handleOnClickVolver={this.handleBack}
              handleOnClickPagar={this.handlePagar}
            />
          </React.Fragment>
        )
        break;
      case 2:
        return (
          <React.Fragment>
            <Card className={classes.card}>
              <CardHeader>

              </CardHeader>
              <CardBody>
                <div className={classes.root}>
                  <Grid
                    direction="row"
                    wrap="wrap"
                    alignItems="center"
                    >
                    <GridItem>

                      <span>{this.state.message != null ? this.state.message : 'Procesando el pago...'}</span>

                    </GridItem>
                  </Grid>
                </div>
              </CardBody>
            </Card>
          </React.Fragment>
        )
        break;
      default:
        return <div></div>
    }
  }

  render (){
    const steps = this.getSteps();
    const { activeStep, message, messageColor } = this.state;
    const {pagos, headerProps, classes} = this.props;
    const loading = pagos.loadingPagos;
    console.log("propiedades: ",this.props);

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

              </CardHeader>
              <CardBody>
                <div className={classes.root}>
                  <Grid
                    direction="row"
                    wrap="wrap"
                    alignItems="center"
                    >
                    <GridItem>

                      <div className={classes.wrapper}>
                          {this.getStepContent(activeStep)}
                      </div>

                    </GridItem>
                  </Grid>
                </div>
              </CardBody>
            </Card>
          </div>
        </BlockComponent>


        <MessageComponent
          color={messageColor}
          message={message}
          handleOnClickAceptar={this.setToken}
        />

      </div>
    )
  }
}
