export default class VSTSService {
  constructor() {
    this.graphUrl = 'https://microsoft.visualstudio.com/OSGS/OEM%20Big%20Catalog%20and%20Pricing/_apis/work/backlogs/1808?api-version=4.1-preview.1';
  }

  getSprintWorkItems = token => {
    console.log(token);
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    const options = {
      headers
    };
    return fetch(`${this.graphUrl}`, options)
      .then((response) => {
        console.log(response.json);
        return response;
      })
      .catch(response => {
        console.error(response.text());
        return response.text();
      });
  };
}