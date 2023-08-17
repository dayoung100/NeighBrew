import { callApi } from "../../utils/api";
import { backIcon } from "../../assets/AllIcon";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import AlarmItem from "../components/AlarmItem";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
import autoAnimate from "@formkit/auto-animate";
import { AlarmLog } from "../../Type/types";
import EmptyMsg from "../components/EmptyMsg.tsx";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

const NavbarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ActionContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 18px;
  font-weight: 500;
  box-sizing: border-box;
  background-color: #e17070;
  color: #1d1818;
  overflow: hidden;
`;

const deletePush = (id: number) => {
  callApi("delete", `api/push/${id}`)
    .then(res => {
      console.log(res);
    })
    .catch(err => console.error(err));
};
const trailingActions = (id: number) => (
  <TrailingActions>
    <SwipeAction destructive={true} onClick={() => deletePush(id)}>
      <ActionContent>알림삭제</ActionContent>
    </SwipeAction>
  </TrailingActions>
);
const alarmPage = () => {
  const parent = useRef(null);
  const BackIcon = backIcon();
  const navigate = useNavigate();
  const myId = localStorage.getItem("myId");
  // 현재 더미 텍스트로 이루어져 있습니다. api가 있으면 비어두면 될 것 같습니다.
  const [alarmList, setAlarmList] = useState<AlarmLog[]>([]);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  // 비동기 통신으로 알림을 불러옵니다. api가 있을 때 까지 주석처리.
  useEffect(() => {
    callApi("get", `api/push/${myId}`)
      .then(res => {
        setAlarmList(res.data);
      })
      .catch(err => console.error(err));
  }, []);
  const goPageHandler = async (url: string, id: number) => {
    await deletePush(id);
    await navigate(url.split("io")[1]);
  };
  const toBackHandler = () => {
    navigate(-1);
  };
  return (
    <>
      {/* 알림창의 내브바 */}
      <NavbarDiv>
        <div style={{ marginLeft: "10px" }} onClick={toBackHandler}>
          {BackIcon}
        </div>
        <div>
          <h2 style={{ fontFamily: "JejuGothic" }}>알림 페이지</h2>
        </div>
        <div style={{ width: "36px", height: "10px", visibility: "hidden" }}></div>
      </NavbarDiv>

      {/* 모든 알림을 리스트로 가정을 하고 map으로 풀어냅니다. 정의될때까지 주석처리. */}
      <div style={{ margin: "0px 10px 0px 10px" }} ref={parent}>
        {alarmList.length === 0 ? (
          <EmptyMsg title="알림이 없습니다." contents="" />
        ) : (
          alarmList.map((alarm, i) => {
            return (
              <SwipeableList>
                <SwipeableListItem
                  trailingActions={trailingActions(alarm.pushId)}
                  onClick={() => {
                    goPageHandler(alarm.url, alarm.pushId);
                  }}
                >
                  <AlarmItem key={i} alarm={alarm}></AlarmItem>
                </SwipeableListItem>
              </SwipeableList>
            );
          })
        )}
      </div>
      <Footer></Footer>
    </>
  );
};
export default alarmPage;
