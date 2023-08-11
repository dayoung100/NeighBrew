import styled from "styled-components";
import { forwardRef } from "react";
import { SubReview } from "../../Type/types";

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
  background-color: var(--c-lightgray);
`;

const NameAndContent = styled.div`
  margin-left: 8px;
  text-align: start;
  width: 88%;
`;

<<<<<<< HEAD
const commentItem = ({ subReview }: { subReview: SubReview }) => {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();
  console.log(subReview);
  // const toProfileHandler = () => {
  //   navigate;
  // };
  const getCommentUser = () => {
    if (subReview.userId !== undefined) {
      callApi("get", `api/user/${subReview.userId}`).then(res => setUser(res.data));
    }
  };
  useEffect(() => {
    getCommentUser();

    // callApi("get", `api/user/${subReview.userId}`)
    //   .then(res => {
    //     setUser(res.data);
    //   })
    //   .catch(err => console.error(err));
  }, []);

  return (
    <>
=======
type CommentItemProps = {
  subReview: SubReview;
};

const commentItem = forwardRef<HTMLDivElement, CommentItemProps>(
  (props, ref) => {
    const { subReview } = props;
    return (
>>>>>>> 9047c37608c204ae6924a6fd3e690346edcde771
      <WholeDiv>
        <ProfileDiv>
          <ProfileDiv2
            style={{
              backgroundImage: `url(${
                subReview.user?.profile || "기본 이미지 URL"
              })`,
            }}
          ></ProfileDiv2>
        </ProfileDiv>
        <NameAndContent>
          <div>
<<<<<<< HEAD
            <b>{user !== undefined ? user.nickname : "loading"}</b>
=======
            <b>{subReview.user?.nickname}</b>
>>>>>>> 9047c37608c204ae6924a6fd3e690346edcde771
          </div>
          <div>{subReview.content}</div>
          <div ref={ref}></div>
        </NameAndContent>
      </WholeDiv>
    );
  }
);
export default commentItem;
