export const retryRequest = (callback, dispatch) => (userId) => () => setTimeout(dispatch(callback(userId)), 5000);
export const formatDate = (d) => {
  let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};