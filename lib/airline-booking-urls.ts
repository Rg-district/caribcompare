/**
 * Generates direct airline booking URLs for flight searches
 * Returns airline-specific booking links or Google Flights as fallback
 */

export function getAirlineBookingUrl(
  airlineCode: string, 
  airlineName: string, 
  origin: string, 
  destination: string, 
  departureDate: string, 
  returnDate?: string
): string {
  // Format departure date to YYYYMMDD for some airlines
  const date = departureDate.replace(/-/g, '');
  const returnDateFormatted = returnDate?.replace(/-/g, '') || '';
  
  switch(airlineCode) {
    case 'BA':
      return `https://www.britishairways.com/travel/fx/public/en_gb?eId=106047&source=WWW_BCPD_FLT&operatingAirline=BA&from=${origin}&to=${destination}&depart=${departureDate}&adults=1&class=M`;
      
    case 'VS':
      return `https://www.virginatlantic.com/flights/search?origin=${origin}&destination=${destination}&outboundDate=${departureDate}&adults=1&tripType=ONE_WAY`;
      
    case 'B6': // JetBlue
      return `https://www.jetblue.com/booking/flights?from=${origin}&to=${destination}&depart=${departureDate}&return=&travelers=1-0-0&isMultiCity=false`;
      
    case 'AA':
      return `https://www.aa.com/booking/flights/search?locale=en_US&pax=1&adult=1&type=OneWay&searchType=aa&cabin=&carriers=ALL&outboundFlight[0].departureDate=${departureDate}&outboundFlight[0].origin=${origin}&outboundFlight[0].destination=${destination}`;
      
    case 'DL':
      return `https://www.delta.com/us/en/flight-search/book-a-flight#/results/outbound?type=ONE_WAY&cabin=MAIN_CABIN&pax=1&fare=lowest&origin=${origin}&destination=${destination}&date=${departureDate}`;
      
    case 'UA':
      return `https://www.united.com/en/us/fsr/choose-flights?f=${origin}&t=${destination}&d=${departureDate}&tt=1&at=1&sc=7&px=1&taxng=1&newHP=True`;
      
    case 'WS': // WestJet
      return `https://www.westjet.com/en-ca/book-trip/flights?tripType=one-way&origin=${origin}&destination=${destination}&departDate=${departureDate}&adults=1`;
      
    case 'AC': // Air Canada
      return `https://www.aircanada.com/en/ca/aco/home.html#/search?tripType=O&org0=${origin}&dest0=${destination}&departureDate0=${departureDate}&ADT=1&CNN=0&INF=0&INS=0`;
      
    case 'KL': // KLM
      return `https://www.klm.com/en-gb/search?adults=1&children=0&infants=0&cabin=ECONOMY&outbound=${origin}-${destination}-${departureDate}`;
      
    case 'AF': // Air France
      return `https://wwws.airfrance.fr/search/offers?_ga=&adults=1&cabin=EC&tripType=ONE_WAY&origin=${origin}&destination=${destination}&outboundDate=${departureDate}`;
      
    case 'BW': // Caribbean Airlines
      return `https://www.caribbean-airlines.com/flights/search?origin=${origin}&destination=${destination}&departDate=${departureDate}&adults=1&tripType=1`;
      
    case 'WN': // Southwest
      return `https://www.southwest.com/air/booking/select.html?originationAirportCode=${origin}&destinationAirportCode=${destination}&departureDate=${departureDate}&passengerCount=1&tripType=oneway`;
      
    case 'NK': // Spirit
      return `https://www.spirit.com/book/${origin}/${destination}/${departureDate}`;
      
    case 'TOM': // TUI
      return `https://www.tui.co.uk/destinations/`;
      
    default:
      // Fallback: Google Flights (not Skyscanner)
      return `https://www.google.com/travel/flights/search?q=flights%20from%20${origin}%20to%20${destination}&curr=GBP`;
  }
}