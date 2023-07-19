// import axios from 'axios'
import { styled } from "styled-components";

const ShowcaseBody = styled.div`
  background-color: var(--c-black);
  color: white;
`;

const drinkpost = () => {
  return (
    <ShowcaseBody>
      <h1>술장</h1>
      <div className="showcase">
        <span className="drinkcard">
          <img></img>
        </span>
        <span className="drinkcard">
          <img></img>
        </span>
        <span className="drinkcard">
          <img></img>
        </span>
        <span className="drinkcard">
          <img></img>
        </span>
      </div>
    </ShowcaseBody>
  );
};

export default drinkpost;
