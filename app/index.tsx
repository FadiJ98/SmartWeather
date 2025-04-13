import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, FlatList, Text, View, Image, ImageBackground, Dimensions, Button, TextInput} from 'react-native';

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
    header: {
        fontSize: 40,
    },
    image: {
        width:  200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
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

function test(){
}

export default function App () {
    //console.log(navigator.geolocation.getCurrentPosition(success,error,options));
    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false); 
    const [text, setText] = useState('');
    //setText(48003);

    const getWeather = async (zipcode) => {
        console.log(zipcode.text);
        try {
            var locationApiUrl = "http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=ebVzkgYiQZd9KbWc0FLaPc3xx4mU4NCY&q=".concat(zipcode.text, "&language=en-US&details=true");
            const responseL = await fetch(locationApiUrl, {
                method: 'GET',
            });
            jsonL = await responseL.json();
            console.log(jsonL[0]);
            locationKey = jsonL[0].ParentCity.Key;
            var forecastApiUrl = "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/".concat(locationKey, "?apikey=ebVzkgYiQZd9KbWc0FLaPc3xx4mU4NCY&language=en-US&details=true&metric=false");
            const responseW = await fetch(forecastApiUrl, {
                method: 'GET',
            });
          const json = await responseW.json();
          //console.log(json[0]);
          const thedata = [json[0].Temperature.Value, json[0].Temperature.Unit, json[0].DateTime, json[0].Wind.Speed.Value,json[0].Wind.Speed.Unit, json[0].Wind.Direction.Localized, jsonL[0].ParentCity.LocalizedName]
          setData(thedata);
        }
        catch (error) {
          console.error(error);
        };
    };

    useEffect(() => {
        getWeather({text});
    }, [refetch]);


    const thedata = {data};
    //console.log(thedata);
    //const temp = thedata.data['RealFeelTemperature'].data.Value;
    return (
        <View style={styles.thewholeshit}>
            <Text style={styles.header}>{thedata.data[6]}</Text>
            <ImageBackground source={require('../assets/images/sun.png')} style={styles.image}>
                <Text style={styles.text}>{thedata.data[0]} {thedata.data[1]}</Text>
            </ImageBackground>
            <Text style={styles.text}>🕓 {thedata.data[2]}</Text>
            <Text style={styles.text}>💨 {thedata.data[3]} {thedata.data[4]} {thedata.data[5]}</Text>
            <TextInput style={{backgroundColor: 'white'}} onChangeText={newText => setText(newText)} />
            <Button text="Refresh" onPress={({text}) => setRefetch(!refetch)} />
        </View>
    );
};

