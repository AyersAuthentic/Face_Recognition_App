
import Particles from 'react-particles-js'
import Navigation from './component/Navigation/Navigation';
import Signin from './component/Signin/Signin';
import Clarifai from 'clarifai';
import Face from './component/Face/Face';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import './App.css';
import { Component } from 'react';

const app = new Clarifai.App({
  apiKey: '86e16886bcd94baa96e3c53c9b0237d9'
});

const particlesOptions = {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
  }



class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = (event) => {
    this.setState({imageUrl: this.state.input});

    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
          <Particles className='particles'
              params={particlesOptions}
            />
        <Navigation />
        <Signin />
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onSubmit={this.onSubmit}/>
        <Face box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
