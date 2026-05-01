import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { WeatherCard } from '../WeatherCard';
import { WeatherCondition } from '../../types/weather';
import { useColorScheme } from 'react-native';

const mockUseColorScheme = jest.spyOn(require('react-native'), 'useColorScheme');

beforeEach(() => {
  mockUseColorScheme.mockReturnValue('light');
  jest.clearAllMocks();
});

afterAll(() => {
  mockUseColorScheme.mockRestore();
});

describe('WeatherCard', () => {
  describe('renders all data points correctly', () => {
    it('renders temperature, condition icon, humidity, and wind speed with complete props', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          humidity={65}
          windSpeed={12}
        />
      );

      expect(screen.getByText('22°C')).toBeTruthy();
      expect(screen.getByText('☀️')).toBeTruthy();
      expect(screen.getByText('Humidity: 65%')).toBeTruthy();
      expect(screen.getByText('Wind: 12 km/h')).toBeTruthy();
    });
  });

  describe('temperature units', () => {
    it('displays temperature with Celsius unit when unit="metric"', () => {
      render(
        <WeatherCard
          temperature={15}
          condition="cloudy"
          unit="metric"
        />
      );

      expect(screen.getByText('15°C')).toBeTruthy();
    });

    it('displays temperature with Fahrenheit unit when unit="imperial"', () => {
      render(
        <WeatherCard
          temperature={59}
          condition="cloudy"
          unit="imperial"
        />
      );

      expect(screen.getByText('59°F')).toBeTruthy();
    });
  });

  describe('condition icon mapping', () => {
    const conditions: { condition: WeatherCondition; icon: string }[] = [
      { condition: 'sunny', icon: '☀️' },
      { condition: 'rainy', icon: '🌧️' },
      { condition: 'cloudy', icon: '☁️' },
      { condition: 'stormy', icon: '⛈️' },
      { condition: 'snowy', icon: '❄️' },
      { condition: 'foggy', icon: '🌫️' },
      { condition: 'partly-cloudy', icon: '⛅' },
      { condition: 'windy', icon: '💨' },
      { condition: 'unknown', icon: '❓' },
    ];

    it.each(conditions)('renders $condition icon as $icon', ({ condition, icon }) => {
      render(
        <WeatherCard
          temperature={20}
          condition={condition}
          unit="metric"
        />
      );

      expect(screen.getByText(icon)).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('renders loading skeleton when isLoading is true', () => {
      const { toJSON } = render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          isLoading={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('does not render content when loading', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          isLoading={true}
        />
      );

      expect(screen.queryByText('22°C')).toBeNull();
      expect(screen.queryByText('☀️')).toBeNull();
    });
  });

  describe('error state', () => {
    it('renders error fallback when hasError is true', () => {
      const { toJSON } = render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          hasError={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('displays error message when hasError is true', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          hasError={true}
        />
      );

      expect(screen.getByText('Unable to load weather data.')).toBeTruthy();
    });

    it('does not render weather data when hasError is true', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          hasError={true}
        />
      );

      expect(screen.queryByText('22°C')).toBeNull();
      expect(screen.queryByText('☀️')).toBeNull();
    });
  });

  describe('optional props handling', () => {
    it('shows placeholder when humidity is null', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          humidity={null}
          windSpeed={10}
        />
      );

      expect(screen.getByText('Humidity: --')).toBeTruthy();
    });

    it('shows placeholder when humidity is undefined', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          windSpeed={10}
        />
      );

      expect(screen.getByText('Humidity: --')).toBeTruthy();
    });

    it('shows placeholder when windSpeed is null', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          humidity={65}
          windSpeed={null}
        />
      );

      expect(screen.getByText('Wind: --')).toBeTruthy();
    });

    it('shows placeholder when windSpeed is undefined', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          humidity={65}
        />
      );

      expect(screen.getByText('Wind: --')).toBeTruthy();
    });

    it('shows placeholders for both humidity and windSpeed when both are missing', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
        />
      );

      expect(screen.getByText('Humidity: --')).toBeTruthy();
      expect(screen.getByText('Wind: --')).toBeTruthy();
    });

    it('does not crash when optional props are completely omitted', () => {
      const { toJSON } = render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('edge cases', () => {
    it('correctly renders temperature of 0 without treating it as falsy', () => {
      render(
        <WeatherCard
          temperature={0}
          condition="sunny"
          unit="metric"
        />
      );

      expect(screen.getByText('0°C')).toBeTruthy();
    });

    it('handles very low temperatures', () => {
      render(
        <WeatherCard
          temperature={-40}
          condition="cloudy"
          unit="metric"
        />
      );

      expect(screen.getByText('-40°C')).toBeTruthy();
    });

    it('handles very high temperatures', () => {
      render(
        <WeatherCard
          temperature={50}
          condition="sunny"
          unit="imperial"
        />
      );

      expect(screen.getByText('50°F')).toBeTruthy();
    });

    it('handles very high wind speeds', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="stormy"
          unit="metric"
          windSpeed={200}
        />
      );

      expect(screen.getByText('Wind: 200 km/h')).toBeTruthy();
    });

    it('handles 100% humidity', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="foggy"
          unit="metric"
          humidity={100}
        />
      );

      expect(screen.getByText('Humidity: 100%')).toBeTruthy();
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with complete props in light mode', () => {
      const { toJSON } = render(
        <WeatherCard
          temperature={22}
          condition="partly-cloudy"
          unit="metric"
          humidity={65}
          windSpeed={12}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('matches snapshot in dark mode', () => {
      mockUseColorScheme.mockReturnValue('dark');

      const { toJSON } = render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="imperial"
          humidity={50}
          windSpeed={8}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('matches loading state snapshot', () => {
      const { toJSON } = render(
        <WeatherCard
          isLoading={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('matches error state snapshot', () => {
      const { toJSON } = render(
        <WeatherCard
          hasError={true}
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('accessibility', () => {
    it('has accessibilityLabel on main container', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          humidity={65}
          windSpeed={12}
        />
      );

      const container = screen.getByLabelText(
        'Weather: 22 degrees, sunny, humidity 65%, wind 12 km/h'
      );
      expect(container).toBeTruthy();
    });

    it('provides accessibilityLabel for temperature', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
        />
      );

      expect(screen.getByLabelText('Temperature: 22°C')).toBeTruthy();
    });

    it('provides accessibilityLabel for condition icon', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="rainy"
          unit="metric"
        />
      );

      expect(screen.getByLabelText('Condition: rainy')).toBeTruthy();
    });

    it('provides accessibilityLabel for humidity', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          humidity={65}
        />
      );

      expect(screen.getByLabelText('Humidity: 65%')).toBeTruthy();
    });

    it('provides accessibilityLabel for humidity placeholder', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
        />
      );

      expect(screen.getByLabelText('Humidity: --')).toBeTruthy();
    });

    it('provides accessibilityLabel for wind', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="imperial"
          windSpeed={10}
        />
      );

      expect(screen.getByLabelText('Wind: 10 mph')).toBeTruthy();
    });

    it('provides accessibilityLabel for wind placeholder', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
        />
      );

      expect(screen.getByLabelText('Wind: --')).toBeTruthy();
    });

    it('allows custom accessibilityLabel to override default', () => {
      render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          accessibilityLabel="Custom weather card description"
        />
      );

      expect(screen.getByLabelText('Custom weather card description')).toBeTruthy();
    });
  });

  describe('testID prop', () => {
    it('passes testID to main container', () => {
      const { toJSON } = render(
        <WeatherCard
          temperature={22}
          condition="sunny"
          unit="metric"
          testID="weather-card.test"
        />
      );

      const tree = toJSON();
      expect(tree && tree.props).toHaveProperty('testID', 'weather-card.test');
    });
  });
});
