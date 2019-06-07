import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    paddin:'0px',
  },
  input: {
    display: 'none',
  },
});

class NavPath extends Component {

  render (){
    const {paths, classes} = this.props;
    return (
      <div>
        <span>
          {this.props.iniPath != undefined &&
            <Button
              onClick={this.props.handleOnClickIni}
              size="small" color="primary"
              variant="outlined" href="#outlined-buttons" className={classes.button}>
              {this.props.iniPath.texto}
            </Button>
          }
        </span>
        {
          paths.map((p,index)=>{
            return (
              <span>
                <Button
                  onClick={() => this.props.handleOnClick(p)}
                  size="small" color="primary"
                  variant="outlined" href="#outlined-buttons" className={classes.button}
                  >{p.texto}
                </Button>
              </span>
            )
          })
        }
      </div>
    )
  }
}

NavPath.defaultProps = {
  paths:[],
}
NavPath.propTypes = {
  iniPath:PropTypes.object,
  paths: PropTypes.array.isRequired,
  handleOnClick:PropTypes.func.isRequired,
}
export default withStyles(styles)(NavPath);
