
import { CrystalShape, TopologyPattern } from '../types';

export interface SkinConfig {
  day: number;
  name: string;
  color: string;
  accent: string;
  geometry: CrystalShape;
  topology: TopologyPattern;
}

export const SKIN_REGISTRY: Record<number, SkinConfig> = {
  1: {
    day: 1,
    name: "火之初啟",
    color: "#F59E0B", // Amber
    accent: "#EF4444", // Red
    geometry: "Tetrahedron",
    topology: "chaotic"
  },
  2: {
    day: 2,
    name: "熔岩煉金",
    color: "#EA580C", // Orange
    accent: "#991B1B", // Dark Red
    geometry: "Tetrahedron",
    topology: "chaotic"
  },
  3: {
    day: 3,
    name: "森之秩序",
    color: "#10B981", // Emerald
    accent: "#064E3B", // Dark Green
    geometry: "Cube",
    topology: "grid"
  },
  4: {
    day: 4,
    name: "地心矩陣",
    color: "#84CC16", // Lime
    accent: "#3F6212", // Dark Lime
    geometry: "Cube",
    topology: "grid"
  },
  5: {
    day: 5,
    name: "羽之流動",
    color: "#0EA5E9", // Sky
    accent: "#1E40AF", // Navy
    geometry: "Octahedron",
    topology: "fluid"
  },
  6: {
    day: 6,
    name: "深海共鳴",
    color: "#06B6D4", // Cyan
    accent: "#164E63", // Teal
    geometry: "Octahedron",
    topology: "fluid"
  },
  7: {
    day: 7,
    name: "虹化大圓滿",
    color: "#FFFFFF", // White
    accent: "#D8B4FE", // Lavender
    geometry: "Sphere",
    topology: "mandala"
  }
};
