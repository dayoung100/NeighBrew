import styled from "styled-components";
import { useState } from "react";
import filterIcon from "../../assets/meetingFilter.svg";
import SearchBox from "../components/SearchBox";
import ListInfoItem from "../components/ListInfoItem";
import MeetingDetail from "./MeetingDetail";
import PeopleNumInfo from "./PeopleNumInfo";

const TestCateDiv = styled.div`
  height: 10rem;
  border: 1px solid var(--c-black);
  margin: 2rem 1rem;
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

const FilterDiv = styled.div<{ isFilterOpen: boolean }>`
  display: flex;
  justify-content: center;
  margin: 0 1rem;
  border-bottom: 1px solid var(--c-gray);
  display: ${props => (props.isFilterOpen ? "" : "none")};
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
`;

const meetingFind = () => {
  const [siList, setSiList] = useState(["서울", "경기", "대전", "인천"]);
  const [guList, setGuList] = useState(["동구", "중구", "서구", "유성", "대덕"]);
  const [dongList, setDongList] = useState(["봉명동", "중앙동", "갈마1동", "삼성동", "탄방동"]);

  const [meetingList, setMeetingList] = useState([
    "모임의 제목이 들어갑니다",
    "모임2",
    "모임3",
    "모임4",
    "모임5",
    "모임6",
    "모임7",
  ]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div>
      <TestCateDiv>category area - 컴포넌트로 빼기</TestCateDiv>
      <SearchResultDiv>
        <SearchResultHeader>
          지금 진행 중인 모임
          <FilterBtn onClick={() => setIsFilterOpen(!isFilterOpen)} />
        </SearchResultHeader>
        <FilterDiv isFilterOpen={isFilterOpen}>
          <FilterBg>
            위치
            <FilterElement>
              <div>
                <DropdownInput>
                  {siList.map(si => {
                    return <option>{si}</option>;
                  })}
                </DropdownInput>
                시
              </div>
              <div>
                <DropdownInput>
                  {guList.map(gu => {
                    return <option>{gu}</option>;
                  })}
                </DropdownInput>
                구
              </div>
              <div>
                <DropdownInput>
                  {dongList.map(dong => {
                    return <option>{dong}</option>;
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
        {meetingList.map(meeting => {
          return (
            <ListInfoItem
              title={meeting}
              tag="소주/맥주"
              content={<MeetingDetail />}
              numberInfo={<PeopleNumInfo now={1} max={1} />}
            ></ListInfoItem>
          );
        })}
      </SearchResultDiv>
    </div>
  );
};
export default meetingFind;
