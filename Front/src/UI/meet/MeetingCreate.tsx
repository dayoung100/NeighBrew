/*
[MeetingCreate.tsx]
모임 생성 페이지
모임 이름, 주종 카테고리, 술 검색, 위치, 시간, 조건, 설명, 이미지 첨부 가능
*/
import { useState, useRef, useEffect } from "react";
import NavbarSimple from "../navbar/NavbarSimple";
import styled, { css } from "styled-components";
import DrinkCategory from "../drinkCategory/DrinkCategory";
import SearchBox from "../components/SearchBox";
import FooterBigBtn from "../footer/FooterBigBtn";
import OneLineListItem from "../components/OneLineListItem";
import ListInfoItem from "../components/ListInfoItem";
import autoAnimate from "@formkit/auto-animate";

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  margin-bottom: 0.5rem;
`;

const SubTitle = styled.div`
  font-family: SeoulNamsan;
  font-size: 14px;
  text-align: left;
`;

const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  background: white;
  text-align: left;
  padding: 2% 0;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  font-family: "SeoulNamsan";
  font-size: 14px;
  outline: none;
  &::placeholder {
    color: var(--c-gray);
  }
`;

const InputShort = styled(Input)`
  width: 4rem;
  padding: 1% 3%;
  text-align: right;
`;

const DropdownInput = styled.select`
  width: 4rem;
  background: white;
  text-align: right;
  padding: 1% 3%;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  font-family: "SeoulNamsan";
  outline: none;
  -webkit-appearance: none; /* 화살표 없애기 for chrome*/
  -moz-appearance: none; /* 화살표 없애기 for firefox*/
  appearance: none; /* 화살표 없애기 공통*/
`;

const SearchResultDiv = styled.div`
  border-radius: 15px;
  border: 1px solid var(--c-gray);
  height: 12rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
`;

const AddBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: var(--c-yellow);
  width: 5rem;
  margin: auto auto;
  padding: 2% 5%;
  border-radius: 20px;
  font-family: "SeoulNamsan";
  font-size: 7px;
`;

const DateAndTimeInputStyle = css`
  color: var(--c-black);
  width: 45%;
  font-family: "SeoulNamsan";
  text-align: right;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  background: white;
  font-size: 14px;
  outline: none;
`;

const DateInput = styled.input.attrs({ type: "date" })`
  ${DateAndTimeInputStyle}
`;

const TimeInput = styled.input.attrs({ type: "time" })`
  ${DateAndTimeInputStyle}
`;

const CateDiv = styled.div`
  height: 10rem;
  div {
    margin: 0;
  }
  .first,
  .second {
    display: flex;
    justify-content: space-around;
    margin-top: 0.5rem;
  }
`;

const InfoTextArea = styled.textarea`
  width: 90%;
  height: 10rem;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid var(--c-gray);
  border-radius: 15px;
  outline: none;
  font-family: "SeoulNamsan";
  font-size: 14px;
  resize: none;
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

const MeetingCreate = () => {
  //파일 업로드 용
  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef<HTMLInputElement>(null);
  //검색 결과 창 애니메이션 용
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  //검색 결과 데이터
  const [searchResultList, setSearchResultList] = useState([
    "조니워커 블루라벨",
    "조니워커 레드라벨",
    "클렌피딕 15Y",
    "클렌피딕 12Y",
    "와일드터키 8Y",
    "버팔로 트레이스",
    "탈리스커 10Y",
    "몽키숄더",
    "발렌타인 17Y",
    "발렌타인 21Y",
  ]);
  //검색 후 선택한 주류 정보
  const [selectedDrink, setSelectedDrink] = useState("");
  const getDrink = (drink: string) => {
    setSelectedDrink(drink);
    setIsSearchFocused(false);
  };
  useEffect(() => {
    console.log(selectedDrink);
  }, [selectedDrink]);
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
    <div>
      <header>
        <NavbarSimple title="모임 만들기" />
      </header>
      <div style={{ padding: "0 1.5rem", marginBottom: "7rem" }}>
        <QuestionDiv>
          <Title>모임의 이름</Title>
          <Input placeholder="모임의 이름을 입력해주세요" />
        </QuestionDiv>
        <QuestionDiv ref={parent}>
          <Title>우리가 마실 것은</Title>
          <SubTitle>카테고리를 선택해주세요</SubTitle>
          <CateDiv>
            <DrinkCategory />
          </CateDiv>
          <SubTitle style={{ marginBottom: "0.3rem" }}>
            정확한 술의 이름을 검색할 수 있어요
          </SubTitle>
          {selectedDrink === "" && (
            <div onFocus={() => setIsSearchFocused(true)}>
              <SearchBox placeholder="" />
            </div>
          )}
          {isSearchFocused && selectedDrink === "" && (
            <SearchResultDiv>
              <div style={{ overflow: "auto", height: "100%", flexGrow: "1" }}>
                {searchResultList.map(res => {
                  return (
                    <OneLineListItem content={res} tag="주종" getFunc={getDrink}></OneLineListItem>
                  );
                })}
              </div>
              <div
                style={{
                  position: "sticky",
                  bottom: "0",
                  height: "3rem",
                  zIndex: "3",
                }}
              >
                <AddBtn>
                  <img src="/src/assets/plusButton.svg" width="13rem" />
                  <div>문서 추가하기</div>
                </AddBtn>
              </div>
            </SearchResultDiv>
          )}
          {selectedDrink !== "" && (
            <ListInfoItem
              title={selectedDrink}
              imgSrc="/src/assets/ForTest/backgroundImg.jpg"
              tag="주종"
              content="술에 대한 내용"
              numberInfo={3}
              isWaiting={false}
              outLine={true}
              routingFunc={null}
            />
          )}
        </QuestionDiv>
        <QuestionDiv>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "SeoulNamsan",
              fontSize: "14px",
            }}
          >
            <Title>위치</Title>
            <DropdownInput>
              <option>대전</option>
              <option>서울</option>
            </DropdownInput>
            시
            <DropdownInput>
              <option>유성</option>
              <option>동구</option>
            </DropdownInput>
            구
            <DropdownInput>
              <option>덕명</option>
              <option>봉명</option>
            </DropdownInput>
            동
          </div>
          <Input
            placeholder="업장의 이름 등 세부 위치를 입력해주세요"
            style={{ marginTop: "0.5rem" }}
          />
        </QuestionDiv>
        <QuestionDiv>
          <Title>시간</Title>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <DateInput />
            <TimeInput />
          </div>
        </QuestionDiv>
        <QuestionDiv style={{ fontFamily: "SeoulNamsan", fontSize: "14px" }}>
          <Title>조건</Title>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <SubTitle>최대 인원</SubTitle>
            <InputShort />명
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <img src="/src/assets/liver.svg" />
            <SubTitle>간수치</SubTitle>
            <InputShort placeholder="40" />
            IU/L이상
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <img src="/src/assets/age.svg" />
            <SubTitle>나이</SubTitle>
            <InputShort placeholder="20" />
            세 이상
            <InputShort placeholder="100" />세 미만
          </div>
        </QuestionDiv>
        <QuestionDiv>
          <Title>설명</Title>
          <InfoTextArea placeholder="모임에 대한 소개글을 작성해주세요"></InfoTextArea>
        </QuestionDiv>
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
      </div>
      <footer>
        <FooterBigBtn
          content="모임 만들기"
          color="var(--c-yellow)"
          bgColor="white"
          reqFunc={null}
        />
      </footer>
    </div>
  );
};
export default MeetingCreate;
