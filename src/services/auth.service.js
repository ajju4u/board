import * as Msal from 'msal';

const applicationConfig = {
  clientID: '214ec7d0-64cf-4f7f-89d2-a7445c8440f9',
  graphScopes: ['user.read'],
  redirectUri: window.location.origin
};

export default class AuthService {

  app = new Msal.UserAgentApplication(
    applicationConfig.clientID,
    '',
    this.authCallback,
    {
      cacheLocation:'localStorage',
      loadFrameTimeout:6000,
      redirectUri: applicationConfig.redirectUri
    }
  );

  constructor() {
    
  }
  authCallback = (errorDesc, token, error, tokenType) => {
    if (token) {
      debugger;
      console.log('loginRedirect- Success');
      this.app.acquireTokenSilent(applicationConfig.graphScopes).then(
        accessToken => {
          this.access_token = accessToken;
          console.log('ACCESS TOKEN: \n ' + this.access_token);
          this.user = this.app.getUser(); // AZURE AD
          this.isAuthenticated = true;
        },
        acquireTokenSilentError => {
          console.log('acquireTokenSilent- Error:\n' + acquireTokenSilentError);
          this.app.acquireTokenRedirect(applicationConfig.graphScopes).then(accessToken => {
            console.log('acquireTokenRedirect- Success:\n' + accessToken);
          },
            acquireTokenRedirectError => {
              console.log('acquireTokenRedirect- Error:\n' + acquireTokenRedirectError);
            });
        }
      );
    } else {
      console.log('Error during login:\n' + error);
      console.log('Error Description of login error:', errorDesc);
    }
  }

  login = () => {
    return this.app.loginRedirect(applicationConfig.graphScopes).then(
      idToken => {
        const user = this.app.getUser();
        if (user) {
          return user;
        } else {
          return null;
        }
      },
      () => {
        return null;
      }
    );
  };
  logout = () => {
    this.app.logout();
  };
  getUser = () => {
    return this.app.getUser();
  }
  getToken = () => {
    return this.app.acquireTokenSilent(applicationConfig.graphScopes).then(
      accessToken => {
        return accessToken;
      },
      error => {
        return this.app
          .acquireTokenPopup(applicationConfig.graphScopes)
          .then(
            accessToken => {
              return accessToken;
            },
            err => {
              console.error(err);
            }
          );
      }
    );
  };
}
