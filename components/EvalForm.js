/**
 * Created by antonincarlin on 14/02/2017.
 */
import React from 'react';
import {StyleSheet, Text, ScrollView, View, TextInput, TouchableOpacity, Dimensions, DeviceEventEmitter, KeyboardAvoidingView, AsyncStorage } from 'react-native';
    
import { Fields, reduxForm } from 'redux-form/immutable';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import Calendar from './Calendar';
import {sendEval} from '../actions';

const BUTTON_TEXT_FIRST = "J'ai terminé";
const BUTTON_TEXT_SECOND = "Envoyer";
const VERT = '#68AA70';
const ORANGE = '#FFA959';


class EvalForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            allFields : {},
            buttonActive: false,
            buttonColor: VERT,
            buttonText:BUTTON_TEXT_FIRST,
        }
    }
    updateState(objName, objOri, name, myValue){
        let state = {}
        state[objName] = objOri;
        state[objName][name] = myValue;
        
        return state;
    }
    async setItem(obj, itemName, callback = null){
        try {
            await AsyncStorage.setItem(itemName, JSON.stringify(obj), callback);
        } catch (err){
            console.log('setItem', err.message)
        }
    }

    async getItem(itemName){
        try {
            return await AsyncStorage.getItem(itemName,(err, result) => {
                 return result
            });
        } catch (err){
            console.log('getItem', err.message)
        }
    }


    componentWillMount(){

        // On créé les states des inputs dynamiquement
        const fields = this.props.data.fields;
        let i;
        let returnObj = {
            allFields: {}
        };


        for(i = 0; i <= fields.length;i++){
            if(fields[i]){
                let name = fields[i].fieldName;

                returnObj.allFields[name] = {
                    text : '',
                    style : '#fff'
                };
            }
        }
        this.setState(returnObj);

        // On créé l'objet qui va contenir le state des mois du calandrier, si il existe.
        if(this.props.data.calendar){
            this.setState({calendarState:{}})
        }
           
    }

    componentWillReceiveProps(nextProps){
        //Si le Calendrier est demandé ont créé un state pour les données du calendrier
        if (this.props.data.calendar){
            this.setState({calendarState:nextProps.selectedMonths});
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
        //Si le bouton à déjà était cliqué on créé l'object à envoyer et on l'envoie.
        if (this.state.buttonActive){
            //Création du tableau contenant les champs
            let fields = this.state.allFields;
            let fieldsArray = [];
            for(let field in fields){
                if(fields.hasOwnProperty(field)){
                    fieldsArray.push({fieldName:field, fieldContent:fields[field].text})
                }
            }

            //Création du tableau contenant le calandrier.
            let calendar = this.state.calendarState;
            let monthsArray = [];
            if(this.props.data.calendar){
                calendar.map((month) =>{
                    monthsArray.push({ fieldName: month.fieldName, fieldContent: month.content ? true : false })
                })
            }

            //On créer l'Objet final à envoyer.
            let finalObject = {
                // user: this.props.user,
                // evaluation: this.props.data.idEval,
                idVeg: this.props.data.idVeg,
                fields : fieldsArray,
            }

            if (this.props.data.calendar) finalObject.calendar = monthsArray ;


            let generalObj = {};
            generalObj['key', this.props.data.idVeg] = finalObject

        
            this.getItem('allEvals').then((response) => {
                if (response == null) {
                    this.setItem(generalObj, 'allEvals', () =>{
                        this.getItem('allEvals').then((res) => {
                             this.props.sendEval(this.props.data.numScan, this.props.user, this.props.data.idEval, JSON.parse(res))
                            });
                    })
                } else {
                    generalObj = JSON.parse(response);
                    AsyncStorage.removeItem('allEvals'); // Utile ?
                    generalObj[this.props.data.idVeg] = finalObject;
                    AsyncStorage.setItem('allEvals', JSON.stringify(generalObj), () =>{
                        this.getItem('allEvals').then((res) => {
                             this.props.sendEval(this.props.data.numScan, this.props.user, this.props.data.idEval, JSON.parse(res))
                            });
                    })
                }
            });

        //Sinon on ouvre le bouton.    
        } else {
            setTimeout(() => { this._toggleButton() }, 200)
        }
    }

    
    _selectNextInput(nextField, nameField){
        let inputContent = this.state.allFields[nameField].text;

        // On change de couleur si l'input est vide        
        if (inputContent === ''){
            let newState =this.updateState('allFields',this.state.allFields,nameField,{style: ORANGE})
            this.setState(newState);
        }

        if(this.refs[nextField]){
            this.refs[nextField].focus()
            this.MyScrollView.getScrollResponder().scrollTo({ y: nextField * 50 })
        } else {
            let focusOrnot= (bool, self)=> {self.refs[nextField - 1].setNativeProps({ 'editable': bool });}
            focusOrnot(false, this);
            setTimeout(()=>{focusOrnot(true, this)},100)
            this.MyScrollView.getScrollResponder().scrollTo({ y: 0 })
        }
    }


    _onChangeText(text, name) {
        let color ='';
        if(text == ''){color = ORANGE} else {color= VERT}
        newState = this.updateState('allFields',this.state.allFields,name,{ text: text, style: color });
        this.setState(newState);
    }

    _onFocus(index){
        if(index !== 0){
            this.MyScrollView.scrollTo({ y: index*50 })
        }
    }


/** 
 *  RENDER FUNCTIONS
 */

    renderProgression(){
         return this.props.data.fields.map((field, i)=>{
            return (                
                <View key={i} ref={field.fieldName} style={{ backgroundColor: this.state.allFields[field.fieldName].style, flex: 1, height: 20, width: 50, justifyContent: 'center', alignItems: 'center', margin: 2 }}>
                    <Text>{i}</Text>
                </View>
            )
        })
    }

    renderCancelButton(){
        if(this.state.buttonActive){
            return (
                <TouchableOpacity style={[styles.button, { borderColor: VERT, marginLeft: 10, flex: 1 }]} onPress={() => { this._toggleButton() }}>
                    <Text style={{ color: VERT, fontSize: 20, fontFamily: 'Ubuntu-B' }}>X</Text>
                </TouchableOpacity>
            )
        }
    }

    renderField(){
        return this.props.data.fields.map((field, index)=>{
            return (
                <View key={index} style={[{flexDirection:"row",},styles.InputWrapper]}>
                    <TouchableOpacity onPressIn={()=>{this.refs[index].focus(true)}}>
                        <View style={{
                            flex:2,
                            justifyContent: 'center',
                        }}>
                            <Text style={styles.Label}>{field.fieldLabel.toUpperCase()}</Text>
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        ref={index}
                        blurOnSubmit={false}
                        onFocus={()=>{this._onFocus(index)}}
                        style={styles.Input}
                        onChangeText={(text)=>{this._onChangeText(text, field.fieldName)}}
                        value={this.state.allFields[field.fieldName].text}
                        returnKeyType={"next"}
                        onSubmitEditing={() => this._selectNextInput(index + 1, field.fieldName)}
                        underlineColorAndroid="transparent"
                    />
                    <View style={{ backgroundColor: 'transparent', height: 30, width: 20, justifyContent: 'center', alignItems: 'center', margin: 2 }}>
                        <Text style={{color:this.state.allFields[field.fieldName].style}}>{index}</Text>
                    </View>
                </View>
            )
        })
}

renderCalendar(data){
    if(this.props.data.calendar){
        return(<Calendar data={data} interact={true} />)
    }
}

render(){
    return(
        <View style={styles.Wrapper}>
            <Text style={styles.title}>Evaluation<Text style={{ color: "#68AA70", fontSize: 20 }}> | Vegy n°{this.props.data.idVeg}</Text></Text>

            <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                {this.renderProgression()}
            </View>
            <KeyboardAvoidingView behavior='padding' style={{ flex: 8 }}>
                <ScrollView
                    ref={(ScrollView) => { this.MyScrollView = ScrollView }}
                    scrollEnabled={true}
                    style={{ flex: 1, padding: 10 }}>
                    {this.renderField()}
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {this.renderCalendar(this.props.data.calendar)} 
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <TouchableOpacity style={[styles.button, { borderColor: this.state.buttonColor, flex: 4 }]} onPressOut={() => { this._submitButton() }}>
                            <Text style={{ color: this.state.buttonColor, fontSize: 20, fontFamily: 'Ubuntu-B' }}>{this.state.buttonText}</Text>
                        </TouchableOpacity>
                        {this.renderCancelButton()}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
        )
    };
}


const styles = StyleSheet.create({
    Wrapper: {
        flex:1,
        margin:10,
        borderRadius: 5,
        backgroundColor:'rgba(44,61,79,0.8)'
    },
    InputWrapper: {
        marginBottom:20,
        height:30,
        borderBottomWidth: 2,
        borderBottomColor:'#68AA70',
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
        fontSize: 24,
        fontFamily: 'Ubuntu-B',
        padding: 15,
        paddingBottom:10,
        color:'#ccc'
    },
    button: {
        borderWidth :2,
        borderRadius:5,
        marginTop:30,
        marginBottom:30,
        flex:1,
        height:70,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

function mapStateToProps(state) {
    // Whatever is returned will show up as props
    // Inside a book list
    return {
        selectedMonths : state.selectedMonths
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({sendEval}, dispatch);
}



export default connect(mapStateToProps, mapDispatchToProps)(EvalForm);