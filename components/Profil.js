/**
 * Created by antonincarlin on 14/02/2017.
 */
import React from 'react';
import {StyleSheet, View, Text, ScrollView, AsyncStorage, TouchableOpacity} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {getUserNotes, Access} from '../actions/index';
import moment from 'moment';
import moment_l from 'moment/locale/fr.js'


const padding = 20;

class Profil extends React.Component {
    constructor(props){
        super(props);
    }

    async removeToken(){
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.clear();
            this.props.Access(false);
        } catch (err){
            console.log('removeItem',err)
        }
    }
    

    componentWillMount(){
        this.props.getUserNotes(this.props.data.userData.id);
    }


    renderLi(note, key) {
        moment.updateLocale('fr', moment_l);
        return (
            <View key={key} style={{height:140,marginLeft:10, marginRight:10, marginBottom:10}}>
                <Text style={[styles.date, {alignItems: 'center', padding:10, fontFamily:'Ubuntu-M'}]}>{moment(note.date).format('L LT')}</Text>
                <View style={{flex:3, backgroundColor:'#CCCCCC', flexDirection:'row',justifyContent: 'center',alignItems: 'center',}} >
                    <View style={{ alignItems: 'center', justifyContent: 'center',flex: 1 }} >
                        <Text style={[styles.h3, { paddingTop: 10 }]}>MIN</Text>
                        <AnimatedCircularProgress
                            size={50}
                            width={5}
                            fill={(note.min/20)*100}
                            tintColor="#68AA70"
                            backgroundColor="#3d5875"
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                        >
                        {
                                (fill) => (
                                    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.points}>{note.min}</Text>
                                    </View>
                            )
                        }
                        </AnimatedCircularProgress>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
                        <Text style={[styles.h3, { paddingTop: 10 }]}>MOY</Text>
                        <AnimatedCircularProgress
                            size={50}
                            width={5}
                            fill={(note.moyenne/20)*100}
                            tintColor="#68AA70"
                            backgroundColor="#3d5875"
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                        >
                        {
                                (fill) => (
                                    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.points}>{note.moyenne}</Text>
                                    </View>
                            )
                        }
                        </AnimatedCircularProgress>
                    </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
                        <Text style={[styles.h3, { paddingTop: 10 }]}>MAX</Text>
                        <AnimatedCircularProgress
                            size={50}
                            width={5}
                            fill={(note.max/20)*100}
                            tintColor="#68AA70"
                            backgroundColor="#3d5875"
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                        >
                        {
                                (fill) => (
                                    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.points}>{note.max}</Text>
                                    </View>
                            )
                        }
                        </AnimatedCircularProgress>
                    </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 2 }} >
                        <Text style={[styles.h3, { paddingTop: 10 }]}>MA NOTE</Text>
                        <AnimatedCircularProgress
                            size={50}
                            width={5}
                            fill={(note.note/20)*100}
                            tintColor="#68AA70"
                            backgroundColor="#3d5875"
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                        >
                        {
                                (fill) => (
                                    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.points}>{note.note}</Text>
                                    </View>
                            )
                        }
                        </AnimatedCircularProgress>
                    </View>
                    
                </View>
            </View>
        )
    }
    renderNotes(){
        if(this.props.notes instanceof Array) {
            return this.props.notes.reverse().map((note, key) =>{
                return (this.renderLi(note, key) )
            })
        } else {
           return  (
               <View style={[{justifyContent: 'center',alignItems: 'center'}]}>
                   <Text style={styles.text}>Vous n'avez pas encore de notes</Text>
               </View>
           )
        }

    }

    render(){
       function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
       return (
           <View style={styles.Wrapper}>
               <View style={styles.Header}>
                   <View style={[styles.HeaderItem, {flex:2, marginRight:5}]} >
                       <Text style={styles.text}>{capitalizeFirstLetter(this.props.data.userData.prenom) + ' ' + capitalizeFirstLetter(this.props.data.userData.nom)}</Text>
                   </View>
                   <TouchableOpacity onPress={()=>{this.removeToken()}}>
                       <View style={[styles.HeaderItem, { flex: 1 }]} >
                           <Text style={[styles.text, { fontSize: 12, fontFamily: 'Ubuntu-R', }]}>Déconnexion</Text>
                       </View>
                   </TouchableOpacity>
               </View>
               <ScrollView style={{flex:8}}>
                   {this.renderNotes()}
               </ScrollView>
        
           </View>
       );
    }
}

const styles = StyleSheet.create({
    Wrapper: {
        flex: 1,
        paddingTop:20,
        justifyContent: 'center',
        backgroundColor: '#2C3D4F',
        // flexDirection:"row"
    },
    Header: {
        height:60,
        margin:10,
        flex:0,
        flexDirection:'row'

    },
    HeaderItem: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#68AA70'
    },
    text: {
        fontSize: 24,
        fontFamily:'Ubuntu-B',
        color: '#2C3D4F'
    },

    date : {
        color: '#68AA70',
    },

    points : {
        fontFamily:'Ubuntu-B',
        fontSize:14,
        backgroundColor:'transparent',
        color:'#68AA70'
    },

    h3 : {
        fontFamily:'Ubuntu-R',
        fontSize:18,
        color:'#2C3D4F'
    }

});
function mapStateToProps(state) {
    // Whatever is returned will show up as props
    // Inside a book list
    return {
        notes : state.notes,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getUserNotes, Access}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Profil);