import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import Typography from '@material-ui/core/Typography';
import SvgIcon from '@material-ui/core/SvgIcon';
import Checkbox from '@material-ui/core/Checkbox';
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import { formatNumber } from "../../core/helpers";

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
  typography: {
    useNextVariants: true,
  },
});

const styles = {

  card: {
    //display:'inline-flex',
    minWidth: 275,
    width:'100%',
  },
  leftContent :{
    display:'flex',
    alignItems: 'center',
    minWidth:'60px',
    width:'0,10%',
  },
  mainContent:{
    width:'100%',
    display:'inline-flex',
  },
  detailContent:{
    width:'100%',
  },
  actions:{
    backgroundColor:'red',
  },
  rightContent:{
    display:'flex',
    alignItems: 'center',
    width:'25%',
    border: '1px solid black',
  },
  cardContent:{
    border: '1px solid black',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
  },
  cssPagar: {
    color:'white',
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  danger : {
    color: '#ff2d00',
    fontSize: '20px',
    fontFamily: 'sans-serif'
  },
  cssRoot: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
  },
  cssDeuda: {
    color: '#3f51b5',
    fontSize: '0.8125rem',
    lineHeight: '1.75',
    fontWeight: '500',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  cssCardActions:{
    display:'block',
    width:'100%',
  },
};

class CardDeuda extends Component {

  HomeIcon(props) {
    return (
      <div style={{paddingRight:'10px'}}>
        <SvgIcon {...props}>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
      </div>
    );
  }
  DetailIcon(props) {
    return (
      <div style={{paddingRight:'10px'}}>
        <SvgIcon {...props}>
          <path fill="#000000" d="M5,3C3.89,3 3,3.89 3,5V19C3,20.11 3.89,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3H5M5,5H19V19H5V5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z" />
        </SvgIcon>
      </div>
    );
  }

  handleClickDetalle = (det, id_padre, e) => {
    det.id_padre = id_padre;
    this.props.handleSeleccion(det);
  }

  render(){
    const { classes, data, deuda, importeDeuda, handleOnClickPagar } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <GridContainer container>
            <GridItem item xs={12}>
              <Typography className={classes.pos} color="textSecondary">
                <div style={{display:'inline-flex'}}>
                  {this.HomeIcon(this.props)}
                  <div>
                     {data.tipo.descripcion}
                  </div>
                </div>
              </Typography>
            </GridItem>

                {data.descripcion1 != '' &&
                  <GridItem item xs={12}>
                    <Typography variant="h6" component="h3">
                      {data.descripcion1}
                    </Typography>
                  </GridItem>
                }
                  {data.descripcion2 != '' &&
                    <GridItem item xs={12}>
                      <Typography variant="h6" component="h4">
                        {data.descripcion2}
                      </Typography>
                    </GridItem>
                  }

                    {data.total != '' &&
                      <GridItem item xs={12} sm={9}>
                        <Typography variant="h6" component="h2" color="textSecondary">
                          <span className={classes.danger}>
                            {data.tipo.detalle != undefined && data.tipo.detalle == 'res'
                              ? "Total $ "+ formatNumber(data.total)
                              : "Total $ "+ formatNumber(importeDeuda)
                            }
                          </span>
                        </Typography>
                      </GridItem>
                    }

            <GridItem item xs={12} sm={3} alignItems="center">
                <Button
                  fullWidth={true}
                  size="large"
                  className={classes.cssPagar}
                  onClick={handleOnClickPagar}
                >Pagar</Button>
            </GridItem>

            <GridItem item xs={12}>
              <Typography className={classes.pos} color="textSecondary">
                <div style={{display:'inline-flex'}}>
                  {this.DetailIcon()}
                  <div>
                    Detalle
                  </div>
                </div>
              </Typography>
            </GridItem>
              {
                data.detalle != undefined && data.detalle.map((det,index)=>{
                  return data.tipo.detalle != undefined && data.tipo.detalle === 'det'
                  ?
                    <GridItem item xs={12}>
                      <div className={classes.cssDeuda} >
                        <span onClick={() => this.props.handleCheckBox(det)}>
                          <Checkbox tabIndex={-1} disableRipple color="primary"
                            checked={deuda.includes(det)} />
                          <Button color="primary" >
                            {"$ "+ formatNumber(det.total)+" ("+det.descripcion1+" )"}
                          </Button>
                        </span>
                      </div>
                    </GridItem>
                  :
                    <GridItem item xs={12}>
                      <CardActions>
                        <Button
                          color="primary"
                          onClick={(e) => this.handleClickDetalle(det, this.props.data.id, e)}>
                          {"$ "+ formatNumber(det.total)+" ("+det.descripcion1+" )"}
                        </Button>
                      </CardActions>
                    </GridItem>
                })
              }
          </GridContainer>
        </CardContent>
      </Card>
    )
  }
}

CardDeuda.defaultProps = {
  classes : {
  },
};

CardDeuda.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardDeuda);
