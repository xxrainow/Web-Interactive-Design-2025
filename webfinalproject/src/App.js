import './App.css';
import IntroPage from './pages/Intro/IntroPage';

function App() {
  const handleEnter = () => {
    console.log('다음 페이지로 이동!');
  };

  return (
    <div className="App">
      <IntroPage onEnter={handleEnter} />
    </div>
  );
}

export default App;
