import React from 'react';
import { Components } from 'exponent';


import { MessageBar, MessageBarManager} from 'react-native-message-bar';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@exponent/vector-icons';
import Tag from './Tag'

import {getVegies, isFetching, tags as alltags} from '../actions'

const VERT = '#68AA70';
const ORANGE = '#FFA959';

class SearchBar extends React.Component  {

    constructor(props) {
        super(props);
        
        this.state = {
            query: '',
            tags: []
        }
    }

componentWillMount() {
    this.setState({tags : this.props.tags || []})
}

componentDidMount() {
  // Register the alert located on this master page
  // This MessageBar will be accessible from the current (same) component, and from its child component
  // The MessageBar is then declared only once, in your main component.
  MessageBarManager.registerMessageBar(this.refs.alert);
}

componentWillUnmount() {
  // Remove the alert located on this master page from the manager
  MessageBarManager.unregisterMessageBar();
}

    componentWillReceiveProps(nextprops){
        if(nextprops.search !== this.props.search) {
            if( nextprops.search.tagId || nextprops.search.tagId ===  0){
                this.props.isFetching();
                //On enleve de l'objet le tag en question
                let newTags = this.state.tags;
                newTags.splice(nextprops.search.tagId, 1);
                this.props.alltags(newTags);
                this.setState({tags : newTags});
                this.getVegies();
            }
        }
    }

    getVegies(){
        let newObj = {};
        let chiffres = ['un', 'deux' , 'trois', 'quatre', 'cinq']
        for (let i = 0; i <= 4; i++){
            newObj[chiffres[i]] = this.state.tags[i] || '';
        }
        this.props.getVegies(newObj)
    }

    _onSubmitTags(){
        newTags = this.state.tags;
        if(newTags.length ===  5 ) {
            MessageBarManager.showAlert({
                title: 'Ouups',
                message: '5 critères maximum',
                alertType: 'info',
                stylesheetInfo : { backgroundColor : '#FFA959', strokeColor : '#FFA959' }, // Default are blue colors
                viewTopInset : 20, // Default is 0
            });
            return;
        }
        if(this.state.query.length > 0 && this.state.query !== ' '){
            this.props.isFetching();
            newTags.push(this.state.query);
            this.props.alltags(newTags)
            this.setState({ tags: newTags })
        }

        this.setState({query : ''})
        this.getVegies();

    }


    renderTags(){
        return this.state.tags.map((title, id)=> {
            return <Tag key={id} tagInfo={{title, id}} />
        })
    }

    render(){
        return (
            <View style={{paddingTop:30}}  >
                <View style={[Styles.InputWrapper, { borderBottomColor: this.state.loginFeedBack, }]}>
                    <TouchableOpacity onPressIn={()=>{this.refs.login.focus()}}>
                        <View style={{
                            flex:2,
                            justifyContent: 'center',
                        }}>
                           <Ionicons name="ios-search" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        ref="login"
                        style={Styles.Input}
                        onChangeText={(text)=>{this.setState({query : text})}}
                        value={this.state.query}
                        onSubmitEditing={() => this._onSubmitTags()}
                        returnKeyType={"next"}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <View  style={{padding:5,flexDirection:'row', flexWrap: 'wrap',alignItems: 'flex-start', borderBottomColor:'#FFA959', borderBottomWidth : 1,}}>{this.renderTags()}</View>
                <MessageBar ref="alert" />
            </View>

        )
    }
}


const Styles = StyleSheet.create({
    Wrapper : {
        height : 50,
        borderRadius : 5,
        borderWidth : 3,
        flexDirection : 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    Text : {
        fontFamily : 'Ubuntu-R',
        fontSize : 12
    },

    InputWrapper: {
        margin: 10,
        height:30,
        borderBottomWidth: 2,
        flexDirection:"row",
        borderColor:'#ccc'
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
})

function mapStateToProps(state) {
    // Whatever is returned will show up as props
    // Inside a book list
    return {
        search : state.search,
        tags : state.tags
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getVegies, isFetching, alltags}, dispatch);
}


export default connect(mapStateToProps,mapDispatchToProps)(SearchBar);


