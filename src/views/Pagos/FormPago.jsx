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
class FormPago extends Component {



  constructor (props){
    super(props)
    this.state = {
      message:null,
      messageColor:null,
      token:null,
      isLoading: false,
      card_number : null,
      card_holder_name:null,
      card_expiration_month : null,
      card_expiration_year : null,
      security_code :null,
      card_holder_identification_type :null,
      card_holder_identification_number : null,
    };
    this.reset = this.reset.bind(this);
  }
  reset(){
    const state = {
      message:null,
      messageColor:null,
      token:null,
      isLoading: false,
      card_number : null,
      card_holder_name:null,
      card_expiration_month : null,
      card_expiration_year : null,
      security_code :null,
      card_holder_identification_type :null,
      card_holder_identification_number : null,
    }
    this.setState(state);
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

  handleOnChangeModoPago = (key) =>{
  }

  handleOnChangeNumber = (key) =>{
  }

  validateNumber = (e) =>{
    return true;
  }

  bindValue = key => {
		return {
			onChange: this.handleOnChangeValue.bind(this)(key),
			value: this.state[key] || '',
			validate: "'"+this.validarItem.bind(this)(key)+"'",
		};
	};

	getItemValue = key => {
		return this.state[key] || ''
	}

	bindNumberValue = key => {
		return {
			onChange: this.handleOnChangeValue.bind(this)(key),
			value: this.state[key] === undefined ? 0 : Number(this.state[key] || '')
		};
	};

	bindDateValue = key => {
		return {
			onChange: m => {
				const state = this.state;
				state[key] = m.format('DD/MM/YYYY');
				this.setState({state});
			},
			value: this.state[key] || ''
		};
	};

	handleOnChangeValue(key) {
    if (this.validateNumber(key))
  		return (e) => {
  			const state = this.state;
  			state[key] = e.target.value;
  			this.setState({
  				...state,
  			});
  		}
	}

  validarItem(key){
    //console.log("VALIDAR ITEM: ",key);
		return true;
	}

  validarCardNumber = () => {
    const state = this.state;
    const medioPago = this.props.medioPago;
    if (state.card_number == null){
      return false;
    }
    if (state.card_number.toString().length <  medioPago.parametros.longitud_pan ||
        state.card_number.toString().length >  medioPago.parametros.longitud_pan){
      return false;
    }
    return true;
  }

  validarMes = () => {
    const state = this.state;
    const medioPago = this.props.medioPago;
    if (state.card_expiration_month <  1 || state.card_expiration_month >  31){
      return false;
    }
    return true;
  }

  validarAnio = () => {
    const state = this.state;
    const medioPago = this.props.medioPago;
    const current_year = new Number(new Date().getFullYear().toString().substring(2));
    if (state.card_expiration_year <  current_year ){
      return false;
    }
    return true;
  }

  validarCVV = () => {
    const state = this.state;
    const medioPago = this.props.medioPago;

    if (state.security_code == null ||
        state.security_code.length != medioPago.parametros.formato_cvv.length ){
      return false;
    }
    return true;
  }

  habilitarDocumento(){
    return this.state.card_holder_identification_type != undefined
           || this.state.card_holder_identification_type != null ? false : true;
  }

  habilitarButtonPagar = () => {
    return !this.props.habilitarButtonPagar;
  }

  handleVolver = () => {
    this.reset();
    this.props.handleOnClickVolver()
  }

  handleOnClickAceptar = () => {
    if ( ! this.validarCardNumber()){
      this.setErrorMessage("El número de tarjeta no es correcto.");
      return;
    }
    if ( ! this.validarMes()){
      this.setErrorMessage("Més no válido.");
      return;
    }
    if ( ! this.validarAnio()){
      this.setErrorMessage("Año no válido.");
      return;
    }
    if ( ! this.validarCVV()){
      this.setErrorMessage("Código CVV incorrecto.");
      return;
    }

    this.tokenizar();
  }



  tokenizar = () => {
    this.setState({
      ...this.state,
      isLoading: true,
    });

    const params = {
      method:'POST',
      headers:{
        'apikey':'e9cdb99fff374b5f91da4480c8dca741',
        'content-type':'application/json',
        'cache-control':'no-cache',
      },
      body:JSON.stringify({
        "card_number":this.state.card_number,
        "card_expiration_month":this.state.card_expiration_month,
        "card_expiration_year":this.state.card_expiration_year,
        "security_code":this.state.security_code,
        "card_holder_name": this.state.card_holder_name,
        "card_holder_identification":{
          "type": this.state.card_holder_identification_type,
          "number": this.state.card_holder_identification_number,
        },
      }),
    }
    fetch("https://developers.decidir.com/api/v1/tokens", params)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            ...this.state,
            isLoading: false,
            token: result,
          });
          if (result.status == 'active'){
            this.props.handleOnClickPagar(result);
          }
        },
        (error) => {
          this.setState({
            isLoading: false,
            error
          });
        }
      )

  }

  render (){
    console.log("RENDER FORMPAGO: ", this.state);
    const { medioPago, classes } = this.props; //Puede ser Tarjetas de Credito o Debito
    const isLoading = this.state.isLoading;
    const message = this.state.message;
    const messageColor = this.state.messageColor;
    return (
      <Grid>
        <BlockComponent blocking={isLoading}>
          <form autoComplete="off" className={classes.root} >
            <Grid container >
              <GridItem xs={6} sm={3} >
                <FormControl
                  className={classes.formControl}
                  fullWidth={true}
                  >
                  <InputLabel htmlFor="card_holder_identification_type">Tipo Documento</InputLabel>
        					<Select
                    native
        						{...this.bindValue('card_holder_identification_type')}
        						name="card_holder_identification_type"
        						inputProps={{
        							id: 'card_holder_identification_type',
        						}}
                    className={classes.selectEmpty}
                    MenuProps={{
                      className: classes.selectMenu,
                    }}
        					>
        						<option value="" disabled></option>
                    <option value="dni">DNI</option>
        					</Select>
                </FormControl>
              </GridItem>

              <GridItem xs={6} sm={3}>
                <CustomInput
                  labelText="Número"
                  id="card_holder_identification_number"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    disabled: this.habilitarDocumento(),
                    required: true,
                    type: "text",
                    ...this.bindValue('card_holder_identification_number'),
                  }}
                />
              </GridItem>
            </Grid>

                <Grid container >
                  <GridItem xs={12} sm={6}>
                    <CustomInput
                      labelText="Nombre del titular"
                      id="card_holder_name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        required: true,
                        type: "text",
                        ...this.bindValue('card_holder_name'),
                      }}
                    />
                  </GridItem>
                </Grid>

                <Grid container >
                  <GridItem xs={12} sm={6} >
                    <CustomInput
                      labelText="Número de Tarjeta"
                      id="card_number"
                      formControlProps={{
                        fullWidth: true,
                        required: true,
                        margin: "none",
                        variant: "outlined",
                      }}
                      inputProps={{
                        type: "text",
                        ...this.bindValue('card_number'),
                      }}
                      inputHtmlProps={{
                        minLength:medioPago.parametros.longitud_pan,
                        maxLength:medioPago.parametros.longitud_pan,
                      }}
                    />
                  </GridItem>
                </Grid>

                <Grid container >
                  <GridItem xs={6} sm={3} >
                    <CustomInput
                      labelText="Mes Exp."
                      id="card_expiration_month"
                      formControlProps={{
                        fullWidth: true,
                        margin: "none",
                      }}
                      inputProps={{
                        placeholder:'MM',
                        required: true,
                        type: "text",
                        ...this.bindValue('card_expiration_month'),
                      }}
                      inputHtmlProps={{
                        minLength:2,
                        maxLength:2,
                      }}
                    />
                  </GridItem>

                  <GridItem xs={6} sm={3}>
                    <CustomInput
                      labelText="Año Exp."
                      id="card_expiration_year"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        placeholder:'YY',
                        required: true,
                        type: "text",
                        ...this.bindValue('card_expiration_year'),
                      }}
                      inputHtmlProps={{
                        minLength:2,
                        maxLength:2,
                      }}
                    />
                  </GridItem>
                </Grid>
                <Grid container >
                  <GridItem xs={6} sm={3}>
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
                  <GridItem xs={6} sm={3}>
                    <CustomInput
                      labelText="CVV"
                      id="security_code"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        required: true,
                        type: "text",
                        ...this.bindValue('security_code'),
                      }}
                      inputHtmlProps={{
                        minLength:medioPago.parametros.formato_cvv.length,
                        maxLength:medioPago.parametros.formato_cvv.length,
                      }}
                    />
                  </GridItem>
                </Grid>

  							<Grid container >
  								<GridItem xs={6} sm={3}>
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
                  <GridItem xs={6} sm={3}>
    								<FormControl fullWidth={true} >
                      <Button
                        disabled={this.habilitarButtonPagar()}
                        variant="contained"
                        color="success"
                        fullWidth={true}
                        size="lg"
                        onClick={this.handleOnClickAceptar}>
                        PAGAR
                      </Button>
    								</FormControl>
                  </GridItem>
  							</Grid>


  				</form>

          <MessageComponent
  					color={messageColor}
  					message={message}
  				/>
        </BlockComponent>
      </Grid>
    )
  }
}

export default FormPago;
