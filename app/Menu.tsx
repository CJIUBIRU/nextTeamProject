"use client";
import { AppBar, Button, Toolbar } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import app from "./_firebase/Config";
import { getAuth } from "firebase/auth";
import { AuthContext } from "./AuthContext";

export default function Menu() {
  const logout = async function (e: React.MouseEvent<HTMLElement>) {
    try {
      await auth.signOut();
    } catch (error) {
      window.alert("登出失敗，請在試一次。");
    }
  };
  const auth = getAuth(app);
  const router = useRouter();
  const pathname = usePathname();
  const authContext = useContext(AuthContext);

  return (
    <AppBar position="static">
      {authContext && (
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 style={{ margin: "20px" }}>輔仁大學體育器材室管理系統</h2>
            <Button
              color="inherit"
              variant={pathname === "/" ? "outlined" : "text"}
              onClick={() => router.push("/")}
            >
              主頁面
            </Button>
            <Button
              color="inherit"
              variant={pathname === "/equipment" ? "outlined" : "text"}
              onClick={() => router.push("/equipment")}
            >
              器材管理
            </Button>
            <Button
              color="inherit"
              variant={pathname === "/schedule" ? "outlined" : "text"}
              onClick={() => router.push("/schedule")}
            >
              時段管理
            </Button>
            <Button
              color="inherit"
              variant={pathname === "/history" ? "outlined" : "text"}
              onClick={() => router.push("/history")}
            >
              租借紀錄
            </Button>
            <Button
              color="inherit"
              variant={pathname === "/report" ? "outlined" : "text"}
              onClick={() => router.push("/report")}
            >
              統計報表
            </Button>
            <Button
              color="inherit"
              variant={pathname === "/repairment" ? "outlined" : "text"}
              onClick={() => router.push("/repairment")}
            >
              器材報修
            </Button>
            <Button
              color="inherit"
              variant={pathname === "/account" ? "outlined" : "text"}
              onClick={() => router.push("/account")}
            >
              帳號管理
            </Button>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p style={{ lineHeight: "35px" }}>目前登入：{authContext}</p>&nbsp;
            <Button variant="contained" color="primary" onClick={logout}>
              登出
            </Button>
          </div>
        </Toolbar>
      )}
      {!authContext && (
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 style={{ margin: "20px" }}>輔仁大學體育器材室管理系統</h2>
          </div>
          <div style={{ display: "flex" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/")}
            >
              登入/註冊
            </Button>
          </div>
        </Toolbar>
      )}
    </AppBar>
  );
}
