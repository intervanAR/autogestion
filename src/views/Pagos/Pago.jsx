import React, { Component } from 'react';
import Header from "../../components/Header/Header.jsx";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import FormPago from './FormPago';
//Actions connect
import { postResumenPago , postPagar, getMediosPago, getGatewayPago } from '../../core/pagos/pagos-actions.js';

//Utils
import MessageComponent from '../../components/Message/MessageComponent';
import Step from '@material-ui/core/Step';
import Button from '../../components/CustomButtons/Button';
import Grid from '@material-ui/core/Grid';
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import BlockComponent from "../../components/Loading/BlockComponent";
import Select from "@material-ui/core/Select";
import moment from "moment";
import MedioPago from './MedioPago';

const styles = theme => ({
  root: {
    width: '100%',
    paddingTop:'60px',
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
      getMediosPago,
      getGatewayPago,
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
      mediosPago : this.props.pagos.mediosPago,
      selectedMedioPago : null,
      fecha_actualizacion:  moment(new Date(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
      id_operacion:null,
      pago:null,
    })
    this.nextStep = this.nextStep.bind(this);
  }

  componentDidMount() {
		return Promise.all([
			this.props.actions.getMediosPago({}),
		])
	}


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
    const codGateway = this.state.selectedMedioPago.cod_gateway;
    const params = Object.assign({
      usuario:  this.props.user != undefined ? this.props.user.id : null,
      fecha_actualizacion: state.fecha_actualizacion,
      deudas:this.props.pagos.resumenPrevio.map(deuda =>{return {id:deuda.id}}),
    });

    return Promise.all([
      this.props.actions.getGatewayPago({codGateway}),
      this.props.actions.postResumenPago(params),
    ]).then(data =>{
      console.log("GATEWAY : ", data[0]);
      console.log("OPERACION :", data[1]);
      if (data[1].id_operacion != undefined){
        this.setState({...this.state,
                        id_operacion:data[1].id_operacion,
                        importe:data[1].importe});
        this.nextStep(e);
      }
    }).catch(error => {
      this.setErrorMessage(error.message);
    });
  }

  handlePagar = (token) => {
    const data = {
      id_operacion: this.state.id_operacion,
      medio_pago: this.state.selectedMedioPago.cod_medio_pago,
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
    });
    /*.catch(error => {
      this.setErrorMessage(error.message);
    });*/
  }

  habilitarButtonConinuar = ()=>{
    return this.state.selectedMedioPago != undefined
        || this.state.selectedMedioPago != null ? false : true;
  }

  getMediosPagoContent(){
    const {mediosPago} = this.props.pagos;
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
              mediosPago.filter(i => i.tipo == 'CREDITO').map((item, index)=>{
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
              mediosPago.filter(i => i.tipo == 'DEBITO').map((item, index)=>{
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
              mediosPago.filter(i => i.tipo == 'OTRO').map((item, index)=>{
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
              size="lg"
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
    console.log("PROPS: ",this.props);
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
              <Grid
                direction="row"
                wrap="wrap"
                alignItems="center"

                >
                <GridItem>
                  {
                    this.props.pagos.PagosError
                    ? <span>Se produjo un error en el Pago</span>
                    : ''
                  }

                  {
                    this.props.pagos.data.resultado != undefined && this.props.pagos.data.resultado == 'OK'
                    ? (
                      <div>
                        <span>El Pago fue realizado.</span>
                        <Button color="info">DESCARGAR</Button>
                      </div>
                    ):''
                  }
                </GridItem>
              </Grid>
          </React.Fragment>
        )
        break;
      default:
        return <div></div>
    }
  }

  render (){
    const { activeStep, message, messageColor } = this.state;
    const {pagos, headerProps, classes} = this.props;
    const loading = pagos.loadingPagos;

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
