/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import storage from "../../utils/storage";
import { Button, InputAdornment, TextField } from "@mui/material";
import BackdropLoader from "../../components/Loader/BackdropLoader";
import "./protected.css";
import { styled } from "@mui/material/styles";
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
import { trimText } from "../../utils/format";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BlogList() {
  const token = storage.getToken();
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [clickDelete, setClickDelete] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const [blogList, setBlogList] = useState<[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [blogDeleteId, setBlogDeleteId] = useState<string>("");
  const [showId, setShowId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

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

  const getUserSearchList = async () => {
    const apiUrl = `${API_URL}/blog/list?name=${searchTerm}`;
    try {
      const response = await axios.get(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogList(response?.data?.data);
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        console.log(errorMessage);
      } else {
        console.log("An error occurred");
      }
    }
  };
  const getblogList = async () => {
    setLoading(true);
    let apiUrl = `${API_URL}/blog/list?page=${currentPage}`;

    try {
      const response = await axios.get(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogList(response?.data?.data);
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
      getblogList();
    }
  }, [token, isUpdating, currentPage]);

  const handleDelete = (idy: string) => {
    setBlogDeleteId(idy);
    handleClickOpen();
  };

  const deleteUser = async () => {
    setLoading(true);
    setUpdating(true);
    try {
      await axios.delete(`${API_URL}/blog/delete/${blogDeleteId}`, {
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

  const handleMore = (id: string) => {
    setShowId(id);
    setShowText(true);
  };

  return (
    <ContentLayout title="All Blog">
      {isLoading ? (
        <BackdropLoader open={true} />
      ) : (
        <>
          <div className="container mt-3">
            <h3>Blog List : </h3>
            <div className="row TPOsbc">
              <div className="col-md-9">
                <Button
                  onClick={() => navigate("/create-blog")}
                  className="blogBttn"
                  variant="contained"
                  type="submit"
                >
                  Create Blog
                </Button>
              </div>
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
            {blogList.length > 0 ? (
              <>
                <div className="row">
                  {blogList?.map((item: any, index: number) => (
                    <>
                      <div className="col-md-4 " key={index}>
                        <div className="blogBox">
                          <p className="p1">{item?.title}</p>
                          {showText && showId === item?.id ? (
                            <p className="p2">{item?.content}</p>
                          ) : (
                            <p className="p2">
                              {trimText(item?.content)}
                              {item?.content.length > 60 ? (
                                <button
                                  className="readBtn"
                                  onClick={() => handleMore(item?.id)}
                                >
                                  Read more
                                </button>
                              ) : null}
                            </p>
                          )}
                          <p className="p3">{item?.author}</p>
                          <button
                            className="btnDelete"
                            onClick={() => handleDelete(`${item?.id}`)}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                          <button
                            className="btnEdit"
                            onClick={() => navigate(`/update-blog/${item?.id}`)}
                          >
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
                  Are you sure , you want to delete the blog ?
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

export default BlogList;
