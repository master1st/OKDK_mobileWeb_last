import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopNavigation from "../../components/TopNavigation";
import PaymentTitle from "../../components/PaymentTitle";
import ListBox from "../../components/ListBox";
import barcodeData from "../../mock/barcode.json";
import Barcode from "../../components/Barcode";
import BasicButton from "../../components/Button";
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

export default function EarningInfomation() {
  //variable management---------------------------
  const navigation = useNavigate();

  const [user, setUser] = useState({});
  const [barcode, setBarcode] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const accessToken = localStorage.getItem("access"); //access Token
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      try {
        const userData = await axios.get("/account/user/", config);

        const barcodeData = await axios.get(
          "/payment/membership/list/",
          config
        );

        console.log(userData.data.user);
        console.log(barcodeData.data);

        setUser(userData.data.user);
        setBarcode(barcodeData.data);
      } catch (error) {
        console.error("fetchData 함수 에러 발생:", error);

        if (error.response && error.response.status === 401) {
          try {
            await refreshAccessToken();
            console.log("fetchData 재시도");
            await fetchData(false);
          } catch (refreshError) {
            console.error("토큰 갱신 중 오류:", refreshError);
            // 추가적인 오류 처리 로직 필요 (예: 사용자를 로그인 페이지로 리다이렉트)
          }
        }
      }
    }
    fetchData();
  }, []);

  const refreshAccessToken = async () => {
    const body = {
      refresh: localStorage.getItem("refresh"),
    };

    try {
      const response = await axios.post(
        "/account/refresh/access_token/",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const access = response.data.access;
      const refresh = response.data.refresh;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      console.log("success : refresh Access Token");
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error; // 함수를 호출하는 곳에서 오류를 처리할 수 있도록 오류를 다시 던집니다.
    }
  };
  return (
    <Body>
      <TopNavigation navigation={navigation} />
      <ScrollWrap>
        <PaymentTitle
          name={user.nickname || "익명"}
          describe={"적립정보를 관리합니다"}
        />

        {/* {barcodeData.barcode.map((data, index) => (
          <ListBox
            listTitle={data.barcodename}
            handleShowMore={() => navigation("/DetailEarningInfomation")}
          >
            <div
              key={index}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Barcode
                width={"9.31331rem"}
                height={"5.5rem"}
                img={data.barcodeimg}
              />
              <p>{data.barcodeNum}</p>
            </div>
          </ListBox>
        ))} */}
        {barcode.map((data, index) => (
          <ListBox
            key={index}
            listTitle={data.brand}
            handleShowMore={() =>
              navigation("/DetailEarningInfomation", {
                state: { brand: data.brand },
              })
            }
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Barcode
                width={"9.31331rem"}
                height={"5.5rem"}
                img={data.image}
              />
              <p>{data.serial_num}</p>
            </div>
          </ListBox>
        ))}
        <BasicButton
          btnName="매장추가하기"
          onClick={() => navigation("/AddStoreToEarning")}
        />
      </ScrollWrap>
    </Body>
  );
}
