import styled from "styled-components";

const WholeDiv = styled.div`
  display: flex;
  margin: 0px 24px 0px 24px;
`;

const ProfileDiv = styled.div`
  width: 12%;
  word-break: break-all;
`;

const ProfileDiv2 = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 30px;
  background-color: var(--c-lightgray);
`;

const NameAndContent = styled.div`
  margin-left: 8px;
  text-align: start;
  width: 88%;
`;

const commentItem = () => {
  return (
    <>
      <WholeDiv>
        <ProfileDiv>
          <ProfileDiv2></ProfileDiv2>
        </ProfileDiv>
        <NameAndContent>
          <div>
            <b>회원명</b>
          </div>
          <div>
            설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명
            설명설명설명설명설명설명설명설명설명설명설명설명
          </div>
        </NameAndContent>
      </WholeDiv>
    </>
  );
};
export default commentItem;
