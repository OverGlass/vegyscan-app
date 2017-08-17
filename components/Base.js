/**
 * Created by antonincarlin on 08/02/2017.
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    AsyncStorage,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import {Font} from 'exponent';
import axios from 'axios';

import Swiper from 'react-native-swiper'

import BarcodeScanner from '../containers/BarcodeScanner';
import VegyList from '../containers/VegyList';
import EvalForm from '../components/EvalForm';
import Login from '../containers/Login';
import Profil from './Profil';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUserData, getUserNotes} from '../actions'

class Base extends React.Component {
    swiper = {};
    constructor(props){
        super(props);
        this.state = {
            fontLoaded: false,
            isLogged : false,
            checkLoggin: false,
            token: null,
            userData:null,
            eval : false,
            index : 0
        }
    }
    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
  }

    getToken(){
            AsyncStorage.getItem('user')
                .then((res) => {
                    let tokenObj = JSON.parse(res);
                    console.log(tokenObj)
                    this.setState({ isLogged: true, checkLoggin: true, token: tokenObj });
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokenObj.token
                    this.props.getUserData(tokenObj.id)
                })
                .catch((err) => {
                    console.log('getItem', err.message)
                    this.setState({ isLogged: false, checkLoggin: true });
                    console.log('check3')
                } )
        //     let tokenObj = {}
        //       if (token !== null){
        //           tokenObj = JSON.parse(token)
        //           console.log(tokenObj)

        //           console.log('check1')
                  
        //           this.setState({ isLogged: true, checkLoggin:true, token:tokenObj });
        //           axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokenObj.token;

        //       } 
        //         console.log('check2')
        //       this.setState({checkLoggin:true});
        // } catch (err){
        //     console.log('getItem',err.message)
        //     this.setState({ isLogged: false, checkLoggin:true });
        //     console.log('check3')
        // }
        // if(this.state.token !== null && this.state.token.id){
        //     this.props.getUserData(this.state.token.id)
        // }
    }
    async componentDidMount() {
        this.getToken();
        await Font.loadAsync({
            'Ubuntu-B': require('../assets/fonts/Ubuntu-B.ttf'),
            'Ubuntu-M': require('../assets/fonts/Ubuntu-M.ttf'),
            'Ubuntu-R': require('../assets/fonts/Ubuntu-R.ttf'),
        });

        this.setState({ fontLoaded: true });
    }
    componentWillMount(){
        this.getToken();
         UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }


    componentWillReceiveProps(NextProps){
        console.log(NextProps);
        if (this.props.vegy[0] != NextProps.vegy[0]) {
            if (NextProps.vegy[0].fields) {
                this.setState({ eval: true })
            } else if (NextProps.vegy[0].nomCommun) {
                this.setState({ eval: false })
            }
        }
    if (NextProps.evalInfo.evalEnd && NextProps.vegy[0].fields) {
        // On actualise les notes
        this.props.getUserNotes(this.state.userData.id);
        this.setState({ eval: false })
        this.swiper.scrollBy(1);

        } 
        //On identifie l'utilisateur
    if (NextProps.Access && this.state.token == null) this.getToken();
    if (NextProps.Access.login != this.props.Access.login && NextProps.Access.login == false) {
        console.log('coucoucocucoucou')
            this.setState({isLogged : false, token : null, userData : null})
    }


        //On récupère les info utilisateurs
        if(NextProps.Access.username && this.state.userData == null){
            let obj = NextProps.Access;
            obj.etablissement = this.state.token.etablissement;
            this.setState({ userData: obj });
            console.log(obj)
        } 

    }
    renderLogin(){
        return(<Login />)
    }

    renderApp(){
        return (
                <Swiper
                    style={styles.wrapper}
                    ref={component => this.swiper = component}
                    loop={false}
                    showsPagination={false}
                    index={1}
                    scrollEnabled = {!this.state.eval}
                >
                    {/*Liste !*/}

                    <VegyList />

                    {/*Snanner*/}
                    <BarcodeScanner user={this.state.userData} />

                    {/*Profile*/}
                    <Profil data = {{userData:this.state.userData}}/>

                </Swiper>
            );
    }


    render() {
        console.log('isLogged', this.state.isLogged);
        if(this.state.isLogged && this.state.fontLoaded && this.state.userData){
            return this.renderApp()
        } else if(this.state.checkLoggin && this.state.fontLoaded ) {
           return  this.renderLogin()
        } else {
            return (<View style={styles.slide1}><Text>loading</Text></View>)
        }
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2C3D4F'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2C3D4F'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2C3D4F'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }


});

function mapStateToProps(state) {
    // Whatever is returned will show up as props
    // Inside a book list
    return {
        Access : state.loginAccess,
        userData : state.userData,
        evalInfo : state.evalInfo,
        vegy : state.OneVegy

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getUserData,getUserNotes}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Base);

