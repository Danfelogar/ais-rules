# Spec for Weather Card Component

branch: claude/feature/weather-card-component
figma_component (if used): <figma-component-name>

## Summary

A self-contained React Native card component that displays current weather information for a given location. The card presents four key data points — temperature, condition icon, humidity, and wind speed — in a compact, legible layout suitable for use in dashboards, home screens, or any context where at-a-glance weather awareness is needed.

## Functional Requirements

- Display the current temperature with the appropriate unit (Celsius or Fahrenheit) as a prominent value.
- Show a weather condition icon that visually represents the current condition (e.g. sunny, cloudy, rainy, stormy).
- Display the current humidity as a percentage value with a label.
- Display current wind speed with its unit (km/h or mph) and a label.
- Accept all weather data as props so the component remains stateless and reusable.
- Support a loading state that renders placeholder/skeleton elements while data is being fetched.
- Support an error state that renders a graceful fallback message when data is unavailable.
- The component must be accessible: all visual elements must have appropriate accessibility labels.

## Figma Design Reference (only if referenced)

- File: N/A
- Component name: N/A
- Key visual constraints: N/A

## Possible Edge Cases

- Temperature value is 0 (should not be treated as falsy/missing).
- Extremely long location names overflowing the card boundary.
- Unknown or unsupported weather condition codes that have no matching icon.
- Wind speed or humidity values are null or undefined (data partially missing).
- Very high or very low numeric values (e.g. -40°C, 100% humidity, 200 km/h wind).
- Component rendered on very small screen widths (e.g. narrow phones or split-screen).
- Dark mode / light mode theming if the host app supplies a theme context.

## Acceptance Criteria

- The card renders all four data points (temperature, condition icon, humidity, wind speed) when valid props are provided.
- Temperature displays the correct unit based on the `unit` prop.
- The condition icon changes to match the current weather condition code passed via props.
- Humidity is shown as a percentage and wind speed is shown with its unit.
- A skeleton/loading placeholder is shown when the `isLoading` prop is true.
- An error message or fallback UI is shown when the `hasError` prop is true.
- All interactive/visual elements have `accessibilityLabel` values.
- The component does not crash when optional props (humidity, windSpeed) are omitted.
- The layout does not overflow or break on screens as narrow as 320 pt wide.

## Open Questions

- Should the component fetch weather data itself, or only accept data via props? (Current assumption: props-only / stateless.) props-only
- What icon library or custom asset set will be used for weather condition icons? local-icons or the OS
- Should temperature units be controlled by a prop or derived from device locale? °C
- Is dark mode support required at launch, or deferred? yes
- Are there specific design tokens or a theme system the component must consume? Not

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Renders all four data points correctly when given complete, valid props.
- Renders the loading skeleton when `isLoading` is true.
- Renders the error fallback when `hasError` is true.
- Displays temperature with the correct unit for both Celsius and Fahrenheit props.
- Does not crash or throw when optional props (humidity, windSpeed) are absent.
- Condition icon changes when a different weather condition code is supplied.
- Snapshot test to catch unintended layout regressions.
