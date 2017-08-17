/**
 * Created by antonincarlin on 14/02/2017.
 */
import React from 'react';
import {AsyncStorage, StyleSheet, Text, ScrollView,Image, View, TextInput, TouchableOpacity, Dimensions, DeviceEventEmitter, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
    
import { Fields, reduxForm } from 'redux-form/immutable';
import { connect } from 'react-redux';
import {loginIn, Access, setToken} from '../actions';
import {bindActionCreators} from 'redux';

const ERROR_MESSAGE_1 = "Erreur d'identification"; 
const ERROR_MESSAGE_2 = "Veuillez remplir tout les champs"; 
const VERT = '#ffffff';
const ORANGE = '#FFA959';

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login: "",
            passwd:"",
            loginFeedBack:VERT,
            passwdFeedBack:VERT,
            errorLogin: false,
            errorMessage : ERROR_MESSAGE_1
        }
    }

    async setToken(obj, itemName){
        try {
            await AsyncStorage.setItem(itemName, JSON.stringify(obj));
        } catch (err){
            console.log('setItem', err.message)
        }
    }



    componentWillReceiveProps(nextProps){
        if(nextProps.loginResponse){
            this.setState({isLoading : false})
        }
        if(nextProps.loginResponse.data){
            this.setToken(nextProps.loginResponse.data,'user');
            this.props.Access();
            this.setState({
                passwdFeedBack : VERT,
                loginFeedBack : VERT,
                errorLogin : false
            })
        } else {
            this.setState({
                passwdFeedBack : ORANGE,
                loginFeedBack : ORANGE,
                errorMessage: ERROR_MESSAGE_1,
                errorLogin : true
            })
        }
        
    }

/** 
 * INTERACT FUNCTIONS
 */

    //Send Button TOGGLE
    _toggleButton(){
        let active =  !this.state.buttonActive;
        this.setState({
            buttonActive: active,
            buttonColor: active ? ORANGE : VERT,
            buttonText: active ? BUTTON_TEXT_SECOND : BUTTON_TEXT_FIRST
        });
    }

    //Send Button SUBMIT
    _submitButton(){
        if(this.state.login !== '' && this.state.passwd !== ''){
            let obj = {
                username: this.state.login,
                password: this.state.passwd
            }
            this.setState({isLoading:true})
            this.props.loginIn(obj)
        } else {
            this.setState({
                passwdFeedBack : ORANGE,
                loginFeedBack : ORANGE,
                errorMessage: ERROR_MESSAGE_2,
                errorLogin : true
            })
        }
    }

    changeInputColor(state){
        let obj = {};
        if (this.state[state] === ''){
            obj[state + "FeedBack"] = ORANGE;
        } else if (this.state[state] != VERT) {
            obj[state + "FeedBack"] = VERT;
            this.setState({errorLogin : false})
        }
        this.setState(obj)
    }
    
    _selectNextInput(nextField){
        let inputState ="";
        if(nextField === 'passwd'){
            inputState = 'login'
            this.refs['passwd'].focus();
        } else {
            inputState = 'passwd';
            this._submitButton();
        }
        this.changeInputColor(inputState)
    }


    _onChangeText(text, name) {
        let obj = {};
        obj[name] = text;
        this.setState(obj);
        setTimeout(()=>{this.changeInputColor(name)},100);
    }



/** 
 *  RENDER FUNCTIONS
 */

render(){
    return(
        <Image source={require('../assets/img/background.jpg')} style={styles.Wrapper}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                <Text style={styles.title}>Vegy</Text><Text style={[styles.title,{ fontFamily: 'Ubuntu-R' }]}>Scan</Text>
            </View>
            <KeyboardAvoidingView behavior='padding' style={{ flex: 2 }}>
                {this.state.errorLogin ? <Text style={{color:'#fff'}} >{this.state.errorMessage}</Text> : null}
                <View style={[styles.InputWrapper, { borderBottomColor: this.state.loginFeedBack, }]}>
                    <TouchableOpacity onPressIn={()=>{this.refs.login.focus()}}>
                        <View style={{
                            flex:2,
                            justifyContent: 'center',
                        }}>
                            <Text style={styles.Label}>{"Nom d'utilisateur".toUpperCase()}</Text>
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        ref="login"
                        style={styles.Input}
                        onChangeText={(text)=>{this._onChangeText(text,'login')}}
                        value={this.state.login}
                        onSubmitEditing={() => this._selectNextInput('passwd')}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <View style={[styles.InputWrapper, {borderBottomColor:this.state.passwdFeedBack,}]}>
                    <TouchableOpacity onPressIn={()=>{this.refs.passwd.focus()}}>
                        <View style={{
                            flex:2,
                            justifyContent: 'center',
                        }}>
                            <Text style={styles.Label}>{"Mot de passe".toUpperCase()}</Text>
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        ref="passwd"
                        style={styles.Input}
                        onChangeText={(text)=>{this._onChangeText(text,'passwd')}}
                        value={this.state.passwd}
                        returnKeyType={"done"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => this._selectNextInput('submit')}
                        secureTextEntry={true}
                        underlineColorAndroid="transparent"
                    />
                </View>
 
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <TouchableOpacity style={styles.button} onPressOut={() => { this._submitButton() }}>
                        <View style={{flex:2, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: "#ffffff", fontSize: 20, fontFamily: 'Ubuntu-B' }}>LOGIN</Text>
                        </View>
                        {this.state.isLoading ?
                        <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
                            <ActivityIndicator
                                    animating={true}
                                    style={{height: 80}}
                                    color={VERT}
                                    size="large"
                                />
                        </View> : null}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Image>
        )
    };
}


const styles = StyleSheet.create({
    Wrapper: {
        flex:1,
        paddingTop:30,
        padding:20,
        width:null,
        height:null,
        resizeMode: 'cover',
        backgroundColor:'rgba(44,61,79,0.8)'
    },
    InputWrapper: {
        marginBottom:20,
        height:30,
        borderBottomWidth: 2,
        flexDirection:"row",
    },
    Input : {
        height:30,
        marginTop:0,
        margin:0,
        fontSize:12,
        paddingLeft:10,
        flex:2,
        color:'#fff',
    },
    Label : {
        color:'#ccc',
        fontFamily: 'Ubuntu-B',
        fontSize : 14,
        height:20,
        lineHeight:20
    },
    title: {
        fontSize: 37,
        fontFamily: 'Ubuntu-B',
        color:'#ccc'
    },
    button: {
        borderWidth :2,
        borderRadius:5,
        marginTop:30,
        marginBottom:30,
        flex:1,
        height:70,
        flexDirection:'row',
        borderColor: "#ffffff",
    }
});

function mapStateToProps(state) {
    // Whatever is returned will show up as props
    // Inside a book list
    return {
        loginResponse : state.loginIn,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({loginIn, Access}, dispatch);
}


export default connect(mapStateToProps,mapDispatchToProps)(Login);