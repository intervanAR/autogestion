import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import "react-image-gallery/styles/css/image-gallery.css";
import "react-dropzone-component/styles/filepicker.css";
import "dropzone/dist/min/dropzone.min.css";
import App from './views/AppContainer';

require("react-hot-loader/patch");
import 'babel-polyfill';
require('./core/pollyfills/Array.from');
require('./core/pollyfills/IE-console');
import "./assets/scss/autogestion.css?v=1.3.0";
import 'react-viewer/dist/index.css';
require('./assets/img/autogestionicon2.png');

if (__GLOBALS__.ENV_NAME === 'prod') {
    window.dataLayer = window.dataLayer || [];

    function gtag () {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());

    gtag('config', 'UA-114440492-2');
}

ReactDOM.render(
    <AppContainer>
        <App/>
    </AppContainer>,
    document.getElementById('root')
);
if (module.hot) module.hot.accept();
