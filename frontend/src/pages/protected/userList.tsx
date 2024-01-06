/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import storage from "../../utils/storage";
import { Button, InputAdornment, TextField } from "@mui/material";
import BackdropLoader from "../../components/Loader/BackdropLoader";
import "./protected.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { ContentLayout } from "../../layout/ContentLayout";
import { API_URL } from "../../config";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function UserList() {
  const token = storage.getToken();
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [clickDelete, setClickDelete] = useState<boolean>(false);
  const [userList, setUserList] = useState<[]>([]);
  const [userId, setId] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(1);
  const [userDelId, setuserDelId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemNum, setItemNum] = useState(1);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (currentPage) {
      setItemNum(currentPage * 10 - 9);
    }
  }, [currentPage]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = (value: any) => {
    try {
      setSearchTerm(value);
    } catch (error) {
      console.error("Error in handleSearch:", error);
    }
  };

  useEffect(() => {
    getUserSearchList();
  }, [searchTerm]);

  const handleEdit = (identity: any) => {
    setId(identity);
  };

  useEffect(() => {
    if (userId) {
      navigate(`/user-edit/${userId}`);
    }
  }, [userId]);

  const getUserSearchList = async () => {
    const apiUrl = `${API_URL}/blog/list?name=${searchTerm}`;
    try {
      const response = await axios.get(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserList(response?.data?.data);
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.log(errorMessage);
      } else {
        console.log("An error occurred");
      }
    }
  };
  const getUserList = async () => {
    setLoading(true);
    let apiUrl = `${API_URL}/blog/list?page=${currentPage}`;

    try {
      const response = await axios.get(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserList(response?.data?.data);
      setTotalPage(response?.data?.totalPages);
      setLoading(false);
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.log(errorMessage);
      } else {
        console.log("An error occurred");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUserList();
    }
  }, [token, isUpdating, currentPage]);

  const handleDelete = (idy: string) => {
    setuserDelId(idy);
    handleClickOpen();
  };

  const deleteUser = async () => {
    setLoading(true);
    setUpdating(true);
    try {
      await axios.delete(`${API_URL}/blog/delete/${userDelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setUpdating(false);
      handleClose();
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.log(errorMessage);
      } else {
        console.log("An error occurred");
      }
      setLoading(false);
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (clickDelete) {
      deleteUser();
    }
  }, [clickDelete]);

  return (
    <ContentLayout title="All User">
      {isLoading ? (
        <BackdropLoader open={true} />
      ) : (
        <>
          <div className="container mt-3">
            <h3>User Profiles Information :</h3>
            <div className="row TPOsbc">
              <div className="col-md-9"></div>
              <div className="col-md-3">
                <TextField
                  id="search"
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            {userList.length > 0 ? (
              <>
                <div className="row">
                  {userList?.map((item: any, index: number) => (
                    <>
                      <div className="col-md-4 " key={index}>
                        <div className="blogBox">
                          <p className="p1">{item?.title}</p>
                          <p className="p2">{item?.content}</p>
                          <p className="p3">{item?.author}</p>
                          <button className="btnDelete">
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                          <button className="btnEdit">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
                <div className="row m-4 rht">
                  <Stack spacing={2}>
                    <Pagination
                      count={totalPage}
                      variant="outlined"
                      shape="rounded"
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                  </Stack>
                </div>
              </>
            ) : (
              <>
                <div className="make-center emptyList">
                  <i className="fa-solid fa-box-archive"></i>
                  <p>No Entry found </p>
                </div>
              </>
            )}
            {/* {userList.length > 0 ? (
              <>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>S.no.</StyledTableCell>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell align="right">Email</StyledTableCell>
                        <StyledTableCell align="right">
                          Phone Number
                        </StyledTableCell>
                        <StyledTableCell align="right">Address</StyledTableCell>
                        <StyledTableCell align="right">Role </StyledTableCell>
                        <StyledTableCell align="right">Action </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userList?.map((item: any, index: number) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell component="th" scope="item">
                            {index + itemNum}
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="item">
                            {item.first_name} {item.last_name}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {item.email}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {item.phone_number}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {item.address}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {item.role === "user" ? "User" : "Admin"}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {item.role == "user" ? (
                              <div className="row">
                                <div className="col-md-6">
                                  <Button
                                    className="bti"
                                    onClick={() => handleEdit(item.id)}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </Button>
                                </div>
                                <div className="col-md-6">
                                  <Button
                                    className="bti"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    <i className="fa-solid fa-trash-can"></i>
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="bti">
                                <i className="fa-solid fa-file-shield"></i>
                              </div>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="row m-4 rht">
                  <Stack spacing={2}>
                    <Pagination
                      count={totalPage}
                      variant="outlined"
                      shape="rounded"
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                  </Stack>
                </div>
              </>
            ) : (
              <>
                <div className="make-center emptyList">
                  <i className="fa-solid fa-box-archive"></i>
                  <p>No Entry found </p>
                </div>
              </>
            )} */}
          </div>
          <React.Fragment>
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Confirm delete
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent dividers>
                <Typography gutterBottom>
                  Are you sure , you want to delete the user ?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={() => setClickDelete(true)}>
                  Delete
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </React.Fragment>
        </>
      )}
    </ContentLayout>
  );
}

export default UserList;
