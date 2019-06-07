
export const formatNumber = (num) => {
  return (Math.round(num * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
