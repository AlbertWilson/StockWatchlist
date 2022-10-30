import * as React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import SignIn from './components/signin';
import SignUp from './components/signup';
import WatchlistPage from './components/stockwatchlistpage';


function App() {
  return (
    <Router>
      <div className="App">
        {/* Can add a navbar here if I want */}
        <div>
          <Switch>
            <Route exact path="/">
              <SignIn />
            </Route>
            <Route exact path="/signup">
              <SignUp />
            </Route>
            <Route exact path="/watchlist">
              <WatchlistPage />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App;
