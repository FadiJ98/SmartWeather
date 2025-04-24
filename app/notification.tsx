    import React from 'react';
    import { View, Text, StyleSheet } from 'react-native';

    export interface NotificationProps {
      message: string;
      time: string;
      type: 'info' | 'success' | 'warning' | 'error';
    }

    const Notification: React.FC<NotificationProps> = ({ message, time, type }) => {
      const getBackgroundColor = () => {
        switch (type) {
          case 'success': return '#4ade80';
          case 'warning': return '#facc15';
          case 'error': return '#f87171';
          case 'info':
          default: return '#60a5fa';
        }
      };

      return (
        <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        padding: 12,
        margin: 10,
        borderRadius: 10,
      },
      message: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
      },
      time: {
        fontSize: 12,
        color: '#f0f0f0',
        marginTop: 4,
      },
    });

    export default Notification;
