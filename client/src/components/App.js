import React from 'react';
import './App.css';
import Header from './Header';
import RTL from './rtl';


import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
	direction: 'rtl', // Both here and <body dir="rtl">
});

function App({ children }) {
	return (
		<RTL>
		<ThemeProvider theme={theme}>
			<div className="App" dir="rtl">
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Header />
					</Grid>
					<Grid item xs={12}>
						{children}
					</Grid>
				</Grid>
			</div>
		</ThemeProvider>
		</RTL>
	);
}

export default App;
