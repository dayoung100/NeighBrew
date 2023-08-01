import backIcon from "../../assets/backIcon.svg";
import createButton from "../../assets/createButton.svg";
import defaultImage from "../../assets/defaultImage.svg";
import imageButton from "../../assets/imageButton.svg";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { callApi } from "../../utils/api";
import { User, Drink } from "../../Type/types";
import detail from "./DrinkpostDetail";
import { useParams, useNavigate } from "react-router-dom";
import ImageInput from "../components/ImageInput";

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
  margin-bottom: 30px;
`;

const ImageDiv = styled.div`
  margin-left: 36px;
  text-align: start;
`;

const Input = styled.input`
  font-size: 20px;
  width: 98%;
  height: 70%;
  border: none;
  border-bottom: 1px solid #444;
  outline: none;
  &:focus {
    border-bottom: 2px solid #000000;
  }
`;

const DrinkpostReviewCreate = () => {
  const navigate = useNavigate();
  const { drinkId } = useParams();
  const [drink, setDrink] = useState<Drink>();
  const [review, setReview] = useState("");
  const [myInfo, setMyInfo] = useState<User>();
  const reviewHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReview(e.target.value);
  };
  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`)
      .then(res => {
        setDrink(res.data);
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    callApi("get", `api/user/guard/myinfo`)
      .then(res => {
        console.log(res.data);
        setMyInfo(res.data);
        console.log(myInfo);
      })
      .catch(err => console.log(err));
  }, []);

  const reviewSubmit = () => {
    callApi("post", "api/drinkreview/guard", {
      myInfo: myInfo.userId,
      drinkId: drinkId,
      content: review,
      img: null,
    })
      .then(res => {
        console.log(res);
        console.log("잘댐");
        navigate(`/drinkpost/${drinkId}`);
      })
      .catch(err => {
        console.log(err);
        console.log("안댐");
      });
  };
  return (
    <>
      <Navdiv>
        <div style={{ marginLeft: "10px" }}>
          <img src={backIcon} alt="" />
        </div>
        <h2 onClick={() => navigate(`/drinkpost/${drinkId}`)}>{drink?.name}</h2>
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
            placeholder="후기 글을 작성해주세요."
            onChange={reviewHandler}
            autoFocus
          ></Input>
        </InputDiv>
        <div style={{ marginLeft: "36px" }}>
          <ImageInput></ImageInput>
        </div>

        <div onClick={reviewSubmit} style={{ marginTop: "80%" }}>
          <img src={createButton} alt="" />
        </div>
      </CreateBody>
    </>
  );
};
export default DrinkpostReviewCreate;
