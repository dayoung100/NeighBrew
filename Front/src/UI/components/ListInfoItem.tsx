/*
[ListInfoItem.tsx]
모임 리스트 또는 술장 검색 결과 리스트에 사용되는 컴포넌트
자세한 props는 type ListInfoItemProps 참고
*/
import styled from "styled-components";

type ListInfoItemProps = {
  title: string; //제목
  tag: string; //주종 태그
  content: any; //내용, 컴포넌트를 넣어도 됨
  numberInfo: any; //인원정보 또는 후기 수, 컴포넌트를 넣어도 됨
  isWaiting: boolean; //신청대기중인 모임인지(아니라면 false)
  routingFunc: any; //라우팅 함수(ex.routingFunc={() => GotoMeetDetailHandler(1)})
};

const ItemDiv = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 20rem;
  height: 6rem;
  background: white;
  margin: 1rem auto 0 auto;
  border-radius: 20px;
  padding: 0.5rem 0.5rem;
`;

const ImageArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--c-gray);
  border-radius: 15px;
  width: 30%;
  margin: 0 3%;
  &::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

const InfoArea = styled.div`
  width: 70%;
  text-align: left;
  align-self: flex-start;
`;

const InfoTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 14px;
  margin: 3% 0;
  width: 9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const InfoContent = styled.div`
  font-family: "SeoulNamsan";
  font-size: 10px;
  color: var(--c-gray);
`;

const Tag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  background: var(--c-yellow);
  padding: 1.5% 2%;
  font-family: "JejuGothic";
  font-size: 7px;
  border-radius: 10px;
  span {
    display: flex;
    justify-content: center;
    min-width: 30px;
  }
`;

const InfoTag = styled(Tag)`
  right: 3%;
  top: 7%;
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    margin-right: 2px;
  }
`;

const WaitingTag = styled(Tag)`
  left: 3%;
  top: 7%;
`;

const InfoNumber = styled.div`
  position: absolute;
  right: 5%;
  bottom: 7%;
`;

const ListInfoItem = (props: ListInfoItemProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }} onClick={() => props.routingFunc()}>
      <ItemDiv>
        <ImageArea />
        <InfoArea>
          <InfoTitle>{props.title}</InfoTitle>
          <InfoContent>{props.content}</InfoContent>
        </InfoArea>
        <InfoTag>
          <span>{props.tag}</span>
        </InfoTag>
        <InfoNumber>{props.numberInfo}</InfoNumber>
        {props.isWaiting ? (
          <WaitingTag>
            <span>승인대기</span>
          </WaitingTag>
        ) : null}
      </ItemDiv>
    </div>
  );
};
export default ListInfoItem;
