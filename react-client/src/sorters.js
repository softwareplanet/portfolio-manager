export const _onColumnClick = (ev, column) => {
  const { projectsToShow: items, columns} = this.state;
  const newColumns = columns.slice();
  const currColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
  console.log(column);
  newColumns.forEach((newCol) => {
    if (newCol === currColumn) {
      currColumn.isSortedDescending = !currColumn.isSortedDescending;
      currColumn.isSorted = true;
    } else {
      newCol.isSorted = false;
      newCol.isSortedDescending = true;
    }
  });
  const newItems = _copyAndSort(items, currColumn.fieldName, currColumn.isSortedDescending);
  this.setState({
    columns: newColumns,
    projectsToShow: newItems
  });
};

function _copyAndSort(items, columnKey, isSortedDescending) {
  const key = columnKey;
  return items.slice(0).sort((a, b) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}