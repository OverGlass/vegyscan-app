/**
 * Created by antonincarlin on 14/02/2017.
 */
import React from 'react';
import {StyleSheet, Text, View,TouchableOpacity,} from 'react-native';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {getMonthsSelected} from '../actions';

class Calendar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            titleColor : this.props.interact ? '#fff' : '#000'
        }
    }

    sendObject(month, index){
        let newObj = this.state.months;
        newObj[index].content = !newObj[index].content
        this.setState({months : newObj})

        let objToSend = {
            name : month.fieldName, active : month.content
        }
        this.props.getMonthsSelected(newObj);
    }

    componentWillMount(){
        this.setState({months : this.props.data,});
        if(this.props.interact) this.props.getMonthsSelected(this.props.data);
    }

    renderMonth(){
        let self = this;
        function renderButton(month, index){
            let style = {position:'absolute',top:0,left:0,right:0,bottom:0}
            return (
                <TouchableOpacity onPress={()=>{self.sendObject(month, index)}} style={style}><View style={style}/></TouchableOpacity>
            )
        }
        return this.state.months.map((month, index) => {
            const itemClass = [styles.Item, month.content && styles.ItemActive];

            return (
                <View key={index} style={itemClass}>
                    <Text style={{fontFamily:'Ubuntu-B', color:'#fff'}}>{month.item}</Text>
                    {this.props.interact ? renderButton(month, index):null}
                </View>
            );
        });
    }

    render(){
        return(
            <View style={styles.Wrapper}>{this.renderMonth()}<Text style={{color:this.state.titleColor}}>Date(s) de floraison</Text></View>
        )
    };
}



const styles = StyleSheet.create({
    Wrapper: {
        flex:1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingLeft:12,
        paddingRight:12,
        paddingTop:5,
        width:300
    },

    Item: {
        alignItems:'center',
        backgroundColor: '#68AA70',
        height: 35,
        justifyContent: 'center',
        margin: 5,
        opacity:0.5,
        width: 50
    },

    ItemActive : {
        backgroundColor: '#467E4D',
        opacity:1
    }


});


function mapDispatchToProps(dispatch) {
    return bindActionCreators({getMonthsSelected}, dispatch);
}

export default connect(null,mapDispatchToProps)(Calendar);