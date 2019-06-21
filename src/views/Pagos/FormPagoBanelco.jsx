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
export default class FormPagoBanelco extends Component {
  constructor (props){
    super(props);
    this.state = {
      message:null,
      messageColor:null,
      token:null,
      isLoading: false,
      customer_name:'',
      customer_doc_type:'',
      customer_doc_number:null,
    };

    this.reset = this.reset.bind(this);
    const script = document.createElement("script");
    script.src = "https://live.decidir.com/static/v2.5/decidir.js";
    script.async = true;
    document.body.appendChild(script);
  }

  reset(){
    const state = {
      message:null,
      messageColor:null,
      token:null,
      isLoading: false,
      customer_name:'',
      customer_doc_type:'',
      customer_doc_number:null,
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
  		return true;
  	}

    habilitarDocumento(){
      return this.state.customer_doc_type != undefined
             || this.state.customer_doc_type != null ? false : true;
    }

    habilitarButtonPagar = () => {
      return false;
    }

    handleVolver = () => {
      this.reset();
      this.props.handleOnClickVolver()
    }

    handleOnClickAceptar = () => {
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
          "customer": {
            "name": this.state.customer_name,
            "identification": {
              "type": this.state.customer_doc_type,
              "number": this.state.customer_doc_number,
            }
          }
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

/*
    tokenizar = () => {
      const publicApiKey = "e9cdb99fff374b5f91da4480c8dca741";
      const urlSandbox = "https://developers.decidir.com/api/v2";
      const inhabilitarCS = true;
      //Para el ambiente de desarrollo
      const decidir = new Decidir(urlSandbox, true);
      //Se indica la public API Key
      decidir.setPublishableKey(publicApiKey);
      decidir.setTimeout(5000);//timeout de 5 segundos
      //formulario
      var form = document.createElement("form");
      form.id = 'formulario'
      form.method = "POST";
      form.action = "";

      var input1 = document.createElement("input");
      var input2 = document.createElement("input");
      var input3 = document.createElement("input");

      input1.value = this.state.customer_name;
      input1.setAttribute("data-decidir", "customer_name");

      input2.value = this.state.customer_doc_type;
      input2.setAttribute("data-decidir", "customer_doc_type");

      input3.value = this.state.customer_doc_number;
      input3.setAttribute("data-decidir", "customer_doc_number");

      form.appendChild(input1);
      form.appendChild(input2);
      form.appendChild(input3);

      console.log("askduasjd");
      var event = new Event('submit', {
            'bubbles'    : false, // Whether the event will bubble up through the DOM or not
            'cancelable' : true  // Whether the event may be canceled or not
        });


      //Asigna la funcion de invocacion al evento de submit del formulario
      form.addEventListener('submit',(event) => {
          console.log("SEnding Form...");
          event.preventDefault();
          decidir.createToken(form, (status, response) => {
            console.log("status: ",status);
            console.log("response: ",response);
            if (status != 200 && status != 201) {

              //Manejo de error: Ver Respuesta de Error
              //...codigo...
            } else {
              //Manejo de respuesta donde response = {token: "99ab0740-4ef9-4b38-bdf9-c4c963459b22"}
              //..codigo...
            }
          });
        });
      form.dispatchEvent(event);
    }
    */

  render (){
    console.log("RENDER FORMPAGO: ", this.state);
    const { medioPago, classes } = this.props; //Puede ser Tarjetas de Credito o Debito
    const isLoading = this.state.isLoading;
    const message = this.state.message;
    const messageColor = this.state.messageColor;
    return (
      <Grid>
        <BlockComponent blocking={isLoading}>
          <form autoComplete="off" className={classes.root} action="" method="post" id="formulario" >
            <Grid container >
              <GridItem xs={6} sm={3} >
                <FormControl
                  className={classes.formControl}
                  fullWidth={true}
                  >
                  <InputLabel htmlFor="customer_doc_type">Tipo Documento</InputLabel>
        					<Select
                    native
        						{...this.bindValue('customer_doc_type')}
        						name="customer_doc_type"
        						inputProps={{
                      type:"text",
                      'data-decidir':"customer_name",
        							id: 'customer_doc_type',
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
                  id="customer_doc_number"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    disabled: this.habilitarDocumento(),
                    required: true,
                    type: "text",
                    ...this.bindValue('customer_doc_number'),
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
                        value: formatNumber(this.props.importe),
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
