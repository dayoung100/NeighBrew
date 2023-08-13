import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Drink, User } from "../../Type/types";
import { callApi } from "../../utils/api";
import ImageInput from "../components/ImageInput";
import FooterBigBtn from "../footer/FooterBigBtn";
import NavbarSimple from "../navbar/NavbarSimple";

const CreateBody = styled.div`
  width: 100%;
`;

const InputDiv = styled.div`
  margin-left: 2rem;
  text-align: start;
  margin-bottom: 30px;
  margin-right: 2rem;
`;

const LongTextInput = styled.textarea`
  font-family: "NanumSquareNeo";
  border: 1px solid var(--c-gray);
  width: 100%;
  height: 30vh;
  font-size: 1rem;
  border-radius: 8px;
  resize: none;
  outline: none;
  &:focus {
    border: 2px solid black;
  }
`;

const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const DrinkpostReviewCreate = () => {
  const navigate = useNavigate();
  const { drinkId } = useParams();
  const [drink, setDrink] = useState<Drink>();
  const [review, setReview] = useState("");
  const [myInfo, setMyInfo] = useState<User>();
  const reviewHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };
  const myId = localStorage.getItem("myId");
  const [imgFile, setImgFile] = useState(null);

  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`).then((res) => {
      setDrink(res.data);
    });
  }, []);
  useEffect(() => {
    callApi("get", `api/user/myinfo`).then((res) => {
      setMyInfo(res.data);
    });
  }, []);

  const reviewSubmit = () => {
    const file = imgFile;
    const formData = new FormData();

    formData.append("drinkId", drinkId);
    formData.append("content", review);
    formData.append("image", file);
    if (review === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    if (file) {
      if (file.size > 1024 * 1024 * 20) {
        alert("20MB 이하 이미지만 올릴 수 있습니다.");
        return;
      }
    }

    axios
      .post(`/api/drinkreview`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          UserID: myId,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // navigate(`/drinkpost/${drinkId}`, { replace: true });
        navigate(-1);
      });
  };

  return (
    <>
      <NavbarSimple title={drink?.name} />
      <CreateBody>
        <InputDiv>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="review">
              <b>후기 작성</b>
            </label>
          </div>
          {/* <Input
            id="review"
            placeholder="후기 글을 작성해주세요."
            onChange={reviewHandler}
            autoFocus
          ></Input> */}
          <LongTextInput
            id="review"
            value={review}
            placeholder="후기 글을 작성해주세요."
            onChange={reviewHandler}
            autoFocus
          ></LongTextInput>
        </InputDiv>
        <div style={{ marginLeft: "36px" }}>
          <QuestionDiv style={{ textAlign: "left" }}>
            <ImageInput getFunc={setImgFile} />
          </QuestionDiv>
        </div>
      </CreateBody>
      <FooterBigBtn
        content="등록하기"
        color="var(--c-yellow)"
        reqFunc={reviewSubmit}
      />
    </>
  );
};
export default DrinkpostReviewCreate;
