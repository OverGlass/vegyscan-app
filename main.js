import Exponent from 'exponent';
import React, {Component} from 'react';
import { AsyncStorage, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import axios from 'axios'
// import ReduxPromise from 'redux-promise-middleware';
import reducers from './reducers';

import Base from './components/Base';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            rehydrated: false,
            fontLoaded:false
        }
    }

    async removeToken(){
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.clear()
        } catch (err){
            console.log('removeItem',err)
        }
    }
    componentWillMount(){
        // this.removeToken();
        axios.interceptors.response.use(function (response) {
    // Do something with response data
            return response;
        }, function (error) {
                      if (error.response.status === 401) {
                          AsyncStorage.clear();
                          this.props.Access(false);
                      }
    // Do something with response error
                      return Promise.reject(error);
                      });
    }

    render(){
         return ( 
            <Provider store={createStoreWithMiddleware(reducers)}>
                <Base />
            </Provider>)
    }
}


Exponent.registerRootComponent(App);