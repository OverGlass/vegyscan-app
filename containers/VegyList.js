/**
 * Created by antonincarlin on 13/02/2017.
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    Platform,
    UIManager,
    LayoutAnimation,
    ActivityIndicator
} from 'react-native';

import { Ionicons } from '@exponent/vector-icons';

const windowHeight = Dimensions.get('window').height;

import {allVegyFetch} from '../actions';

import VegyFiche from '../components/VegyFiche';
import SearchBar from './SearchBar';
import { connect } from 'react-redux';


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class VegyList extends React.Component {
    constructor(props) {
        super(props);

        this.updateListView = this.updateListView.bind(this);
        this.toggleItemEnabled = this.toggleItemEnabled.bind(this);

        this.state = {
            dataSource: ds.cloneWithRows([]),
            open : true,
            isAndroid: false,
            scrViewMove : false,
            isFetching : false
        }
    }
    componentWillMount(){
        if (Platform.OS === 'android') {
            this.setState({isAndroid:true})
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
  }

    componentWillReceiveProps(nextProps) {
        if (nextProps.Vegies !== this.props.Vegies) {
            if(nextProps.Vegies.search){
                this.updateListView(nextProps.Vegies.search);
                this.setState({isFetching : false})
            }

            if( nextProps.Vegies.isFetching){
                this.setState({isFetching : nextProps.Vegies.isFetching})
            }
        }
    }

    updateListView(items) {
        this.setState({
            dataSource: ds.cloneWithRows(items.slice())
        });
    }

   async scrollTo(posY){
        try {
            if(this.state.scrViewMove){
                await setTimeout(() => this.MyScrollView.scrollTo({ y: posY }), 500)
            }
        } catch(err) {
            console.log(err)
        }
    }


   toggleItemEnabled(item, sectionId, rowId) {
       let newItems = this.props.Vegies.search, //On récupère un objet tout neuf
           getBool = item.enabled, //On sauvegarde le booléen de fiche selectionné.
           posY; //Variable de stockage de la position du scroll en Y


       // On réinitialise le booléen de toute les fiches à false
    //    for(let i = 0; i < newItems.length; i ++){
    //        newItems[i].enabled = false; //tous fermé
    //    }

       //On inverse le booleen sauvegardé.
       newItems[rowId].enabled = !getBool;

       //on Determine la position en Y de la fiche selectionné
       if(rowId === 0) {posY = 0;} else {posY = 260 * rowId;}


       if(newItems[rowId].enabled) {
           this.setState({open:false});
            this.scrollTo(posY);
       } else {
           this.setState({open:true});
       }
       this.updateListView(newItems);

    }

     renderCloseIcon(bool){
        if(!bool) {
            return (<Ionicons name="ios-close" size={60} color="white" />)
        }
    }


    renderItem(item, sectionId, rowId) {
        const styles = {
            Wrapper: !item.enabled ? null : {height : windowHeight-30},
            Button: !item.enabled ? {position:'absolute',backgroundColor:'transparent', top:0,bottom:0,left:0,right:0} : { flex:1 },
        };

        return (
            <View style={styles.Wrapper}>
                <VegyFiche data={item} min={!item.enabled } />
                <TouchableOpacity style={styles.Button} onPress={ () => this.toggleItemEnabled(item, sectionId, rowId) }>
                    <View style={{flex:1, alignItems: 'center',backgroundColor:'transparent', justifyContent: 'center',}}>{this.renderCloseIcon(!item.enabled)}</View>
                </TouchableOpacity>
            </View>
        )
    }


    render() {

        renderListView = () => {
            if(!this.state.isFetching){
                return (
                    <ListView
                        ref={(ScrollView) => { this.MyScrollView = ScrollView }}
                        style={{ flex: 8, backgroundColor: '#2C3D4F' }}
                        dataSource={this.state.dataSource}
                        renderRow={(vegy, sectionId, rowId) => this.renderItem(vegy, sectionId, rowId)}
                        removeClippedSubviews={!this.state.isAndroid}
                        onContentSizeChange={(contentWidth, contentHeight) => { this.setState({ scrViewMove: true }) }}
                        scrollEnabled={this.state.open}
                        enableEmptySections={true}
                    />
                )
            } else {
                return (
                    <View style={{ flex: 1, backgroundColor: '#2C3D4F', justifyContent:'center', alignItems:'center' }} >
                        <ActivityIndicator
                            animating={true}
                            style={{ height: 80 }}
                            color={'#fff'}
                            size="large"
                        />
                    </View>
                )
            }
        }
        return (
            <View style={{flex:1, paddingTop: !this.state.open ? 20 : 0 ,paddingBottom:0,backgroundColor:'#2C3D4F'}}>
                 { !this.state.open || <SearchBar/>  }
                {renderListView()}
            </View>
        )
    }
}




function mapStateToProps(state) {
    // Whatever is returned will show up as props
    // Inside a book list
    return {
        allVegy : state.allvegy,
        Vegies : state.search
    };
}

export default connect(mapStateToProps)(VegyList);

