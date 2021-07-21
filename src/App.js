import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import ProfilePage from './components/ProfilePage';
function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/' component={SearchPage} />
          <Route path='/profile' component={ProfilePage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
