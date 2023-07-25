import backIcon from "../../assets/backIcon.svg";
import createButton from "../../assets/createButton.svg";
import defaultImage from "../../assets/defaultImage.svg";
import imageButton from "../../assets/imageButton.svg";
import styled from "styled-components";
import { useState } from "react";

const Navdiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateBody = styled.div`
  border: 2px solid black;
`;

const InputDiv = styled.div`
  margin-left: 36px;
  text-align: start;
`;

const ImageDiv = styled.div`
  margin-left: 36px;
  text-align: start;
`;

const Input = styled.textarea`
  border-radius: 12px;
`;

const DrinkpostReviewCreate = () => {
  const [review, setReview] = useState("");
  const reviewHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  return (
    <>
      <Navdiv>
        <div style={{ marginLeft: "10px" }}>
          <img src={backIcon} alt="" />
        </div>
        <h2>술 이름</h2>
        <div style={{ visibility: "hidden" }}>A</div>
      </Navdiv>
      <CreateBody>
        <InputDiv>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="review">
              <b>후기 작성</b>
            </label>
          </div>
          <Input
            id="review"
            rows={8}
            cols={40}
            placeholder="후기 글을 작성해주세요."
            onChange={reviewHandler}
            autoFocus
          ></Input>
        </InputDiv>
        <ImageDiv>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>이미지 등록</span>
            <span>
              <img src={imageButton} alt="" />
            </span>
          </div>
          <div>
            <img src={defaultImage} alt="" />
          </div>
        </ImageDiv>
        <div style={{ marginTop: "80%" }}>
          <img src={createButton} alt="" />
        </div>
      </CreateBody>
    </>
  );
};
export default DrinkpostReviewCreate;
