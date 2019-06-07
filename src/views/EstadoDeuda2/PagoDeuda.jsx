import React, { Component } from 'react';
import Grid from "@material-ui/core/Grid";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import InputLabel from "@material-ui/core/InputLabel";
import CustomInput from "../CustomInput/CustomInput.jsx";
import FormControl from "@material-ui/core/FormControl";
import Moment from 'moment';
import Button from "../CustomButtons/Button.jsx";
import TextField from '@material-ui/core/TextField';
import Select from "@material-ui/core/Select";


export default class PagoDeuda extends Component {

  constructor(props){
    super(props)
    this.state = {
			openModal : false,
			importe:0,
			formData : Object.assign({
				card_number : null,
			  card_expiration_month : null,
			  card_expiration_year : null,
			  security_code : null,
			  card_holder_name : null,
			  card_holder_identification_type : "dni",
			  card_holder_identification_number : null,
			})
    }
  }

  handleToogleModal = () => {
		const openModal = !this.state.openModal;
		this.setState({
			...this.state,
			openModal
		})
	}

  bindValue = key => {
		return {
			onChange: this.handleOnChangeValue.bind(this)(key),
			value: this.state.formData[key] || '',
			validate: this.validarItem.bind(this)(key),
		};
	};

	getItemValue = key => {
		return this.state.formData[key] || ''
	}

	bindNumberValue = key => {
		return {
			onChange: this.handleOnChangeValue.bind(this)(key),
			value: this.state.formData[key] === undefined ? 0 : Number(this.state.formData[key] || '')
		};
	};

	bindDateValue = key => {
		return {
			onChange: m => {
				const formData = this.state.formData;
				formData[key] = m.format('DD/MM/YYYY');
				this.setState({formData});
			},
			value: this.state.formData[key] || ''
		};
	};

	handleOnChangeValue(key) {
		return (e) => {
			const formData = this.state.formData;
			formData[key] = e.target.value;
			this.setState({
				formData: {
					...formData,
				}
			});
		}
	}


  render(){
    return (
      <Grid>
        <form autoComplete="off">
					<Card login>
						<CardHeader
							color="primary"
						>
							<h4>Pagar Deuda</h4>
						</CardHeader>
						<CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12}>
                  <FormControl fullWidth={true} >
                    <InputLabel htmlFor="tarjetaPago">Tarjeta de Pago</InputLabel>
                    <Select
                      value = {this.state.tarjetaPago}
                      name="tarjetaPago"
                      inputProps={{
                        id: 'tarjetaPago',
                        fullWidth:true,
                      }}
                      native
                      required
                    >
                      <option value="" disabled></option>
                      {
                        mediosPago.map((item, key)=><option value={item.id}>{item.marca}</option>)
                      }
                    </Select>
                  </FormControl>
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12}>
                    <CustomInput
                      labelText="Número"
                      id="card_number"
                      validateOnChange={() => this.validateNumber.bind(this)}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        required: true,
                        type: "text",
                        ...this.bindValue('card_number'),
                      }}
                    />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={6} sm={3}>
                  <FormControl >
                    <CustomInput
                      labelText="Mes Exp."
                      id="card_expiration_month"
                      formControlProps={{
                        fullWidth: false
                      }}
                      inputProps={{
                        placeholder:'MM',
                        required: true,
                        type: "text",
                        ...this.bindValue('card_expiration_month'),
                      }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem xs={6} sm={3}>
                  <FormControl >
                    <CustomInput
                      labelText="Año Exp."
                      id="card_expiration_year"
                      formControlProps={{
                        fullWidth: false
                      }}
                      inputProps={{
                        placeholder:'YY',
                        required: true,
                        type: "text",
                        ...this.bindValue('card_expiration_year'),
                      }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem xs={6} sm={6}>
                  <FormControl >
                    <CustomInput
                      labelText="CVV"
                      id="security_code"
                      formControlProps={{
                        fullWidth: false
                      }}
                      inputProps={{
                        required: true,
                        type: "text",
                        ...this.bindValue('security_code'),
                      }}
                    />
                  </FormControl>
                </GridItem>
              </GridContainer>

							<GridContainer>
								<GridItem xs={6} sm={6}>
  								<FormControl >

  								</FormControl>
                </GridItem>
							</GridContainer>


						</CardBody>
						<CardFooter >
							<div  style={{textAlign: 'center'}}>
								<Button round onClick={this.props.handleToogleModal}>
									Cancelar
								</Button>
								<Button round color="primary" type="submit">
									Pagar
								</Button>
							</div>
						</CardFooter>
					</Card>
				</form>
      </Grid>
    )
  }
}
