import React, { Component } from 'react';
import Header from './Commponents/Header/Headers/Header';
import { Provider } from 'react-redux';
import myStore, { persistor } from './Commponents/ReactRedux/Store/Store';
import { PersistGate } from 'redux-persist/integration/react';
import './app.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Provider store={myStore}>
                    <PersistGate loading={null} persistor={persistor}>
                        <Header />
                    </PersistGate>
                </Provider>
            </div>
        );
    }
}
export default App;
