"use client";
import * as React from "react";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Typography,
  MenuItem,
  Grid,
  FormControlLabel,
  FormLabel,
  FormControl,
  RadioGroup,
  Radio,
  DialogContentText,
  Alert,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CloseIcon from "@mui/icons-material/Close";
import ListItemButton from "@mui/material/ListItemButton";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useSchedule from "./useSchedule";
import useCategory from "../category/useCategory";
import { Period } from "../_settings/interfaces";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'; //修改
import { DatePicker } from "@mui/lab";
import { format } from "date-fns";
import getRentId from "../equipment/getRentId";
import changeStatus from "../equipment/changeStatus";
import changeRentAble from "../category/changeRentAble";
import useReturn from "./useReturn";
import TestEmail from "../testmail/page";

export default function SelectedListItem() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };
  const [queryUpdate, setQueryUpdate] = useState(0);
  const [queryText, setQueryText] = useState(0);
  const [period, setPeriod, addPeriod, deletePeriod, updatePeriod, isLoading] =
    useSchedule(queryText, queryUpdate);
  // console.log(period);

  //query
  const [queryError, setQueryError] = useState("今日尚未有登記紀錄！");

  function queryButton() {
    setQueryUpdate((currentValue) => currentValue + 1);
    if (queryText != 0 && period.length == 0) {
      setQueryError(
        "你所查詢的行政人員編號 / 學號並不存在或其並未於今日租界器材使用，請重新查詢"
      );
    } else {
      setQueryError("今日尚未有登記紀錄！");
    }
  }

  //getCategoryNumber
  const [queryCategory, setQueryCategory] = useState("");
  const [category, setCategory] = useCategory(queryCategory);
  if (queryCategory !== "") {
    // console.log(category[0].rentAble);
  }

  //DatePicker
  const [newDate, setnewDate] = React.useState(new Date());
  const date = format(newDate, "M/d/yyyy");

  //add
  // const [newPeriod, setNewPeriod] = useState<Period[]>([]);
  const [newPeriod, setNewPeriod] = useState<Period>({
    id: "",
    userId: 0,
    userName: "",
    category: "",
    quantity: 0,
    period: "",
    rentId: [],
    rentTime: Timestamp.fromDate(new Date())
      .toDate()
      .toTimeString()
      .slice(0, 5),
    returnTime: "",
    date: format(newDate, "M/d/yyyy"),
  });

  const handleClick = function (e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "userId") {
      setNewPeriod({ ...newPeriod, [e.target.name]: parseInt(e.target.value) });
    } else if (e.target.name === "quantity") {
      setNewPeriod({ ...newPeriod, [e.target.name]: parseInt(e.target.value) });
      setRentIdUpdate((currentValue) => currentValue + 1); //control getRentId
    } else if (e.target.name === "queryText") {
      //query
      setQueryText(parseInt(e.target.value));
    } else if (e.target.name === "category") {
      //getCategoryNumber
      setQueryCategory(e.target.value);
      setNewPeriod({ ...newPeriod, [e.target.name]: e.target.value });
    } else {
      setNewPeriod({ ...newPeriod, [e.target.name]: e.target.value });
    }
  };

  const [inputError, setInputError] = useState("");
  function handleValidation() {
    //check value correct
    if (newPeriod.userId === 0) {
      //userID
      setInputError("請輸入教職員編號或學號！");
    } else if (newPeriod.userName === "") {
      //userName
      setInputError("請輸入姓名！");
    } else if (newPeriod.category === "") {
      //category
      setInputError("請選擇器材！");
    } else if (newPeriod.quantity === 0) {
      //quantity
      setInputError("數量不可為零！請重新輸入");
    } else if (newPeriod.quantity > category[0].rentAble) {
      setInputError("超過數量上限！請重新輸入");
    } else if (newPeriod.period === "") {
      //period
      setInputError("請選擇時段！");
    } else {
      handleAddOpen();
    }
  }

  //function GetRentId and ChangeRentAble
  const [rentIdUpdate, setRentIdUpdate] = useState(0);
  const [rentId, setRentId, imLoading] = getRentId(
    newPeriod.category,
    newPeriod.quantity,
    rentIdUpdate
  );
  const [rentAbleUpdate, setRentAbleUpdate] = useState(0);
  changeRentAble(newPeriod.category, newPeriod.quantity, rentAbleUpdate);

  function add() {
    setRentAbleUpdate((currentValue) => currentValue + 1); //control changeRentAble
    changeStatus(rentId); //control changeStatus
    setNewPeriod({ ...newPeriod, rentId: rentId });
  }

  function confirm() {
    // console.log(newPeriod);
    addPeriod(newPeriod);
    resetPeriod();
    setInputError("");
    setAddOpen(false);
  }

  // add-alert open
  const [addOpen, setAddOpen] = React.useState(false);
  const handleAddOpen = () => {
    setAddOpen(true);
    add();
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };

  const resetPeriod = () => {
    setNewPeriod({
      id: "",
      userId: 0,
      userName: "",
      category: "",
      quantity: 0,
      period: "",
      rentId: [],
      rentTime: Timestamp.fromDate(new Date())
        .toDate()
        .toTimeString()
        .slice(0, 5),
      returnTime: "",
      date: format(newDate, "M/d/yyyy"),
    });
  };

  //return
  const [returnId, setReturnId] = useState("");
  const [returnUpdate, setReturnUpdate] = useState(0);
  useReturn(returnId, returnUpdate);
  //return-alert open
  const [open, setOpen] = React.useState(false);
  function handleClickOpen(period: Period, id: string) {
    setReturnId(id);
    setNewPeriod({
      ...period,
      returnTime: Timestamp.fromDate(new Date())
        .toDate()
        .toTimeString()
        .slice(0, 5),
    });
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    setReturnId("");
    resetPeriod();
  };

  function addReturnTime() {
    setReturnUpdate((currentValue) => currentValue + 1);
    updatePeriod(newPeriod);
    setOpen(false);
    resetPeriod();
  }

  //delete-alert open
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState("");
  function handelDeleteOpen(id: string) {
    setDeleteOpen(true);
    setDeleteId(id);
  }

  function DeletePeriod() {
    deletePeriod(deleteId);
    setDeleteId("");
    setDeleteOpen(false);
  }

  const [isTestEmailVisible, setTestEmailVisible] = useState(false);

  const handleButtonClick = () => {
    setTestEmailVisible(!isTestEmailVisible);
  };

  return (
    <div>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Grid container spacing={2} columns={16}>
          <Grid xs={7}>
            <Card
              aria-labelledby="租借器材"
              variant="outlined"
              style={{ padding: "1.5rem" }}
            >
              <Typography variant="h6" component="div">
                租借器材{" "}
                <span style={{ fontSize: "0.8rem", color: "red" }}>
                  {inputError}
                </span>
              </Typography>
              <CardContent>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <TextField
                    label="教職員編號 / 學號"
                    variant="outlined"
                    name="userId"
                    value={newPeriod.userId}
                    onChange={handleClick}
                  />
                  <TextField
                    label="姓名"
                    variant="outlined"
                    name="userName"
                    value={newPeriod.userName}
                    onChange={handleClick}
                  />
                  <TextField
                    label="器材種類"
                    select
                    style={{ width: "100%" }}
                    name="category"
                    value={newPeriod.category}
                    onChange={handleClick}
                  >
                    <MenuItem value="羽球拍">羽球拍</MenuItem>
                    <MenuItem value="排球">排球</MenuItem>
                    <MenuItem value="羽球">羽球</MenuItem>
                    <MenuItem value="桌球">桌球</MenuItem>
                    <MenuItem value="桌球拍">桌球拍</MenuItem>
                    <MenuItem value="籃球">籃球</MenuItem>
                  </TextField>
                  <TextField
                    label="數量"
                    helperText={
                      newPeriod.category != ""
                        ? "最多可借：" + category[0].rentAble
                        : ""
                    }
                    variant="outlined"
                    name="quantity"
                    value={newPeriod.quantity}
                    onChange={handleClick}
                  />
                </div>
                <FormControl style={{ marginTop: "1rem" }}>
                  <FormLabel>請選擇時段：</FormLabel>
                  <RadioGroup
                    name="period"
                    value={newPeriod.period}
                    onChange={handleClick}
                    row
                  >
                    <FormControlLabel
                      value="D1~D2"
                      control={<Radio />}
                      label="D1~D2"
                    />
                    <FormControlLabel
                      value="D3~D4"
                      control={<Radio />}
                      label="D3~D4"
                    />
                    <FormControlLabel
                      value="D5~D6"
                      control={<Radio />}
                      label="D5~D6"
                    />
                    <FormControlLabel
                      value="D7~D8"
                      control={<Radio />}
                      label="D7~D8"
                    />
                  </RadioGroup>
                </FormControl>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="登記日期(readonly)"
                      readOnly
                      value={date}
                      onChange={() => setnewDate(newDate)}
                      // renderInput={(params) => <TextField {...params} />} //修改
                      renderInput={(params: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} />} //修改
                    />
                  </LocalizationProvider>
                  <TextField
                    inputProps={{ readOnly: true }}
                    label="登記時間(readonly)"
                    variant="outlined"
                    name="rentTime"
                    value={Timestamp.fromDate(new Date())
                      .toDate()
                      .toTimeString()
                      .slice(0, 5)}
                    onChange={handleClick}
                  />
                </div>
                <div style={{ display: "none" }}>
                  <TextField
                    label="歸還時間(disabled)"
                    disabled
                    variant="outlined"
                    name="returnTime"
                    value={""}
                    onChange={handleClick}
                  />
                </div>
              </CardContent>
              <CardActions style={{ float: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleValidation}
                >
                  確定租借
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* 確定租借窗口 */}
          <Dialog open={addOpen} onClose={handleAddClose}>
            <div
              style={{
                minWidth: "10rem",
                minHeight: "8rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {imLoading ? (
                <CircularProgress />
              ) : (
                <div>
                  <p style={{ marginBottom: "0.5rem" }}>租借成功</p>
                  <Button variant="contained" onClick={confirm}>
                    確認
                  </Button>
                </div>
              )}
            </div>
          </Dialog>

          {/* --------------------------------------------------------------------------------------- */}

          <Grid
            xs={9}
            sx={{ px: "2rem", display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">當日租借紀錄</Typography>
            </Box>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                marginBottom: "-1px",
              }}
            >
              <div></div>
              <div>
                <TextField
                  sx={{ mr: 2 }}
                  size="small"
                  label="請輸入編號 / 學號"
                  variant="outlined"
                  name="queryText"
                  value={queryText}
                  onChange={handleClick}
                />
                <Button variant="contained" onClick={queryButton}>
                  搜尋
                </Button>
              </div>
            </Box>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <List>
                <Box display={period.length != 0 ? "none" : "block"}>
                  <Alert severity="error">{queryError}</Alert>
                </Box>
                {period.map((period, index) => (
                  <ListItem divider key={index}>
                    <ListItemButton
                      selected={selectedIndex === index}
                      onClick={(event) => handleListItemClick(event, index)}
                    >
                      <ListItemText
                        primary={[period.userId, "  ", period.userName]}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {[
                                "器材種類: ",
                                period.category,
                                "、數量: ",
                                period.quantity,
                                "、時段: ",
                                period.period,
                                "、登記時間: ",
                                period.rentTime,
                              ]}
                            </Typography>
                          </React.Fragment>
                        }
                      ></ListItemText>

                      {/* return btn */}
                      <Button
                        variant="contained"
                        disabled={period.returnTime != ""}
                        onClick={() => handleClickOpen(period, period.id)}
                      >
                        {period.returnTime != "" ? "已歸還" : "歸還"}
                      </Button>
                      {period.returnTime === "" && (
                        <Button
                          style={{ marginLeft: "5px" }}
                          variant="contained"
                          onClick={handleButtonClick}
                        >
                          {isTestEmailVisible ? "關閉" : "催還"}
                        </Button>
                      )}

                      <Box display={period.returnTime == "" ? "none" : "block"}>
                        {/* delete */}
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handelDeleteOpen(period.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
            {/* return */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle
                sx={{
                  m: 0,
                  p: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton>
                  <WarningAmberRoundedIcon fontSize="large" />
                </IconButton>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{ pr: 2, color: (theme) => theme.palette.grey[500] }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <DialogContentText>
                  <h3>請確實清點器材數量以及是否損壞再進行歸還！</h3>
                  <p>歸還時間 (readonly)：{newPeriod.returnTime}</p>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button variant="contained" onClick={addReturnTime}>
                  {" "}
                  確認{" "}
                </Button>
              </DialogActions>
            </Dialog>

            {/* delete */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
              <DialogTitle
                sx={{ m: 0, p: 1, display: "flex", alignItems: "center" }}
              >
                <IconButton>
                  <WarningAmberRoundedIcon fontSize="large" />
                </IconButton>
                確定取消租借嗎？
                <IconButton
                  aria-label="close"
                  onClick={() => setDeleteOpen(false)}
                  sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogActions>
                <Button onClick={() => setDeleteOpen(false)}>取消</Button>
                <Button variant="contained" onClick={DeletePeriod}>
                  確認
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Box>
      <div>{isTestEmailVisible && <TestEmail />}</div>
    </div>
  );
}
