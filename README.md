# Weather Card Component

A reusable, stateless React Native component that displays current weather information in a compact, accessible card layout.

## Features

- **Stateless Design**: All weather data passed via props
- **Accessibility First**: Full screen reader support with accessibility labels
- **Dark Mode**: Automatic theme adaptation using system appearance
- **Responsive**: Works on narrow screens down to 320pt width
- **Edge Case Handling**: Proper handling of zero values, missing data, and extreme temperatures
- **Lightweight**: No external icon dependencies (uses Unicode emoji)

## Installation

Copy the `src` directory to your project. Ensure you have React Native and TypeScript set up.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `temperature` | `number` | Yes | Current temperature in degrees |
| `condition` | `WeatherCondition` | Yes | Weather condition (see types below) |
| `unit` | `'metric' \| 'imperial'` | Yes | Unit system for temperature and wind speed |
| `humidity` | `number \| null` | No | Humidity percentage (optional, defaults to `null`) |
| `windSpeed` | `number \| null` | No | Wind speed (optional, defaults to `null`) |
| `isLoading` | `boolean` | No | When true, shows loading skeleton (default: `false`) |
| `hasError` | `boolean` | No | When true, shows error fallback (default: `false`) |
| `accessibilityLabel` | `string` | No | Custom accessibility label (overrides auto-generated) |
| `testID` | `string` | No | Test identifier for automation |

### WeatherCondition

```typescript
type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'windy'
  | 'unknown';
```

## Usage

```tsx
import { WeatherCard } from './src';

const MyScreen = () => (
  <WeatherCard
    temperature={22}
    condition="sunny"
    unit="metric"
    humidity={65}
    windSpeed={12}
  />
);
```

### Loading State

```tsx
<WeatherCard
  temperature={22}
  condition="sunny"
  unit="metric"
  isLoading={true}
/>
```

### Error State

```tsx
<WeatherCard
  temperature={22}
  condition="sunny"
  unit="metric"
  hasError={true}
/>
```

## Styling

The component uses built-in styles that adapt to light/dark mode. To customize:

1. **Override styles via props** (future enhancement)
2. **Fork and modify the StyleSheet** in `WeatherCard.tsx`
3. **Wrap with your own styling component**

The default styles are defined in `WeatherCard.tsx` using `StyleSheet.create()`.

## Accessibility

All elements include accessibility labels:

- Main container aggregates weather data
- Temperature labeled as "Temperature: {value}{unit}"
- Condition icon labeled with condition name
- Humidity labeled as "Humidity: {value}%"
- Wind labeled as "Wind: {value} {unit}"

Custom labels can be provided via the `accessibilityLabel` prop.

## Edge Cases

- **Zero temperature**: Displays as `0°C` or `0°F` (not omitted)
- **Missing data**: Humidity/wind show `--` when null or undefined
- **Extreme values**: Any numeric value within JavaScript number range is supported
- **Long labels**: Text truncates gracefully on narrow screens
- **Unsupported conditions**: Unknown conditions render `❓` icon

## Testing

Run the test suite with:

```bash
npm test
# or
yarn test
```

The test suite covers:

- ✅ Complete data rendering
- ✅ Unit conversions (°C / °F)
- ✅ Condition icon mapping
- ✅ Loading state skeleton
- ✅ Error fallback UI
- ✅ Optional data handling
- ✅ Edge case values
- ✅ Snapshot regression tests
- ✅ Accessibility labels
- ✅ Dark mode styling

## File Structure

```
src/
├── components/
│   ├── WeatherCard.tsx
│   └── __tests__/
│       └── WeatherCard.test.tsx
├── types/
│   └── weather.ts
└── index.ts
```
