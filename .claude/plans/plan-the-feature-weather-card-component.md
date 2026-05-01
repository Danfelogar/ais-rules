# Implementation Plan: Weather Card Component

## Context

The ais-rules repository needs a React Native weather card component as defined in `_specs/weather-card-component.md`. This is a greenfield implementation - no existing React/TypeScript code or project structure exists yet. The component will be props-driven, stateless, and provide at-a-glance weather information with loading/error states and full accessibility support.

## Goals

- Create a production-ready, reusable WeatherCard component
- Support TypeScript with proper type definitions
- Handle all edge cases (0 temperature, missing data, long labels, etc.)
- Provide comprehensive test coverage
- Ensure accessibility compliance
- Dark mode compatible via React Native's built-in appearance APIs

## File Structure

```
ais-rules/
├── src/
│   ├── components/
│   │   ├── WeatherCard.tsx
│   │   └── __tests__/
│   │       └── WeatherCard.test.tsx
│   └── types/
│       └── weather.ts
├── package.json (minimal - just for types/testing deps reference)
└── README.md (component usage documentation)
```

## Implementation Details

### 1. Type Definitions (`src/types/weather.ts`)

Define TypeScript interfaces:

```typescript
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
  // Required props
  temperature: number;
  condition: WeatherCondition;
  unit: UnitSystem;
  
  // Optional props (may be null/undefined)
  humidity?: number | null;
  windSpeed?: number | null;
  
  // State props
  isLoading?: boolean;
  hasError?: boolean;
  
  // Accessibility & display
  accessibilityLabel?: string;
  testID?: string;
}
```

### 2. Component Implementation (`src/components/WeatherCard.tsx`)

Key implementation notes:

- **Temperature display**: Prominent, large font. Format: `${temperature}°${unit === 'metric' ? 'C' : 'F'}`. Handle zero correctly (not falsy).
- **Condition icon**: Use unicode/emoji mapping:
  - sunny: '☀️'
  - partly-cloudy: '⛅'
  - cloudy: '☁️'
  - rainy: '🌧️'
  - stormy: '⛈️'
  - snowy: '❄️'
  - foggy: '🌫️'
  - windy: '💨'
  - unknown: '❓'
- **Humidity**: Format: `Humidity: ${value ?? '--'}%`. Show '--' when null/undefined.
- **Wind speed**: Format: `${value ?? '--'} ${unit === 'metric' ? 'km/h' : 'mph'}`. Show '--' when null/undefined.
- **Loading state**: Render skeleton placeholders (gray boxes with shimmer effect or simple gray rectangles). Use `ActivityIndicator` from 'react-native' as an alternative.
- **Error state**: Render fallback UI with an error icon (⚠️) and message: "Unable to load weather data."
- **Dark mode**: Use `useColorScheme()` hook and style adaptively. Provide default styles that work in both modes, but allow theme overrides if needed.
- **Layout**: Use View with flexDirection='row' or flexDirection='column' depending on width. Implement responsive layout that works at 320pt width. Consider a horizontal layout for larger screens, stacked for narrow.
- **Accessibility**: 
  - Main container: `accessibilityLabel` prop or auto-generated composite label: `Weather: ${temperature}°, ${condition}, humidity ${humidity}%, wind ${windSpeed} ${unit === 'metric' ? 'km/h' : 'mph'}`
  - Icons: `accessibilityLabel` = condition description
  - Values: `accessibilityRole='text'`
- **Styling**: Use `StyleSheet.create`. Ensure text doesn't overflow - use `numberOfLines={1}` with `ellipsizeMode='tail'` for location/condition text if included. Use flexible width with maxWidth constraints.

Component structure:

```tsx
const WeatherCard: React.FC<WeatherCardProps> = ({
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
  
  // Return loading state
  if (isLoading) {
    return <LoadingSkeleton testID={testID} isDark={isDark} />;
  }
  
  // Return error state
  if (hasError) {
    return <ErrorFallback testID={testID} isDark={isDark} />;
  }
  
  // Main content
  const icon = getConditionIcon(condition);
  const tempString = `${temperature}°${unit === 'metric' ? 'C' : 'F'}`;
  const humidityString = humidity !== null && humidity !== undefined 
    ? `${humidity}%` 
    : '--';
  const windString = windSpeed !== null && windSpeed !== undefined
    ? `${windSpeed} ${unit === 'metric' ? 'km/h' : 'mph'}`
    : '--';
  
  const mergedAccessibilityLabel = accessibilityLabel 
    ?? `Weather: ${temperature} degrees, ${condition}, humidity ${humidityString}, wind ${windString}`;
  
  return (
    <View 
      style={[styles.container, isDark ? styles.dark : styles.light]}
      accessibilityLabel={mergedAccessibilityLabel}
      accessibilityRole="text"
      testID={testID}
    >
      <Text style={styles.temperature} accessibilityLabel={ `${temperature} degrees` }>
        {tempString}
      </Text>
      <Text style={styles.icon} accessibilityLabel={condition}>
        {icon}
      </Text>
      <View style={styles.details}>
        <Text style={styles.detail} accessibilityLabel={`Humidity: ${humidityString}`}>
          Humidity: {humidityString}
        </Text>
        <Text style={styles.detail} accessibilityLabel={`Wind: ${windString}`}>
          Wind: {windString}
        </Text>
      </View>
    </View>
  );
};
```

