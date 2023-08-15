import backIcon from "../../assets/backIcon.svg";
import createButton from "../../assets/createButton.svg";
import defaultImage from "../../assets/defaultImage.svg";
import imageButton from "../../assets/imageButton.svg";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { callApi } from "../../utils/api";
import { User, Drink } from "../../Type/types";
import ImageInput from "../components/ImageInput";
import detail from "./DrinkpostDetail";
import FooterBigBtn from "../footer/FooterBigBtn";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarSimple from "../navbar/NavbarSimple";

const Navdiv = styled.div`
  font-family: "JejuGothic";
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateBody = styled.div`
  width: 100%;
`;

const InputDiv = styled.div`
  margin-left: 2rem;
  text-align: start;
  margin-bottom: 30px;
  margin-right: 2rem;
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

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  margin-bottom: 0.5rem;
`;
const ImageArea = styled.div<{ src: string }>`
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
  border-radius: 15px;
  position: relative;
  width: 70%;
  padding-bottom: 70%;
  overflow: hidden;
  margin-top: 1rem;
`;

const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const ImgInput = styled.div`
  // label로 대신하고 input은 숨기기 위한 css
  input[type="file"] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

const ImageInputBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 10px;
  background-color: var(--c-yellow);
  padding: 0.5rem;
  margin-left: 0.5rem;
`;

const ReselectBtn = styled.div`
  background: var(--c-lightgray);
  border-radius: 10px;
  width: 2rem;
  font-family: "NanumSquareNeo";
  font-size: 15px;
  padding: 0.5rem;
  margin-left: 0.5rem;
  text-align: center;
`;

const DrinkpostReviewCreate = () => {
  const navigate = useNavigate();
  const { drinkId, reviewId } = useParams();
  const [drink, setDrink] = useState<Drink>();
  const [review, setReview] = useState("");
  const [myInfo, setMyInfo] = useState<User>();
  const reviewHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };
  const myId = localStorage.getItem("myId");
  const [imgFile, setImgFile] = useState(null);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(myId);
    callApi("get", `api/drink/${drinkId}`)
      .then(res => {
        setDrink(res.data);
      })
      .catch(err => console.log(err));
    callApi("get", `api/drinkreview/review/${reviewId}`).then(res => {
      setReview(res.data.content);
      setImgFile(res.data.img);
    });
  }, []);
  useEffect(() => {
    callApi("get", `api/user/myinfo`)
      .then(res => {
        setMyInfo(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const reviewSubmit = () => {
    const file = imgFile;
    const formData = new FormData();

    formData.append("drinkReviewId", reviewId);
    formData.append("content", review);
    formData.append("upload", file);
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
      .put(`/api/drinkreview/${reviewId}`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          userId: localStorage.getItem("myId"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        console.log(res.data);
        navigate(`/drinkpost/${drinkId}`);
      })
      .catch(err => console.log(err));
  };

  const toPreviousPage = () => {
    navigate(`/drinkpost/${drinkId}`);
  };

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImgFile(reader.result);
      }
    };
  };

  const resetImgFile = () => {
    console.log("취소버튼 눌렀어요");
    imgRef.current.value = null;
    setImgFile(null); // 미리보기 초기화
    saveImgFile(); //부모 객체로 전달
    // props.getFunc(null);
    // props.getImgSrc("no image");
  };

  return (
    <>
      <NavbarSimple title={drink?.name} />
      <CreateBody>
        <InputDiv>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="review">
              <b style={{ fontFamily: "JejuGothic" }}>후기 수정</b>
            </label>
          </div>
          <LongTextInput
            id="review"
            value={review}
            placeholder="후기 글을 수정해주세요."
            onChange={reviewHandler}
            autoFocus
          ></LongTextInput>
        </InputDiv>
        <div style={{ marginLeft: "36px" }}>
          <QuestionDiv style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Title style={{ margin: "0" }}>대표 이미지</Title>
              <ImgInput>
                <label htmlFor="img_file">
                  <ImageInputBtn>
                    <img src="/src/assets/imagePlusIcon.svg" width="90%" />
                  </ImageInputBtn>
                </label>
                <input
                  type="file"
                  id="img_file"
                  accept="image/jpg, image/png, image/jpeg"
                  onChange={saveImgFile}
                  ref={imgRef}
                />
              </ImgInput>
              {imgFile && <ReselectBtn onClick={resetImgFile}>취소</ReselectBtn>}
            </div>
            {imgFile && <ImageArea src={imgFile}></ImageArea>}
          </QuestionDiv>
        </div>
      </CreateBody>
      <FooterBigBtn content="등록하기" color="var(--c-yellow)" reqFunc={reviewSubmit} />
    </>
  );
};
export default DrinkpostReviewCreate;
