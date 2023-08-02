// 술장에 술 정보를 입력하고 올릴 수 있는 create창입니다.
//

import DrinkCategory from "../drinkCategory/DrinkCategory";
import styled from "styled-components";
import { useState, useRef } from "react";
import createButton from "../../assets/createButton.svg";
import imageButton from "../../assets/imageButton.svg";
import defaultImage from "../../assets/defaultImage.svg";
import { callApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import ImageInput from "../components/ImageInput";
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
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

// 실질적으로 정보를 입력할 input tag입니다.
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

// 도수 관련 정보 입력은 한 줄로 되어있습니다.
// 따라서 InputDiv에 있는 justifyContent : space-around부분이 없습니다.
const InputDivAlcohol = styled.span`
  width: 100%;
  background-color: white;
  position: sticky;
  height: 2.5rem;
  box-sizing: border-box;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
`;

// 도수 관련 input tag는 작습니다.
// 따라서 width는 15%으로 맞춰져있습니다.
const InputAlcohol = styled.input`
  font-size: 18px;
  width: 15%;
  height: 70%;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  outline: none;

  &:focus {
    border-bottom: 2px solid var(--c-black);
  }
`;

const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
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
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

const ImageArea = styled.div<{ src: string }>`
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
  border-radius: 15px;
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
  const [drinkType, setDrinkType] = useState("");
  const [drinkDescription, setDrinkDescription] = useState("");
  const [drinkAlcohol, setDrinkAlcohol] = useState("");

  const navigate = useNavigate();

  const drinkNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrinkName(e.target.value);
    console.log("name");
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

  const uploadImageToServer = async imgFile => {
    const file = imgRef.current.files[0];
    try {
      const formData = new FormData();
      formData.append("image", file);
      console.log(file);
      console.log(formData);
      // console.log(imgFile);
      const response = await axios.post("http://i9b310.p.ssafy.io/api/img/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
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
    console.log(imageUrl);
    try {
      callApi("post", "api/drink", {
        name: drinkName,
        image: imageUrl,
        description: drinkDescription,
        degree: drinkAlcohol,
        tagId: selectedCategory,
      })
        .then(res => {
          console.log(res.data);
          navigate(`/drinkpost/${res.data.drinkId}`);
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ border: "2px solid black" }}>
      <h3>술 문서 등록하기</h3>
      <div style={{ textAlign: "start", margin: "0px 15px 80px 15px" }}>
        <GuideText>이름</GuideText>
        <InputDiv>
          <Input
            value={drinkName}
            onChange={drinkNameHandler}
            placeholder="ex. 글렌피딕 15년, 테라스 가우다"
            autoFocus
          ></Input>
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
        </InputDiv>
        <InputDivAlcohol>
          <h3 style={{ marginRight: "1rem" }}>도수</h3>
          <InputAlcohol value={drinkAlcohol} onChange={drinkAlcoholHandler}></InputAlcohol>
          <p>%</p>
        </InputDivAlcohol>
        <QuestionDiv style={{ textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title style={{ margin: "0" }}>대표 이미지</Title>
            <ImgInput>
              <label htmlFor="img_file">
                <img src="/src/assets/imageButton.svg" style={{ margin: "0 0.5rem" }} />
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
        {/* <div style={{ marginTop: "20px", display: "flex", alignItems: "flex-end" }}>
          <span>
            <b>대표 이미지</b>
          </span>
          <span style={{ marginLeft: "12px" }}>
            <img src={imageButton} alt="chumbuFilePicture" />
          </span>
          <span style={{ marginLeft: "15px" }}>
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
