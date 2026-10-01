const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/app.ts',
    output: {
      filename: isProduction ? 'bundle.[contenthash].js' : 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devtool: isProduction ? false : 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
      extensionAlias: {
        '.js': ['.js', '.ts'] // Додай цей рядок
    }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            // у dev-режимі style-loader дає миттєве оновлення стилів (HMR), у prod - окремий css-файл
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern-compiler',
                sassOptions: {
                  // Bootstrap 5.3 ще використовує глобальні sass-функції - приглушуємо шум у консолі
                  quietDeps: true,
                  silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './index.html' }),
      ...(isProduction ? [new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' })] : []),
    ],
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 9000,
      open: true,
      hot: true,
    },
  };
};
