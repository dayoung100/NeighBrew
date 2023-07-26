import styled from "styled-components";
import { useState, useRef } from "react";

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

const ImageInput = () => {
  //파일 업로드 용
  const [imgFile, setImgFile] = useState("");
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

  return (
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
  );
};
export default ImageInput;
