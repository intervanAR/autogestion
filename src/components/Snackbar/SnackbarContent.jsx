import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Snack from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";

import snackbarContentStyle from "../../assets/jss/components/snackbarContentStyle.jsx";

function SnackbarContent({...props}) {
	const {classes, item, color, edit, close, icon, styles} = props;
	var action = [];
	const messageClasses = cx({
		[classes.iconMessage]: icon !== undefined
	});
	if (edit !== undefined) {
		action.push(
			<IconButton
				className={classes.iconButton}
				key="edit"
				aria-label="Edit"
				color="inherit"
				onClick={() => props.handleOnUpdate(item)}
			>
				<Edit className={classes.close}/>
			</IconButton>);
	}
	if (close !== undefined) {
		action.push(
			<IconButton
				className={classes.iconButton}
				key="close"
				aria-label="Close"
				color="inherit"
				onClick={() => props.handleOnRemove(item)}
			>
				<Close className={classes.close}/>
			</IconButton>);
	}
	const iconClasses = cx({
		[classes.icon]: classes.icon,
		[classes.infoIcon]: color === "info",
		[classes.successIcon]: color === "success",
		[classes.warningIcon]: color === "warning",
		[classes.dangerIcon]: color === "danger",
		[classes.primaryIcon]: color === "primary",
		[classes.roseIcon]: color === "rose"
	});
	return (
		<Snack
			style={styles}
			message={
				<div>
					{icon !== undefined ? <props.icon className={iconClasses}/> : null}
					<span className={messageClasses}>{item.message}</span>
				</div>
			}
			classes={{
				root: classes.root + " " + classes[color],
				message: classes.message
			}}
			action={<div className={classes.actionContainer}>{action}</div>}
		/>
	);
}

SnackbarContent.defaultProps = {
	color: "info"
};

SnackbarContent.propTypes = {
	classes: PropTypes.object.isRequired,
	styles: PropTypes.object,
	item: PropTypes.object.isRequired,
	color: PropTypes.oneOf([
		"info",
		"success",
		"warning",
		"danger",
		"primary",
		"rose"
	]),
	close: PropTypes.bool,
	edit: PropTypes.bool,
	icon: PropTypes.func,
	handleOnRemove: PropTypes.func,
	handleOnUpdate: PropTypes.func,
};

export default withStyles(snackbarContentStyle)(SnackbarContent);
