import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import './index.css';
import App from './components/App';
import Welcome from './components/Welcome';
import SignIn from './components/auth/SignIn';
import Companies from './components/companies/Companies';
import reducers from './reducers';
import SignOut from './components/auth/SignOut';

const store = createStore(
	reducers,
	{
		auth: { authenticated: localStorage.getItem('token') }
	},
	applyMiddleware(reduxThunk)
);

ReactDOM.render(
	<Provider store={store}>
    	<BrowserRouter>
      		<App>
        	<Route path="/" exact component={Welcome} />
        	<Route path="/signin" exact component={SignIn}/>
			<Route path="/companies" exact component={Companies}/>
			<Route path="/signout" exact component={SignOut}/>
      	</App>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);