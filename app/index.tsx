import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, FlatList, Text, View, Image, ImageBackground, Dimensions, Button, TextInput} from 'react-native';

const stylesDay = StyleSheet.create({
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

const stylesCloudy = StyleSheet.create({
    thewholeshit: {
        backgroundColor: 'lightgrey',
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

const stylesNight = StyleSheet.create({
    thewholeshit: {
        backgroundColor: '#141a24',
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
        texColor: '#fff',
    },
    header: {
        fontSize: 40,
        fontColor: '#fff',
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
          console.log(json[0]);
          //console.log(json[0]);
          const thedata = [json[0].Temperature.Value, json[0].Temperature.Unit, json[0].DateTime, json[0].Wind.Speed.Value,json[0].Wind.Speed.Unit, json[0].Wind.Direction.Localized, jsonL[0].ParentCity.LocalizedName, json[0].IconPhrase, json[0].WeatherIcon]
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
    var thestyle = stylesDay;
    const sunIcon = require('../assets/images/sun.png');
    const cloudIcon = require('../assets/images/cloud.png');
    var theicon = sunIcon;
    if(thedata.data[8] > 32){
        thestyle = stylesNight;
    }
    else if (thedata.data[8] > 6){
        thestyle = stylesCloudy;
        theicon = cloudIcon;
    }
    else{
        thestyle = stylesDay;
    }
    console.log(thedata);
    console.log(thestyle);
    return (
        <View style={thestyle.thewholeshit}>
            <Text style={thestyle.header}>{thedata.data[6]}</Text>
            <ImageBackground source={theicon} style={thestyle.image}>
                <Text style={thestyle.text}>{thedata.data[0]} {thedata.data[1]}</Text>
            </ImageBackground>
            <Text style={thestyle.text}>🕓 {thedata.data[2]}</Text>
            <Text style={thestyle.text}>💨 {thedata.data[7]} </Text>
            <Text style={thestyle.text}>💨 {thedata.data[3]} {thedata.data[4]} {thedata.data[5]}</Text>
            <TextInput style={{backgroundColor: 'white'}} onChangeText={newText => setText(newText)} />
            <Button text="Refresh" onPress={({text}) => setRefetch(!refetch)} />
        </View>
    );
};

