/**
 * Created by antonincarlin on 07/02/2017.
 */
import React from 'react';

import {
    StyleSheet, Text, View,
    ScrollView, Dimensions,
    ListView, Animated,
    LayoutAnimation,
    UIManager,
    Image,Platform } from 'react-native';

import Swiper from 'react-native-swiper';
import Calendar from './Calendar';
import Schemas from './Schemas';


const FlexSwiper = Animated.createAnimatedComponent(Swiper);
const HEADER_MAX_HEIGHT = 150;
const HEADER_MIN_HEIGHT = 10;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class VegyFiche extends React.Component {
    constructor(props){
        super(props);
        this.ficheToggle = this.ficheToggle.bind(this);

        this.state = {
            windowWidth:320,
            min: false,
            maxHeight:null,
            scrollY: new Animated.Value(0),
            animation: new Animated.Value(),
            wrapperStyle:{flex: 6, backgroundColor: 'transparent', paddingTop:10, padding:10, paddingBottom:0},
            ficheStyle : {flex:6, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius:5,},
            itemStyle : {color:"rgba(44,64,78,0.6)",fontFamily:'Ubuntu-B', flexDirection:"row", flex:1, lineHeight:30, fontSize:14},
            specStyle : {padding:10},

        };
    }
    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
  }

    async componentWillMount() {
        let windowWidth = Dimensions.get('window').width;
        this.setState({windowWidth: windowWidth - 20});
        this.setState({min:this.props.min});
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

        if(this.props.min){this.ficheClose()}

    }

    componentWillReceiveProps(nextProps) {
        if (this.state.min != nextProps.min) {
            this.setState({min: nextProps.min});
            this.ficheToggle();
        }
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight: event.nativeEvent.layout.height
        });
    }



    ficheOpen(){
        this.setState({
            wrapperStyle:{flex: 6, backgroundColor: 'transparent', paddingTop:10, padding:10, paddingBottom:0},
            ficheStyle: {flex:6, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius:5,},
            itemStyle:{color:"rgba(44,64,78,0.6)",fontFamily:'Ubuntu-B', flexDirection:"row", flex:1, lineHeight:30, fontSize:14},
            specStyle : {padding:10},
        })
    }

    ficheClose(){
        this.setState({
            wrapperStyle:{flex:0, height:260, backgroundColor: 'transparent', paddingTop:10, padding:10, paddingBottom:0},
            ficheStyle: {flex:6, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius:5, borderBottomWidth:5, borderBottomColor:'#68AA70',},
            itemStyle: {color:"rgba(44,64,78,0.6)",fontFamily:'Ubuntu-B', fontSize:14, flex:0},
            specStyle : {padding:10},
        });
    }


    ficheToggle(){
        let initialValue,
            finalValue;

        if(this.state.min){
            this.ficheOpen();
            
        } else {
            this.state.scrollY.setValue(0);
            setTimeout(()=>this.MyScrollView.scrollTo({y:0}),100);
            this.ficheClose();
        }
    }


    //Listes les caractéristques de la plante.
    renderList(){
        let specs = [];
        if(this.props.data.otherSpec) {
            specs = this.props.data.dataSpec.concat(this.props.data.otherSpec)
        } else {
            specs = this.props.data.dataSpec;
        }

        return specs.map((spec,index)=> {
            if (spec.content){
                return (
                    <View key={index} style={this.state.specStyle}>
                        <Text style={this.state.itemStyle}>{spec.item.toUpperCase()}</Text>
                        <Text> {spec.content}</Text>
                    </View>
                );
            }

            else {return null}
        

        });
    }



    renderImgSwip(){
        return this.props.data.imgs.map((img,index)=> {
            return (
                <View key={index} style={{backgroundColor:'#FFA959',overflow:'hidden', height:HEADER_MAX_HEIGHT,}}>
                    <Image
                        style={{flex:1}}
                        source={{uri: 'https://'+img}}
                    />
                </View>
            )
        });
    }

    schema(bool){
        if(!bool) {
            return (
                <View>
                    <Swiper
                        widthe={this.state.windowWidth - 10}
                        heighte={160} style={{borderRadius: 5}}
                        showsPagination={false}
                        showsButtons={true}
                    >

                        {/*--- Schemas Diamètre & tailles ---*/}
                       <Schemas data={this.props.data}/>


                        {/*--- MOIS DE FLEURAISON ---*/}
                        <View
                            style={{flex: 1, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center'}}>
                            <Calendar data={this.props.data.month}/>
                        </View>
                    </Swiper>
                </View>

            )
        }
    }

    renderFlexSwiper(){
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        return (
            <FlexSwiper
                            showsPagination={false}
                            activeDotColor={'#fff'}
                            autoplay={true}
                            heighte={headerHeight}
                            widthe={this.state.windowWidth}
                            style={{
                                borderTopLeftRadius:5,
                                borderTopRightRadius:5,
                                flex:0
                            }}

            >{this.renderImgSwip()}</FlexSwiper>
        )
    }

    renderHeaderImg(){
        return (
            <View style={{ borderRadius:5, backgroundColor: '#FFA959', overflow: 'hidden', height: HEADER_MAX_HEIGHT, }}>
                    <Image
                        style={{flex:1}}
                        source={{uri: 'https://' + this.props.data.imgs[0]}}
                    />
                </View>
        )
    }


    render() {
            return (
                <Animated.View style={this.state.wrapperStyle}>
                    <View style={this.state.ficheStyle} >
                        {this.state.min ? this.renderHeaderImg() : this.renderFlexSwiper()}
                        <View style={styles.wrapper2}>
                            <Text style={styles.title}>{this.props.data.nomCommun}</Text>
                            <ScrollView ref={(ScrollView)=>{this.MyScrollView = ScrollView}}
                                        style={{flex:1}}
                                        onScroll={Animated.event(
                                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                                        )}
                                        scrollEventThrottle={16}
                                        scrollEnabled={!this.state.min}
                            >

                                <View style={!this.state.min ? {flex:1}: styles.listSpec}>{this.renderList()}{this.schema(this.state.min)}</View>

                            </ScrollView>

                            {/*--- SLIDE SCHEMAS ---*/}


                        </View>
                    </View>
                </Animated.View>
            );
    }
}

const styles = StyleSheet.create({
    wrapper2: {padding:5, flex:1},
    title : {
        fontSize:24,
        fontFamily:'Ubuntu-B',
        paddingBottom:5,
        color:'#2C3D4F'

    },
    listSpec: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems:'center',

    },
    itemSpec: {
        width: 100,
        padding:0,
        margin:0
    }
});

