import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object


// TODO: Define a class for the Weather object

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL?: string;

  private apiKey?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }

  async getWeatherByCity(city: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/city?limit=10&stateCode=${city}&api_key=${this.apiKey}`
      );

      const weather = await response.json();

      const mappedWeather = await this.parkDataMapping(weather.data);
      return mappedWeather;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }

  async WeatherDataMapping(weather: Weather[]) {
    const weatherArray: Weather[] = weather.map((weather) => {
      const weatherObject: Weather = {
        id: weather.id,
        fullName: weather.fullName,
        description: weather.description,
        url: weather.url,
        designation: weather.designation,
        images: weather.images,
      };

      return weatherObject;
    });

    return weatherArray;
  }

  async getClosestEventByState(state: string): Promise<ParkEvent | string> {
    try {
      const response = await fetch(
        `${this.baseURL}/events?limit=10&stateCode=${state}&api_key=${this.apiKey}`
      );

      const events = await response.json();

      const mappedEvents = await this.parkEventDataMapping(events.data);

      if (mappedEvents.length === 0) {
        return 'No events found';
      }

      const closestEvent = await this.findClosestParkEvent(mappedEvents);
      return closestEvent;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async parkEventDataMapping(parkEvent: ParkEvent[]) {
    const parkEventsArray: ParkEvent[] = parkEvent.map((occasion) => {
      const parkEventObject: ParkEvent = {
        id: occasion.id,
        title: occasion.title,
        location: occasion.location,
        description: occasion.description,
        infourl: occasion.infourl || 'No URL Available',
        datestart: occasion.datestart,
        dateend: occasion.dateend,
      };

      return parkEventObject;
    });

    return parkEventsArray;
  }

  async findClosestParkEvent(events: ParkEvent[]) {
    const today = new Date();
    const closestEvent = events.reduce((prev, current) => {
      const prevDate = new Date(prev.datestart);
      const currentDate = new Date(current.datestart);
      const prevDiff = Math.abs(today.getTime() - prevDate.getTime());
      const currentDiff = Math.abs(today.getTime() - currentDate.getTime());
      return prevDiff < currentDiff ? prev : current;
    });

    return closestEvent;
  }

  async convertStateNameToCode(state: string) {
    const stateCodes = await this.read();
    const parsedStateCodes = JSON.parse(stateCodes);
    const foundState = parsedStateCodes.filter((stateObject: StateObject) => {
      //ensuring casing of input does not matter
      return stateObject.stateName.toLowerCase() === state.toLowerCase();
    });

    const stateCode = foundState[0].stateCode;
    return stateCode;
  }

  async convertStateCodeToName(stateCode: string) {
    const stateCodes = await this.read();
    const parsedStateCodes = JSON.parse(stateCodes);
    const foundState = parsedStateCodes.filter((stateObject: StateObject) => {
      //ensuring casing of input does not matter
      return stateObject.stateCode.toLowerCase() === stateCode.toLowerCase();
    });

    const stateName = foundState[0].stateName;
    return stateName;
  }

  private async read() {
    return await fs.readFile('db/stateCodes.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }
}

export default new ParkService();{

 
}

export default new WeatherService();
