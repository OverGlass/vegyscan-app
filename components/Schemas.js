/**
 * Created by antonincarlin on 14/02/2017.
 */
import React from 'react';
import Svg,{Circle, Rect, G, Text} from 'react-native-svg';
import {StyleSheet, View,} from 'react-native';

const padding = 20;

export default class Schemas extends React.Component {
    constructor(props){
        super(props);

        this.data = this.props.data;
        this.diam = this.data.diametreAuSol || 'ø';
        this.taille = {
            min : this.data.hauteurMiniTailleAdulte || 'ø',
            max : this.data.hauteurMaxiTailleAdulte || 'ø'
        }

    }


    render(){
       return (
        <View style={styles.GlobalWrapper}>

            {/*----- Diamètre -----*/}
            <View style={[{flex:1, paddingLeft:padding}, styles.Center]}>
                <Svg height="150" width="100" style={styles.Center}>
                    <G origin="90, 90">
                        <Circle cx="45" cy="65" r="45" fill="#776E57"/>

                        {/*----- Valeur du Diamètre -----*/}
                        <Text
                            x="45"
                            y="49"
                            fill="#fff"
                            textAnchor="middle"
                            fontWeight='bold'
                            fontSize='24'>{this.diam + 'm'}</Text>

                        {/*----- Label du Diamètre -----*/}

                        <Text
                            x="45"
                            y="120"
                            fill="#776E57"
                            textAnchor="middle"
                            fontFamily="Ubuntu-B"
                            fontSize='16'
                        >Diamètre</Text>
                    </G>
                </Svg>
            </View>

            {/*----- Tailles MIN & MAX -----*/}
            <View style={[{flex:1, paddingRight:padding}, styles.Center]}>
                <Svg height="150" width="100" style={styles.Center}>
                    <G origin="90, 90">

                        {/*----- MIN -----*/}
                        <G origin="0,45">
                            <Rect x="0" y="60" width="40" height="45" fill="#776E57"/>

                            {/*----- Valeur MIN -----*/}
                            <Text
                                x="20"
                                y="70"
                                fill="#fff"
                                textAnchor="middle"
                                fontWeight='bold'
                                fontSize='16'>{this.taille.min}</Text>

                            {/*----- Label MIN -----*/}
                            <Text
                                x="20"
                                y="40"
                                fill="#776E57"
                                textAnchor="middle"
                                fontWeight='bold'
                                fontSize='22'>MIN</Text>
                        </G>

                        {/*----- MAX -----*/}
                        <G origin="40,45">
                            <Rect x="50" y="45" width="40" height="60" fill="#776E57"/>

                            {/*----- Valeur MAX -----*/}
                            <Text
                                x="71"
                                y="70"
                                fill="#fff"
                                textAnchor="middle"
                                fontWeight='bold'
                                fontSize='16'>{this.taille.max}</Text>

                            {/*----- Label MAX -----*/}
                            <Text
                                x="69"
                                y="27"
                                fill="#776E57"
                                textAnchor="middle"
                                fontWeight='bold'
                                fontSize='18'>MAX</Text>
                        </G>

                        {/*----- Label Taille-----*/}
                        <Text
                            x="45"
                            y="120"
                            fill="#776E57"
                            textAnchor="middle"
                            fontFamily="Ubuntu-B"
                            fontSize='16'
                        >Tailles adulte</Text>
                    </G>
                </Svg>
            </View>
        </View>
       )
    }
}

const styles = StyleSheet.create({
    GlobalWrapper: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        flex: 1,
        flexDirection: 'row',
    },

    Center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});