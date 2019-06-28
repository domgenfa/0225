import React, { Component } from 'react';

import { Upload, Icon, Modal ,message} from 'antd';
import { reqDeleteProductImg}from '../../../api';
// function getBase64(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = error => reject(error);
//     });
// }

export default class  PicturesWall extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList:this.props.imgs.map((img,index)=>{
            return {
                uid:-index,
                name:img,
                status:'done',
                url:`http://localhost:5000/upload/${img}`
            }
        })

    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {


        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange =async ({file,fileList})=>{
        if(file.status==='uploading'){
        //    上传中

        }else if(file.status ==='done'){
            message.success('上传图片成功',2)
        }else if (file.status === 'error'){
            message.error('上传图片失败！', 2);
        }else{
            const id = this.props.id;
            const name = file.name;
            const result = await reqDeleteProductImg(name,id)
            if(result){
                message.success('删除图片成功~', 2)
            }
        }
        this.setState({ fileList });
    }


    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    data={{
                        id:this.props.id
                    }}
                    name='image'
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}