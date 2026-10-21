import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SIZE = 110;

export default function ShapeVisual({ type, color, size = SIZE }) {
  switch (type) {
    case "circle":
      return <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />;
    case "square":
      return <View style={{ width: size, height: size, backgroundColor: color, borderRadius: 12 }} />;
    case "rectangle":
      return <View style={{ width: size * 1.4, height: size * 0.8, backgroundColor: color, borderRadius: 12 }} />;
    case "oval":
      return <View style={{ width: size * 1.3, height: size * 0.8, borderRadius: size, backgroundColor: color }} />;
    case "triangle":
      return (
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: size / 2,
            borderRightWidth: size / 2,
            borderBottomWidth: size,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: color,
          }}
        />
      );
    case "star":
      return (
        <Text style={{ fontSize: size, color, lineHeight: size * 1.05 }}>
          ★
        </Text>
      );
    default:
      return <View style={{ width: size, height: size, backgroundColor: color }} />;
  }
}

const styles = StyleSheet.create({
  circle: {},
});
