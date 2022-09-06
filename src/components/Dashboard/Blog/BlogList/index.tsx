import React from "react";
import "./style.css";
import Sidebar from "../../Sidebar";
import AddBlog from "../AddBlog";

type BlogListDataType = {
  title: string;
  description: string;
  blogImage: string;
  date: string;
};

const BlogList: React.FC = () => {
  const [blogItem, setBlogItem] = React.useState<BlogListDataType[]>([]);

  const handleOpenClick = () => {
    (document.getElementById("modal") as HTMLInputElement).style.display =
      "block";
  };
  const handleCloseClick = () => {
    (document.getElementById("modal") as HTMLInputElement).style.display =
      "none";
  };
  React.useEffect(() => {
    fetch("./blog.json")
      .then((res) => res.json())
      .then((data) => {
        setBlogItem(data);
      });
  }, []);

  return (
    <React.Fragment>
      <Sidebar />
      <section className="productlist">
        <div className="productlist__row">
          <h3 className="productlist__row__title">Blog list</h3>
          <div className="productlist__row__button">
            <button
              className="productlist__row__button__btn"
              onClick={handleOpenClick}
            >
              + add
            </button>

            <div id="modal" className="productlist__row__modal">
              <div className="productlist__row__modal__content">
                <span
                  className="productlist__row__modal__content__close"
                  onClick={handleCloseClick}
                >
                  &times;
                </span>
                {/* <p>Some text in the Modal..</p> */}
                <AddBlog />
              </div>
            </div>
          </div>
          <table className="productlist__row__table">
            <tr className="productlist__row__table__row">
              <th className="productlist__row__table__row__text">Title</th>
              <th className="productlist__row__table__row__text">
                Description
              </th>
              <th className="productlist__row__table__row__text">Date</th>
              <th className="productlist__row__table__row__text">Actions</th>
            </tr>

            {blogItem?.map((blog) => {
              return (
                <tr className="productlist__row__table__row">
                  <td className="productlist__row__table__row__text">
                    {blog.title}
                  </td>
                  <td className="productlist__row__table__row__text">
                    {blog.description.slice(0, 50)}
                  </td>
                  <td className="productlist__row__table__row__text">
                    {blog.date}
                  </td>
                  <td className="productlist__row__table__row__text">
                    <button className="productlist__row__table__row__button__edit">
                      edit
                    </button>
                    <button className="productlist__row__table__row__button__delete">
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </section>
    </React.Fragment>
  );
};

export default BlogList;