### 3. Subcomponents (Internal)

- **LoadingSkeleton**: Simple View with gray background and optional ActivityIndicator
- **ErrorFallback**: View with ⚠️ icon and "Unable to load weather data." text

Both should accept `testID` and `isDark` props.

### 4. Testing (`src/components/__tests__/WeatherCard.test.tsx`)

Required test cases (using Jest + React Native Testing Library):

1. ✅ Renders temperature, condition icon, humidity, wind speed with complete props
2. ✅ Renders correct temperature unit for metric (°C)
3. ✅ Renders correct temperature unit for imperial (°F)
4. ✅ Condition icon changes based on condition prop (test at least 3 conditions)
5. ✅ Renders loading skeleton when `isLoading={true}`
6. ✅ Renders error fallback when `hasError={true}`
7. ✅ Does not crash when humidity is null/undefined (shows '--')
8. ✅ Does not crash when windSpeed is null/undefined (shows '--')
9. ✅ Temperature 0 renders as "0°C" or "0°F" (not omitted or treated as falsy)
10. ✅ Snapshot test for default rendering
11. ✅ Snapshot test for loading state
12. ✅ Snapshot test for error state
13. ✅ Accessibility labels are present and correct on all elements
14. ✅ Component uses dark mode styles when isDark=true (test with mocked useColorScheme)

### 5. Jest Configuration

Create minimal `jest.config.js` in project root (if not existing) pointing to react-native preset:

```javascript
preset: 'react-native',
setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
transform: {
  '^.+\\.(ts|tsx)$': 'babel-jest',
},
testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
```

**Note**: If the repository doesn't have Jest/Testing Library set up, we'll need to add minimal configuration and dependencies. Since the spec says "Component-only", we'll include bare essential config files.

### 6. Documentation (`README.md`)

Add component usage docs with:

- Installation instructions (if published separately)
- Props table with types and descriptions
- Usage examples
- Accessibility notes
- Customization guide (styling, icons)
- Edge case handling explanation

### 7. Export Index (`src/index.ts`)

Create barrel export:

```typescript
export { WeatherCard } from './components/WeatherCard';
export type { WeatherCardProps, WeatherCondition, UnitSystem } from './types/weather';
```

## Critical Decisions & Constraints

1. **No data fetching**: Component receives all data via props only (stateless)
2. **Emoji icons**: Unicode emoji for weather conditions - lightweight, no external dependencies
3. **Placeholder for missing**: Humidity/wind show '--' when data is null/undefined
4. **Single unit prop**: 'metric' or 'imperial' controls both temperature and wind units
5. **Dark mode**: Built-in using `useColorScheme()` - no complex theming needed at this stage
6. **Accessibility first**: Every visual element gets appropriate labels
7. **Responsive**: Works at 320pt minimum width
8. **Temperature zero handling**: Explicit check ensures 0 renders correctly

## Verification Plan

1. **Code Review**:
   - Read WeatherCard.tsx to verify all acceptance criteria met
   - Check that 0 temperature displays correctly
   - Verify null/undefined handling for optional props
   - Confirm all visual elements have accessibility labels

2. **Run Tests**:
   - Execute `npm test` or `yarn test`
   - Ensure all 14 test cases pass
   - Check coverage (aim for >90% on component)
   - Verify snapshots are created and stable

3. **Manual Testing** (if possible in React Native environment):
   - Render component with complete props and verify visual appearance
   - Toggle dark mode and verify styles adapt
   - Test on narrow screen (320pt) to check layout stability
   - Verify loading state shows skeleton
   - Verify error state shows fallback
   - Test with extreme values (-40°C, 200 km/h, etc.)

4. **Accessibility Audit**:
   - Run accessibility scanner if available
   - Verify screen reader would read meaningful labels
   - Check contrast ratios in both themes

## Dependencies to Install (if setting up project)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0"
  },
  "devDependencies": {
    "@testing-library/react-native": "^12.0.0",
    "@testing-library/jest-native": "^5.0.0",
    "jest": "^29.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.73.0"
  }
}
```

**Note**: Since the repository doesn't have a package.json, we'll create a minimal one or document dependencies in README. The spec says "Component-only" so we'll keep this lightweight.

## Acceptance Criteria Coverage

| Criterion | Implementation |
|-----------|----------------|
| Renders all 4 data points | Main component returns all elements |
| Temperature correct unit | Unit prop determines °C vs °F |
| Condition icon matches code | getConditionIcon() maps conditions to emoji |
| Humidity as percentage | Humidity displayed with % suffix |
| Wind speed with unit | Wind displayed with km/h or mph |
| Loading skeleton | isLoading triggers LoadingSkeleton subcomponent |
| Error fallback | hasError triggers ErrorFallback subcomponent |
| Accessibility labels | All elements have accessibilityLabel props |
| Doesn't crash with missing optional props | Default null values; conditional rendering with `?? '--'` |
| 320pt width layout | Flex layout with responsive design; test at narrow width |
| Temperature 0 not treated falsy | Uses numeric check, not truthy check |
| Dark mode support | useColorScheme() hook provides isDark flag |
| Long labels overflow handled | numberOfLines={1} with ellipsizeMode on text elements |

All acceptance criteria from the spec are addressed.
