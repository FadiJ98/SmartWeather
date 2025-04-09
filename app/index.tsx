import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, FlatList, Text, View} from 'react-native';

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
});

export default function App () {
    const [data, setData] = useState([]);

    const getWeather = async () => {
        try {
            //const response = await fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/333697?apikey=ebVzkgYiQZd9KbWc0FLaPc3xx4mU4NCY&language=en-us&details=true&metric=true', {
            const response = await fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/333697?apikey=ebVzkgYiQZd9KbWc0FLaPc3xx4mU4NCY&language=en-us&details=true&metric=false', {
                method: 'GET',
            });
          const json = await response.json();
          console.log(json['DailyForecasts'][0]/* ['Temperature']['Minimum'].Value */);
          console.log(json['DailyForecasts'][0]/* ['Temperature']['Maximum'].Value */);
          const temps = [json['DailyForecasts'][0]['Temperature']['Minimum'].Value,json['DailyForecasts'][0]['Temperature']['Maximum'].Value]
          setData("LOW: ".concat(temps[0], " HIGH: ", temps[1]));
        }
        catch (error) {
          console.error(error);
        };
    };

    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.thewholeshit}>
            <View style={styles.container}>
                <Text style={styles.text}>{data}</Text>
            </View>
        </View>
    );
};

