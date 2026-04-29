export const TRANSFORMATIONS = {
  // ==================== LINHA EARTH ====================
  'MUD': { input: { 'EARTH': 3 }, output: 1, timeMin: 0.167, isEarth: true },
  'CLAY': { input: { 'MUD': 10 }, output: 1, timeMin: 0.5, isEarth: false },
  'SAND': { input: { 'CLAY': 3 }, output: 1, timeMin: 2, isEarth: false },
  'COPPER': { input: { 'SAND': 30 }, output: 1, timeMin: 60, isEarth: false },
  'STEEL': { input: { 'COPPER': 5 }, output: 1, timeMin: 720, isEarth: false },
  'SCREWS': { input: { 'STEEL': 3 }, output: 1, timeMin: 2880, isEarth: false },
  
  // ==================== LINHA WATER ====================
  'SEAWATER': { input: { 'WATER': 16 }, output: 1, timeMin: 120, isEarth: false },
  'ALGAE': { input: { 'SEAWATER': 4 }, output: 1, timeMin: 360, isEarth: false },
  'OXYGEN': { input: { 'ALGAE': 3 }, output: 1, timeMin: 900, isEarth: false },
  'GAS': { input: { 'OXYGEN': 2 }, output: 1, timeMin: 1440, isEarth: false },
  'FUEL': { input: { 'GAS': 3 }, output: 1, timeMin: 3360, isEarth: false },
  'OIL': { input: { 'FUEL': 3 }, output: 1, timeMin: 5760, isEarth: false },
  
  // ==================== LINHA FIRE ====================
  'HEAT': { input: { 'FIRE': 18 }, output: 1, timeMin: 150, isEarth: false },
  'LAVA': { input: { 'HEAT': 4 }, output: 1, timeMin: 480, isEarth: false },
  
  // ==================== PRODUTOS CRUZADOS ====================
  'GLASS': { input: { 'SAND': 180, 'HEAT': 8 }, output: 1, timeMin: 1080, isEarth: false },
  'SULFUR': { input: { 'STEEL': 8, 'LAVA': 10 }, output: 1, timeMin: 7200, isEarth: false },
  'FIBERGLASS': { input: { 'GLASS': 10, 'SULFUR': 2 }, output: 1, timeMin: 11520, isEarth: false },
  'CERAMICS': { input: { 'CLAY': 300, 'SEAWATER': 3 }, output: 1, timeMin: 600, isEarth: false },
  'STONE': { input: { 'COPPER': 10, 'ALGAE': 3 }, output: 1, timeMin: 1680, isEarth: false },
  'STEAM': { input: { 'OXYGEN': 2, 'LAVA': 4 }, output: 1, timeMin: 1920, isEarth: false },
  'CEMENT': { input: { 'CERAMICS': 10, 'STONE': 3 }, output: 1, timeMin: 3840, isEarth: false },
  'ACID': { input: { 'SCREWS': 2, 'FUEL': 2 }, output: 1, timeMin: 6480, isEarth: false },
  'PLASTICS': { input: { 'CEMENT': 3, 'ACID': 2 }, output: 1, timeMin: 10080, isEarth: false },
  'ENERGY': { input: { 'OIL': 2, 'HEAT': 72 }, output: 1, timeMin: 12960, isEarth: false },
  'HYDROGEN': { input: { 'STEAM': 7, 'ENERGY': 2 }, output: 1, timeMin: 14400, isEarth: false },
  'DYNAMITE': { input: { 'FIBERGLASS': 3, 'PLASTICS': 2 }, output: 1, timeMin: 20160, isEarth: false }
}
