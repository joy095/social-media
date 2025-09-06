declare const DEFAULT_CITIES: string[];
/**
 * Get random city from environment or default list
 * @returns {string} Random city name
 */
declare const getRandomCity: () => string;
/**
 * Get all available cities
 * @returns {Array<string>} Array of all cities
 */
declare const getAllCities: () => string[];
/**
 * Validate if a city exists in the list
 * @param {string} cityName - City name to validate
 * @returns {boolean} Whether city exists
 */
declare const isValidCity: (cityName: any) => boolean;
/**
 * Get cities by region (if needed for future expansion)
 * @param {string} region - Region name
 * @returns {Array<string>} Cities in that region
 */
declare const getCitiesByRegion: (region: any) => any;
/**
 * Get random city from specific region
 * @param {string} region - Region name
 * @returns {string} Random city from region
 */
declare const getRandomCityFromRegion: (region: any) => any;
export { getRandomCity, getAllCities, isValidCity, getCitiesByRegion, getRandomCityFromRegion, DEFAULT_CITIES };
//# sourceMappingURL=cityGenerator.d.ts.map