/*
[MeetingCreate.tsx]
모임 생성 페이지
모임 이름, 주종 카테고리, 술 검색, 위치, 시간, 조건, 설명, 이미지 첨부 가능
*/
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSimple from "../navbar/NavbarSimple";
import styled, { css } from "styled-components";
import DrinkCategory from "../drinkCategory/DrinkCategory";
import SearchBox from "../components/SearchBox";
import FooterBigBtn from "../footer/FooterBigBtn";
import OneLineListItem from "../components/OneLineListItem";
import ListInfoItem from "../components/ListInfoItem";
import ImageInput from "../components/ImageInput";
import { MeetDetail } from "../../Type/types";
import autoAnimate from "@formkit/auto-animate";
import { callApi } from "../../utils/api";
import { Drink } from "../../Type/types";
import {
  initialMeetDetail,
  initialDrink,
  initialSido,
  initialGugun,
  WhiteModal,
} from "../common";
import Modal from "react-modal";

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 24px;
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const SubTitle = styled.div`
  font-family: "NanumSquareNeo";
  font-size: 16px;
  text-align: left;
`;

const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const ReselectBtn = styled.div`
  background: var(--c-lightgray);
  border-radius: 10px;
  width: 3rem;
  font-family: "NanumSquareNeo";
  font-size: 15px;
  padding: 0.5rem;
  margin: 0.5rem 0 0 auto;
`;

const Input = styled.input`
  width: 100%;
  background: white;
  text-align: left;
  padding: 2% 0;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  font-family: "NanumSquareNeo";
  font-size: 16px;
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
  width: 5rem;
  background: white;
  text-align: right;
  padding: 1% 3%;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  font-family: "NanumSquareNeo";
  font-size: 16px;
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

const OnOffBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  height: 3rem;
  z-index: 3;
  padding: 0 1rem;
  font-family: "NanumSquareNeo";
`;

const DateAndTimeInputStyle = css`
  color: var(--c-black);
  width: 45%;
  font-family: "NanumSquareNeo";
  text-align: right;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  background: white;
  font-size: 16px;
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
  margin: 1rem 0 0.5rem 0;
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

const LimitDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
`;

const InfoTextArea = styled.textarea`
  width: 90%;
  height: 10rem;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid var(--c-gray);
  border-radius: 15px;
  outline: none;
  font-family: "NanumSquareNeo";
  font-size: 14px;
  resize: none;
`;

const ErrorDiv = styled.div`
  color: red;
  text-align: left;
  font-family: "NanumSquareNeo";
  font-size: 14px;
  padding: 0.5rem;
`;

