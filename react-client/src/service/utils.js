export const retryRequest = (callback, dispatch) => (userId) => () => setTimeout(dispatch(callback(userId)), 5000);
export const formatDate = (d) => {
  let month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};
export const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return Array.from(map);
};

export class Paginator {
  constructor(array, pageSize = 10) {
    this.array = array;
    this.pageSize = pageSize;
  }

  getPagesCount() {
    if (this.array) {
      return Math.ceil(this.array.length / this.pageSize);
    } else {
      return 0;
    }
  }

  getCurrentPage(pageNumber) {
    return this.array ? this.array.slice(pageNumber * this.pageSize, (pageNumber + 1) * this.pageSize) : [];
  }
}
