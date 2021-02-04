import './App.css';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
  return (
    <Fragment>
      <Router>
        <Header />
        <main class='py-3'>
          <Container>
            <Route path='/' component={HomeScreen} exact></Route>
            <Route path='/product/:id' component={ProductScreen}></Route>
          </Container>
        </main>
        <Footer />
      </Router>
    </Fragment>
  );
};

export default App;
