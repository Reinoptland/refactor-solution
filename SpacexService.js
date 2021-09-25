export class SpacexService {
  constructor(baseUrl, retries = 3) {
    this.baseUrl = baseUrl;
    this.retries = retries;
  }

  async getLaunches(retries = this.retries) {
    try {
      const response = await fetch(`${this.baseUrl}/launches`);
      const data = await response.json();
      return [null, data];
    } catch (error) {
      if (retries > 0) {
        this.getLaunches(retries - 1);
      } else {
        return [error, null];
      }
    }
  }
}

export default new SpacexService("https://api.spacexdata.com/v4");
