"use client";
import React, { useRef, useState, useContext } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FilledTextFieldProps,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  OutlinedTextFieldProps,
  Radio,
  RadioGroup,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridLocaleText,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarFilterButton,
  zhTW,
} from "@mui/x-data-grid";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  Timestamp,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import MultipleSelectChip from "./repairment/MultipleSelectChip";
import useCategory from "./repairment/useCategory";
import useEquipment from "./repairment/useEquipment";
import useRepairment from "./repairment/useRepairment";
import { Period, Repair } from "./_settings/interfaces";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import shortUUID from "short-uuid";
import app from "@/app/_firebase/Config";
import { AuthContext } from "./AuthContext";
import { FirebaseError } from "firebase/app";
import { DatePicker } from "@mui/lab";
import useReturn from "./schedule/useReturn";
import changeRentAble from "./category/changeRentAble";
import getRentId from "./equipment/getRentId";
import useSchedule from "./schedule/useSchedule";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Schedule from "./schedule/page"
import Record from "./history/page"

export default function Home() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const authContext = useContext(AuthContext);

  const storage = getStorage(app);
  const [account, setAccount] = useState({
    email: "",
    password: "",
    name: "",
    photo: "next.svg",
  });
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("註冊");
  const [file, setFile] = useState<File>();
  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };
  const changeStatus = function (e: React.MouseEvent<HTMLElement>) {
    if (status === "註冊") {
      setStatus("登入");
    } else {
      setStatus("註冊");
    }
  };
  const logout = function (e: React.MouseEvent<HTMLElement>) {
    auth.signOut();
    setStatus("登入");
    setMessage("登出成功");
  };

  const handleUpload = async function (e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      console.log(e.target.files[0]);
      setAccount({ ...account, photo: e.target.files[0].name });
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async function (e: React.MouseEvent<HTMLElement>) {
    try {
      if (status === "註冊") {
        const res = await createUserWithEmailAndPassword(
          auth,
          account.email,
          account.password
        );
        setMessage(`註冊成功，歡迎 ${res.user?.email}`);
        console.log(file);
        setStatus("登入成功");

        if (file) {
          const imageRef = ref(storage, file.name);
          await uploadBytes(imageRef, file);
          setMessage(`個人照片上傳成功，歡迎 ${res.user?.email}`);
          const userDoc = await setDoc(doc(db, "account", res.user.uid), {
            photo: file.name,
          });
          const starsRef = ref(storage, file.name);
          const photoURL = await getDownloadURL(starsRef);
          setAccount({ ...account, photo: photoURL });
        } else {
          setMessage("未上傳檔案");
        }
      } else {
        const res = await signInWithEmailAndPassword(
          auth,
          account.email,
          account.password
        );
        // setMessage(`登入成功，歡迎 ${res.user?.email}`);
        if (res) {
          const userDoc = await getDoc(doc(db, "account", res.user.uid));
          let photo = "Ben.jpg";
          if (userDoc.exists()) {
            photo = userDoc.data().photo ? userDoc.data().photo : "Ben.jpg";
          }
          const starsRef = ref(storage, photo);
          const photoURL = await getDownloadURL(starsRef);
          setAccount({ ...account, photo: photoURL });
        }
        setStatus("登入成功");
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        let message = "";
        switch (e.code) {
          case "auth/email-already-in-use":
            message = "電子信箱已註冊";
            break;
          case "auth/weak-password":
            message = "密碼強度不足";
            break;
          case "auth/invalid-email":
            message = "電子郵件格式錯誤";
            break;
          case "auth/user-not-found":
            message = "電子郵件信箱不存在";
            break;
          case "auth/wrong-password":
            message = "密碼錯誤";
            break;
          case "auth/too-many-requests":
            message = "登入失敗次數過多，請稍後再試";
            break;
          default:
            message = "系統錯誤:" + e.code;
        }
        setMessage(message);
      } else {
        if (e instanceof Error) {
          setMessage(e.message);
        } else {
          setMessage("系統錯誤");
        }
      }
    }
  };

  return (
    <center>
      {authContext && (
        <div style={{ display: "flex" }}>
          <Card
            style={{
              // backgroundColor: "#D7E9F7",
              width: "60%",
              // padding: "35px 20px 20px 20px",
              margin: "10px",
              borderLeft: "4px solid gray",
            }}
          >
            <CardHeader style={{marginBottom: "-70px"}}
              title={
                <Typography style={{ fontSize: "25px", textAlign: "left" }}>
                  快速租借
                </Typography>
              }
            ></CardHeader>
            <CardContent>
              <Schedule />
            </CardContent>
          </Card>
          <Card
            style={{
              // backgroundColor: "#90AACB",
              width: "40%",
              margin: "10px",
              borderLeft: "4px solid gray",
            }}
          >
            <CardHeader style={{marginBottom: "-20px"}}
              title={
                <Typography style={{ fontSize: "25px", textAlign: "left" }}>
                  查看所有租借紀錄
                </Typography>
              }
            ></CardHeader>
            <CardContent>
              <Record />
            </CardContent>
          </Card>
        </div>
      )}
      {!authContext && (
        <form
          style={{
            border: "1px solid lightgray",
            width: "470px",
            marginTop: "50px",
            paddingTop: "30px",
            paddingBottom: "20px",
            marginBottom: "50px",
            boxShadow: "1px 1px 5px lightgray",
          }}
        >
          {/* {status === "登入成功" && (
            <Card sx={{ maxWidth: "30vw" }}>
              <CardMedia
                component="img"
                image={account.photo}
                alt={account.email}
              />
              <CardContent>{account.email}</CardContent>
            </Card>
          )} */}

          {(status === "註冊" || status === "登入") && (
            <div>
              <div>
                <TextField
                  type="email"
                  name="email"
                  value={account.email}
                  placeholder="電子郵件信箱"
                  label="電子郵件信箱:"
                  onChange={handleChange}
                  autoComplete="username"
                  style={{ width: "350px" }}
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <TextField
                  type="password"
                  name="password"
                  value={account.password}
                  placeholder="密碼"
                  label="密碼:"
                  onChange={handleChange}
                  autoComplete="current-password"
                  style={{ width: "350px" }}
                />
              </div>
            </div>
          )}

          {status === "註冊" && (
            <div>
              <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                <TextField
                  type="text"
                  name="name"
                  value={account.name}
                  placeholder="姓名"
                  label="姓名:"
                  onChange={handleChange}
                  style={{ width: "350px" }}
                />
              </div>
              <div>
                <TextField
                  type="file"
                  inputProps={{ accept: "image/x-png,image/jpeg" }}
                  onChange={handleUpload}
                  style={{ width: "350px" }}
                />
              </div>
            </div>
          )}
          <div>
            {status === "註冊" || status === "登入" ? (
              <div style={{ marginTop: "20px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {status}
                </Button>
              </div>
            ) : (
              <div style={{ marginTop: "15px" }}>
                <Button variant="contained" color="primary" onClick={logout}>
                  返回登入
                </Button>
              </div>
            )}
          </div>

          <div style={{ marginTop: "10px", marginBottom: "15px" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={changeStatus}
            >
              {status === "註冊" ? "已經註冊，我要登入" : "尚未註冊，我要註冊"}
            </Button>
          </div>

          {/* <div style={{ marginTop: "10px" }}>{message}</div> */}
        </form>
      )}
    </center>
  );
}
