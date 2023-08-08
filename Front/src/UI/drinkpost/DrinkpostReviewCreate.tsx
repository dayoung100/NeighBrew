import backIcon from "../../assets/backIcon.svg";
import createButton from "../../assets/createButton.svg";
import defaultImage from "../../assets/defaultImage.svg";
import imageButton from "../../assets/imageButton.svg";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { callApi } from "../../utils/api";
import { User, Drink } from "../../Type/types";
import detail from "./DrinkpostDetail";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Navdiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateBody = styled.div`
  border: 2px solid black;
`;

const InputDiv = styled.div`
  margin-left: 36px;
  text-align: start;
  margin-bottom: 30px;
`;

const ImageDiv = styled.div`
  margin-left: 36px;
  text-align: start;
`;

const Input = styled.input`
  font-size: 20px;
  width: 98%;
  height: 70%;
  border: none;
  border-bottom: 1px solid #444;
  outline: none;
  &:focus {
    border-bottom: 2px solid #000000;
  }
`;

const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  margin-bottom: 0.5rem;
`;

const ImgInput = styled.div`
  // label로 대신하고 input은 숨기기 위한 css
  input[type="file"] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

const ImageArea = styled.div<{ src: string }>`
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
  border-radius: 15px;
  position: relative;
  width: 30%;
  padding-bottom: 30%;
  overflow: hidden;
`;

const DrinkpostReviewCreate = () => {
  const navigate = useNavigate();
  const { drinkId } = useParams();
  const [drink, setDrink] = useState<Drink>();
  const [review, setReview] = useState("");
  const [myInfo, setMyInfo] = useState<User>();
  const reviewHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReview(e.target.value);
  };
  const myId = localStorage.getItem("myId");
  const [imgFile, setImgFile] = useState(null);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(myId);
    callApi("get", `api/drink/${drinkId}`)
      .then(res => {
        setDrink(res.data);
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    callApi("get", `api/user/guard/myinfo`)
      .then(res => {
        console.log(res.data);
        setMyInfo(res.data);
        console.log(myInfo);
      })
      .catch(err => console.log(err));
  }, []);

  const reviewSubmit = () => {
    const file = imgRef.current.files[0];
    const formData = new FormData();

    formData.append("drinkId", drinkId);
    formData.append("content", review);
    formData.append("image", file);
    if (review === "") {
      alert("뭐라도 입력해봐.");
      return;
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    axios
      .post("api/drinkreview/guard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(res => {
        console.log(res.data);
        navigate(`/drinkpost/${drinkId}`);
      })
      .catch(err => console.error(err));

    // callApi("post", "api/drinkreview/guard", {
    //   myInfo: myInfo.userId,
    //   drinkId: drinkId,
    //   content: review,
    //   img: null,
    // })
    //   .then(res => {
    //     console.log(res);
    //     console.log("잘댐");
    //     navigate(`/drinkpost/${drinkId}`);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     console.log("안댐");
    //   });
  };

  const toPreviousPage = () => {
    navigate(`/drinkpost/${drinkId}`);
  };

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImgFile(reader.result);
      }
    };
  };

  const uploadReviewImage = async () => {
    const file = imgRef.current.files[0];
    try {
      const formData = new FormData();
      formData.append("image", file);
      if (file !== undefined) {
        const response = await axios.post(`http://i9b310.p.ssafy.io/api/img/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const submitHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    const file = imgRef.current.files[0];
    const formData = new FormData();
    formData.append("drinkId", drinkId);
    formData.append("content", review);
    formData.append("image", file);
    if (review === "") {
      alert("뭐라도 입력해봐.");
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    axios
      .post("api/drinkreview/guard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };
  return (
    <>
      <Navdiv>
        <div style={{ marginLeft: "10px", cursor: "pointer" }} onClick={toPreviousPage}>
          <img src={backIcon} alt="" />
        </div>
        <h2 onClick={() => navigate(`/drinkpost/${drinkId}`)}>{drink?.name}</h2>
        <div style={{ visibility: "hidden" }}>A</div>
      </Navdiv>
      <CreateBody>
        <InputDiv>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="review">
              <b>후기 작성</b>
            </label>
          </div>
          <Input
            id="review"
            placeholder="후기 글을 작성해주세요."
            onChange={reviewHandler}
            autoFocus
          ></Input>
        </InputDiv>
        <div style={{ marginLeft: "36px" }}>
          <QuestionDiv style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Title style={{ margin: "0" }}>대표 이미지</Title>
              <ImgInput>
                <label htmlFor="img_file">
                  <img src="/src/assets/imageButton.svg" style={{ margin: "0 0.5rem" }} />
                </label>
                <input
                  type="file"
                  id="img_file"
                  accept="image/jpg, image/png, image/jpeg"
                  onChange={saveImgFile}
                  ref={imgRef}
                />
              </ImgInput>
            </div>
            {imgFile && <ImageArea src={imgFile}></ImageArea>}
          </QuestionDiv>
        </div>

        <div onClick={reviewSubmit} style={{ marginTop: "80%" }}>
          <img src={createButton} alt="" />
        </div>
      </CreateBody>
    </>
  );
};
export default DrinkpostReviewCreate;
