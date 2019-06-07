# Intervan Autogestion

## Configuration
To override default configurations, just run

```
export ENV_NAME=dev
export API_URL=http://localhost/api-rentas/rest
```

## Install dependencies
`yarn`

## Run locally
`yarn start`

## Build 

```
export BASE_URL=/autogestion/  (Setea el subdirectorio donde se ubicará la aplicacion dentro del servidor web)
npm run build
```

## Build en Windows 

```
export NODE_ENV=production
export BASE_URL=/autogestion/  (Setea el subdirectorio donde se ubicará la aplicacion dentro del servidor web)
yarn build-win
```


To do a quick manual build to existing envs:
```
bin/deploy.sh [dev|testing|prod]
```

## Deploy Autogestion en Apache
Si se quiere ubicar la applicacion en un subdirectorio de apache, agregar el siguiente archivo `.htaccess` dentro del directorio donde corre la aplicacion:

```
RewriteEngine On
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
RewriteRule ^ - [L]

# Fallback all other routes to index.html
RewriteRule ^ /[BASE_URL]/index.html [L]
```

`BASE_URL`: Nombre del directorio dentro del root de apache, igual a la variable de entorno usada en el build.

## TODO
