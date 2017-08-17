import React from 'react';
import {Components} from 'exponent';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {deleteTag} from '../actions';

const VERT = '#68AA70';
const ORANGE = '#FFA959';

class Tag extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: false,
            color: VERT,
            backgroundColor: this.active ? ORANGE : null
        }

    }

    render(){
        return (
            <TouchableOpacity 
                onPress={() => this.props.deleteTag(this.props.tagInfo.id)} 
            >
                {/* WRAPPER */}
                <View style={[Styles.Wrapper, { borderColor: this.state.color, backgroundColor: this.state.backgroundColor }]} >
                    {/* TITLE */}
                    <Text style={[Styles.Text, { color: this.state.color }]} >{this.props.tagInfo.title}</Text>
                    {/* CROIX */}
                    <Text style={[Styles.Text, { color: this.state.color, paddingLeft:10, fontFamily: "Ubuntu-B" }]}>X</Text>
                </View>
            </TouchableOpacity>
        )
    }
}


const Styles = StyleSheet.create({
    Wrapper : {
        height : 40,
        borderRadius : 5,
        borderWidth : 2,
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex:0,
        padding:5,
        margin:5,
    },

    Text : {
        fontFamily : 'Ubuntu-R',
        fontSize : 12
    }
})




function mapDispatchToProps(dispatch) {
    return bindActionCreators({deleteTag}, dispatch);
}


export default connect(null,mapDispatchToProps)(Tag);


