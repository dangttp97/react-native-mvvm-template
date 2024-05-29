import { useMemo } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import keys from 'lodash.keys';

import { AppColors, colors } from '@assets/colors';
import { font } from '@assets/fonts';

type Theme = {
  font: typeof font;
  colors: AppColors;
};

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

type NamedStylesFn<Props extends {}, T> = {
  [P in keyof T]:
    | ((args: Props) => ViewStyle | TextStyle | ImageStyle)
    | ViewStyle
    | TextStyle
    | ImageStyle;
};

type StyleThemFn<
  Props extends {},
  T extends NamedStyles<T> | NamedStyles<any> | NamedStylesFn<Props, T>,
> = (args: Theme) => T | NamedStyles<any> | NamedStylesFn<Props, T>;

type ReturnNameStyled<T> = T;

const theme = {
  font,
  colors,
};

export const useTheme = () => {
  return { font, colors } as Theme; // here
};

const createNewStyle = (styles: any, props?: any) => {
  return keys(styles).reduce((results, key) => {
    if (typeof styles[key] === 'function') {
      results[key] = styles[key](props);
    } else {
      results[key] = styles[key];
    }
    return results;
  }, {} as any);
};

export const createStyle =
  <Props extends {}>() =>
  <T extends NamedStyles<T> | NamedStyles<any> | NamedStylesFn<Props, T>>(
    styles:
      | StyleThemFn<Props, T>
      | T
      | NamedStyles<T>
      | NamedStylesFn<Props, T>,
  ) => {
    return (props?: Props) => {
      return useMemo<{
        [P in keyof ReturnNameStyled<T>]: {};
      }>(
        () =>
          StyleSheet.create({
            ...createNewStyle(
              typeof styles === 'function'
                ? styles({
                    ...theme, // here
                  })
                : styles,
              props,
            ),
          }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props],
      );
    };
  };
