// Default cities list
const DEFAULT_CITIES = [
  'Mumbai', 'Delhi', 'Raipur', 'Bangalore', 'Chennai',
  'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi',
  'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai',
  'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
  'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli'
];

/**
 * Get random city from environment or default list
 * @returns {string} Random city name
 */
const getRandomCity = () => {
  try {
    // Get cities from environment variable if available
    const envCities = process.env.CITIES;
    let cities = DEFAULT_CITIES;

    if (envCities) {
      cities = envCities.split(',').map(city => city.trim());
    }

    // Ensure we have cities to choose from
    if (cities.length === 0) {
      cities = DEFAULT_CITIES;
    }

    // Get random city
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
  } catch (error) {
    console.error('Error getting random city:', error);
    // Fallback to a default city
    return 'Mumbai';
  }
};

/**
 * Get all available cities
 * @returns {Array<string>} Array of all cities
 */
const getAllCities = () => {
  try {
    const envCities = process.env.CITIES;

    if (envCities) {
      return envCities.split(',').map(city => city.trim());
    }

    return DEFAULT_CITIES;
  } catch (error) {
    console.error('Error getting all cities:', error);
    return DEFAULT_CITIES;
  }
};

/**
 * Validate if a city exists in the list
 * @param {string} cityName - City name to validate
 * @returns {boolean} Whether city exists
 */
const isValidCity = (cityName) => {
  const cities = getAllCities();
  return cities.map(city => city.toLowerCase()).includes(cityName.toLowerCase());
};

/**
 * Get cities by region (if needed for future expansion)
 * @param {string} region - Region name
 * @returns {Array<string>} Cities in that region
 */
const getCitiesByRegion = (region) => {
  const cityRegions = {
    north: ['Delhi', 'Gurgaon', 'Noida', 'Chandigarh', 'Ludhiana', 'Amritsar', 'Jaipur', 'Jodhpur'],
    south: ['Bangalore', 'Chennai', 'Hyderabad', 'Coimbatore', 'Madurai', 'Vijayawada', 'Kochi'],
    west: ['Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Nashik', 'Aurangabad'],
    east: ['Kolkata', 'Bhubaneswar', 'Patna', 'Ranchi', 'Guwahati'],
    central: ['Bhopal', 'Indore', 'Nagpur', 'Raipur', 'Jabalpur']
  };

  return cityRegions[region.toLowerCase()] || [];
};

/**
 * Get random city from specific region
 * @param {string} region - Region name
 * @returns {string} Random city from region
 */
const getRandomCityFromRegion = (region) => {
  const cities = getCitiesByRegion(region);

  if (cities.length === 0) {
    return getRandomCity(); // Fallback to any random city
  }

  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
};

export {
  getRandomCity,
  getAllCities,
  isValidCity,
  getCitiesByRegion,
  getRandomCityFromRegion,
  DEFAULT_CITIES
};