const MeetingCreate = () => {
  //네비게이터: 모임 수정 후 모임 상세로 이동, 주류 추가 페이지로 이동
  const navigate = useNavigate();
  const GoMeetDetailHandler = (meetId: number) => {
    navigate(`/meet/${meetId}`);
  };
  //모달 관련
  const [isModalOn, setIsModalOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); //모달에 띄울 에러메시지

  //모임 및 유저 정보
  const [userId, setUserId] = useState(0); //현재 유저의 userId
  const [sidoList, setSidoList] = useState([initialSido]);
  const [gugunList, setGugunList] = useState([initialGugun]);

  //폼에 들어갈 state들
  const [meetTitle, setMeetTitle] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState(0); //주종카테고리
  const [selectedDrink, setSelectedDrink] = useState<Drink>(initialDrink); //주류
  const [sido, setSido] = useState(initialSido); //시도
  const [gugun, setGugun] = useState(initialGugun); //구군
  const [date, setDate] = useState(""); //날짜
  const [time, setTime] = useState(""); //시간
  const [maxParticipants, setMaxParticipants] = useState(8); //최대인원
  const [liverLimit, setLiverLimit] = useState(0); //간수치 제한
  const [minAge, setMinAge] = useState(0); //최소나이
  const [maxAge, setMaxAge] = useState(0); //최대나이
  const [meetDesc, setMeetDesc] = useState(""); //모임 소개
  const [imgSrc, setImgSrc] = useState<string>(""); //이미지 경로
  const [file, setFile] = useState(null); //파일 타입

  //검색 관련 state
  const [inputText, setInputText] = useState(""); //검색창에 입력된 텍스트
  const [searchResultList, setSearchResultList] = useState<Drink[]>([]); //주류 검색 결과 리스트

  //생성 버튼 클릭했는지 - 버튼 한번이라도 클릭 시에만 빨간 가이드 글씨 오픈
  const [btnClicked, setBtnClicked] = useState(false);

  //모임의 정보 초기 세팅
  useEffect(() => {
    setMeetTitle(initialMeetDetail.meetDto.meetName);
    setSelectedCategory(initialMeetDetail.meetDto.tagId); //주종카테고리
    setSelectedDrink(initialMeetDetail.meetDto.drink); //주류아이디
    setSido(initialSido); //시도
    setGugun(initialGugun); //구군
    setDate(formateDate(`${localDate()}T${localTime()}:00`)); //날짜
    setTime(formateTime(`${localDate()}T${localTime()}:00`)); //시간
    setMaxParticipants(initialMeetDetail.meetDto.maxParticipants); //최대인원
    setLiverLimit(initialMeetDetail.meetDto.minLiverPoint); //간수치 제한
    setMinAge(initialMeetDetail.meetDto.minAge); //최소 나이
    setMaxAge(initialMeetDetail.meetDto.maxAge); //최대 나이
    setMeetDesc(initialMeetDetail.meetDto.description); //모임 소개
    setImgSrc(initialMeetDetail.meetDto.imgSrc); //이미지 경로
    //로컬 스토리지에서 userId 가져오기
    setUserId(parseInt(localStorage.getItem("myId")));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    //시도 정보 미리 받아와 세팅하기
    callApi("get", "api/sido").then((res) => {
      setSidoList([initialSido, ...res.data]);
    });
  }, []);

  //선택한 시도에 따라 구군 fetch
  useEffect(() => {
    setGugun(initialGugun); //초기화
    callApi("get", `api/gugun/${sido.sidoCode}`).then((res) => {
      setGugunList([initialGugun, ...res.data]);
    });
  }, [sido]);

  //inputText로 술장 검색 api
  useEffect(() => {
    const promise = callApi(
      "get",
      `api/drink/search?tagId=${selectedCategory}&name=${inputText}`
    );
    promise.then((res) => {
      setSearchResultList(res.data.content);
    });
  }, [inputText, selectedCategory]);

  //카테고리 변경 시 주류 검색 결과 및 조건 초기화
  useEffect(() => {
    setSelectedDrink(initialDrink);
    setInputText("");
  }, [selectedCategory]);

  //주종 카테고리 선택
  const getDrinkCategory = (tagId: number) => {
    setSelectedCategory(tagId);
  };

  //검색 후 선택한 주류 정보, 즉 모임에 설정할 술 정보받아오기
  const getDrink = (drink: Drink) => {
    setSelectedDrink(drink);
    setIsSearchFocused(false);
  };

  //////////////api 호출 전 각종 데이터 검증//////////////
  //제목: 필수 입력/15자 이내
  const titleCheck = () => {
    return !(meetTitle === "" || meetTitle == null || meetTitle.length > 15);
  };

  //술: 필수 입력
  const drinkCheck = () => {
    return !(selectedDrink.drinkId === 0);
  };

  //위치: 필수 입력(구군은 필수x, 세종시 때문에)
  const positionCheck = () => {
    return !(sido.sidoCode === 0);
  };

  //날짜: 필수 입력/현재 시점 이후로
  const timeCheck = () => {
    return !(date === "" || time === "" || isDateTimeBeforeNow(date, time));
  };

  //최대인원: 필수 입력/최대 8명
  const participantsCheck = () => {
    return !(maxParticipants === 0 || maxParticipants > 8);
  };

  //간수치: 100이하
  const liverLimitCheck = () => {
    return !(liverLimit > 100);
  };

  //나이: 최소나이는 20세 이상/나이는 200이하
  const ageCheck = () => {
    return !(minAge < 20 || maxAge > 200);
  };

  //이미지: 이미지타입/이미지크기(5MB)
  const imgcheck = () => {
    return !(
      file &&
      (file.size > 1024 * 1024 * 5 || !file.type.startsWith("image/"))
    );
  };
  //////////////api 호출 전 각종 데이터 검증//////////////

  //필수 입력값 검증(위 내용 외에 추가로 모달창 오픈)
  const checkRequiredValue = () => {
    //빨간글씨가 하나라도 있으면 모달 오픈
    let isValid =
      titleCheck() &&
      drinkCheck() &&
      positionCheck() &&
      timeCheck() &&
      participantsCheck() &&
      liverLimitCheck() &&
      ageCheck() &&
      imgcheck();
    if (!isValid) {
      setErrorMsg("입력값을 확인해주세요.");
      return false;
    }
    //최대인원수 < 1
    // if (1 > maxParticipants) {
    //   setErrorMsg(`최대 인원수는 1명 이상이어야합니다.`);
    //   return false;
    // }
    // //최소 나이 > 최대 나이 일때
    // if (maxAge && minAge > maxAge) {
    //   setErrorMsg("최소 나이는 최대 나이보다 \n 클 수 없습니다.");
    //   return false;
    // }
    return true;
  };

  //필수가 아닌 입력값 검증
  const checkNonRequiredValue = (value: string | number) => {
    //숫자 값이 없는지 -> 있어야만 폼데이터에 넣음
    let res = value !== 0 && value != null && !Number.isNaN(value);
    return res;
  };

  //수정 완료 버튼 클릭 api
  const updateMeeting = async () => {
    setBtnClicked(true);
    //api 요청 전에 확인
    //입력 값들이 적절한가?
    if (!checkRequiredValue()) {
      setIsModalOn(true);
      return;
    }

    let f = new FormData();
    //필수 입력o
    f.append("userId", userId.toString());
    f.append("meetName", meetTitle);
    f.append("maxParticipants", maxParticipants.toString());
    f.append("meetDate", `${date}T${time}:00`);
    f.append("tagId", selectedCategory.toString());
    f.append("sido", sido.sidoCode.toString());
    f.append("gugun", gugun.gugunCode.toString());
    f.append(
      "drinkId",
      selectedDrink.drinkId !== 0 ? selectedDrink.drinkId.toString() : ""
    );
    //필수 입력x
    if (checkNonRequiredValue(liverLimit)) {
      f.append("minLiverPoint", liverLimit.toString());
    }
    if (checkNonRequiredValue(minAge)) {
      f.append("minAge", minAge.toString());
    }
    if (checkNonRequiredValue(maxAge)) {
      f.append("maxAge", maxAge.toString());
    }
    f.append("description", meetDesc);
    f.append("image", file);

    const promise = callApi("post", `/api/meet/create`, f);
    promise
      .then((res) => {
        GoMeetDetailHandler(res.data.meetId); //모임 상세 페이지로 이동
      })
      .catch((error) => {
        setErrorMsg(error.response.data);
        setIsModalOn(true);
      });
  };

  //검색 결과 창 애니메이션 용
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  //날짜와 변환 함수
  function formateDate(dateData: string) {
    const date = new Date(dateData);
    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

    return `${year}-${month}-${day}`;
  }

  //시간 변환 함수
  function formateTime(dateData: string) {
    const date = new Date(dateData);
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minute =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    return `${hour}:${minute}`;
  }

  //태그ID를 태그 이름으로 변환
  function getTagName(tagId: number) {
    const tag = [
      { tagId: 0, tagName: "전체" },
      { tagId: 1, tagName: "양주" },
      { tagId: 2, tagName: "전통주" },
      { tagId: 3, tagName: "전체" },
      { tagId: 4, tagName: "사케" },
      { tagId: 5, tagName: "와인" },
      { tagId: 6, tagName: "수제맥주" },
      { tagId: 7, tagName: "소주/맥주" },
    ];
    return tag[tagId].tagName;
  }

  //현재 날짜를 받아오기 -> min 값으로 설정
  const localDate = () => {
    const date = new Date().toISOString().substring(0, 10);
    return date;
  };

  // //현재 시간을 받아오기(UTC9)
  const localTime = () => {
    const time = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(11, 16);
    return time;
  };

  //날짜와 시간 입력 시 현재 날짜, 시간보다 이전인지를 반환(UTC0)
  const isDateTimeBeforeNow = (date, time) => {
    try {
      const targetDateTime = new Date(`${date}T${time}:00`);
      const currentDateTime = new Date();
      return targetDateTime < currentDateTime;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  return (
    <div>
      <header>
        <NavbarSimple title="모임 만들기" />
      </header>
      <div style={{ padding: "0 1.5rem", marginBottom: "7rem" }}>
        <QuestionDiv>
          <Title>모임의 이름</Title>
          <Input
            placeholder="모임의 이름을 입력해주세요"
            value={meetTitle}
            onChange={(e) => setMeetTitle(e.target.value)}
          />
          {!titleCheck() && btnClicked && (
            <ErrorDiv>📌모임 이름은 필수로 입력해야합니다.(15자 이내)</ErrorDiv>
          )}
        </QuestionDiv>
        <QuestionDiv>
          <Title>우리가 마실 것은</Title>
          <SubTitle>카테고리를 선택해주세요</SubTitle>
          <CateDiv>
            <DrinkCategory
              key={selectedCategory}
              getFunc={getDrinkCategory}
              selectedId={selectedCategory}
              isSearch={false}
            />
          </CateDiv>
          <div ref={parent}>
            {selectedDrink.drinkId === 0 && (
              <div>
                <SubTitle style={{ marginBottom: "0.3rem" }}>
                  정확한 술의 이름을 검색할 수 있어요
                </SubTitle>
                <div onFocus={() => setIsSearchFocused(true)}>
                  <SearchBox
                    placeholder=""
                    value={inputText}
                    changeFunc={(inputTxt: string) => {
                      setInputText(inputTxt);
                    }}
                  />
                </div>
                {!isSearchFocused && btnClicked && !drinkCheck() && (
                  <ErrorDiv>
                    📌한 가지의 주류를 필수적으로 입력해야합니다.
                  </ErrorDiv>
                )}
                {isSearchFocused && (
                  <SearchResultDiv>
                    <div
                      style={{
                        overflow: "auto",
                        height: "100%",
                        flexGrow: "1",
                      }}
                    >
                      {searchResultList.length === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            paddingTop: "2rem",
                            fontFamily: "NanumSquareNeo",
                          }}
                        >
                          검색 결과가 없습니다.
                        </div>
                      ) : (
                        searchResultList.map((res) => (
                          <div onClick={() => getDrink(res)} key={res.drinkId}>
                            <OneLineListItem
                              content={res.name}
                              tag={getTagName(res.tagId)}
                            ></OneLineListItem>
                          </div>
                        ))
                      )}
                    </div>
                    <OnOffBtn onClick={() => setIsSearchFocused(false)}>
                      ▲닫기
                    </OnOffBtn>
                  </SearchResultDiv>
                )}
              </div>
            )}
            {selectedDrink.drinkId !== 0 && (
              <div>
                <ListInfoItem
                  title={selectedDrink.name}
                  imgSrc={
                    selectedDrink.image === "no image"
                      ? "/src/assets/whiskeyImage.png"
                      : selectedDrink.image
                  }
                  tag={getTagName(selectedDrink.tagId)}
                  content={selectedDrink.description}
                  isWaiting={false}
                  outLine={true}
                  isDrink={true}
                  routingFunc={null}
                />
                <ReselectBtn
                  onClick={() => {
                    setSelectedDrink(initialDrink);
                  }}
                >
                  재선택
                </ReselectBtn>
              </div>
            )}
          </div>
        </QuestionDiv>
        <QuestionDiv>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Title>위치</Title>
            <DropdownInput
              onChange={(e) => {
                const selectedValue = e.target.value;
                const selectedSido = sidoList.find(
                  (item) => item.sidoName === selectedValue
                );
                setSido(selectedSido);
              }}
              value={sido.sidoName}
            >
              {sidoList.map((siItem) => {
                return (
                  <option value={siItem.sidoName} key={siItem.sidoCode}>
                    {siItem.sidoName}
                  </option>
                );
              })}
            </DropdownInput>
            시/도
            <DropdownInput
              onChange={(e) => {
                const selectedValue = e.target.value;
                const selectedGugun = gugunList.find(
                  (item) => item.gugunName === selectedValue
                );
                setGugun(selectedGugun);
              }}
              value={gugun.gugunName}
            >
              {gugunList.map((guItem) => {
                return (
                  <option value={guItem.gugunName} key={guItem.gugunCode}>
                    {guItem.gugunName}
                  </option>
                );
              })}
            </DropdownInput>
            구/군
          </div>
          {!positionCheck() && btnClicked && (
            <ErrorDiv>📌위치(시/도)는 필수 입력 사항입니다.</ErrorDiv>
          )}
        </QuestionDiv>
        <QuestionDiv>
          <Title>시간</Title>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <DateInput
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={localDate().toString()}
              required
            />
            <TimeInput
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          {!timeCheck() && btnClicked && (
            <ErrorDiv>
              <div>📌날짜와 시간은 필수 입력 사항입니다.</div>
              <div>(현재 날짜와 시간 이후로만 입력 가능)</div>
            </ErrorDiv>
          )}
        </QuestionDiv>
        <QuestionDiv style={{ fontFamily: "NanumSquareNeo", fontSize: "16px" }}>
          <Title>조건</Title>
          <LimitDiv>
            <SubTitle>최대 인원</SubTitle>
            <InputShort
              value={maxParticipants}
              onChange={(e) =>
                setMaxParticipants(
                  !Number.isNaN(parseInt(e.target.value))
                    ? parseInt(e.target.value)
                    : 0
                )
              }
            />
            명
            {!participantsCheck() && btnClicked && (
              <ErrorDiv>📌필수 입력사항입니다.(8명 이내)</ErrorDiv>
            )}
          </LimitDiv>
          <LimitDiv>
            <img src="/src/assets/liverIcon.svg" />
            <SubTitle>간수치</SubTitle>
            <InputShort
              placeholder="40"
              value={liverLimit > 0 ? liverLimit : ""}
              onChange={(e) => setLiverLimit(parseInt(e.target.value))}
            />
            IU/L이상
            {!liverLimitCheck() && btnClicked && (
              <ErrorDiv>📌100 IU/L 이하</ErrorDiv>
            )}
          </LimitDiv>
          <LimitDiv>
            <img src="/src/assets/age.svg" />
            <SubTitle>나이</SubTitle>
            <InputShort
              placeholder="20"
              value={minAge > 0 ? minAge : ""}
              onChange={(e) => setMinAge(parseInt(e.target.value))}
            />
            세 이상
            <InputShort
              placeholder="100"
              value={maxAge > 0 ? maxAge : ""}
              onChange={(e) => setMaxAge(parseInt(e.target.value))}
            />
            세 미만
          </LimitDiv>
          {!ageCheck() && btnClicked && (
            <ErrorDiv>📌20세 ~ 200세 사이</ErrorDiv>
          )}
        </QuestionDiv>
        <QuestionDiv>
          <Title>설명</Title>
          <InfoTextArea
            placeholder="모임에 대한 소개글을 작성해주세요"
            value={meetDesc}
            onChange={(e) => setMeetDesc(e.target.value)}
          ></InfoTextArea>
        </QuestionDiv>
        <div>
          <ImageInput key={imgSrc} getFunc={setFile} imgSrc={imgSrc} />
          {!imgcheck() && btnClicked && (
            <ErrorDiv>📌이미지만 업로드 가능합니다.(5MB 이하)</ErrorDiv>
          )}
        </div>
      </div>
      <FooterBigBtn
        content="모임 만들기"
        color="var(--c-yellow)"
        bgColor="white"
        reqFunc={() => {
          updateMeeting();
        }}
      />
      <Modal
        isOpen={isModalOn}
        onRequestClose={() => setIsModalOn(false)}
        style={WhiteModal}
      >
        <div style={{ whiteSpace: "pre-line", overflow: "auto" }}>
          {errorMsg}
        </div>
      </Modal>
    </div>
  );
};
export default MeetingCreate;
