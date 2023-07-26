/*
[MeetingFind.tsx]
모임 찾기 페이지
주종별 검색, 필터 검색, 검색결과 리스트 출력
*/
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import filterIcon from "../../assets/meetingFilter.svg";
import SearchBox from "../components/SearchBox";
import ListInfoItem from "../components/ListInfoItem";
import MeetingDetail from "./MeetingDetailSimple";
import PeopleNumInfo from "./PeopleNumInfo";
import DrinkCategory from "../drinkCategory/DrinkCategory";
import autoAnimate from "@formkit/auto-animate";
import { callApi } from "../../utils/api";
import { Meetings } from "../../Type/types";

const meetingFind = () => {
  //네비게이터 : 모임 상세페이지로 이동
  const navigate = useNavigate();
  const GotoMeetDetailHandler = (meetId: number) => {
    console.log(meetId, "find");
    navigate(`/meet/${meetId}`);
  };

  //받아온 모임 정보 리스트(전체)
  const [meetAllData, setMeetAllData] = useState<Meetings[]>([]);
  //필터링 한 후 모임 정보
  const [meetData, setMeetData] = useState<Meetings[]>([]);

  useEffect(() => {
    setMeetData(meetAllData.map((item) => item)); //필터 적용을 위해 복사한 리스트 만들어두기
  }, [meetAllData]);

  useEffect(() => {
    console.dir(meetData); //확인용
  }, [meetData]);

  //api 호출
  useEffect(() => {
    const promise = callApi("get", "api/meet");
    promise.then(res => {
      setMeetAllData(res.data); //받아온 데이터로 meetAllData 세팅
    });
  }, []);

  //주종 카테고리 선택
  const [selectedCategory, setSelectedCategory] = useState(0);
  const getDrinkCategory = (tagId: number) => {
    setSelectedCategory(tagId);
  };

  //필터 애니메이션 관련
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  //필터 지역 검색용
  const [sidoList, setSiList] = useState(["서울", "경기", "대전", "시도"]);
  const [gugunList, setGuList] = useState(["동구", "중구", "서구", "유성", "대덕"]);
  const [dongList, setDongList] = useState(["봉명동", "중앙동", "갈마1동", "삼성동", "탄방동"]);
  const [sido, setSido] = useState("");
  const [gugun, setGugun] = useState("");
  const [dong, setDong] = useState("");
  const sidoSetter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSido = e.target.value;
    setSido(selectedSido);
    //여기서 si에 따라 guList 업데이트
  };
  const gugunSetter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGugun(e.target.value);
    //여기서 gu에 따라 dongList 업데이트
  };
  const dongSetter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDong(e.target.value);
  };

  //필터에 날짜 검색용
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //필터에 텍스트 검색용
  const [inputText, setInputText] = useState("");

  //날짜와 시간 변환 함수
  function formateDate(dateData: string) {
    const date = new Date(dateData);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${month}월 ${day}일 ${hour}시 ${minute}분`;
  }

  //필터용 함수
  //카테고리로 필터링
  const categoryFiltering = (data: Meetings) => {
    if (selectedCategory === 0) {
      return true;
    }
    return data.tagId === selectedCategory;
  };
  //시도 정보로 필터링
  const sidoFiltering = (data: Meetings) => {
    if (sido === "") return true;
    return data.sido === sido;
  };
  //구군 정보로 필터링
  const gugunFiltering = (data: Meetings) => {
    if (gugun === "") return true;
    return data.gugun === gugun;
  };
  //동 정보로 필터링
  const dongFiltering = (data: Meetings) => {
    if (dong === "") return true;
    return data.dong === dong;
  };
  //날짜 정보로 필터링
  const dateFiltering = (data: Meetings) => {
    if (startDate === "" && endDate === "") return true;
    return data.meetDate > startDate && data.meetDate < endDate;
  };
  //모임 이름으로 필터링
  const titleFiltering = (data: Meetings) => {
    if (startDate === "" && endDate === "") return true;
    return data.meetDate > startDate && data.meetDate < endDate;
  };
  //술의 이름으로 필터링

  //전체 필터
  useEffect(() => {
    let filterData = [...meetData];
    filterData = meetAllData.filter(categoryFiltering);
    if (sido !== "") {
      filterData = meetAllData.filter(sidoFiltering);
    }
    setMeetData(filterData);
  }, [selectedCategory, sido]);

  return (
    <div>
      <CateDiv>
        <DrinkCategory getFunc={getDrinkCategory} />
      </CateDiv>
      <SearchResultDiv>
        <SearchResultHeader>
          지금 진행 중인 모임
          <FilterBtn onClick={() => setIsFilterOpen(!isFilterOpen)} />
        </SearchResultHeader>
        <div ref={parent}>
          {isFilterOpen && (
            <FilterDiv>
              <FilterBg>
                위치
                <FilterElement>
                  <div>
                    <DropdownInput onChange={sidoSetter} value={sido}>
                      {sidoList.map(siItem => {
                        return (
                          <option value={siItem} key={siItem}>
                            {siItem}
                          </option>
                        );
                      })}
                    </DropdownInput>
                    시
                  </div>
                  <div>
                    <DropdownInput onChange={gugunSetter} value={gugun}>
                      {gugunList.map(guItem => {
                        return (
                          <option value={guItem} key={guItem}>
                            {guItem}
                          </option>
                        );
                      })}
                    </DropdownInput>
                    구
                  </div>
                  <div>
                    <DropdownInput onChange={dongSetter} value={dong}>
                      {dongList.map(dongItem => {
                        return (
                          <option value={dongItem} key={dongItem}>
                            {dongItem}
                          </option>
                        );
                      })}
                    </DropdownInput>
                    동
                  </div>
                </FilterElement>
                날짜
                <FilterElement>
                  <DateInput type="date" /> ~
                  <DateInput type="date" />
                </FilterElement>
                <div style={{ gridColumn: "span 2" }}>
                  <SearchBox placeholder="정확한 술의 이름 또는 모임의 이름" />
                </div>
              </FilterBg>
            </FilterDiv>
          )}
        </div>
        {meetData.map((meeting: Meetings) => {
          //TODO: 태그 아이디로 태그 스트링으로 변환하기
          const meetId = meeting.meetId;
          const hasAgeLimit = (meeting.minAge ?? 0) > 0 || (meeting.maxAge ?? 0) > 0 ? true : false;
          const position = `${meeting.sido} ${meeting.gugun} ${meeting.dong}`;
          const formattedDate = formateDate(meeting.meetDate);
          return (
            <ListInfoItem
              key={meetId}
              title={meeting.meetName}
              imgSrc="../src/assets/ForTest/backgroundImg.jpg"
              tag="태그"
              content={
                <MeetingDetail
                  position={position}
                  time={formattedDate}
                  hostId={meeting.hostId}
                  liverLimit={(meeting.minLiverPoint ?? 0) > 0 ? true : false}
                  ageLimit={hasAgeLimit}
                />
              }
              numberInfo={
                <PeopleNumInfo
                  now={meeting.nowParticipants}
                  max={meeting.maxParticipants}
                  color={"var(--c-black)"}
                  size={11}
                />
              }
              isWaiting={false}
              outLine={false}
              routingFunc={() => GotoMeetDetailHandler(meetId)}
            ></ListInfoItem>
          );
        })}
      </SearchResultDiv>
    </div>
  );
};
export default meetingFind;

const CateDiv = styled.div`
  height: 10rem;
  margin-top: 1rem;
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

const SearchResultDiv = styled.div`
  background: var(--c-lightgray);
  padding: 1rem 0;
`;

const SearchResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  font-family: "JejuGothic";
  font-size: 20px;
`;

const FilterBtn = styled.button`
  background: url(${filterIcon});
  background-size: 100%;
  width: 2rem;
  height: 2rem;
  border: none;
`;

const FilterDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 1rem;
  border-bottom: 1px solid var(--c-gray);
`;

const FilterBg = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr;
  grid-template-rows: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 15px;
  width: 100%;
  margin: 1rem auto;
  padding: 1rem;
  font-family: "JejuGothic";
  font-size: 14px;
`;

const FilterElement = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "SeoulNamsan";
  margin: 0.5rem 0;
`;

const DropdownInput = styled.select`
  width: 4rem;
  background: white;
  text-align: right;
  padding: 3% 5%;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  font-family: "SeoulNamsan";
  outline: none;
  -webkit-appearance: none; /* 화살표 없애기 for chrome*/
  -moz-appearance: none; /* 화살표 없애기 for firefox*/
  appearance: none; /* 화살표 없애기 공통*/
`;

const DateInput = styled.input.attrs({ type: "date" })`
  color: var(--c-black);
  width: 40%;
  font-family: "SeoulNamsan";
  text-align: right;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  background: white;
  outline: none;
`;

const meetingFind = () => {
  //받아온 모임 정보 리스트(전체)
  const [meetAllData, setMeetAllData] = useState<Meeting[]>([]);
  useEffect(() => {
    console.dir(meetAllData);
    setMeetData(meetAllData.map(item => item));
  }, [meetAllData]);

  //필터링 한 후 모임 정보
  const [meetData, setMeetData] = useState<Meeting[]>([]);
  useEffect(() => {
    console.dir(meetData);
  }, [meetData]);

  useEffect(() => {
    const promise = callApi("get", "api/meet");
    promise.then(res => {
      setMeetAllData(res.data);
      setMeetData(res.data);
    });
    // setMeetAllData([
    //   {
    //     meetId: 1,
    //     meetName: "테스트모임1",
    //     description: "2가만든 모임",
    //     hostId: 3,
    //     participants: 5,
    //     meetDate: "2023-07-21T13:53:12",
    //     tag: {
    //       tagId: 1,
    //       name: "위스키",
    //     },
    //     sido: "대전",
    //     gugun: "유성구",
    //     dong: "학하동",
    //     minAge: null,
    //     maxAge: null,
    //     minLiverPoint: null,
    //   },
    //   {
    //     meetId: 2,
    //     meetName: "change Meet name",
    //     description: "This is a sample meet.",
    //     hostId: 2,
    //     participants: 1,
    //     meetDate: "2023-07-31T00:30:00",
    //     tag: {
    //       tagId: 2,
    //       name: "와인",
    //     },
    //     sido: "서울",
    //     gugun: "change  Gugun",
    //     dong: "change  Dong",
    //     minAge: 0,
    //     maxAge: 0,
    //     minLiverPoint: 50.0,
    //   },
    // ]);
  }, []);

  const [selectedDrink, setSelectedDrink] = useState("");
  const wiskySelect = () => {
    setSelectedDrink("위스키");
  };
  const wineSelect = () => {
    setSelectedDrink("와인");
  };
  useEffect(() => {
    const filterData = meetAllData.filter(data => data.tag.name === selectedDrink);
    setMeetData(filterData);
  }, [selectedDrink]);

  //필터 애니메이션 관련
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const parent = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  //필터 지역 검색용
  const [siList, setSiList] = useState(["서울", "경기", "대전", "인천"]);
  const [guList, setGuList] = useState(["동구", "중구", "서구", "유성", "대덕"]);
  const [dongList, setDongList] = useState(["봉명동", "중앙동", "갈마1동", "삼성동", "탄방동"]);
  const [si, setSi] = useState("");
  const [gu, setGu] = useState("");
  const [dong, setDong] = useState("");
  const siSetHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSi = e.target.value;
    setSi(selectedSi);
    //여기서 si에 따라 guList 업데이트
    //모임 리스트 조건에 맞게 필터링
    console.log(selectedSi);
    const filterData = meetAllData.filter(data => data.sido === selectedSi);
    setMeetData(filterData);
  };
  const guSetHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGu(e.target.value);
    //여기서 si에 따라 guList 업데이트
  };
  const dongSetHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDong(e.target.value);
    //여기서 si에 따라 guList 업데이트
  };
  //모임 상세페이지로 이동
  const GotoMeetDetailHandler = (meetId: number) => {
    console.log(meetId, "find");
    navigate(`/meet/${meetId}`);
  };

  return (
    <div>
      <button onClick={wiskySelect}>위스키</button>
      <button onClick={wineSelect}>와인</button>
      <CateDiv>
        <DrinkCategory />
      </CateDiv>
      <SearchResultDiv>
        <SearchResultHeader>
          지금 진행 중인 모임
          <FilterBtn onClick={() => setIsFilterOpen(!isFilterOpen)} />
        </SearchResultHeader>
        <div ref={parent}>
          {isFilterOpen && (
            <FilterDiv>
              <FilterBg>
                위치
                <FilterElement>
                  <div>
                    <DropdownInput onChange={siSetHandler} value={si}>
                      {siList.map(siItem => {
                        return (
                          <option value={siItem} key={siItem}>
                            {siItem}
                          </option>
                        );
                      })}
                    </DropdownInput>
                    시
                  </div>
                  <div>
                    <DropdownInput onChange={guSetHandler} value={gu}>
                      {guList.map(guItem => {
                        return (
                          <option value={guItem} key={guItem}>
                            {guItem}
                          </option>
                        );
                      })}
                    </DropdownInput>
                    구
                  </div>
                  <div>
                    <DropdownInput onChange={dongSetHandler} value={dong}>
                      {dongList.map(dongItem => {
                        return (
                          <option value={dongItem} key={dongItem}>
                            {dongItem}
                          </option>
                        );
                      })}
                    </DropdownInput>
                    동
                  </div>
                </FilterElement>
                시간
                <FilterElement>
                  <DateInput type="date" /> ~
                  <DateInput type="date" />
                </FilterElement>
                <div style={{ gridColumn: "span 2" }}>
                  <SearchBox placeholder="정확한 술의 이름 또는 모임의 이름" />
                </div>
              </FilterBg>
            </FilterDiv>
          )}
        </div>
        {meetData.map((meeting: Meeting) => {
          const meetId = meeting.meetId;
          return (
            <ListInfoItem
              key={meetId}
              title={meeting.meetName}
              imgSrc="../src/assets/ForTest/backgroundImg.jpg"
              tag={meeting.tag.name}
              content={<MeetingDetail />}
              numberInfo={
                <PeopleNumInfo
                  now={meeting.participants}
                  max={8}
                  color={"var(--c-black)"}
                  size={11}
                />
              }
              isWaiting={false}
              outLine={false}
              routingFunc={() => GotoMeetDetailHandler(meetId)}
            ></ListInfoItem>
          );
        })}
      </SearchResultDiv>
    </div>
  );
};
export default meetingFind;
