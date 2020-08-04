import React, { Component } from 'react';
import './App.css';
import { getUrls, postUrls, deleteUrl } from '../../apiCalls';
import UrlContainer from '../UrlContainer/UrlContainer';
import UrlForm from '../UrlForm/UrlForm';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: []
    }
  }

  handleDeleteUrl = (id) => {
    const foundCard = this.state.urls.find(url => url.id === id)
    const stateCopy = [...this.state.urls]
    const index = stateCopy.indexOf(foundCard)
    const spliced = stateCopy.splice(index, 1)
    this.setState({ urls: stateCopy })

    deleteUrl(id)
      // .catch(error => console.log(error))
  }

  updateUrls = () => {
    getUrls()
    .then(response => this.setState({ urls: response.urls }))
    .catch(error => console.log(error))
  }

  componentDidMount() {
    this.updateUrls()
  }

  render() {
    return (
      <main className="App">
        <header>
          <h1>URL Shortener</h1>
          <UrlForm 
            postUrls={postUrls}
            updateUrls={this.updateUrls} 
          />
        </header>
        <UrlContainer 
          urls={this.state.urls}
          handleDeleteUrl={this.handleDeleteUrl}
        />
      </main>
    );
  }
}

export default App;
