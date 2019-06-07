import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import {NavLink} from "react-router-dom";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import PersonIcon from "@material-ui/icons/Person";

// core components
import sidebarStyle from "../../assets/jss/components/sidebarStyle.jsx";

import avatar from "../../assets/img/default-avatar.png";

import {login, logout} from '../../core/auth/auth-actions';
import * as AuthService from "../../core/auth/auth-actions";
import LoginComponent from "../../components/Login/LoginComponent"
import {getFullUrl} from "../../core/globals";

var ps;

// We've created this component so we can have a ref to the wrapper of the links that appears in our sidebar.
// This was necessary so that we could initialize PerfectScrollbar on the links.
// There might be something with the Hidden component from material-ui, and we didn't have access to
// the links, and couldn't initialize the plugin.
class SidebarWrapper extends React.Component {
	componentDidMount() {
		if (navigator.platform.indexOf("Win") > -1) {
			ps = new PerfectScrollbar(this.refs.sidebarWrapper, {
				suppressScrollX: true,
				suppressScrollY: false
			});
		}
	}

	componentWillUnmount() {
		if (navigator.platform.indexOf("Win") > -1) {
			ps.destroy();
		}
	}

	render() {
		const {className, user, links} = this.props;
		return (
			<div className={className} ref="sidebarWrapper">
				{user}
				{links}
			</div>
		);
	}
}

@connect(
	(state) => ({ // mapStateToProps
		user: state.auth.user,
		errorMessage: state.auth.errorMessage,
		loading: state.auth.loadingUser,
	}),
	(dispatch) => ({ // mapDispatchToProps
		actions: bindActionCreators({
			login,
			logout,
		}, dispatch)
	})
)
@withStyles(sidebarStyle)
export default class Sidebar extends React.Component {

	static defaultProps = {
		bgColor: "blue"
	};

	static propTypes = {
		classes: PropTypes.object.isRequired,
		bgColor: PropTypes.oneOf(["white", "black", "blue"]),
		rtlActive: PropTypes.bool,
		color: PropTypes.oneOf([
			"white",
			"red",
			"orange",
			"green",
			"blue",
			"purple",
			"rose"
		]),
		logo: PropTypes.string,
		logoText: PropTypes.string,
		image: PropTypes.string,
		routes: PropTypes.arrayOf(PropTypes.object),
		errorMessage: PropTypes.string,
		loading: PropTypes.bool,
	};

	constructor(props) {
		super(props);
		this.state = {
			openAvatar: false,
			miniActive: true,
			showLoginComponent: false,
		};
		this.activeRoute.bind(this);
		this.onLoginClick.bind(this);
		this.onCancelLoginClick = this.onCancelLoginClick.bind(this);
		this.onLogin.bind(this);
	}

	// verifies if routeName is the one active (in browser input)
	activeRoute(routeName) {
		return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
	}

	openCollapse(collapse) {
		const st = {};
		st[collapse] = !this.state[collapse];
		this.setState(st);
	}

	onLogout = () => {
		this.props.actions.logout();
		this.props.history.replace(getFullUrl('login'));
	};

	checkPermissions = (prop, user) => true;

	hasChildrenToShow = (children, user) => {
		let childrenToShow = false;
		children.map((prop) => {
			childrenToShow |= this.checkPermissions(prop, user);
		});
		return childrenToShow;
	};

	onLoginClick() {
		this.setState({showLoginComponent: true})
	}

	onCancelLoginClick() {
		this.setState({showLoginComponent: false})
	}

	onLogin = (username, password) => {
		if (this.props.actions.login)
			return this.props.actions.login(username, password)
				.then(this.onCancelLoginClick.bind(this));
	};

