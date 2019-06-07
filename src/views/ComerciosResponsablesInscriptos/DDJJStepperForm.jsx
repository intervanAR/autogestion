import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
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

const styles = theme => ({
  root: {
    width: '90%',
    alignItems: 'center',
    textAlign: 'center',
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class DDJJStepperForm extends React.Component {

  constructor (props){
    super(props);
    this.state = {
      activeStep: 0,
      item:{},
    }
    this.nextStep = this.nextStep.bind(this);
  }
  getSteps() {
    return ['Tipo de declaración y periodo', 'Valor de Declaración', 'Confirmarción'];
  }



  handleOnChangeValue = (key) =>{

  }

  desahabilitarFecha = (key) =>{
    return false;
  }

	desahabilitarTipoDeclaracion() {
		const {item: {estado}} = this.state;
		return estado !== 'CAR' || !this.esAlta();
	}

	desahabilitarAnio() {
		const {item: {estado}} = this.state;
		return estado !== 'CAR' || !this.esAlta();
	}

	desahabilitarCuota() {
		const {item: {estado}} = this.state;
		return estado !== 'CAR' || !this.esAlta();
	}

  handleOnBlurValor() {
		//this.actualizarImportes();
	}
  handleOnBlurAlicuotaMinimo () {

  }
  getStepContent(stepIndex) {

    const classes = this.props.classes;
    const tiposDeclaraciones = this.props.tiposDeclaraciones;
    console.log("Switch: ",stepIndex);
    switch (stepIndex) {

      //----------------------------------------- 0 -----------------------------------
      case 0:
        return(
        <React.Fragment>

          <Typography variant="h6" gutterBottom>

          </Typography>
          <Card className={classes.fieldsContainer}>
          <Grid container spacing={24}>
            <Grid item xs={12} >
              <FormControl required className={classes.selectFormControl}>

                  <InputLabel htmlFor="tipoDeclaracion">Tipo Declaración</InputLabel>
                  <Select
                    {...this.props.bindValue('tipoDeclaracion')}
                    name="tipoDeclaracion"
                    inputProps={{
                      id: 'tipoDeclaracion',
                      style: {
                        position:"relative",
                        minWidth:"300px",
                        width:"100%",
                      },
                    }}
                    className={classes.selectEmpty}
                    MenuProps={{
                      className: classes.selectMenu,
                    }}
                    native
                    required
                  >
                    <option value="" disabled></option>
                    {tiposDeclaraciones.map(({tipoDeclaracion, descripcion}, key) => {
                      return (<option key={key}
                              value={tipoDeclaracion}>{descripcion}</option>);
                    })}
                  </Select>

              </FormControl>
            </Grid>

            <Grid item xs={12} >
              <FormControl required className={classes.selectFormControl}>
                <CustomInput
                  labelText="Año"
                  id="anio"
                  formControlProps={{
                    fullWidth: false
                  }}
                  inputProps={{
                    required: true,
                    ...this.props.bindNumberValue('anio'),
                    type: "number",
                  }}
                  inputHtmlProps={{
                    min: Number(moment().format('YYYY')) - 10,
                    max: Number(moment().format('YYYY')),
                  }}
                />
              </FormControl>
              <FormControl required className={classes.selectFormControl}>
                <CustomInput
                  labelText="Cuota"
                  id="cuota"
                  formControlProps={{
                    fullWidth: false
                  }}
                  inputProps={{
                    required: true,
                    type: "number",
                    ...this.props.bindNumberValue('cuota'),
                  }}
                  inputHtmlProps={{
                    min: 1,
                    max: 12,
                  }}

                />
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      </React.Fragment>
      );
      //----------------------------------------- 2 -----------------------------------
      case 1:
        return (
          <React.Fragment>

              { this.state.item.retifica === 'S'
                ?
                (<div style={{ color:'#e99c2a' }}>
                  <div><strong>Rectificación de la declaración N° { this.state.item.nroDeclaracionAnt } </strong></div>
                  <div><strong>Importe anterior: $ { this.state.item.importeAnterior } </strong></div>
                </div>)
                : this.state.item.anticipo === 'S'
                  ? (<div style={{ color:'#e99c2a' }}>
                      <div><strong>Declaración de Anticipo</strong></div>
                    </div>)
                  : '' }

            <Card className={classes.fieldsContainer}>
              <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12}>
                        <CustomInput
                          labelText="Mínimo"
                          id="minimo"
                          formControlProps={{
                            fullWidth: false
                          }}
                          inputProps={{
                            required: true,
                            ...this.props.bindNumberValue('minimo'),
                            type: "number",
                            onBlur: this.handleOnBlurAlicuotaMinimo.bind(this),
                          }}
                        />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12}>
                        <CustomInput
                          labelText="Alícuota"
                          id="alicuota"
                          formControlProps={{
                            fullWidth: false
                          }}
                          inputProps={{
                            required: true,
                            ...this.props.bindNumberValue('alicuota'),
                            type: "number",
                            onBlur: this.handleOnBlurAlicuotaMinimo.bind(this),
                          }}
                        />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12}>
                      <CustomInput
                        labelText="Valor"
                        id="valor"
                        formControlProps={{
                          fullWidth: false
                        }}
                        inputProps={{
                          required: true,
                          ...this.props.bindNumberValue('valor'),
                          type: "number",
                          onBlur: this.handleOnBlurValor.bind(this),
                        }}
                      />
                    </GridItem>
                  </GridContainer>
              </CardBody>
            </Card>
          </React.Fragment>
      );
      //----------------------------------------- 3 -----------------------------------
      case 2:
      case 3:
        return (
          <React.Fragment>
            <Typography variant="h6" gutterBottom>

            </Typography>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem xs={6} sm={3}>
                    <TextField
                      id="nroDeclaracion"
                      label="Nro. Declaración"
                      className={classes.textField}
                      value={this.props.getItemValue('nroDeclaracion')}
                      margin="normal"
                    />
                  </GridItem>
                  <GridItem xs={6} sm={3}>
                    <InputLabel style={{float:'left'}}>Fecha</InputLabel>
                    <Datetime
                      timeFormat={false}
                      dateFormat={"DD/MM/YYYY"}
                      inputProps={{
                        required: true,
                        disabled: this.desahabilitarFecha()
                      }}
                      locale="es-ES"
                      {...this.props.bindDateValue('fecha')}
                    />
                  </GridItem>
                  <GridItem xs={6} sm={3}>
                    <TextField
                      id="tipoDeclaracion"
                      label="Tipo de Declaración"
                      className={classes.textField}
                      value={
                        tiposDeclaraciones.filter(item =>item.tipoDeclaracion == this.props.getItemValue('tipoDeclaracion')).map(item => item.descripcion)}
                      margin="normal"
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={6} sm={3}>
                    <TextField
                      id="anio"
                      label="anio"
                      className={classes.textField}
                      value={this.props.getItemValue('anio')}
                      margin="normal"
                    />
                  </GridItem>

                  <GridItem xs={6} sm={3}>
                    <TextField
                      id="cuota"
                      label="Cuota"
                      className={classes.textField}
                      value={this.props.getItemValue('cuota')}
                      margin="normal"
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>


                {
                  this.props.getItemValue('rectificacion') === 'S'
                  ?
                  (
                    <Card>
                      <CardBody>
                        <GridContainer>
                              <GridItem xs={6} sm={3}>
                                <TextField
                                  id="rectificacion"
                                  label="Rectificación"
                                  className={classes.textField}
                                  value={this.props.getItemValue('rectificacion')}
                                  margin="normal"
                                />
                              </GridItem>

                              <GridItem xs={6} sm={3}>
                                <TextField
                                  id="nroDeclaracionRec"
                                  label="Nro. Rectificación"
                                  className={classes.textField}
                                  value={this.props.getItemValue('nroDeclaracionRec')}
                                  margin="normal"
                                />
                              </GridItem>

                              <GridItem xs={6} sm={3}>
                                <TextField
                                  id="importeAnterior"
                                  label="Importe Anterior"
                                  className={classes.textField}
                                  value={this.props.getItemValue('importeAnterior')}
                                  margin="normal"
                                />
                              </GridItem>
                        </GridContainer>
                      </CardBody>
                    </Card>)
                  : ''
                }

                  {
                    this.props.getItemValue('anticipo') === 'S'
                    ?
                    (
                      <Card>
                        <CardBody>
                          <GridContainer>
                              <GridItem xs={6} sm={3}>
                                <TextField
                                  id="anticipo"
                                  label="Anticipo"
                                  className={classes.textField}
                                  value={this.props.getItemValue('anticipo')}
                                  margin="normal"
                                />
                              </GridItem>

                              <GridItem xs={6} sm={3}>
                                <TextField
                                  id="nroDeclaracionAnt"
                                  label="Nro. Anticipo"
                                  className={classes.textField}
                                  value={this.props.getItemValue('nroDeclaracionAnt')}
                                  margin="normal"
                                />
                              </GridItem>

                              <GridItem xs={6} sm={3}>
                                <TextField
                                  id="importeAnterior"
                                  label="Importe Anterior"
                                  className={classes.textField}
                                  value={this.props.getItemValue('importeAnterior')}
                                  margin="normal"
                                />
                              </GridItem>
                          </GridContainer>
                        </CardBody>
                      </Card>
                  ) : ''
                }

              <Card>
                <CardBody>
                    <GridContainer>
                        <GridItem xs={6} sm={3}>
                          <TextField
                            id="valor"
                            label="Valor"
                            className={classes.textField}
                            value={this.props.getItemValue('valor')}
                            margin="normal"
                          />
                        </GridItem>

                        <GridItem xs={6} sm={3}>
                          <TextField
                            id="importeFijo"
                            label="Importe Fijo"
                            className={classes.textField}
                            value={this.props.getItemValue('importeFijo')}
                            margin="normal"
                          />
                        </GridItem>

                        <GridItem xs={6} sm={3}>
                          <TextField
                            id="minimo"
                            label="Mínimo"
                            className={classes.textField}
                            value={this.props.getItemValue('minimo')}
                            margin="normal"
                          />
                        </GridItem>
                </GridContainer>
                <GridContainer>
                        <GridItem xs={6} sm={3}>
                          <TextField
                            id="alicuota"
                            label="Alícuota"
                            className={classes.textField}
                            value={this.props.getItemValue('alicuota')}
                            margin="normal"
                          />
                        </GridItem>

                        <GridItem xs={6} sm={3}>
                          <TextField
                            id="importe"
                            label="Importe"
                            className={classes.textField}
                            value={this.props.getItemValue('importe')}
                            margin="normal"
                          />
                        </GridItem>

                        <GridItem xs={6} sm={3}>
                          <TextField
                            id="retenciones"
                            label="Retenciones"
                            className={classes.textField}
                            value={this.props.getItemValue('retenciones')}
                            margin="normal"
                          />
                        </GridItem>
                    </GridContainer>

                    <GridContainer>
                        <GridItem xs={6} sm={3}>
                          <TextField
                            id="saldo"
                            label="Saldo"
                            className={classes.textField}
                            value={this.props.getItemValue('saldo')}
                            margin="normal"
                          />
                        </GridItem>

                        <GridItem xs={6} sm={3}>
                          <TextField
                            id="saldoAfavor"
                            label="Saldo a Favor"
                            className={classes.textField}
                            value={this.props.getItemValue('saldoAfavor')}
                            margin="normal"
                          />
                        </GridItem>

                        <GridItem xs={6} sm={3}>
                          <TextField
                            id="neto"
                            label="Neto"
                            className={classes.textField}
                            value={this.props.getItemValue('neto')}
                            margin="normal"
                          />
                        </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
        </React.Fragment>
      );

      default:
        return 'Unknown stepIndex';
    }
  }


  nextStep(e){
    this.setState({
      ...this.state,
      activeStep : this.state.activeStep + 1,
    });
  }

  handleNext = () => {
    this.props.onChangeStep(this.state.activeStep, this.nextStep);
  };

  handleBack = () => {
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
    this.props.handleFin();
  }
  render() {
    const { classes } = this.props;
    const steps = this.getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
          {this.state.activeStep === steps.length ? (
            <div>
              <div className={classes.instructions}>{this.getStepContent(activeStep)}</div>
                <Button
                  onClick={this.handleFin}
                  className={classes.backButton}
                >
                  Volver
                </Button>
              <Button onClick={this.props.handleDescargar}>descargar</Button>
            </div>
          ) : (
            <div>

                {this.getStepContent(activeStep)}

              <div>
                <Button
                  onClick={activeStep === 0 ? this.handleFin : this.handleBack}
                  className={classes.backButton}
                >
                  Volver
                </Button>
                <Button
                  variant="contained"
                  color={activeStep === steps.length - 1 ? 'secondary' : 'primary'}
                  onClick={this.handleNext}>
                  {activeStep === steps.length - 1 ? 'Confirmar' : 'Siguiente'}
                </Button>
              </div>
            </div>
          )}
      </div>
    );
  }
}
DDJJStepperForm.propTypes = {
  classes: PropTypes.any,
};
export default withStyles(styles)(DDJJStepperForm);
