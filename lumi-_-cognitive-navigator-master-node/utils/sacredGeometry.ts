
/**
 * [SACRED GEOMETRY ENGINE v2.1]
 * Provides vector coordinates for the Heptad Crystal Topology.
 * Includes Metatron's Cube projections and Resonance Wave functions.
 */

/**
 * Calculates hexagonal vertex positions for the radial Mandala.
 */
export const getHexPosition = (index: number, radius: number, center = { x: 200, y: 450 }) => {
  if (index === 6) return center;
  const angle = (index * 60 - 90) * (Math.PI / 180);
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle)
  };
};

/**
 * Flower of Life Background Path.
 */
export const getFlowerOfLifePath = (center: {x: number, y: number}, r: number) => {
  let path = "";
  const hexRadius = r;
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60) * (Math.PI / 180);
    const x = center.x + hexRadius * Math.cos(angle);
    const y = center.y + hexRadius * Math.sin(angle);
    path += `M ${x} ${y} m -${hexRadius}, 0 a ${hexRadius},${hexRadius} 0 1,0 ${hexRadius*2},0 a ${hexRadius},${hexRadius} 0 1,0 -${hexRadius*2},0 `;
  }
  path += `M ${center.x} ${center.y} m -${hexRadius}, 0 a ${hexRadius},${hexRadius} 0 1,0 ${hexRadius*2},0 a ${hexRadius},${hexRadius} 0 1,0 -${hexRadius*2},0 `;
  return path;
};

/**
 * Double Star Matrix (Metatron's Cube / Merkaba Projection).
 * Interlocks two triangles (Fire/Yang and Water/Yin) to create 3D depth.
 */
export const getMetatronsCubePath = (center: {x: number, y: number}, radius: number) => {
  let path = "";
  const nodes = Array.from({ length: 6 }).map((_, i) => getHexPosition(i, radius, center));

  // Yang Triangle (Fire): Nodes 0 -> 2 -> 4 -> 0
  path += `M ${nodes[0].x} ${nodes[0].y} L ${nodes[2].x} ${nodes[2].y} L ${nodes[4].x} ${nodes[4].y} Z `;

  // Yin Triangle (Water): Nodes 1 -> 3 -> 5 -> 1
  path += `M ${nodes[1].x} ${nodes[1].y} L ${nodes[3].x} ${nodes[3].y} L ${nodes[5].x} ${nodes[5].y} Z `;

  return path;
};

/**
 * Resonance Waves.
 * Generates concentric hexagonal ripples expanding from the center.
 */
export const getResonanceWaves = (center: {x: number, y: number}, radius: number) => {
  let path = "";
  // Three concentric waves at 0.4, 0.7, and 1.0 scale
  [0.4, 0.7, 1.0].forEach(scale => {
    const r = radius * scale;
    const start = getHexPosition(0, r, center);
    path += `M ${start.x} ${start.y} `;
    for (let i = 1; i <= 6; i++) {
      const p = getHexPosition(i % 6, r, center);
      path += `L ${p.x} ${p.y} `;
    }
    path += "Z ";
  });
  return path;
};

/**
 * Generates resonance path for visual halos.
 */
export const getResonancePath = (center: {x: number, y: number}, radius: number, rings: number = 3) => {
  let path = "";
  for (let i = 1; i <= rings; i++) {
    const r = (radius / rings) * i;
    path += `M ${center.x} ${center.y} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0 `;
  }
  return path;
};
