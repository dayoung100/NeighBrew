/*
[MeetingInfoManage.tsx]
모임 정보 관리 페이지
모임 이름, 주종 카테고리, 술 검색, 위치, 시간, 조건, 설명, 이미지 첨부 가능
*/
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarSimple from "../navbar/NavbarSimple";
import styled, { css } from "styled-components";
import FooterBigBtn from "../footer/FooterBigBtn";
import ImageInput from "../components/ImageInput";
import MeetingDrinkSearch from "./MeetingDrinkSearch";
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
  ModalInner,
} from "../common";
import Modal from "react-modal";

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

const ErrorDiv = styled.div`
  color: red;
  text-align: left;
  font-family: "SeoulNamsan";
  font-size: 15px;
  padding: 0.5rem;
`;

const MeetingInfoManage = () => {
  //네비게이터: 모임 수정 후 모임 상세로 이동, 주류 추가 페이지로 이동
  const navigate = useNavigate();
  const GoMeetDetailHandler = () => {
    navigate(`/meet/${meetId}`);
  };
  const GoMeetMainHandler = () => {
    navigate(`/meet`);
  };
  //모달 관련
  const [isModalOn, setIsModalOn] = useState(false);
  const [isGotoMainModalOn, setIsGotoMainModalOn] = useState(false); //모임 메인으로 이동시키는 모달은 따로 관리
  const [errorMsg, setErrorMsg] = useState(""); //모달에 띄울 에러메시지

  //미팅 기존 정보
  const [meetData, setMeetData] = useState<MeetDetail>(initialMeetDetail);
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [userId, setUserId] = useState(0); //현재 유저의 userId

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

  //이미지 수정용
  const [newImgSrc, setNewImgSrc] = useState("");

  //지역 관련 state
  const [sidoList, setSidoList] = useState([initialSido]);
  const [gugunList, setGugunList] = useState([initialGugun]);

  //생성 버튼 클릭했는지 - 버튼 한번이라도 클릭 시에만 빨간 가이드 글씨 오픈
  const [btnClicked, setBtnClicked] = useState(false);

  //첫 로딩 시
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    //시도 정보 미리 받아와 세팅하기
    callApi("get", "api/sido").then((res) => {
      setSidoList([initialSido, ...res.data]);
    });
  }, []);

  //api 호출, 기존 모임의 정보 저장
  useEffect(() => {
    const promise = callApi("get", `api/meet/${meetId}`);
    promise.then((res) => {
      setMeetData(res.data);
    });
    //로컬 스토리지에서 userId 가져오기
    setUserId(parseInt(localStorage.getItem("myId")));
  }, [meetId]);

  //받아온 모임 정보로 state 초기값 설정
  useEffect(() => {
    setMeetTitle(meetData.meet.meetName);
    setSelectedCategory(meetData.meet.tagId); //주종카테고리
    setSelectedDrink(meetData.meet.drink); //주류아이디
    setSido(meetData.meet.sido); //시도
    setGugun(meetData.meet.gugun); //구군
    setDate(formateDate(meetData.meet.meetDate)); //날짜
    setTime(formateTime(meetData.meet.meetDate)); //시간
    setMaxParticipants(meetData.meet.maxParticipants); //최대인원
    setLiverLimit(meetData.meet.minLiverPoint); //간수치 제한
    setMinAge(meetData.meet.minAge); //최소 나이
    setMaxAge(meetData.meet.maxAge); //최대 나이
    setMeetDesc(meetData.meet.description); //모임 소개
    setImgSrc(meetData.meet.imgSrc); //이미지 경로(원래의)
    setNewImgSrc(meetData.meet.imgSrc); //이미지 경로(새로세팅할)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [meetData]);

  //선택한 시도에 따라 구군 fetch
  useEffect(() => {
    //초기 모임 데이터 로딩은 제외하고, 구군 정보 초기화
    if (gugun.sidoCode !== sido.sidoCode) {
      setGugun(initialGugun); //초기화
    }
    callApi("get", `api/gugun/${sido.sidoCode}`).then((res) => {
      setGugunList([initialGugun, ...res.data]);
    });
  }, [sido]);

  //api 호출 전 각종 데이터 검증
  //유저 아이디와 호스트 아이디 확인
  //권한이 없다면 메인 페이지로 이동시킴
  const checkIsHost = () => {
    let isValid: boolean = true;
    if (userId !== meetData.meet.host.userId) {
      isValid = false;
      setErrorMsg("모임 편집 권한이 없습니다.");
    }
    return isValid;
  };

  //////////////api 호출 전 각종 데이터 검증//////////////
  //제목: 필수 입력/30자 이내
  const titleCheck = () => {
    return !(meetTitle === "" || meetTitle == null || meetTitle.length > 30);
  };

  //술: 필수 입력
  const drinkCheck = () => {
    return !(selectedDrink.drinkId < 1);
  };

  //위치: 필수 입력
  const positionCheck = () => {
    return !(sido.sidoCode === 0 || gugun.gugunCode === 0);
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

  //이미지: 이미지타입/이미지크기
  const imgcheck = () => {
    return !(
      file &&
      (file.size > 1024 * 1024 * 10 || !file.type.startsWith("image/"))
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
    if (1 > maxParticipants) {
      setErrorMsg(`최대 인원수는 1명 이상이어야합니다.`);
      return false;
    }
    //모임 현재 인원수 > 최대인원수 일때
    if (meetData.meet.nowParticipants > maxParticipants) {
      setErrorMsg(
        `최대 인원수는 현재 인원수보다 적어질 수 없습니다. \n 현재 인원수: ${meetData.meet.nowParticipants}`
      );
      return false;
    }
    //최소 나이 > 최대 나이 일때
    if (maxAge && minAge > maxAge) {
      setErrorMsg("최소 나이는 최대 나이보다 \n 클 수 없습니다.");
      return false;
    }
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
    //호스트가 맞는가?
    if (!checkIsHost()) {
      setIsGotoMainModalOn(true);
      return;
    }
    //입력 값들이 적절한가?
    if (!checkRequiredValue()) {
      setIsModalOn(true);
      return;
    }

    let f = new FormData();
    //필수 입력o
    f.append("meetName", meetTitle);
    f.append("maxParticipants", maxParticipants.toString());
    f.append("meetDate", `${date}T${time}:00`);
    f.append("tagId", selectedCategory.toString());
    f.append("sidoCode", sido.sidoCode.toString());
    f.append("gugunCode", gugun.gugunCode.toString());
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

    //이미지 수정을 위한 분기
    //1. 파일이 null이 아님 -> 이미지를 변경한 것 -> 새파일을 담아서 전송
    if (file !== null) {
      f.append("image", file);
    } else if (newImgSrc === "no image") {
      //2. 파일이 null이지만 newImgSrc가 no image임
      //-> 이미지 첨부를 취소하고 기본이미지로 돌리려는 것
      //-> image와 함께 변경된 imgSrc 정보도 담아야
      f.append("image", null);
      f.append("imgSrc", "no image");
    } else {
      //3. 파일이 null이고 imgSrc가 no image가 아님
      //-> 첨부 취소 버튼을 누르지도 않고, 파일 첨부도 하지 않음 = 이미지 수정하지 않음
      //-> image만 null로 담아 보내기
      f.append("image", null);
    }

    const promise = callApi("put", `/api/meet/modify/${userId}/${meetId}`, f);
    promise
      .then((res) => {
        GoMeetDetailHandler(); //모임 상세 페이지로 이동
      })
      .catch((error) => {
        setErrorMsg(error.response.data);
        setIsModalOn(true);
      });
  };

  useEffect(() => {
    console.log("변경됐어요");
    console.dir(file);
    console.dir(newImgSrc);
  }, [file, newImgSrc]);

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

  //현재 날짜를 받아오기 -> min 값으로 설정
  const localDate = () => {
    const date = new Date().toISOString().substring(0, 10);
    return date;
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
        <NavbarSimple title="모임 관리" />
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
            <ErrorDiv>📌모임 이름은 필수로 입력해야합니다.(30자 이내)</ErrorDiv>
          )}
        </QuestionDiv>
        <QuestionDiv>
          {selectedDrink.drinkId !== 0 && selectedCategory !== 0 && (
            <MeetingDrinkSearch
              tagId={selectedCategory}
              setTagIdFunc={setSelectedCategory}
              drink={selectedDrink}
              setDrinkFunc={setSelectedDrink}
              btnClicked={btnClicked}
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
            <ErrorDiv>📌위치는 필수 입력 사항입니다.</ErrorDiv>
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
        <QuestionDiv style={{ fontFamily: "SeoulNamsan", fontSize: "14px" }}>
          <Title>조건</Title>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
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
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
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
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <img src="/src/assets/age.svg" />
            <SubTitle>나이</SubTitle>
            <InputShort
              placeholder="20"
              value={minAge > 0 ? minAge : ""}
              onChange={(e) => setMinAge(parseInt(e.target.value))}
            />
            세 이상
            <InputShort
              placeholder="200"
              value={maxAge > 0 ? maxAge : ""}
              onChange={(e) => setMaxAge(parseInt(e.target.value))}
            />
            세 미만
          </div>
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
          <ImageInput
            key={newImgSrc}
            getFunc={setFile}
            imgSrc={newImgSrc}
            getImgSrc={setNewImgSrc}
          />
          {!imgcheck() && btnClicked && (
            <ErrorDiv>📌이미지만 업로드 가능합니다.(10MB 이하)</ErrorDiv>
          )}
        </div>
      </div>
      <FooterBigBtn
        content="정보 수정 완료"
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
        <ModalInner>{errorMsg}</ModalInner>
      </Modal>
      <Modal
        isOpen={isGotoMainModalOn}
        onRequestClose={() => {
          setIsGotoMainModalOn(false);
          GoMeetMainHandler(); //모임 메인 페이지로 이동
        }}
        style={WhiteModal}
      >
        <ModalInner>{errorMsg}</ModalInner>
      </Modal>
    </div>
  );
};
export default MeetingInfoManage;
