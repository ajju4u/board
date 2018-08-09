import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AuthService from './services/auth.service';
import GraphService from './services/graph.service';
import VSTSService from "./services/vsts.service";

class App extends Component {
  constructor() {
    super();
    this.authService = new AuthService();
    this.graphService = new GraphService();
    this.vsts = new VSTSService();
    this.state = {
      user: null,
      userInfo: null,
      workItems: null,
      apiCallFailed: false,
      loginFailed: false
    };
  }

  callGraphAPI = () => {
    this.setState({
      apiCallFailed: false
    });
    this.authService.getToken().then(
      token => {
        this.graphService.getUserInfo(token).then(
          data => {
            this.setState({
              userInfo: data
            });
          },
          error => {
            console.error(error);
            this.setState({
              apiCallFailed: true
            });
          }
        );
      },
      error => {
        console.error(error);
        this.setState({
          apiCallFailed: true
        });
      }
    );
  };

  callVSTSAPI = () => {
    this.setState({
      apiCallFailed: false
    });
    this.authService.getToken().then(
      token => {
        this.vsts.getSprintWorkItems(token).then(
          data => {
            this.setState({
              workItems: data
            });
          },
          error => {
            console.error(error);
            this.setState({
              apiCallFailed: true
            });
          }
        );
      },
      error => {
        console.error(error);
        this.setState({
          apiCallFailed: true
        });
      }
    );
  };

  componentDidMount() {
    var user = this.authService.getUser();
    if (user) {
      this.setState({
        user: user
      });
    } else {
      this.setState({
        loginFailed: true
      });
      this.login();
    }
 }

  logout = () => {
    this.authService.logout();
  };

  login = () => {
    this.setState({
      loginFailed: false
    });
    this.authService.login().then(
      user => {
        if (user) {
          this.setState({
            user: user
          });
        } else {
          this.setState({
            loginFailed: true
          });
        }
      },
      () => {
        this.setState({
          loginFailed: true
        });
      }
    );
  };

  render() {
    let templates = [];
    if (this.state.user) {
      templates.push(
        <div key="loggedIn">
          <button onClick={this.callGraphAPI} type="button">
            Call Graph's /me API
          </button>
          <button onClick={this.callVSTSAPI} type="button">
            Call VSTS API
          </button>
          <button onClick={this.logout} type="button">
            Logout
          </button>
          <h3>Hello {this.state.user.name}</h3>
        </div>
      );
    } else {
      var loginStyle = {
        "text-align":"right"
      };
      templates.push(
        <div key="loggedIn" style={{loginStyle}}>
          <button onClick={this.login} type="button" >
            Login with Microsoft
          </button>
        </div>
      );
    }
    if (this.state.userInfo) {
      templates.push(
        <pre key="userInfo">{JSON.stringify(this.state.userInfo, null, 4)}</pre>
      );
    }
    if (this.state.loginFailed) {
      templates.push(<strong key="loginFailed">Login unsuccessful</strong>);
    }
    if (this.state.apiCallFailed) {
      templates.push(
        <strong key="apiCallFailed">Graph API call unsuccessful</strong>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <div><img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Service </h1>
          </div>
        </header>
        {templates}
      </div>
    );
  }
}

export default App;
