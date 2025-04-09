import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, FlatList, Text, View, Image, ImageBackground, Dimensions} from 'react-native';

const styles = StyleSheet.create({
    thewholeshit: {
        backgroundColor: 'lightskyblue',
        height: '100%',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'lightskyblue',
        height: '20%',
    },
    text: {
        fontSize: 30,
    },
    image: {
        width:  200,
        height: 200,
    },
});

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function success(pos){
    const crd = pos.coords;
    console.log(`${crd.latitude}`);
    console.log(`${crd.longitude}`);
}

export default function App () {
    console.log(navigator.geolocation.getCurrentPosition(success,error,options));
    const [data, setData] = useState([]);

    const getWeather = async () => {
        try {
            //const response = await fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/333697?apikey=ebVzkgYiQZd9KbWc0FLaPc3xx4mU4NCY&language=en-us&details=true&metric=true', {
            const response = await fetch('http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/333697?apikey=ebVzkgYiQZd9KbWc0FLaPc3xx4mU4NCY&language=en-US&details=true&metric=false', {
                method: 'GET',
            });
          const json = await response.json();
          console.log(json[0]['Temperature'].Value );
          console.log(json[0]['Temperature'].Value );
          const temp = json[0]['Temperature'].Value;
          const datetime = json[0].DateTime;
          setData("".concat(temp,"degrees, ",datetime));
        }
        catch (error) {
          console.error(error);
        };
    };

    useEffect(() => {
        getWeather();
    }, []);

    const logo_width = Dimensions.get('screen').width * 0.4;
    const logo_height = Dimensions.get('screen').height * 0.4;
    return (
        <View style={styles.thewholeshit}>
                  <ImageBackground source={require('../assets/images/sun.png')} style={styles.image}>
                    <Text>Inside</Text>
                  </ImageBackground>
                  <Text style={styles.text}>{data}</Text>
            </View>
    );
};

