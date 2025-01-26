import { useSettingsStore } from '../store/settingsStore';

interface ConversionMap {
  [key: string]: {
    metric: string;
    imperial: string;
    convert: (value: number, toImperial: boolean) => number;
  };
}

const conversions: ConversionMap = {
  weight: {
    metric: 'g',
    imperial: 'oz',
    convert: (value, toImperial) => toImperial ? value * 0.035274 : value * 28.3495
  },
  volume: {
    metric: 'ml',
    imperial: 'fl oz',
    convert: (value, toImperial) => toImperial ? value * 0.033814 : value * 29.5735
  },
  temperature: {
    metric: '°C',
    imperial: '°F',
    convert: (value, toImperial) => toImperial ? (value * 9/5) + 32 : (value - 32) * 5/9
  }
};

export const useMeasurements = () => {
  const { measurementSystem } = useSettingsStore();
  const isImperial = measurementSystem === 'imperial';

  const convertMeasurement = (value: number, unit: string) => {
    // Find the conversion type based on the unit
    const type = Object.entries(conversions).find(([_, conv]) => 
      conv.metric === unit || conv.imperial === unit
    );

    if (!type) return { value, unit };

    const [_, conversion] = type;
    const currentlyMetric = unit === conversion.metric;
    
    // Only convert if needed
    if (currentlyMetric === !isImperial) {
      return {
        value: conversion.convert(value, isImperial),
        unit: isImperial ? conversion.imperial : conversion.metric
      };
    }

    return { value, unit };
  };

  const formatMeasurement = (value: number, unit: string) => {
    const { value: convertedValue, unit: convertedUnit } = convertMeasurement(value, unit);
    return `${convertedValue.toFixed(1)} ${convertedUnit}`;
  };

  return {
    convertMeasurement,
    formatMeasurement,
    isImperial
  };
};