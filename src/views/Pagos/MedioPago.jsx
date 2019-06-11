import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

const styles = theme => ({

  item :{
    fontWeight: 'bold',
    color: '#252629',
    fontSize: '16px',
    opacity:'0.8',
  },
  itemHover:{
    border:'1px solid #c7c8cf',
    opacity:'1',
  },
  selectedItem:{
    fontWeight: 'bold',
    border:'1px solid #c7c8cf',
    fontSize: '16px',
    opacity:'1',
    webkitBoxShadow: '0px 0px 4px 3px rgb(0, 179, 209)',
    mozBoxShadow: '0px 0px 4px 3px rgb(0, 179, 209)',
    boxShadow: '0px 0px 3px 3px rgb(0, 179, 209)',

  },

});

class MedioPago extends Component {

  constructor(props){
    super(props);
    this.state = {
      hover:false,
    }
  }

  handleClick(item){
    return this.props.handleClick(item);
  }

  hoverOn = ()=>{
    this.setState({ hover: true });
  }
  hoverOff = ()=>{
    this.setState({ hover: false });
  }

  render (){

    const { item, selected, classes, icono } = this.props;
    const iconPath = "../../assets/img/"+icono;

    return (

        <Grid item xs={4} sm={2}
          onClick={() => this.handleClick(item)}
          alignItems="center"
          justify="center"
          >
            <Tooltip TransitionComponent={Zoom} TransitionProps={{ timeout: 600 }} title={item.desc_medio_pago}>
              <Card
                onMouseEnter={this.hoverOn}
                onMouseLeave={this.hoverOff}
                className={
                  selected ? classes.selectedItem : this.state.hover ? classes.itemHover : classes.item
                }>
                <CardBody>
                  <img src={iconPath} alt="Smiley face"  />
                </CardBody>
              </Card>
            </Tooltip>

        </Grid>
    )
  }
}

MedioPago.propTypes = {
  handleClick: PropTypes.func,
  classes: PropTypes.any,
  selected: PropTypes.bool,
  icono : PropTypes.string,
  item: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
  }),
};

export default withStyles(styles)(MedioPago);
