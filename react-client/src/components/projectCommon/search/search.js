import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {SearchBox} from "office-ui-fabric-react";
import axios from "axios";
import {SearchResults} from "./searchResults";

class SearchComponent extends Component {

  state = {
    openedSearch: false,
    items: null,
    loading: false,
    searchValue: ''
  };

  componentDidMount() {
    document.getElementsByClassName('content-container')[0].addEventListener('click', () => this.setState({openedSearch: false}));
  }

  search(value) {
    this.setState({loading: true});
    axios.post('/api/v1/search', {query: value})
      .then((res) => this.state.searchValue && this.setState({items: res.data}))
      .catch((err) => this.setState({items: err}))
      .finally(() => this.setState({loading: false}))
  }

  render() {
    const {openedSearch, items, loading, searchValue} = this.state;
    return (
      <div className={'search-container'}>
        <SearchBox
          placeholder="Search"
          underlined={true}
          value={searchValue}
          onFocus={() => this.setState({openedSearch: true})}
          onChange={(newValue) => {
            this.setState({searchValue: newValue});
            if (newValue.length !== 0) this.search(newValue);
            else this.setState({items: null});
          }}
          onSearch={this.search.bind(this)}
          onEscape={() => this.setState({openedSearch: false})}
        />
        <SearchResults opened={openedSearch} items={items} loading={loading}
                       closeSearch={() => this.setState({openedSearch: false, items: null, searchValue: ''})}/>
      </div>
    )
  }
}

export const Search = connect()(SearchComponent);