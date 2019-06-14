import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import GridItem from "../../components/Grid/GridItem.jsx";
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
  subtitle : {
    marginTop:'20px',
    fontSize: '18px',
  },
  detContent : {
    padding:20,
  },
  headContent : {
    paddingBottom:20,
  },
  mainComp:{
    border: '1px solid #aeaeae',
    borderRadius: '3px',
    padding: '5px',
  },
  head : {
    borderBottom:'1px solid #aeaeae',
  }

});

@withStyles(styles)
export default class ComprobantePago extends Component {

  static propTypes = {
    classes: PropTypes.any,
    titulo: PropTypes.isRequired,
    fecha: PropTypes.isRequired,
    hora: PropTypes.isRequired,
    transaccion: PropTypes.isRequired,
    usuario: PropTypes.isRequired,
    importe: PropTypes.isRequired,
    medioPago: PropTypes.isRequired,
    estado: PropTypes.isRequired,
  };

  render (){
    const { classes, titulo, fecha, hora, transaccion, usuario, importe, medioPago, estado } = this.props;
    return (
        <Grid container justify="center">
          <Grid item xs={12} sm={6}>
            <div className={classes.mainComp}>
                <div className={classes.head}>
                  <Grid container justify="center">
                    <Grid className={classes.headContent} item xs={12} sm={12}>
                      <Typography gutterBottom variant="caption">Sistema de Pago en Línea</Typography>
                      <Typography gutterBottom variant="headline">{titulo}</Typography>
                    </Grid>
                  </Grid>

                  <Grid  container justify="center">
                    <Grid item xs={4} sm={4}>
                      <Typography gutterBottom variant="body2">Fecha</Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <Typography gutterBottom variant="body2">Hora</Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <Typography gutterBottom variant="body2">Transacción</Typography>
                    </Grid>
                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={4} sm={4}>
                      <Typography gutterBottom variant="body2">{fecha}</Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <Typography gutterBottom variant="body2">{hora}</Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <Typography gutterBottom variant="body2">{transaccion}</Typography>
                    </Grid>
                  </Grid>
                </div>


                <Grid  className={classes.detContent} container justify="center">
                  <Grid  justify="flex-start" container sm={8} xs={8}>
                    <Grid className={classes.detItem} item>
                      <Typography gutterBottom variant="body1">Usuario</Typography>
                    </Grid>
                  </Grid>
                  <Grid  container justify="center" sm={4} xs={4}>
                    <Grid item>
                      <Typography gutterBottom variant="body1">{usuario}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.detContent} container justify="center">
                  <Grid justify="flex-start" container  sm={8} xs={8}>
                    <Grid item>
                      <Typography gutterBottom variant="body1">Por un importe de</Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="center" sm={4} xs={4}>
                    <Grid item>
                      <Typography gutterBottom variant="body1">$ {importe}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.detContent} container justify="center">
                  <Grid justify="flex-start" container sm={8} xs={8}>
                    <Grid item>
                      <Typography gutterBottom variant="body1">Medio de Pago</Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="center" sm={4} xs={4}>
                    <Grid item>
                      <Typography gutterBottom variant="body1">{medioPago}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.detContent} container justify="center">
                  <Grid justify="flex-start" container xs={8} sm={8}>
                    <Grid item>
                      <Typography gutterBottom variant="body1">Estado</Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="center" xs={4} sm={4}>
                    <Grid item>
                      <Typography gutterBottom variant="body1">{estado}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
            </div>
          </Grid>
        </Grid>
    )
  }
}
