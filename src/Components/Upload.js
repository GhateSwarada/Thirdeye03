import React, { useCallback, useEffect, useState } from 'react';
import design from '../CSS/Upload.module.css';
import { useDropzone } from 'react-dropzone';
import Navbar from '../Components/Navbar';
import Compressor from 'compressorjs';
import axios from 'axios';
import Loader from '../Components/Loader';

function Upload() {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageForm, setImageForm] = useState({
    hashtag: '',
    layout: '',
    type: '',
    name: '',
    des: '',
    url_path: '',
    user_id: '',
  });
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    getUserId();
  }, []);

  const getUserId = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token.trim() === "") {
      console.error("No valid token found!");
      window.location.href = "/login";
      return;
    }

    try {
      const result = await fetch("http://localhost:8080/api/user/getUserId", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!result.ok) {
        throw new Error(`Failed to fetch user ID: ${result.status} ${result.statusText}`);
      }

      const id = await result.text();
      setUserId(id);
      setImageForm((prev) => ({ ...prev, user_id: id }));
    } catch (error) {
      console.error(error.message);
      setUploadError("Failed to fetch user ID. Please try again later.");
    }
  };

  const handleChange = (e) => {
    setImageForm({ ...imageForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);
    setIsLoading(true);

    if (!selectedImage) {
      setUploadError('Please select an image first.');
      setIsLoading(false);
      return;
    }

    new Compressor(selectedImage, {
      quality: 0.6,
      success(result) {
        uploadCompressedImage(result);
      },
      error(err) {
        console.error('Error compressing image:', err);
        setUploadError('Error compressing image. Please try again.');
        setIsLoading(false);
      }
    });
  };

  const uploadCompressedImage = async (file) => {
    const timestamp = Date.now();
    const originalExtension = selectedImage.name.split('.').pop();
    const newFileName = `${selectedImage.name.replace(/\.[^/.]+$/, "")}_${timestamp}.${originalExtension}`;
    const compressedFileName = `compressed_${newFileName}`;

    const compressedFile = new File([file], compressedFileName, { type: file.type });

    const CloudinaryFormData = new FormData();
    CloudinaryFormData.append("file", compressedFile);
    CloudinaryFormData.append("fileName", newFileName);
    CloudinaryFormData.append("folder", `uploads/${userId}`);
    CloudinaryFormData.append("upload_preset", "thirdeye_vinit_mhatre");
    CloudinaryFormData.append("public_id", `public_${newFileName}`);

    try {
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dg6qi1yxm/image/upload`,
        CloudinaryFormData
      );

      const imageUrl = cloudinaryResponse.data.secure_url;
      setImageForm((prev) => ({ ...prev, url_path: imageUrl, name: selectedImage.name }));

      const formData = { ...imageForm, url_path: imageUrl, name: selectedImage.name };

      const response = await fetch("http://localhost:8080/api/images/uploadImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSelectedImage(null);
        window.location.href = "/profile";
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Image upload to server unsuccessful";
        setUploadError(errorMessage);
        console.error("Image upload to server unsuccessful:", errorData);
      }

    } catch (error) {
      console.error("Error uploading image to Cloudinary or server:", error);
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    if (file) {
      setSelectedImage(file);

      const extension = file.name.split('.').pop().toLowerCase();
      const imageTypes = ['png', 'jpeg', 'jpg'];
      const illustrationTypes = ['svg', 'gif'];
      const type = imageTypes.includes(extension) ? 'Photographs' : illustrationTypes.includes(extension) ? 'Illustrations' : 'unknown';

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let layout = 'square';
        if (img.width > img.height) {
          layout = 'horizontal';
        } else if (img.height > img.width) {
          layout = 'vertical';
        }
        setImageForm((prev) => ({ ...prev, layout, type, name: file.name }));
      };
    }
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImage]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/gif': ['.gif'], 'image/svg+xml': ['.svg'] },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={design.container}>
      <div className={design.nav}>
        <Navbar />
      </div>
      <div className={design.circle}></div>
      <div className={design.bottom_circle}></div>
      <p className={design.title}>Upload your work here</p>
      <div className={design.flexContaint}>
        <div className={design.right_side}>
          <div {...getRootProps()} className={design.input_box}>
            <input {...getInputProps()} />
            <p className={design.txt}>Drag and Drop, or click to select image files</p>
          </div>
        </div>
        <div className={design.imgForm}>
          {selectedImage != null && (
            <div className={design.preview}>
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className={design.form}>
            <input type='text' className={design.input} value={imageForm.hashtag} onChange={handleChange} placeholder='Enter image related hashtags' name='hashtag' required />
            <br />
            <input type='text' className={design.input} value={imageForm.des} placeholder='Enter description' name='des' onChange={handleChange} required />
            <br />
            {uploadError && <p className={design.err}>{uploadError}</p>}
            <br />
            <input type='submit' value='Upload' className={design.btn} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;