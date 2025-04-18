import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  ImageBackground,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import API_KEYS from './APIs';

// === STYLES ===
const stylesDay = StyleSheet.create({
  thewholeshit: { backgroundColor: 'lightskyblue', height: '100%' },
  container: { justifyContent: 'center', alignItems: 'center', height: '20%' },
  text: { fontSize: 24 },
  icontext: { fontSize: 30 },
  header: { fontSize: 32 },
  image: { width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
});

const stylesCloudy = StyleSheet.create({
  thewholeshit: { backgroundColor: 'lightgrey', height: '100%' },
  container: { justifyContent: 'center', alignItems: 'center', height: '20%' },
  text: { fontSize: 24 },
  icontext: { fontSize: 30 },
  header: { fontSize: 32 },
  image: { width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
});

const stylesNight = StyleSheet.create({
  thewholeshit: { backgroundColor: '#0e131b', height: '100%' },
  container: { justifyContent: 'center', alignItems: 'center', height: '20%' },
  text: { fontSize: 24, color: '#fff' },
  icontext: { fontSize: 30 },
  header: { fontSize: 32, color: '#fff' },
  image: { width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
});

export default function App() {
  const [data, setData] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [text, setText] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  // === Try all API keys until one works ===
  const fetchWithFallback = async (urlBuilder) => {
    for (let i = 0; i < API_KEYS.length; i++) {
      const key = API_KEYS[i];
      try {
        const res = await fetch(urlBuilder(key));
        if (!res.ok) throw new Error('Bad response');
        const json = await res.json();
        return json;
      } catch (err) {
        console.warn(`API key ${key} failed. Trying next...`);
      }
    }
    throw new Error('All API keys failed.');
  };

  const getWeather = async (input) => {
    try {
      const isLatLong = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(input.trim());
      let locationKey = '';
      let cityName = '';

      if (isLatLong) {
        const geoData = await fetchWithFallback(
          (key) => `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${key}&q=${input}`
        );
        if (!geoData || !geoData.Key) {
          console.warn("Invalid coordinates or location not found.");
          return;
        }
        locationKey = geoData.Key;
        cityName = geoData.LocalizedName;
      } else {
        const zipData = await fetchWithFallback(
          (key) => `https://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${key}&q=${input}&language=en-US&details=true`
        );
        if (!Array.isArray(zipData) || zipData.length === 0 || !zipData[0].ParentCity) {
          console.warn("Invalid ZIP code or location not found.");
          return;
        }
        locationKey = zipData[0].ParentCity.Key;
        cityName = zipData[0].ParentCity.LocalizedName;
      }

      const hourlyData = await fetchWithFallback(
        (key) => `https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${key}&language=en-US&details=true&metric=false`
      );

      const thedata = [
        hourlyData[0].Temperature.Value,
        hourlyData[0].Temperature.Unit,
        hourlyData[0].DateTime,
        hourlyData[0].Wind.Speed.Value,
        hourlyData[0].Wind.Speed.Unit,
        hourlyData[0].Wind.Direction.Localized,
        cityName,
        hourlyData[0].IconPhrase,
        hourlyData[0].WeatherIcon,
      ];
      setData(thedata);

      const forecastData = await fetchWithFallback(
        (key) => `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${key}&language=en-US&details=true&metric=false`
      );
      setDailyForecast(forecastData.DailyForecasts);
    } catch (error) {
      console.error('Weather fetch failed:', error.message);
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
  const locationIcon = require('../assets/images/GPS.png');

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

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          marginBottom: 10,
          gap: 8,
        }}
      >
        <TouchableOpacity onPress={fetchCurrentLocation}>
          <ImageBackground
            source={locationIcon}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TextInput
          style={{
            backgroundColor: 'white',
            width: 250,
            padding: 10,
            borderRadius: 8,
          }}
          placeholder="Enter ZIP or coordinates"
          value={text}
          onChangeText={(newText) => setText(newText)}
        />
      </View>

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
