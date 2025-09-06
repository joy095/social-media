// List of Indian cities for random location assignment
const cities = [
    'MUMBAI',
    'DELHI',
    'BANGALORE',
    'HYDERABAD',
    'AHMEDABAD',
    'CHENNAI',
    'KOLKATA',
    'PUNE',
    'JAIPUR',
    'SURAT',
    'LUCKNOW',
    'KANPUR',
    'NAGPUR',
    'INDORE',
    'THANE',
    'BHOPAL',
    'VISAKHAPATNAM',
    'PIMPRI-CHINCHWAD',
    'PATNA',
    'VADODARA',
    'GHAZIABAD',
    'LUDHIANA',
    'AGRA',
    'NASHIK',
    'FARIDABAD',
    'MEERUT',
    'RAJKOT',
    'KALYAN-DOMBIVALI',
    'VASAI-VIRAR',
    'VARANASI',
    'SRINAGAR',
    'AURANGABAD',
    'DHANBAD',
    'AMRITSAR',
    'NAVI MUMBAI',
    'ALLAHABAD',
    'RANCHI',
    'HOWRAH',
    'COIMBATORE',
    'JABALPUR',
    'GWALIOR',
    'VIJAYAWADA',
    'JODHPUR',
    'MADURAI',
    'RAIPUR',
    'KOTA',
    'GUWAHATI',
    'CHANDIGARH',
    'SOLAPUR',
    'HUBLI-DHARWAD',
    'BAREILLY',
    'MORADABAD',
    'MYSORE',
    'GURGAON',
    'ALIGARH',
    'JALANDHAR',
    'TIRUCHIRAPPALLI',
    'BHUBANESWAR',
    'SALEM',
    'MIRA-BHAYANDAR',
    'WARANGAL',
    'GUNTUR',
    'BHIWANDI',
    'SAHARANPUR',
    'GORAKHPUR',
    'BIKANER',
    'AMRAVATI',
    'NOIDA',
    'JAMSHEDPUR',
    'BHILAI NAGAR',
    'CUTTAK',
    'FIROZABAD',
    'KOCHI',
    'BHAVNAGAR',
    'DEHRADUN',
    'DURGAPUR',
    'ASANSOL',
    'NANDED-WAGHALA',
    'KOLHAPUR',
    'AJMER',
    'GULBARGA',
    'JAMNAGAR',
    'UJJAIN',
    'LONI',
    'SILIGURI',
    'JHANSI',
    'ULHASNAGAR',
    'JAMMU',
    'SANGLI-MIRAJ & KUPWAD',
    'MANGALORE',
    'ERODE',
    'BELGAUM',
    'AMBATTUR',
    'TIRUNELVELI',
    'MALEGAON',
    'GAYA',
    'JALGAON',
    'UDAIPUR',
    'MAHESHTALA'
];
// Function to get a random city
export const getRandomCity = () => {
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
};
// Function to get all available cities
export const getAllCities = () => {
    return [...cities];
};
// Function to check if a city exists in our list
export const isCityValid = (city) => {
    return cities.includes(city.toUpperCase());
};
// Function to get cities by region (simplified grouping)
export const getCitiesByRegion = (region) => {
    const regions = {
        'north': [
            'DELHI', 'GURGAON', 'FARIDABAD', 'GHAZIABAD', 'NOIDA',
            'LUCKNOW', 'KANPUR', 'AGRA', 'MEERUT', 'ALLAHABAD',
            'VARANASI', 'LUDHIANA', 'AMRITSAR', 'JALANDHAR', 'CHANDIGARH',
            'BAREILLY', 'MORADABAD', 'ALIGARH', 'SAHARANPUR', 'GORAKHPUR',
            'JAIPUR', 'JODHPUR', 'KOTA', 'BIKANER', 'AJMER', 'UDAIPUR',
            'JAMMU', 'SRINAGAR', 'DEHRADUN'
        ],
        'west': [
            'MUMBAI', 'PUNE', 'AHMEDABAD', 'SURAT', 'THANE', 'VADODARA',
            'RAJKOT', 'KALYAN-DOMBIVALI', 'VASAI-VIRAR', 'NAVI MUMBAI',
            'SOLAPUR', 'MIRA-BHAYANDAR', 'BHIWANDI', 'BHAVNAGAR',
            'JAMNAGAR', 'ULHASNAGAR', 'SANGLI-MIRAJ & KUPWAD', 'MALEGAON',
            'JALGAON'
        ],
        'south': [
            'BANGALORE', 'HYDERABAD', 'CHENNAI', 'COIMBATORE', 'MADURAI',
            'MYSORE', 'TIRUCHIRAPPALLI', 'SALEM', 'WARANGAL', 'GUNTUR',
            'KOCHI', 'MANGALORE', 'ERODE', 'TIRUNELVELI', 'AMBATTUR',
            'VIJAYAWADA', 'VISAKHAPATNAM'
        ],
        'east': [
            'KOLKATA', 'BHUBANESWAR', 'CUTTAK', 'DURGAPUR', 'ASANSOL',
            'SILIGURI', 'HOWRAH', 'GUWAHATI', 'RANCHI', 'JAMSHEDPUR',
            'DHANBAD'
        ],
        'central': [
            'BHOPAL', 'INDORE', 'NAGPUR', 'JABALPUR', 'GWALIOR', 'RAIPUR',
            'UJJAIN', 'GAYA', 'PATNA', 'AURANGABAD', 'NASHIK', 'AMRAVATI',
            'NANDED-WAGHALA', 'KOLHAPUR', 'GULBARGA', 'BELGAUM',
            'HUBLI-DHARWAD', 'BHILAI NAGAR', 'FIROZABAD', 'JHANSI',
            'LONI', 'MAHESHTALA'
        ]
    };
    return regions[region.toLowerCase()] || [];
};
export default {
    getRandomCity,
    getAllCities,
    isCityValid,
    getCitiesByRegion
};
//# sourceMappingURL=cities.js.map