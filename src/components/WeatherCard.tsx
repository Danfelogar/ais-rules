import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  AccessibilityRole,
} from 'react-native';
import { WeatherCardProps, WeatherCondition, UnitSystem } from '../types/weather';

const getConditionIcon = (condition: WeatherCondition): string => {
  const iconMap: Record<WeatherCondition, string> = {
    'sunny': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'rainy': '🌧️',
    'stormy': '⛈️',
    'snowy': '❄️',
    'foggy': '🌫️',
    'windy': '💨',
    'unknown': '❓',
  };
  return iconMap[condition] ?? iconMap['unknown'];
};

const LoadingSkeleton: React.FC<{ testID?: string; isDark: boolean }> = ({
  testID,
  isDark,
}) => {
  const backgroundColor = isDark ? '#2a2a2a' : '#e0e0e0';
  return (
    <View style={[styles.container, styles.skeleton, { backgroundColor }]} testID={testID}>
      <View style={[styles.temperature, { backgroundColor }]} />
      <View style={[styles.icon, { backgroundColor }]} />
      <View style={styles.details}>
        <View style={[styles.detail, { backgroundColor }]} />
        <View style={[styles.detail, { backgroundColor }]} />
      </View>
    </View>
  );
};

const ErrorFallback: React.FC<{ testID?: string; isDark: boolean }> = ({
  testID,
  isDark,
}) => {
  const textColor = isDark ? '#ff6b6b' : '#d32f2f';
  return (
    <View style={styles.container} testID={testID}>
      <Text style={[styles.icon, { color: textColor }]} accessibilityLabel="Error">
        ⚠️
      </Text>
      <Text style={[styles.errorText, { color: textColor }]} accessibilityRole="text">
        Unable to load weather data.
      </Text>
    </View>
  );
};

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  unit,
  humidity = null,
  windSpeed = null,
  isLoading = false,
  hasError = false,
  accessibilityLabel,
  testID,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Render loading state
  if (isLoading) {
    return <LoadingSkeleton testID={testID} isDark={isDark} />;
  }

  // Render error state
  if (hasError) {
    return <ErrorFallback testID={testID} isDark={isDark} />;
  }

  const icon = getConditionIcon(condition);
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  const tempString = `${temperature}${unitSymbol}`;
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';
  const humidityString = humidity !== null && humidity !== undefined
    ? `${humidity}%`
    : '--';
  const windString = windSpeed !== null && windSpeed !== undefined
    ? `${windSpeed} ${windUnit}`
    : '--';

  const autoAccessibilityLabel = accessibilityLabel ??
    `Weather: ${temperature} degrees, ${condition}, humidity ${humidityString}, wind ${windString}`;

  const containerStyle = isDark ? styles.darkContainer : styles.lightContainer;

  return (
    <View
      style={[styles.container, containerStyle]}
      accessibilityLabel={autoAccessibilityLabel}
      accessibilityRole="text"
      testID={testID}
    >
      <Text
        style={[styles.temperature, isDark ? styles.textDark : styles.textLight]}
        accessibilityLabel={`Temperature: ${tempString}`}
        accessibilityRole="text"
      >
        {tempString}
      </Text>
      <Text
        style={[styles.icon, isDark ? styles.textDark : styles.textLight]}
        accessibilityLabel={`Condition: ${condition}`}
        accessibilityRole="text"
      >
        {icon}
      </Text>
      <View style={styles.details}>
        <Text
          style={[styles.detail, isDark ? styles.textDark : styles.textLight]}
          accessibilityLabel={`Humidity: ${humidityString}`}
          accessibilityRole="text"
        >
          Humidity: {humidityString}
        </Text>
        <Text
          style={[styles.detail, isDark ? styles.textDark : styles.textLight]}
          accessibilityLabel={`Wind: ${windString}`}
          accessibilityRole="text"
        >
          Wind: {windString}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 320,
    maxWidth: '100%',
  },
  lightContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkContainer: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333333',
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    flex: 1,
  },
  icon: {
    fontSize: 48,
    marginHorizontal: 16,
    textAlign: 'center' as const,
  },
  details: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detail: {
    fontSize: 14,
    marginVertical: 2,
  },
  textLight: {
    color: '#000000',
  },
  textDark: {
    color: '#ffffff',
  },
  skeleton: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center' as const,
  },
});

export default WeatherCard;
