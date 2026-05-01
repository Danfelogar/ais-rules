export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'windy'
  | 'unknown';

export type UnitSystem = 'metric' | 'imperial';

export interface WeatherCardProps {
  temperature: number;
  condition: WeatherCondition;
  unit: UnitSystem;
  humidity?: number | null;
  windSpeed?: number | null;
  isLoading?: boolean;
  hasError?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}
