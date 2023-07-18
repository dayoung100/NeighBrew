import styled from "styled-components";
import { useState } from "react";
import filterIcon from "../../assets/meetingFilter.svg";

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
  border-bottom: 1px solid --c-gray;
  display: ${props => (props.isFilterOpen ? "" : "none")};
`;

const FilterBg = styled.div`
  background: white;
  border-radius: 15px;
  width: 100%;
  margin: 1rem auto;
  padding: 0.5rem;
`;

const MeetingInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20rem;
  height: 4rem;
  background: white;
  margin: 1rem auto;
`;

const meetingFind = () => {
  const [meetingList, setMeetingList] = useState([1, 2, 3, 4, 5, 6, 7]);
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
            <div>위치</div>
            <div>시간</div>
            <div>키워드검색</div>
          </FilterBg>
        </FilterDiv>
        {meetingList.map(meeting => {
          return <MeetingInfo>{meeting}번 모임</MeetingInfo>;
        })}
      </SearchResultDiv>
    </div>
  );
};
export default meetingFind;
