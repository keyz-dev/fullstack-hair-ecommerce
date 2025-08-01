
export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };
  
  export const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get address from coordinates');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  };
  
  export const formatCameroonAddress = (geocodeData) => {
    if (!geocodeData || !geocodeData.address) {
      throw new Error('Invalid geocoding data');
    }
  
    const address = geocodeData.address;
    
    // Format address components for Cameroon
    const formattedAddress = {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Cameroon'
    };
  
    // Build street address
    const streetParts = [
      address.house_number,
      address.road || address.street || address.pedestrian
    ].filter(Boolean);
    
    formattedAddress.address = streetParts.length > 0 
      ? streetParts.join(' ')
      : address.neighbourhood || address.suburb || geocodeData.display_name;
  
    // City - try multiple possible fields
    formattedAddress.city = address.city || 
                            address.town || 
                            address.village || 
                            address.municipality ||
                            address.county ||
                            '';
  
    // State/Region for Cameroon
    formattedAddress.state = address.state || 
                            address.region || 
                            address.province ||
                            '';
  
    // Postal code
    formattedAddress.postalCode = address.postcode || '';
  
    // Country (force Cameroon for this marketplace)
    formattedAddress.country = 'Cameroon';
  
    return formattedAddress;
  };
  
  export const getLocationErrorMessage = (error) => {
    let message = 'Unable to get your current location. ';
    
    if (error.code === 1) {
      message += 'Please allow location access in your browser and try again.';
    } else if (error.code === 2) {
      message += 'Location information is unavailable. Please check your internet connection.';
    } else if (error.code === 3) {
      message += 'Location request timed out. Please try again.';
    } else {
      message += 'Please enter your address manually.';
    }
    
    return message;
  };
  