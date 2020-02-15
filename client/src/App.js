/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { auth, createUserProfileDocument } from "./firebase/util";
import { setCurrentUser } from "./redux/actions/userAction";
import Auth from "./components/Auth/Auth";

import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import Sell from "./components/Sell/sell"
import Logout from './components/Logout/logout';
import Footer from './components/Footer/Footer'
const App = ({ setCurrentUser, currentUser }) => {
  let unsubscribeFromAuth = null;

  useEffect(() => {
    unsubscribeFromAuth = auth.onAuthStateChanged(async user => {
      if (user) {
        // if user sign in
        const userRef = await createUserProfileDocument(user);
        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: snapShot.id,
              ...snapShot.data()
            })
          );
        });
      } else {
        setCurrentUser(null);
      }
    });
    // Clean up (componentWillUnmoont)
    return () => {
      unsubscribeFromAuth();
    };
  }, []);

  const renderAuthPage = () => {
    if (localStorage.getItem("user") || currentUser) {
      return <Redirect to="/" />;
    }
    if (!localStorage.getItem("user")) {
      return <Route exact path="/auth" component={Auth} />;
    }
    if (!currentUser) {
      return <Route exact path="/auth" component={Auth} />;
    }
  };
  return (
    <div>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path='/sellProduct' component={Sell} />
        <Route path='/logout' component={Logout} />
        <Route path="/chat" component={Chat} />
        {renderAuthPage()}
      </Switch>
      <Footer />
    </div>
  );
};

const mapStateToProps = state => ({
  currentUser: state.users.currentUser
});

export default connect(mapStateToProps, { setCurrentUser })(App);
