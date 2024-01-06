import axios from "axios";
import { useEffect, useState } from "react";
import storage from "../../utils/storage";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import blogImg from "../../assets/blog.jpg";
import BackdropLoader from "../../components/Loader/BackdropLoader";
import "./protected.css";
import { useNavigate, useParams } from "react-router-dom";
import { ContentLayout } from "../../layout/ContentLayout";
import { API_URL } from "../../config";
import styled from "@emotion/styled";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px; 
  color: grey;
  background: #e9e8e8;
  border: 1px solid #e9e8e8 
`
);

function UpdateBlog() {
  const token = storage.getToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [blog, setBlog] = useState<any>(null);

  const getBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/blog/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlog(response?.data?.data);
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
    if (id) {
      getBlog();
    }
  }, [id]);

  interface FormData {
    title: string;
    author: string;
    content: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.put(`${API_URL}/blog/update/${blog?.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Data updated successfully!");
      navigate("/blog-list");
    } catch (error) {
      console.error("Error:", error);

      toast.error(`${error}`);
    }
  };

  return (
    <ContentLayout title="Edit User">
      <BackdropLoader open={isLoading} />
      {!blog ? (
        <BackdropLoader open={true} />
      ) : (
        <>
          <div className="formDiv">
            <div className="">
              <div
                className="row backButton"
                onClick={() => navigate("/blog-list")}
              >
                <i className="fa-solid fa-circle-left"></i>
              </div>
              <div className="row">
                <div className="col-md-7 make-center">
                  <div className="imgDiv">
                    <img className="blImg" src={blogImg} />
                  </div>
                </div>
                <div className="col-md-5 make-center">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        id="title"
                        {...register("title", { required: true })}
                        label="Title"
                        variant="filled"
                        defaultValue={blog?.title}
                      />

                      {errors.title && (
                        <p className="errorText">Title is required.</p>
                      )}
                    </div>

                    <div>
                      <TextField
                        id="author"
                        label="Author"
                        defaultValue={blog?.author}
                        variant="filled"
                        {...register("author", {
                          required: "Author name is required",
                          maxLength: {
                            value: 20,
                            message: "Author name cannot exceed 20 characters",
                          },
                          minLength: {
                            value: 1,
                            message: "Author name is required",
                          },
                        })}
                      />

                      {errors.author && (
                        <p className="errorText">{errors.author.message}</p>
                      )}
                    </div>
                    <div className="mt-3">
                      <Textarea
                        aria-label="minimum height"
                        defaultValue={blog?.content}
                        minRows={3}
                        placeholder="Content"
                        {...register("content", { required: true })}
                      />

                      {errors.content && (
                        <p className="errorText">Content is required.</p>
                      )}
                    </div>

                    <div className="make-center mt-5">
                      <Button variant="contained" type="submit">
                        Edit
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </ContentLayout>
  );
}

export default UpdateBlog;
