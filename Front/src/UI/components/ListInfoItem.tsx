import styled from "styled-components";

const ItemDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 20rem;
  height: 6rem;
  background: white;
  margin: 1rem auto;
  border-radius: 20px;
  padding: 0.5rem 0;
`;

const ImageArea = styled.div`
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
  padding-left: 3%;
`;

const InfoTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 14px;
  margin: 3% 0;
`;

const InfoContent = styled.div`
  font-family: "SeoulNamsan";
  font-size: 10px;
  color: var(--c-gray);
`;

const InfoTag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  right: 3%;
  top: 15%;
  background: var(--c-yellow);
  padding: 1.5% 2%;
  font-family: "JejuGothic";
  font-size: 7px;
  border-radius: 10px;
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    margin-right: 2px;
  }
  span {
    display: flex;
    justify-content: center;
    min-width: 30px;
  }
`;

const InfoNumber = styled.div`
  position: absolute;
  right: 3%;
  bottom: 15%;
`;

type ListInfoItemProps = {
  title: string;
  tag: string;
  content: any;
  numberInfo: string; //인원정보는 4/5 와 같이 들어올 수 있어서
};

const ListInfoItem = (props: ListInfoItemProps) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: "20rem" }}>
          <ItemDiv>
            <ImageArea />
            <InfoArea>
              <InfoTitle>{props.title}</InfoTitle>
              <InfoContent>{props.content}</InfoContent>
            </InfoArea>
          </ItemDiv>
          <InfoTag>
            <span>{props.tag}</span>
          </InfoTag>
          <InfoNumber>{props.numberInfo}</InfoNumber>
        </div>
      </div>
    </div>
  );
};
export default ListInfoItem;
