import axios from 'axios';
import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import SignIn from './components/signin';
import SignUp from './components/signup';
import WatchlistPage from './components/stockwatchlistpage';
import { useHistory } from 'react-router-dom';

function App() {

  const history = useHistory();

  React.useEffect(() => {
    console.log("The token is: " + localStorage.getItem("token"));
    axios.post("http://localhost:8080/isUserAuth", {},
    {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then((resp:any) => {
      console.log("The token was valid");
      console.log("Is this true "+ resp.data.isLoggedIn);
      return resp.data.isLoggedIn ? history.push("/watchlist"): null;
    });
  }, []);

  async function logOut(){
    localStorage.removeItem("token");
    await history.push("/");
  }

  async function logIn(){
    await history.push("/watchlist");
  }

  return (
      <div className="App">
        {/* Can add a navbar here if I want */}
        <Switch>
          <Route exact path="/">
            <SignIn logIn={logIn}/>
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/watchlist">
            <WatchlistPage logOut={logOut}/>
          </Route>
        </Switch>
      </div>
  );
}

export default App;
