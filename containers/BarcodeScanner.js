import React from 'react';
import { Text, View, Image, StyleSheet,TouchableHighlight, Vibration } from 'react-native';
import { Components, Permissions } from 'exponent';
import { Ionicons } from '@exponent/vector-icons';
import VegyFiche from '../components/VegyFiche';
import EvalForm from '../components/EvalForm';
import _ from 'lodash'

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {vegyFetch, sendEval} from '../actions';

class BarcodeScanner extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            hasCameraPermission: null,
            ficheOpen:false,
            evalOpen:false,
            data:[]
        };
    }


    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});

    }

    componentWillReceiveProps(nextProps) {
        console.log('coucouc1000')
        if(this.state.data != nextProps.vegy[0] && nextProps.vegy[0]){
            if (nextProps.vegy[0].nomCommun) {
                Vibration.vibrate();
                this.setState({
                    data: nextProps.vegy[0],
                    ficheOpen: true,
                    evalOpen: false
                })
            } else if (nextProps.vegy[0].fields){
                Vibration.vibrate();
                this.setState({
                    data: nextProps.vegy[0],
                    evalOpen: true,
                    ficheOpen: false,
                })
            }
        } else if(nextProps.evalInfo){
            this.setState({
                evalOpen: false
            })
        }


    }

    render() {
                // On affiche le composant EvalForm.
        evalfiche = (bool) => {
            if(bool){
                return (
                    <View style={{flex:1}}>
                        <View style={{flex:7, paddingTop:20}}>
                            <EvalForm data={this.state.data} user = {this.props.user.id} />
                        </View>
                        <View
                            style={{ alignItems: 'center', backgroundColor:'transparent', flex:1, justifyContent: 'center'}}
                        >
                            <TouchableHighlight onPress={()=>{this.setState({evalOpen:false})}}>
                                <Ionicons name="ios-refresh-outline" size={70} color="white" />
                            </TouchableHighlight>
                        </View>
                    </View>
                )
            }

        };

        // On affiche le composant VegyFiche.
        vegyfiche = (bool) => {
            if(bool){
                return (
                    <View style={{flex:1}}>
                        <View style={{flex:7, paddingTop:20}}>
                            <VegyFiche data={this.state.data} min={false} />
                        </View>
                        <View
                            style={{ alignItems: 'center', backgroundColor:'transparent', flex:1, justifyContent: 'center'}}
                        >
                            <TouchableHighlight onPress={()=>{this.setState({ficheOpen:false})}}>
                                <Ionicons name="ios-refresh-outline" size={70} color="white" />
                            </TouchableHighlight>
                        </View>
                    </View>
                )
            }

        };

        evalInfo = () => {
            if(this.props.evalInfo.nbrVegRes){
                return (
                    <View style={Styles.footer}>
                        <Text style={Styles.title}>{this.props.evalInfo.nbrVegRes}</Text>
                    </View>
                )
            }
        }

        //On affiche les élement d'UI du QRcode
        QRui = (bool) => {
            if(!bool){
                return (
                   <View style={{flex:1}}>
                       <View style={{ alignItems: 'center', backgroundColor:'transparent', flex:5, justifyContent: 'center'}}>
                           <Ionicons name="ios-qr-scanner-outline" size={300} color="white" />
                       </View>
                       {evalInfo()}
                       <View style={[Styles.footer, {flex:2}]}>
                            <Text><Text style={Styles.title}>Vegy</Text><Text style={Styles.title2}>Scan</Text></Text>
                       </View>
                   </View>
                )
            }
        };

       // On regarde si l'a camera est activé & on affiche le scanner.
        const { hasCameraPermission } = this.state;
        if (typeof hasCameraPermission === 'null') {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{flex: 1}}>
                        <Components.BarCodeScanner onBarCodeRead={_.debounce(this._handleBarCodeRead, 500)} style={{flex:1}}>



                        </Components.BarCodeScanner>
                    <View style={{backgroundColor:'transparent', position:'absolute', top:0,bottom:0,right:0,left:0}}>
                        {QRui(this.state.ficheOpen || this.state.evalOpen)}
                        {vegyfiche(this.state.ficheOpen)}
                        {evalfiche(this.state.evalOpen)}
                    </View>
                </View>
            );
        }
    }


    _handleBarCodeRead = (data) => {
        console.log('mdr')
        if(!this.state.ficheOpen && !this.state.evalOpen){
            console.log('coucoucoucoucocucou')
            this.props.vegyFetch(data.data, this.props.user.id, this.props.user.etablissement)
            
        }
    }



}

const Styles = StyleSheet.create({
    footer: {
        flex :1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'transparent'

    },
    title: {
        color : '#fff',
        fontSize:24,
        fontFamily:'Ubuntu-R'
    },
    title2: {
        color : '#fff',
        fontSize:24,
        fontFamily:'Ubuntu-B',
    }

});

function mapStateToProps(state) {
    // Whatever is returned will show up as props
    // Inside a book list
    return {
        vegy : state.OneVegy,
        evalInfo : state.evalInfo
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({vegyFetch, sendEval}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(BarcodeScanner);