	render() {
		const {
			classes,
			color,
			logo,
			image,
			logoText,
			routes,
			bgColor,
			rtlActive,
			user,
			errorMessage,
			loading,
		} = this.props;
		const { showLoginComponent } = this.state;
		const itemText =
			classes.itemText +
			" " +
			cx({
				[classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
				[classes.itemTextMiniRTL]:
				rtlActive && this.props.miniActive && this.state.miniActive,
				[classes.itemTextRTL]: rtlActive
			});
		const collapseItemText =
			classes.collapseItemText +
			" " +
			cx({
				[classes.collapseItemTextMini]:
				this.props.miniActive && this.state.miniActive,
				[classes.collapseItemTextMiniRTL]:
				rtlActive && this.props.miniActive && this.state.miniActive,
				[classes.collapseItemTextRTL]: rtlActive
			});
		const userWrapperClass =
			classes.user +
			" " +
			cx({
				[classes.whiteAfter]: bgColor === "white"
			});
		const caret =
			classes.caret +
			" " +
			cx({
				[classes.caretRTL]: rtlActive
			});
		const photo =
			classes.photo +
			" " +
			cx({
				[classes.photoRTL]: rtlActive
			});
		const fullname = this.props.user && this.props.user.nombre;
		let userContainer = (<div></div>);
		if (AuthService.isLoggedIn()) {
			userContainer = (
				<div className={userWrapperClass}>
					<div className={photo}>
						<img src={avatar} className={classes.avatarImg} alt="..."/>
					</div>
					<List className={classes.list}>
						<ListItem className={classes.item + " " + classes.userItem}>
							<NavLink
								to={"#"}
								className={classes.itemLink + " " + classes.userCollapseButton}
								onClick={() => this.openCollapse("openAvatar")}
							>
								<ListItemText
									primary={fullname}
									secondary={
										<b
											className={
												caret +
												" " +
												classes.userCaret +
												" " +
												(this.state.openAvatar ? classes.caretActive : "")
											}
										/>
									}
									disableTypography={true}
									className={itemText + " " + classes.userItemText}
								/>
							</NavLink>
							<Collapse in={this.state.openAvatar} unmountOnExit>
								<List className={classes.list + " " + classes.collapseList}>
									{/*<ListItem className={classes.collapseItem}>
									<NavLink
										to={getFullUrl('my-profile')}
										className={
											classes.itemLink + " " +
											cx({
												[" " + classes[color]]: this.activeRoute({getFullUrl('my-profile')})
											})
										}
									>
										<ListItemIcon className={classes.itemIcon} style={{top: 0}}>
											<Icon><PermIdentity/></Icon>
										</ListItemIcon>
										<ListItemText
											primary={rtlActive ? "ملفي" : "My Profile"}
											disableTypography={true}
											className={collapseItemText}
										/>
									</NavLink>
								</ListItem>*/}
									<ListItem className={classes.collapseItem} onClick={this.onLogout}>
										<NavLink
											to="#"
											className={
												classes.itemLink
											}
										>
											<ListItemIcon className={classes.itemIcon} style={{top: 0}}>
												<Icon><HighlightOffIcon/></Icon>
											</ListItemIcon>
											<ListItemText
												primary={"Logout"}
												disableTypography={true}
												className={collapseItemText}
											/>
										</NavLink>
									</ListItem>
								</List>
							</Collapse>
						</ListItem>
					</List>
				</div>
			);
		} else {
			userContainer = (
				<div className={userWrapperClass}>
					<NavLink
						to="#"
						onClick={this.onLoginClick.bind(this)}
						className={
							classes.itemLink
						}
					>
						<ListItemIcon className={classes.itemIcon} style={{top: 0}}>
							<Icon><PersonIcon/></Icon>
						</ListItemIcon>
						<ListItemText
							primary={"Ingresar"}
							disableTypography={true}
							className={collapseItemText}
						/>
					</NavLink>
				</div>
			);
		}
		var links = (
			<List className={classes.list}>
				{routes.map((prop, key) => {
					if (prop.redirect) return null;
					if (prop.notShowOnMenu) return null;
					if (prop.private && !AuthService.isLoggedIn()) return null;
					if (prop.collapse) {
						if (!this.hasChildrenToShow(prop.views, user)) return null;
						const navLinkClasses =
							classes.itemLink +
							" " +
							cx({
								[" " + classes.collapseActive]: this.activeRoute(prop.path)
							});
						const itemText =
							classes.itemText +
							" " +
							cx({
								[classes.itemTextMini]:
								this.props.miniActive && this.state.miniActive,
								[classes.itemTextMiniRTL]:
								rtlActive && this.props.miniActive && this.state.miniActive,
								[classes.itemTextRTL]: rtlActive
							});
						const collapseItemText =
							classes.collapseItemText +
							" " +
							cx({
								[classes.collapseItemTextMini]:
								this.props.miniActive && this.state.miniActive,
								[classes.collapseItemTextMiniRTL]:
								rtlActive && this.props.miniActive && this.state.miniActive,
								[classes.collapseItemTextRTL]: rtlActive
							});
						const itemIcon =
							classes.itemIcon +
							" " +
							cx({
								[classes.itemIconRTL]: rtlActive
							});
						const caret =
							classes.caret +
							" " +
							cx({
								[classes.caretRTL]: rtlActive
							});
						return (
							<ListItem key={key} className={classes.item}>
								<NavLink
									to={"#"}
									className={navLinkClasses}
									onClick={() => this.openCollapse(prop.state)}
								>
									<ListItemIcon className={itemIcon}>
										{typeof prop.icon === "string" ? (
											<Icon>{prop.icon}</Icon>
										) : (
											<prop.icon/>
										)}
									</ListItemIcon>
									<ListItemText
										primary={prop.name}
										secondary={
											<b
												className={
													caret +
													" " +
													(this.state[prop.state] ? classes.caretActive : "")
												}
											/>
										}
										disableTypography={true}
										className={itemText}
									/>
								</NavLink>
								<Collapse in={this.state[prop.state]} unmountOnExit>
									<List className={classes.list + " " + classes.collapseList}>
										{prop.views.map((prop, key) => {
											if (!this.checkPermissions(prop, user)) return null;
											const navLinkClasses =
												classes.collapseItemLink +
												" " +
												cx({
													[" " + classes[color]]: this.activeRoute(prop.path)
												});
											return (
												<ListItem key={key} className={classes.collapseItem}>
													<NavLink to={prop.path} className={navLinkClasses}>
														<ListItemIcon className={itemIcon} style={{top: 0}}>
															{typeof prop.icon === "string" ? (
																<Icon>{prop.icon}</Icon>
															) : (
																<prop.icon/>
															)}
														</ListItemIcon>
														<ListItemText
															primary={prop.name}
															disableTypography={true}
															className={collapseItemText}
														/>
													</NavLink>
												</ListItem>
											);
										})}
									</List>
								</Collapse>
							</ListItem>
						);
					}
					if (!this.checkPermissions(prop, user)) return null;
					const navLinkClasses =
						classes.itemLink +
						" " +
						cx({
							[" " + classes[color]]: this.activeRoute(prop.path)
						});
					const itemText =
						classes.itemText +
						" " +
						cx({
							[classes.itemTextMini]:
							this.props.miniActive && this.state.miniActive,
							[classes.itemTextMiniRTL]:
							rtlActive && this.props.miniActive && this.state.miniActive,
							[classes.itemTextRTL]: rtlActive
						});
					const itemIcon =
						classes.itemIcon +
						" " +
						cx({
							[classes.itemIconRTL]: rtlActive
						});
					return (
						<ListItem key={key} className={classes.item}>
							<NavLink to={prop.path} className={navLinkClasses}>
								<ListItemIcon className={itemIcon}>
									{typeof prop.icon === "string" ? (
										<Icon>{prop.icon}</Icon>
									) : (
										<prop.icon/>
									)}
								</ListItemIcon>
								<ListItemText
									primary={prop.name}
									disableTypography={true}
									className={itemText}
								/>
							</NavLink>
						</ListItem>
					);
				})}
			</List>
		);

		const logoNormal =
			classes.logoNormal +
			" " +
			cx({
				[classes.logoNormalSidebarMini]:
				this.props.miniActive && this.state.miniActive,
				[classes.logoNormalSidebarMiniRTL]:
				rtlActive && this.props.miniActive && this.state.miniActive,
				[classes.logoNormalRTL]: rtlActive
			});
		const logoMini =
			classes.logoMini +
			" " +
			cx({
				[classes.logoMiniRTL]: rtlActive,
				[classes.logoMiniSidebarMini]:
				this.props.miniActive && this.state.miniActive
			});
		const logoImg =
			classes.img +
			" " +
			cx({
				[classes.imgSidebarMini]:
				this.props.miniActive && this.state.miniActive
			});
		const logoClasses =
			classes.logo +
			" " +
			cx({
				[classes.whiteAfter]: bgColor === "white"
			});
		var brand = (
			<div className={logoClasses}>
				<a href={getFullUrl('')} className={logoMini}>
					<img src={logo} alt="logo" className={logoImg}/>
				</a>
				{logoText && <a href={getFullUrl('')} className={logoNormal}>
					{logoText}
				</a>}
			</div>
		);
		const drawerPaper =
			classes.drawerPaper +
			" " +
			cx({
				[classes.drawerPaperMini]:
				this.props.miniActive && this.state.miniActive,
				[classes.drawerPaperRTL]: rtlActive
			});
		const sidebarWrapper =
			classes.sidebarWrapper +
			" " +
			cx({
				[classes.drawerPaperMini]:
				this.props.miniActive && this.state.miniActive,
				[classes.sidebarWrapperWithPerfectScrollbar]:
				navigator.platform.indexOf("Win") > -1
			});
		return (
			<div>
				{showLoginComponent &&
					<LoginComponent
						open={showLoginComponent}
						onCancelClick={this.onCancelLoginClick}
						onLogin={this.onLogin}
						loading={loading}
						errorMessage={errorMessage}
					/>
				}
				<div ref="mainPanel">
					<Hidden mdUp implementation="css">
						<Drawer
							variant="temporary"
							anchor={rtlActive ? "left" : "right"}
							open={this.props.open}
							classes={{
								paper: drawerPaper + " " + classes[bgColor + "Background"]
							}}
							onClose={this.props.handleDrawerToggle}
							ModalProps={{
								keepMounted: true // Better open performance on mobile.
							}}
						>
							{brand}
							<SidebarWrapper
								className={sidebarWrapper}
								user={userContainer}
								links={links}
							/>
							{image !== undefined ? (
								<div
									className={classes.background}
									style={{backgroundImage: "url(" + image + ")"}}
								/>
							) : null}
						</Drawer>
					</Hidden>
					<Hidden smDown implementation="css">
						<Drawer
							onMouseOver={() => this.setState({miniActive: false})}
							onMouseOut={() => this.setState({miniActive: true})}
							anchor={rtlActive ? "right" : "left"}
							variant="permanent"
							open
							classes={{
								paper: drawerPaper + " " + classes[bgColor + "Background"]
							}}
						>
							{brand}
							<SidebarWrapper
								className={sidebarWrapper}
								user={userContainer}
								links={links}
							/>
							{image !== undefined ? (
								<div
									className={classes.background}
									style={{backgroundImage: "url(" + image + ")"}}
								/>
							) : null}
						</Drawer>
					</Hidden>
				</div>
			</div>
		);
	}
}
