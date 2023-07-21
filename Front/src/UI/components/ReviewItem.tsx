import styled from "styled-components";

const ReviewCard = styled.div`
  background-color: white;
  display: flex;
  justify-content: start;
  margin: 30px;
`;

const ReviewImg = styled.div`
  background-color: var(--c-gray);
  border-radius: 12px;
  width: 90px;
  height: 90px;
`;

const UserCard = styled.div`
  background-color: white;
  text-align: start;
`;

const ReviewItem = () => {
  return (
    <>
      <ReviewCard>
        <ReviewImg>
          <img src="#" alt="reviewImage" />
        </ReviewImg>
        <div>
          <UserCard>
            <span>
              <img src="#" alt="profile" />
            </span>
            <span>userName</span>
          </UserCard>
          <div style={{ marginLeft: "10px" }}>
            <p style={{ textAlign: "start" }}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium cum numquam
              doloremque magnam excepturi adipisci cupiditate repudiandae perspiciatis, minima
              debitis. Necessitatibus magnam, architecto saepe deserunt soluta corporis autem
              mollitia. Magnam!
            </p>
          </div>
        </div>
      </ReviewCard>
    </>
  );
};
export default ReviewItem;
