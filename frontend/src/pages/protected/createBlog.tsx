import { useForm, SubmitHandler } from "react-hook-form";
import clsx from "clsx";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import { Button } from "@mui/material";
import blogImg from "../../assets/blog.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ContentLayout } from "../../layout/ContentLayout";
import { API_URL } from "../../config";
import storage from "../../utils/storage";
import "./protected.css";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import styled from "@emotion/styled";

interface FormData {
  title: string;
  author: string;
  content: string;
}
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
export const CreateBlog = () => {
  const navigate = useNavigate();
  const token = storage.getToken();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.post(`${API_URL}/blog/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(`Blog created  successful!`);
      navigate("/blog-list");
    } catch (error: any) {
      toast.error(`${error?.response?.data?.message}`);
    }
  };

  return (
    <ContentLayout title="Create Blog">
      <div className="formDiv">
        <div className="registerMargin">
          <div className="row">
            <div className="col-md-7 make-center">
              <div className="imgDiv">
                <img className="blogImg" src={blogImg} alt="register" />
              </div>
            </div>
            <div className="col-md-5 make-center">
              <h5>Create Blog</h5>
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
                  />

                  {errors.title && (
                    <p className="errorText">Title is required.</p>
                  )}
                </div>

                <div>
                  <TextField
                    id="author"
                    label="Author"
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
                    minRows={3}
                    placeholder="Content"
                    {...register("content", { required: true })}
                  />

                  {errors.content && (
                    <p className="errorText">Content is required.</p>
                  )}
                </div>

                <div className="make-center">
                  <Button
                    className={clsx("mt-4")}
                    variant="contained"
                    type="submit"
                  >
                    Create
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};
