// 로그인 화면, 회원 가입을 누르면 Signup.tsx로 이동
import { Input, Alert } from '../../style/common';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUpData } from '../../Type/types';
import axios from 'axios';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginValid, setIsLoginValid] = useState(''); // 오류시 오류 메세지 출력
  const navigate = useNavigate();
  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const loginHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return navigate('/home');
    // 로그인 로직
    axios
      .get('url')
      .then(res => {
        if (res.data === 'success') {
          navigate('/home');
        } else {
          setIsLoginValid(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <>
      <h2>로그인</h2>
      <br />
      <form action="submit">
        {isLoginValid && (
          <p>
            <Alert>{isLoginValid}</Alert>
          </p>
        )}
        <label htmlFor="ID">아이디</label>
        <Input
          type="text"
          placeholder="아이디를 입력해주세요"
          id="ID"
          value={id}
          onChange={onChangeId}
        />
        <br />
        <label htmlFor="PASSWORD">비밀번호</label>
        <Input
          type="text"
          placeholder="비밀번호를 입력해주세요"
          id="PASSWORD"
          value={password}
          onChange={onChangePassword}
        />
        <button onClick={loginHandler}>로그인 하기</button>
      </form>
    </>
  );
};
export default Login;
