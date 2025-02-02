import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Suits");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, Setsizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error("❌ No token provided. User might not be logged in.");
      return;
    }

    console.log("🟢 Token being sent:", token);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Ensure "Bearer " prefix is used
          },
        }
      );

      console.log("✅ Response:", response.data);
    } catch (error) {
      console.error("❌ Axios Error:", error.response?.data || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((image, index) => {
            const setImageFunctions = [
              setImage1,
              setImage2,
              setImage3,
              setImage4,
            ];

            return (
              <label key={index} htmlFor={`image${index + 1}`}>
                <img
                  className="w-20"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="upload_area"
                />
                <input
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setImageFunctions[index](e.target.files[0]);
                    }
                  }}
                />
              </label>
            );
          })}
        </div>
      </div>

      <div className="w-full mt-2">
        <p className="mb-2">Product Name</p>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Type here"
          className="w-full max-w-[500px] px-3 py-2 mb-2"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
          placeholder="Write content here"
          className="w-full max-w-[500px] px-3 py-2"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
            required
          >
            <option value="Saree">Saree</option>
            <option value="Lehnga">Lehnga</option>
            <option value="Suits">Suits</option>
            <option value="Cape">Cape</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "CUSTOM"].map((size) => (
            <div
              key={size}
              onClick={() =>
                Setsizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`mb-2 px-3 py-1 cursor-pointer ${
                  sizes.includes(size)
                    ? "bg-gray-500 text-white"
                    : "bg-slate-200"
                }`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to Bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
