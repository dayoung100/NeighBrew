import { useState, useEffect } from "react";
import styled from "styled-components";

const meetingMy = () => {
  return (
    <div>
      내 모임 컴포넌트
      <div style={{ background: "var(--c-black)", color: "white" }}>--c-black</div>
      <div style={{ background: "var(--c-gray)" }}>--c-gray</div>
      <div style={{ background: "var(--c-lightgray)" }}>--c-lightgray</div>
      <div style={{ background: "var(--c-yellow)" }}>--c-yellow</div>
      <div style={{ background: "var(--c-beige)" }}>--c-beige</div>
    </div>
  );
};
export default meetingMy;
