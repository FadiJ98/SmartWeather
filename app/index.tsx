import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View, ImageBackground, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';

const stylesDay = StyleSheet.create({
  thewholeshit: {
    backgroundColor: 'lightskyblue',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%',
  },
  text: {
    fontSize: 24,
  },
  icontext: {
    fontSize: 30,
  },
  header: {
    fontSize: 32,
  },
  image: {
    width: 150,
    height: 150,
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
    height: '20%',
  },
  text: {
    fontSize: 24,
  },
  icontext: {
    fontSize: 30,
  },
  header: {
    fontSize: 32,
  },
  image: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const stylesNight = StyleSheet.create({
  thewholeshit: {
    backgroundColor: '#0e131b',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%',
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
  icontext: {
    fontSize: 30,
  },
  header: {
    fontSize: 32,
    color: '#fff',
  },
  image: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const API_KEY = 'OwgzpKMRAg1m9iAfRvwQp1oxE9veh7w8';

export default function App() {
  const [data, setData] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [text, setText] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  const getWeather = async (input) => {
    try {
      const isLatLong = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(input.trim());

      let locationKey = '';
      let cityName = '';

      if (isLatLong) {
        const geoUrl = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${input}`;
        const response = await fetch(geoUrl);
        const json = await response.json();

        if (!json || !json.Key) {
          console.warn("Invalid coordinates or location not found.");
          return;
        }

        locationKey = json.Key;
        cityName = json.LocalizedName;
      } else {
        const locationApiUrl = `https://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${API_KEY}&q=${input}&language=en-US&details=true`;
        const responseL = await fetch(locationApiUrl);
        const jsonL = await responseL.json();

        if (!Array.isArray(jsonL) || jsonL.length === 0 || !jsonL[0].ParentCity) {
          console.warn("Invalid ZIP code or location not found.");
          return;
        }

        locationKey = jsonL[0].ParentCity.Key;
        cityName = jsonL[0].ParentCity.LocalizedName;
      }

      const hourlyApiUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${API_KEY}&language=en-US&details=true&metric=false`;
      const forecastApiUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}&language=en-US&details=true&metric=false`;

      const responseW = await fetch(hourlyApiUrl);
      const json = await responseW.json();

      const thedata = [
        json[0].Temperature.Value,
        json[0].Temperature.Unit,
        json[0].DateTime,
        json[0].Wind.Speed.Value,
        json[0].Wind.Speed.Unit,
        json[0].Wind.Direction.Localized,
        cityName,
        json[0].IconPhrase,
        json[0].WeatherIcon
      ];
      setData(thedata);

      const responseF = await fetch(forecastApiUrl);
      const jsonF = await responseF.json();
      setDailyForecast(jsonF.DailyForecasts);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const coords = `${location.coords.latitude},${location.coords.longitude}`;
    setCurrentLocation(coords);
    getWeather(coords);
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const thedata = { data };
  let thestyle = stylesDay;
  const sunIcon = require('../assets/images/sun.png');
  const cloudIcon = require('../assets/images/cloud.png');
  const rainIcon = require('../assets/images/rain.png');
  const moonIcon = require('../assets/images/moon.png');
  let theicon = sunIcon;

  const phrase = (thedata.data[7] || '').toLowerCase();

  if (thedata.data[8] > 32 || phrase.includes('night')) {
    thestyle = stylesNight;
    theicon = moonIcon;
  } else if (phrase.includes('rain')) {
    thestyle = stylesCloudy;
    theicon = rainIcon;
  } else if (phrase.includes('cloud')) {
    thestyle = stylesCloudy;
    theicon = cloudIcon;
  }

  const extractDate = (iso) => iso?.split('T')[0] || '';
  const extractTimeZone = (iso) => iso?.split('T')[1] || '';

  return (
    <View style={[thestyle.thewholeshit, { paddingBottom: 100 }]}>
      <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
        <Text style={thestyle.header}>{thedata.data[6]}</Text>
        <ImageBackground
          source={theicon}
          style={[thestyle.image, { justifyContent: 'center', alignItems: 'center' }]}
        >
          <Text style={thestyle.icontext}>{thedata.data[0]} {thedata.data[1]}</Text>
          <Text style={thestyle.icontext}>{thedata.data[7]}</Text>
        </ImageBackground>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={thestyle.text}>📅 {extractDate(thedata.data[2])}</Text>
        <Text style={thestyle.text}>🕓 {extractTimeZone(thedata.data[2])}</Text>
        <Text style={thestyle.text}>💨 {thedata.data[3]} {thedata.data[4]} {thedata.data[5]}</Text>
      </View>

      <TextInput
        style={{
          backgroundColor: 'white',
          width: '80%',
          padding: 10,
          alignSelf: 'center',
          borderRadius: 8,
        }}
        placeholder="Enter ZIP code or coordinates (lat,long)"
        value={text}
        onChangeText={(newText) => setText(newText)}
      />

      <View style={{ width: '25%', alignSelf: 'center', marginVertical: 10 }}>
        <Button title="Search" onPress={() => getWeather(text)} />
      </View>

      {dailyForecast.length > 0 && (
        <View style={{ marginTop: 20 }}>
            <Text style={[thestyle.text, { fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }]}>
              5-Day Forecast
            </Text>
          <FlatList
            data={dailyForecast}
            horizontal
            keyExtractor={(item) => item.Date}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              if (!item || !item.Temperature || !item.Temperature.Maximum || !item.Temperature.Minimum || !item.Day || !item.Night) return null;

              return (
                <View style={{
                  backgroundColor: '#ffffffaa',
                  marginRight: 10,
                  padding: 15,
                  borderRadius: 10,
                  width: 250,
                }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.Date.split('T')[0]}</Text>
                  <Text>🌞 Day: {item.Day.IconPhrase}</Text>
                  <Text>🌜 Night: {item.Night.IconPhrase}</Text>
                  <Text>⬆️ Max: {item.Temperature.Maximum.Value}°{item.Temperature.Maximum.Unit}</Text>
                  <Text>⬇️ Min: {item.Temperature.Minimum.Value}°{item.Temperature.Minimum.Unit}</Text>
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}



