/*
[MeetingFind.tsx]
모임 찾기 페이지
주종별 검색, 필터 검색, 검색결과 리스트 출력
*/
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import filterIcon from "../../assets/meetingFilter.svg";
import SearchBox from "../components/SearchBox";
import DrinkCategory from "../drinkCategory/DrinkCategory";
import MeetingListItem from "./MeetingListItem";
import autoAnimate from "@formkit/auto-animate";
import { callApi } from "../../utils/api";
import { Meeting } from "../../Type/types";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const meetingFind = () => {
  //받아온 모임 정보 리스트(전체)
  const [meetAllData, setMeetAllData] = useState<Meeting[]>([]);
  //필터링 한 후 모임 정보
  const [meetData, setMeetData] = useState<Meeting[]>([]);
  const [page, setPage] = useState(0); //페이징용, 0에서 시작
  const [totalPage, setTotalPage] = useState(0); //페이징용, 예정된 전체 페이지 수
  const [throttle, setThrottle] = useState(false);

  //주종 카테고리 선택
  const [selectedCategory, setSelectedCategory] = useState(0);
  const getDrinkCategory = (tagId: number) => {
    setSelectedCategory(tagId);
  };

  //TODO: 무한 스크롤 로직
  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting && !throttle) {
      setThrottle(true);
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setThrottle(false);
      }, 300);
    }
  };

  const { setTarget } = useIntersectionObserver({ onIntersect });

  useEffect(() => {
    console.log("page:" + page);
    const promise = callApi(
      "get",
      `api/meet?&tagId=${selectedCategory}&page=${page}&size=10`
    );
    promise.then((res) => {
      setTotalPage(res.data.totalPages);
      setMeetAllData((prev) => [...prev, ...res.data.content]); //받아온 데이터 meetAllData에 추가
    });
  }, [page]);

  useEffect(() => {
    setPage(0);
    setTotalPage(1);
    const promise = callApi(
      "get",
      `api/meet?&tagId=${selectedCategory}&page=${page}&size=10`
    );
    promise.then((res) => {
      setTotalPage(res.data.totalPages);
      setMeetAllData(res.data.content); //받아온 데이터로 meetAllData 초기화
    });
  }, [selectedCategory]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  //필터 애니메이션 관련
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  //필터 지역 검색용
  const [sidoList, setSiList] = useState(["서울", "경기", "대전", "시도"]);
  const [gugunList, setGuList] = useState([
    "동구",
    "중구",
    "서구",
    "유성구",
    "대덕구",
    "구군",
  ]);
  const [dongList, setDongList] = useState([
    "봉명동",
    "중앙동",
    "갈마1동",
    "삼성동",
    "탄방동",
    "학하동",
    "동",
  ]);
  const [sido, setSido] = useState("");
  const [gugun, setGugun] = useState("");
  const [dong, setDong] = useState("");
  //TODO: 중복 코드인데 합칠 수 없나
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
  const startDateSetter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartDate(e.target.value);
  };
  const endDateSetter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndDate(e.target.value);
  };

  //필터에 텍스트 검색용
  const [inputText, setInputText] = useState("");

  //필터용 함수
  //카테고리로 필터링
  const categoryFiltering = (data: Meeting) => {
    if (selectedCategory === 0) {
      return true;
    }
    return data.tagId === selectedCategory;
  };
  //시도 정보로 필터링
  const sidoFiltering = (data: Meeting) => {
    if (sido === "") return true;
    return data.sido === sido;
  };
  //구군 정보로 필터링
  const gugunFiltering = (data: Meeting) => {
    if (gugun === "") return true;
    return data.gugun === gugun;
  };
  //동 정보로 필터링
  const dongFiltering = (data: Meeting) => {
    if (dong === "") return true;
    return data.dong === dong;
  };
  //날짜 정보로 필터링
  const dateFiltering = (data: Meeting) => {
    if (startDate === "" && endDate === "") return true;
    return data.meetDate > startDate && data.meetDate < endDate;
  };
  //모임 이름으로 필터링
  const titleFiltering = (data: Meeting) => {
    if (inputText === "") return true;
    return data.meetName === inputText;
  };
  //술의 이름으로 필터링
  const drinkNameFiltering = (data: Meeting) => {
    if (inputText === "") return true;
    return data.drink.name === inputText;
  };

  const Filtering = () => {
    //전체 목록 중에 필터링 적용
    const filterData = meetAllData.reduce((acc, cur) => {
      //교집합만 push
      if (
        categoryFiltering(cur) &&
        sidoFiltering(cur) &&
        gugunFiltering(cur) &&
        dongFiltering(cur) &&
        dateFiltering(cur) &&
        titleFiltering(cur) &&
        drinkNameFiltering(cur)
      ) {
        acc.push(cur);
      }
      return acc;
    }, []);
    //필터링 후 모임들을 meetData에
    setMeetData(filterData);
  };

  useEffect(() => {
    setMeetData(meetAllData.map((item) => item)); //필터 적용을 위해 복사한 리스트 만들어두기
    Filtering();
  }, [meetAllData]);

  //전체 필터
  useEffect(() => {
    Filtering();
  }, [selectedCategory, sido, gugun, dong, startDate, endDate, inputText]);

  return (
    //TODO: 날짜 세팅에 props 설정
    //TODO: 검색창 인풋에 props 설정
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
                      {sidoList.map((siItem) => {
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
                      {gugunList.map((guItem) => {
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
                      {dongList.map((dongItem) => {
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
        {meetData.length > 0 && <MeetingListItem data={meetData} />}
        {meetData.length === 0 && <div style={{ minHeight: "100vh" }}></div>}
        {!throttle && page < totalPage && (
          <div
            ref={setTarget}
            style={{
              height: "1px",
            }}
          ></div>
        )}
      </SearchResultDiv>
    </div>
  );
};
export default meetingFind;

const CateDiv = styled.div`
  height: 10rem;
  margin-top: 1rem;
  background: white;
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
  padding: 1rem 0 0 0;
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
