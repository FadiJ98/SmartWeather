import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View, ImageBackground, Button, TextInput } from 'react-native';

// Style type = Day
const stylesDay = StyleSheet.create({
  thewholeshit: { // whole app background
    backgroundColor: 'lightskyblue',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%',
  },
  text: {
    fontSize: 40,
  },
  header: {
    fontSize: 40,
  },
  image: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Style type = cloud
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
    fontSize: 30,
  },
  header: {
    fontSize: 40,
  },
  image: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// style type = night
const stylesNight = StyleSheet.create({
  thewholeshit: {
    backgroundColor: '#141a24',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%',
  },
  text: {
    fontSize: 30,
    color: '#fff',
  },
  header: {
    fontSize: 40,
    color: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// API key
const API_KEY = 'ebVzkgYiQZd9KbWc0FLaPc3xx4mU4NCY';

export default function App() {
  const [data, setData] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [text, setText] = useState('');

  // Fetches weather data based on the entered ZIP code
  const getWeather = async (zipcode) => {
    try {
      const locationApiUrl = `https://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${API_KEY}&q=${zipcode.text}&language=en-US&details=true`;
      const responseL = await fetch(locationApiUrl);
      const jsonL = await responseL.json();

      // If city info is incorrect, the code stops
      if (!Array.isArray(jsonL) || jsonL.length === 0 || !jsonL[0].ParentCity) {
        console.warn("Invalid ZIP code or location not found.");
        return;
      }

      const locationKey = jsonL[0].ParentCity.Key;

      // this fetches the weather info
      const hourlyApiUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${API_KEY}&language=en-US&details=true&metric=false`;
      const responseW = await fetch(hourlyApiUrl);
      const json = await responseW.json();

      // if data is incorrect, this will stop
      if (!json || !json[0] || !json[0].Temperature || !json[0].Wind) {
        console.warn("Missing hourly forecast data");

        const forecastApiUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/10day/${locationKey}?apikey=${API_KEY}&language=en-US&details=true&metric=false`;
        const responseF = await fetch(forecastApiUrl);
        const jsonF = await responseF.json();
        setDailyForecast(jsonF.DailyForecasts);
        return;
      }

      // collection of weather info
      const thedata = [
        json[0].Temperature.Value,
        json[0].Temperature.Unit,
        json[0].DateTime,
        json[0].Wind.Speed.Value,
        json[0].Wind.Speed.Unit,
        json[0].Wind.Direction.Localized,
        jsonL[0].ParentCity.LocalizedName,
        json[0].IconPhrase,
        json[0].WeatherIcon
      ];
      setData(thedata);

      // Fetch 10-day forecast
      const forecastApiUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/10day/${locationKey}?apikey=${API_KEY}&language=en-US&details=true&metric=false`;
      const responseF = await fetch(forecastApiUrl);
      const jsonF = await responseF.json();
      setDailyForecast(jsonF.DailyForecasts);

    } catch (error) {
      console.error(error);
    }
  };

  // will fetch weather when refetch value changes
  useEffect(() => {
    if (text) getWeather({ text });
  }, [refetch]);

  // Fallback style and icon
  const thedata = { data };
  let thestyle = stylesDay;
  const sunIcon = require('../assets/images/sun.png');
  const cloudIcon = require('../assets/images/cloud.png');
  let theicon = sunIcon;

  // switch styles based on weather icon number
  if (thedata.data[8] > 32) {
    thestyle = stylesNight;
  } else if (thedata.data[8] > 6) {
    thestyle = stylesCloudy;
    theicon = cloudIcon;
  }

  return (
    <View style={[thestyle.thewholeshit, { paddingBottom: 150 }]}>
      {/* City Name */}
      <Text style={thestyle.header}>{thedata.data[6]}</Text>

      {/* Weather Icon & Temp */}
      <ImageBackground source={theicon} style={thestyle.image}>
        <Text style={thestyle.text}>{thedata.data[0]} {thedata.data[1]}</Text>
      </ImageBackground>

      {/* Time & Wind Info */}
      <Text style={thestyle.text}>🕓 {thedata.data[2]}</Text>
      <Text style={thestyle.text}>💨 {thedata.data[7]}</Text>
      <Text style={thestyle.text}>💨 {thedata.data[3]} {thedata.data[4]} {thedata.data[5]}</Text>

      {/* ZIP Code Input & Refresh */}
      <TextInput
        style={{ backgroundColor: 'white', width: '80%', padding: 10, marginTop: 10, alignSelf: 'center' }}
        placeholder="Enter ZIP code"
        value={text}
        onChangeText={newText => setText(newText)}
      />
      <Button title="Refresh" onPress={() => setRefetch(!refetch)} />

      {/* Daily Forecast Section */}
      {dailyForecast.length > 0 && (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, marginBottom: 10, textAlign: 'center' }}>10-Day Forecast</Text>
          <FlatList
            data={dailyForecast}
            keyExtractor={(item) => item.Date}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => {
              if (!item || !item.Temperature || !item.Temperature.Maximum || !item.Temperature.Minimum || !item.Day || !item.Night) return null;

              return (
                <View style={{
                  backgroundColor: '#ffffffaa',
                  marginBottom: 10,
                  padding: 10,
                  borderRadius: 10,
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
        </>
      )}
    </View>
  );
}
