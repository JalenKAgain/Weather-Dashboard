
import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}


class HistoryService {
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  private async write(city: City[]) {
    return await fs.writeFile('db/db.json', JSON.stringify(city, null, '\t'));
  }

  async getCity() {
    return await this.read().then((city) => {
      let parsedCity: City[];


      try {
        parsedCity = [].concat(JSON.parse(city));
      } catch (err) {
        parsedCity = [];
      }

      return parsedCity;
    });
  }

  async addCity(city: string) {
    if (!city) {
      throw new Error('state cannot be blank');
    }


    const newCity: City = { name: city, id: uuidv4() };


    return await this.getCity()
      .then((city) => {
        if (city.find((index) => index.name === city)) {
          return city;
        }
        return [...city, newCity];
      })
      .then((updatedCity) => this.write(updatedCity))
      .then(() => newCity);
  }

  async removeCity(id: string) {
    return await this.getCity()
      .then((city) => City.filter((city) => city.id !== id))
      .then((filteredCity) => this.write(filteredCity));
  }

}

export default new HistoryService();
