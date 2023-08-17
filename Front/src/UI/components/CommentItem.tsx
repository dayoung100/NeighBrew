import styled from "styled-components";
import { forwardRef, useState } from "react";
import { SubReview } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";
import { useNavigate } from "react-router-dom";
import { moreIcon, deleteIcon, editIcon } from "../../assets/AllIcon";
import { DeleteModal, ThreeDotModal, ShortThreeDotModal, WhiteModal } from "../../style/common";
import Modal from "react-modal";
import Siren from "../../assets/siren.png";
import { callApi } from "../../utils/api";

const WholeDiv = styled.div`
  display: flex;
  margin-top: 1.5rem;
`;

const ProfileDiv = styled.div`
  width: 12%;
  word-break: break-all;
`;

const ProfileDiv2 = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 30px;
  background-size: cover;
`;

const NameAndContent = styled.div`
  margin-left: 8px;
  text-align: start;
  width: 76%;
`;

const MoreBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
`;

const SirenArea = styled.div`
  background: url("/src/assets/siren.png") no-repeat center;
  //background-size : cover;
  background-size: contain;
  overflow: hidden;
  flex-basis: 10%; // flex-grow, flex-shrink, flex-basis
`;

type CommentItemProps = {
  subReview: SubReview;
};

const commentItem = forwardRef<HTMLDivElement, CommentItemProps>(props => {
  const myId = localStorage.getItem("myId");
  const { subReview } = props;
  const navigate = useNavigate();
  const MoreIcon = moreIcon();
  const EditIcon = editIcon();
  const DeleteIcon = deleteIcon();

  const [report, setReport] = useState(false); // 타인 신고하기 버튼 눌렀을 때, 신고할지 말지 묻는 모달을 띄운다.
  const [reportModalOn, setReportModalOn] = useState(false); // 타인 신고하기를 묻는 모달에 예를 눌렀을 때, 신고 완료 모달을 띄운다.
  const [deleteModalOn, setDeleteModalOn] = useState(false); // 본인 댓글 삭제하기 버튼 눌렀을 때, 삭제할지 말지 묻는 모달을 띄운다.
  const [threeDotOn, setThreeDotOn] = useState(false); // 본인 댓글의 ...버튼을 누른다.
  const [ThreeDotOnForOther, setThreeDotOnForOther] = useState(false); //타인 댓글의 ... 버튼을 누른다.
  const nickname = subReview.user.nickname.includes("@")
    ? subReview.user?.nickname.split("@")[0]
    : subReview.user?.nickname;
  const [nameLimit, setNameLimit] = useState(15);
  const truncatedNickname =
    nickname.length > nameLimit ? nickname.substring(0, nameLimit) + "..." : nickname;
  const goReviewUser = () => {
    navigate(`/myPage/${subReview.user.userId}`);
  };

  const moreHandler = () => {
    setThreeDotOn(true);
  };
  const moreHandlerForOther = () => {
    setThreeDotOnForOther(true);
  };
  const toDeleteQuestionHandler = () => {
    setThreeDotOn(false);
    setDeleteModalOn(true);
  };
  const deleteHandler = () => {
    callApi("delete", `api/subreview/delete/${subReview.subReviewId}`);
  };

  const toUpdateHandler = () => {
    console.log("수정");
  };

  const reportQuestionHandler = () => {
    setThreeDotOnForOther(false);
    setReport(true);
  };

  const reportHandler = () => {
    setReport(false);
    setReportModalOn(true);
  };

  return (
    <>
      <WholeDiv>
        <ProfileDiv onClick={goReviewUser}>
          <ProfileDiv2
            style={{
              backgroundImage: `url(${
                subReview.user.profile === "no image" ? defaultImg : subReview.user.profile
              })`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></ProfileDiv2>
        </ProfileDiv>
        <NameAndContent onClick={goReviewUser}>
          <div style={{ fontFamily: "JejuGothic" }}>
            <b>{truncatedNickname}</b>
          </div>
          <div style={{ fontFamily: "NanumSquareNeo", marginTop: "1vh", whiteSpace: "pre-wrap" }}>
            {subReview.content}
          </div>
        </NameAndContent>
        {subReview.user.userId.toString() === myId ? (
          <MoreBtn onClick={moreHandler}>{MoreIcon}</MoreBtn>
        ) : (
          <MoreBtn onClick={moreHandlerForOther}>{MoreIcon}</MoreBtn>
        )}
        {/* <MoreBtn onClick={moreHandler}>{MoreIcon}</MoreBtn> */}
        <Modal
          isOpen={threeDotOn}
          onRequestClose={() => setThreeDotOn(false)}
          style={ThreeDotModal}
          ariaHideApp={false}
        >
          <div style={{ fontSize: "1rem", color: "var(--c-gray)" }}>댓글</div>
          <div
            onClick={toUpdateHandler}
            style={{ display: "flex", alignItems: "center", height: "40%", marginTop: "1rem" }}
          >
            <div style={{ marginRight: "0.5rem" }}>{EditIcon}</div>
            <div style={{ color: "black" }}>수정하기</div>
          </div>

          <div
            onClick={toDeleteQuestionHandler}
            style={{ display: "flex", alignItems: "center", height: "40%" }}
          >
            <div style={{ marginRight: "0.5rem" }}>{DeleteIcon}</div>
            <div style={{ color: "#eb0505" }}>삭제하기</div>
          </div>
        </Modal>
        <Modal
          isOpen={deleteModalOn}
          onRequestClose={() => setDeleteModalOn(false)}
          style={DeleteModal}
          ariaHideApp={false}
        >
          <div>
            <p style={{ padding: "1rem 0rem", fontSize: "1.4rem" }}>댓글을 삭제하시겠습니까?</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              height: "50%",
              fontSize: "1.4rem",
            }}
          >
            <div
              onClick={deleteHandler}
              style={{
                cursor: "pointer",
                width: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              예
            </div>
            <div
              onClick={() => setDeleteModalOn(false)}
              style={{
                cursor: "pointer",
                width: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              아니오
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={ThreeDotOnForOther}
          onRequestClose={() => setThreeDotOnForOther(false)}
          style={ShortThreeDotModal}
          ariaHideApp={false}
        >
          <div style={{ fontSize: "1rem", color: "var(--c-gray)" }}>댓글</div>
          <div onClick={reportQuestionHandler} style={{ display: "flex", marginTop: "1rem" }}>
            <div style={{ width: "10%", marginRight: "0.5rem" }}>
              <img src={Siren} alt="" style={{ width: "100%", height: "100%" }} />
            </div>
            <div style={{ display: "flex", alignItems: "end" }}>신고하기</div>
          </div>
        </Modal>
        <Modal
          isOpen={report}
          onRequestClose={() => setReport(false)}
          style={DeleteModal}
          ariaHideApp={false}
        >
          <div>
            <p style={{ padding: "1rem 0rem", fontSize: "1.4rem" }}>이 유저를 신고하시겠습니까?</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              height: "50%",
              fontSize: "1.4rem",
            }}
          >
            <div
              onClick={reportHandler}
              style={{
                cursor: "pointer",
                width: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              예
            </div>
            <div
              onClick={() => setDeleteModalOn(false)}
              style={{
                cursor: "pointer",
                width: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              아니오
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={reportModalOn}
          onRequestClose={() => setReportModalOn(false)}
          style={WhiteModal}
          ariaHideApp={false}
        >
          <div style={{ padding: "1rem 0rem", fontSize: "1.4rem" }}>신고 완료되었습니다.</div>
        </Modal>
      </WholeDiv>
    </>
  );
});
export default commentItem;
