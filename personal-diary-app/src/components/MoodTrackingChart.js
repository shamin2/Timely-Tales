import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet, View, Text } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const MoodTrackingChart = ({ data }) => {
  const chartData = {
    labels: data.map((m) => m.date.split('-').slice(1).join('/')).slice(0, 7).reverse(),
    datasets: [
      {
        data: data.map((m) => m.moodIndex).slice(0, 7).reverse(),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Mood Trend (Last 7 Days)</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 40} // Adjust width based on screen size
        height={220}
        chartConfig={{
          backgroundColor: '#6200ee',
          backgroundGradientFrom: '#6200ee',
          backgroundGradientTo: '#a370f7',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});

export default MoodTrackingChart;
