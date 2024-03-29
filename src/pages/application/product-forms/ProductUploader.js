import axiosInstance from "config/axios";
import "./css/ProductUploader.css";
import { IconButton } from "@mui/material";
import { PictureOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons"
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { checkImageURL } from "utils/text";

const ProductUploader = ({ productID }) => {
    const [images, setImages] = useState([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const sliderRef = useRef(null);

    const getImages = async () => {
        await axiosInstance.get(`ProductImage/images/${productID}`).then((response) => {
            const result = response.data;
            if (result && result.success) {
                setImages(result.data);
            }
            else console.log(result.message);
        }).catch((error) => console.log(error));
    }

    useEffect(() => {
        const container = sliderRef.current.parentElement;
        const width = container.offsetWidth;
        setContainerWidth(width);
        getImages();
    }, []);

    const slideLeft = () => {
        sliderRef.current.scrollLeft -= containerWidth;
    };

    const slideRight = () => {
        sliderRef.current.scrollLeft += containerWidth;
    };

    const onDeleteImage = async (imageID) => {
        await axiosInstance.delete(`ProductImage/image/${imageID}`).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success) {
                toast.success(result.message);
                getImages();
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error));
    }

    const onUploadImage = async (event) => {
        const id = toast.loading("Vui lòng chờ...")
        const body = {
            imageName: event.target.files[0].name.split('.').shift(),
            productID: productID,
        };

        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        await axiosInstance
            .post('ProductImage/upload-image', formData, { params: body, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                const result = response.data;
                if (!result) return;
                else if (result.success) {
                    toast.update(id, { render: result.message, type: "success", isLoading: false, autoClose: 2000 });
                    getImages();
                }
                else toast.update(id, { render: result.message, type: "error", isLoading: false, autoClose: 2000 });
            })
            .catch((error) => {
                toast.update(id, { render: result.message, type: "error", isLoading: false, autoClose: 2000 });
                console.log(error)
            });
    };

    return (
        <>
            <div className="uploader-container">
                <IconButton area-label="arrow-left" size="large" className="btn-scroll left" onClick={slideLeft}>
                    <LeftOutlined />
                </IconButton>
                <div className="image-list" ref={sliderRef}>
                    <div className="uploader">
                        <input id="file-upload" type="file" name="fileUpload" accept="image/*" onChange={onUploadImage} />

                        <label htmlFor="file-upload" id="file-drag">
                            <img id="file-image" src="#" alt="Preview" className="hidden" />
                            <div id="start">
                                <PictureOutlined style={{ fontSize: "300%" }} />
                            </div>
                            <div id="response" className="hidden">
                                <div id="messages"></div>
                                <progress className="progress" id="file-progress" value="0">
                                    <span>0</span>%
                                </progress>
                            </div>
                        </label>
                    </div>
                    {
                        images && images.length > 0 ?
                            images.map((item, index) => {
                                return (
                                    <div className="uploader" key={index}>
                                        <IconButton
                                            className="action-container"
                                            onClick={() => onDeleteImage(item.imageID)}
                                        >
                                            <DeleteOutlined />
                                        </IconButton>
                                        <div className="image-container">
                                            <img src={checkImageURL(item.imageURL)} alt="Preview" />
                                        </div>
                                    </div>
                                )
                            })
                            :
                            null
                    }
                </div>
                <IconButton area-label="arrow-right" size="large" className="btn-scroll right" onClick={slideRight}>
                    <RightOutlined />
                </IconButton>
            </div>
        </>
    )
}

export default ProductUploader;