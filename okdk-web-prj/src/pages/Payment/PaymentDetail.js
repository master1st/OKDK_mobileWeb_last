import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TopNavigation from "../../components/TopNavigation";
import { useNavigate } from "react-router-dom";
import PaymentTitle from "../../components/PaymentTitle";
import axios from "axios";

export const Body = styled.div`
  width: 100%;
  height: fit-content;
  min-height: 100vh;
  background-color: #f5f7fb;
`;
export const ScrollWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PaymentWrap = styled.div`
  width: 90%;
  min-height: 32.5rem;
  border-radius: 1.25rem;
  background: #fff;
  padding: 1.25rem;
  box-sizing: border-box;
`;

export const PaymentSubTitle = styled.p`
  text-align: start;
  color: #000;
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const PaymentTotalPrice = styled.div`
  margin-top: 0.84rem;
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const SubTitle = styled.div`
  margin-top: 3rem;
  text-align: start;
  width: 100%;
  color: #000;
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const CreatedAtWrap = styled.p`
  margin-top: 0.75rem;
  margin-left: 0.5rem;
  text-align: start;
  color: #595959;
  font-family: Pretendard;
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  border-bottom: 1px solid #a4a4a4;
  box-sizing: border-box;
`;

export const TimeWrap = styled.div`
  margin-top: 0.87rem;
  padding: 0 0.5rem 0 0.5rem;
  color: #000;
  font-family: Pretendard;
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  display: flex;
  justify-content: space-between;
`;

export const MenuWrap = styled.div`
  width: 100%;
  display: flex;
  padding: 0 0.5rem 0 0.5rem;
  color: #000;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const PriceWrap = styled.p`
  color: #0583f2;
  text-align: right;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: #0583f2;
  text-align: end;
`;

export default function PaymentDetail() {
  const accessToken = localStorage.getItem("access"); //access Token

  const navigation = useNavigate();
  const [user, setUser] = useState({});
  const [payment, SetPayment] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    async function fetchData() {
      try {
        const userData = await axios.get("/account/user/", config);

        const paymentData = await axios.get("/order/recents/", config);

        // console.log(userData.data);
        console.log(paymentData.data);

        setUser(userData.data);
        SetPayment(paymentData.data);
      } catch (error) {
        console.error("에러 발생:", error);
      }
    }
    fetchData();
  }, []);

  // 날짜별로 history 분할하는 함수------------------------
  const groupDataByDate = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const date = item.created_at.slice(0, 10); // "YYYY-MM-DD" 형식의 날짜 추출
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(item);
    });

    return groupedData;
  };

  return (
    <Body>
      <TopNavigation navigation={navigation} />
      <ScrollWrap>
        <PaymentTitle
          name={user.nickname || "익명"}
          describe={"결제내역 입니다."}
        />
        <PaymentWrap>
          <PaymentSubTitle>
            {payment[0].created_at.slice(6, 7)}월 사용내역
          </PaymentSubTitle>
          <PaymentTotalPrice>
            {payment.reduce((acc, item) => acc + item.totalPrice, 0)}원
          </PaymentTotalPrice>
          <SubTitle>결제 내역</SubTitle>
          {payment.length > 0 ? (
            Object.entries(groupDataByDate(payment)).map(
              ([date, dataByDate], index) => (
                <div key={index}>
                  <CreatedAtWrap>{date}</CreatedAtWrap>
                  {dataByDate.map((data, dataIndex) => (
                    <div
                      key={dataIndex}
                      style={{
                        paddingBottom: "1.17rem",
                        borderBottomColor: "#E0E0E0",
                        borderBottomStyle: "solid",
                        borderBottomWidth: "1px",
                      }}
                    >
                      <TimeWrap>
                        <p>{data.created_at.slice(11, 19)}</p>
                      </TimeWrap>
                      {data.options.map((option, index) => (
                        <MenuWrap key={index}>
                          <p>
                            {option.temperature}
                            {option.menu_name}
                            {option.size}사이즈
                          </p>
                        </MenuWrap>
                      ))}
                      <PriceWrap>- {data.totalPrice}원</PriceWrap>
                    </div>
                  ))}
                </div>
              )
            )
          ) : (
            <div
              style={{
                width: "100%",
                padding: "1rem",
                boxSizing: "border-box",
              }}
            >
              적립 정보가 없습니다
            </div>
          )}
        </PaymentWrap>
      </ScrollWrap>
    </Body>
  );
}