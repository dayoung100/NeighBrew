import { useState, useEffect } from 'react';
import './App.css';
import { useNavigate, Route, Routes } from 'react-router-dom';
import FirstLoading from './UI/etc/FirstLoading';
import Login from './UI/user/Login';
import Main from './UI/home/Main';

function App() {
  const navigate = useNavigate();
  const [isLodaing, setIsLoading] = useState(false); // 개발시 isLoading true로 두고 하기

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
      console.log(isLodaing);
    }, 3000);
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!isLodaing && <FirstLoading />}
              {isLodaing && <Login></Login>}
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Main />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
