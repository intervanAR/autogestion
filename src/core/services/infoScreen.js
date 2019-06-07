/*
* si es pequeña retorna 'sm'
* si es mediana retorna 'xs'
* si es grande retorna 'xl'
*/
const getScreenType = () => {
  return (
    getScreenWidth() < 1024
    ? 'sm'
      : getScreenWidth() < 1280
        ? 'xs'
          : 'xl');
}

const getScreenWidth = () => {
  return window.screen.width;
}

const getScreenHeigth = () => {
  return window.screen.height;
}

const getScreenRatio = () => {
  return Math.round(window.devicePixelRatio * 100) / 100;
}

export {getScreenType, getScreenWidth, getScreenHeigth, getScreenRatio};
