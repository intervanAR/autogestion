import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from "../../components/Card/Card.jsx";
import CardContent from '@material-ui/core/CardContent';
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";

import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

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
    const iconPath = "../../assets/img/"+icono+".png";

    return (

        <Grid item xs={4} sm={2}
          onClick={() => this.handleClick(item)}
          alignItems="center"
          justify="center"
          >
            <Tooltip TransitionComponent={Zoom} TransitionProps={{ timeout: 600 }} title={item.marca}>
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
  icono : PropTypes.oneOf(['visa','mastercard','rapipago','banelco','link']),
  item: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
  }),
};

export default withStyles(styles)(MedioPago);
