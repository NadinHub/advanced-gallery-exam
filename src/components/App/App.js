import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import Header from '../Header';
import FavoritePage from '../FavoritePage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art'
    };
  }

  render() {
    return (
      <Router basename='/flickr-gallery'>
        <div>
          <Header />
          <div className="app-root">
            <div className="app-header">
              <h2>Flickr Gallery</h2>
              <input className="app-input"
                onChange={event => this.setState({ tag: event.target.value })} value={this.state.tag} />
            </div>
          </div>
          <Switch>
            <Route exact path="/" component={() => <Gallery tag={this.state.tag} />} />
            <Route exact path="/favorite" component={FavoritePage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
