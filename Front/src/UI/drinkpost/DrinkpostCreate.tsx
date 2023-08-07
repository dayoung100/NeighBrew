// 술장에 술 정보를 입력하고 올릴 수 있는 create창입니다.
//

import DrinkCategory from "../drinkCategory/DrinkCategory";
import styled from "styled-components";
import { useState, useRef } from "react";
import createButton from "../../assets/createButton.svg";
import { callApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 여기부터 지정한 부분까지 style 부분입니다.
// GuideText는 h3 tag가 상하 margin을 너무 많이 잡아서 새로 만든 겁니다.
// 상하 margin을 적게 잡는 것 말고는 h3와 차이점은 없습니다.
const GuideText = styled.h3`
  margin-bottom: 0.5rem;
`;

// input tag를 안에 넣을 div tag입니다.
const InputDiv = styled.div`
  width: 100%;
  background-color: white;
  position: sticky;
  height: 2.5rem;
  box-sizing: border-box;
  margin-bottom: 0.1875rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

// 실질적으로 정보를 입력할 input tag입니다.
// placeholder 사이즈는 .625rem
const Input = styled.input`
  font-size: 1rem;
  width: 98%;
  height: 70%;
  border: none;
  border-bottom: 0.0625rem solid #444;
  outline: none;

  &:focus {
    border-bottom: 0.125rem solid #000000;
  }
`;

// 에러 메세지를 띄우기 위한 div tag입니다.
// display는 none으로 되어있습니다.
// 에러 메세지를 띄우기 위해서는 display를 block으로 바꿔주면 됩니다.
const ErrorMessage = styled.div<{
  style: { display: string };
}>`
  font-size: 0.75rem;
  color: red;
  margin-top: 0.3125rem;
  display: none;
`;

// 도수 관련 정보 입력은 한 줄로 되어있습니다.
// 따라서 InputDiv에 있는 justifyContent : space-around부분이 없습니다.
const InputDivAlcohol = styled.span`
  width: 100%;
  background-color: white;
  position: sticky;
  height: 2.5rem;
  box-sizing: border-box;
  margin-bottom: 0.1875rem;
  display: flex;
  align-items: center;
`;

// 도수 관련 input tag는 작습니다.
// 따라서 width는 15%으로 맞춰져있습니다.
// defalueValue는 0으로 되어있습니다.
const InputAlcohol = styled.input`
  font-size: 1.125rem;
  width: 15%;
  height: 70%;
  border: none;
  border-bottom: 0.0625rem solid var(--c-gray);
  outline: none;

  &:focus {
    border-bottom: 0.125rem solid var(--c-black);
  }

  &::placeholder {
    color: var(--c-gray);
  }
`;

const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 1.25rem;
  text-align: left;
  margin-bottom: 0.5rem;
`;

const ImgInput = styled.div`
  // label로 대신하고 input은 숨기기 위한 css
  input[type="file"] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    margin: -0.0625rem;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

const ImageArea = styled.div<{ src: string }>`
  background: url(${(props) => props.src}) no-repeat center;
  background-size: cover;
  border-radius: 0.9375rem;
  position: relative;
  width: 30%;
  padding-bottom: 30%;
  overflow: hidden;
`;

//여기까지 style 부분입니다.

// 서버로부터 받은 이미지 URL이나 정보를 리턴하거나 활용할 수 있습니다.

const DrinkpostCreate = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const getDrinkCategory = (tagId: number) => {
    setSelectedCategory(tagId);
  };
  const [drinkName, setDrinkName] = useState("");
  const [drinkDescription, setDrinkDescription] = useState("");
  const [drinkAlcohol, setDrinkAlcohol] = useState("");
  const [inputCheck, setInputCheck] = useState(false);

  const navigate = useNavigate();

  const drinkNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrinkName(e.target.value);
  };
  const drinkAlcoholHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrinkAlcohol(e.target.value);
  };
  const drinkDescriptionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrinkDescription(e.target.value);
  };

  const [imgFile, setImgFile] = useState(null);
  const imgRef = useRef<HTMLInputElement>(null);

  //이미지 파일 업로드 시 미리보기
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

  const uploadImageToServer = async (imgFile) => {
    const file = imgRef.current.files[0];
    try {
      const formData = new FormData();
      formData.append("img", file);
      const response = await axios.post(
        "http://i9b310.p.ssafy.io/api/img/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const submitHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    let imageUrl: string;
    if (imgFile !== null) {
      imageUrl = await uploadImageToServer(imgFile);
    } else {
      imageUrl = null;
    }

    try {
      callApi("post", "api/drink", {
        name: drinkName.trim(),
        image: imageUrl,
        description: drinkDescription.trim(),
        degree: drinkAlcohol,
        tagId: selectedCategory,
      })
        .then((res) => {
          // drinkdescription이 없을 경우
          // catch로 로 이동
          if (drinkDescription.trim().length === 0) {
            throw Error;
          }
          navigate(`/drinkpost/${res.data.drinkId}`);
        })
        .catch(() => {
          setInputCheck(true);
        });
    } catch (error) {}
  };

  return (
    <div>
      <h3>술 문서 등록하기</h3>
      <div
        style={{ textAlign: "start", margin: "0rem .9375rem 5rem .9375rem" }}
      >
        <GuideText>이름</GuideText>
        <InputDiv>
          <Input
            value={drinkName}
            onChange={drinkNameHandler}
            placeholder="ex. 글렌피딕 15년, 테라스 가우다"
            autoFocus
          ></Input>
          {/* 등록 버튼을 누르기전에는 숨겨져있음 */}
          <ErrorMessage
            style={{
              display:
                drinkName.trim().length === 0 && inputCheck ? "block" : "none",
            }}
          >
            이름을 입력해주세요.
          </ErrorMessage>
        </InputDiv>
        <h3>카테고리</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DrinkCategory getFunc={getDrinkCategory}></DrinkCategory>
        </div>
        <GuideText>설명</GuideText>
        <InputDiv>
          <Input
            value={drinkDescription}
            onChange={drinkDescriptionHandler}
            placeholder="ex. 탄닌 덕분에 은은한 단맛이 돌아요."
          ></Input>
          <ErrorMessage
            style={{
              display:
                drinkDescription.trim().length === 0 && inputCheck
                  ? "block"
                  : "none",
            }}
          >
            설명을 입력해주세요.
          </ErrorMessage>
        </InputDiv>
        <InputDivAlcohol>
          <h3 style={{ marginRight: "1rem" }}>도수</h3>
          <InputAlcohol
            value={drinkAlcohol}
            onChange={drinkAlcoholHandler}
          ></InputAlcohol>
          <p>%</p>
        </InputDivAlcohol>
        <QuestionDiv style={{ textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title style={{ margin: "0" }}>대표 이미지</Title>
            <ImgInput>
              <label htmlFor="img_file">
                <img
                  src="/src/assets/imageButton.svg"
                  style={{ margin: "0 .5rem" }}
                />
              </label>
              <input
                type="file"
                id="img_file"
                accept="image/jpg, image/png, image/jpeg"
                onChange={saveImgFile}
                ref={imgRef}
              />
            </ImgInput>
          </div>
          {imgFile && <ImageArea src={imgFile}></ImageArea>}
        </QuestionDiv>
        {/* <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "flex-end" }}>
          <span>
            <b>대표 이미지</b>
          </span>
          <span style={{ marginLeft: ".75rem" }}>
            <img src={imageButton} alt="chumbuFilePicture" />
          </span>
          <span style={{ marginLeft: ".9375rem" }}>
            <img src={defaultImage} alt="uploadedPicture" />
          </span>
        </div> */}
      </div>
      <div onClick={submitHandler}>
        <img src={createButton} alt="등록" />
      </div>
    </div>
  );
};

export default DrinkpostCreate;
