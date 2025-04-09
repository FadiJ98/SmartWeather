import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

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
        <View style={{flex: 1, padding: 24}}>
            <Text>{data}</Text>
        </View>
    );
};

