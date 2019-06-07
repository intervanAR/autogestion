import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import {Switch, Route, Redirect} from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// core components
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

import mainRoutes from "../routes/main";
import appStyle from "../assets/jss/layouts/appStyle";
import PrivateRoute from '../core/auth/PrivateRoute';
import PublicRoute from '../core/auth/PublicRoute';
import logo from "../assets/img/logo-small.png";

let ps;

@withStyles(appStyle)
export default class MainLayout extends React.Component {

	static propTypes = {
		classes: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			mobileOpen: false,
			miniActive: false
		};
		this.resizeFunction = this.resizeFunction.bind(this);
	}

	componentDidMount() {
		if (navigator.platform.indexOf("Win") > -1) {
			ps = new PerfectScrollbar(this.refs.mainPanel, {
				suppressScrollX: true,
				suppressScrollY: false
			});
			document.body.style.overflow = "hidden";
		}
		window.addEventListener("resize", this.resizeFunction);
	}

	componentWillUnmount() {
		if (navigator.platform.indexOf("Win") > -1) {
			ps.destroy();
		}
		window.removeEventListener("resize", this.resizeFunction);
	}

	componentDidUpdate(e) {
		if (e.history.location.pathname !== e.location.pathname) {
			this.refs.mainPanel.scrollTop = 0;
			if (this.state.mobileOpen) {
				this.setState({mobileOpen: false});
			}
		}
	}

	handleDrawerToggle = () => {
		this.setState({mobileOpen: !this.state.mobileOpen});
	};

	sidebarMinimize() {
		this.setState({miniActive: !this.state.miniActive});
	}

	resizeFunction() {
		if (window.innerWidth >= 960) {
			this.setState({mobileOpen: false});
		}
	}

	renderRoutes () {
		const componentProps = {
			headerProps: {
				sidebarMinimize: this.sidebarMinimize.bind(this),
				miniActive: this.state.miniActive,
				routes: mainRoutes,
				handleDrawerToggle: this.handleDrawerToggle,
				location: this.props.location,
			}
		};
		return (
			<Switch>
				{mainRoutes.map((prop, key) => {
					if (prop.redirect) return <Redirect from={prop.path} to={prop.pathTo} key={key}/>;
					if (prop.private) return <PrivateRoute path={prop.path} component={prop.component} key={key} componentProps={componentProps}/>;
					if (prop.public) return <PublicRoute path={prop.path} component={prop.component} key={key} componentProps={componentProps}/>;
					return <Route path={prop.path} component={prop.component} key={key}/>;
				})}
			</Switch>
		);
	}

	render() {
		const {classes, ...rest} = this.props;
		const mainPanel =
			classes.mainPanel +
			" " +
			cx({
				[classes.mainPanelSidebarMini]: this.state.miniActive,
				[classes.mainPanelWithPerfectScrollbar]:
				navigator.platform.indexOf("Win") > -1
			});
		return (
			<div className={classes.wrapper}>
				<Sidebar
					routes={mainRoutes}
					logo={logo}
					handleDrawerToggle={this.handleDrawerToggle}
					open={this.state.mobileOpen}
					color="purple"
					bgColor="white"
					miniActive={this.state.miniActive}
					{...rest}
				/>
				<div className={mainPanel} ref="mainPanel">
					{this.renderRoutes()}
				</div>
			</div>
		);
	}
}
