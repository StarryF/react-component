/**
 * 按钮组件
 * @module controls/Button
 */

import className from '../util/className.jsx';
import ComponentBase from '../mixins/ComponentBase.jsx';
import Icon from './Icon.jsx';

import '../../css/upload.scss';

var UploadButton = React.createClass({
    getDefaultProps:function() {
        return {
            disable:false,
            multiple: false,
            name: 'image',
            action: '#',
            headers: {},
            onStart: null,
            onError: null,
            beforeUpload: null,
            file: null,
            showDelete: false,
            onDelete: null,
            actionData: null
        };
    },
    getInitialState:function() {
        return {
            progress:0
        };
    },
    getInputFile:function() {
        var props = {
            type:'file',
            name:this.props.name,
            className:'rui-upload-input',
            onChange:this.fileChangeHandler
        };
        if(this.props.disable) {
            props.disabled = true;
        }
        if(this.props.multiple) {
            // props.multiple = true;
        }
        return <form ref="form" id={this._reactInternalInstance._rootNodeID} encType="multipart/form-data" method="post">
            <input {...props} />
        </form>;
    },
    setValue:function(file) {
        this.props.onChange([file], this.props.index);
    },
    reset:function() {
        if(this.refs.form) {
            this.refs.form.reset();
        }
    },
    fileChangeHandler:function(e) {
        var files = e.target.files;
        if(files.length) {
            this.setState({
                progress: 0,
            }, ()=> {
                this.props.onChange(files, this.props.index);
            });
        }
    },
    //componentDidUpdate:function() {
    //    if(this.props.file && !this.props.file.data && this.props.autoUpload && this.state.progress == 0 && !this.state.isError) {
    //        this.applyUpload();
    //    }
    //},
    applyUpload:function() {
        var validUpload = this.props.beforeUpload ? this.props.beforeUpload(this.props.file, this) : true;

        if(validUpload !== false) {
            if(typeof validUpload != 'function' || typeof validUpload.then != 'function') {
                validUpload = new Promise(function(resolve, reject) {
                    var formData = new FormData(document.getElementById(this._reactInternalInstance._rootNodeID));
                    if(this.props.actionData) {
                        formData = this.props.actionData(this.props.file, formData);
                    }
                    $.ajax({
                        url:this.props.action,
                        type:'post',
                        data:formData,
                        cache: false,
                        success:function(response) {
                            resolve(response);
                        },
                        error:function(response) {
                            reject(response);
                        }
                    })
                }.bind(this));
            }

            validUpload.then(function(result) {
                var validResult = this.props.onUploadComplete ? this.props.onUploadComplete(result) : result;
                var file = this.props.file;
                file.data = validResult;
                this.props.onChange([file], this.props.index);

                this.completeProgress();
            }.bind(this)).catch(function(e) {
                this.completeProgress(true);
            }.bind(this));

            this.startProgress();
        }
    },
    startProgress:function() {
        if(this.props.autoUpload && this.props.file) {
            var speed = Math.round(this.props.file.size/200/1024);
            this._progressTimer = setInterval(function () {
                this.setState({
                    progress:Math.min(this.state.progress+speed, 90)
                });
            }.bind(this), 1000);
        }
    },
    completeProgress:function(isError) {
        clearInterval(this._progressTimer);
        this.setState({
            progress:isError ? 0 : 100
        }, ()=>{
            if(isError) {
                this.reset();
            }
        });
    },
    removeHandler:function(event) {
        event && event.stopPropagation();

        this.reset();

        this.props.onDelete && this.props.onDelete(null, this.props.index);
        this.props.onChange && this.props.onChange(null, this.props.index);
    },
    render:function() {
        return <div className="rui-upload-button">
            {this.props.multiple ? (
                <div className={"rui-upload-button-content" + (this.props.file ? " has-image" : "")}>
                    {this.props.file && <UploadImage file={this.props.file} />}
                    {(this.props.file && this.props.autoUpload && this.state.progress < 100) && <div className={"rui-upload-button-progress"}>
                        <div className="rui-upload-button-progress-line" style={{left:this.state.progress+'%', width:(100-this.state.progress)+'%'}}></div>
                        <div className="rui-upload-button-progress-text">{this.state.progress}%</div>
                    </div>}
                    {!this.props.disable && this.getInputFile()}
                </div>
            ) : (
                <RUI.Button onClick={this.clickHandler}>
                    <RUI.Icon name="upload" />
                    点击上传
                    {!this.props.disable && this.getInputFile()}
                </RUI.Button>
            )}
            {(this.props.multiple && this.props.file && this.props.showDelete) && (
                <RUI.Icon className="rui-upload-button-remove" name="error" onClick={this.removeHandler} />
            )}
        </div>;
    }
});

var UploadImage = React.createClass({
    getDefaultProps:function() {
        return {
            file:null
        };
    },
    getInitialState:function() {
        return {
            imageData:null,
            file:this.props.file
        };
    },
    componentDidMount:function() {
        var _this = this;
        this.preview();
    },
    componentWillReceiveProps:function(nextProps) {
        if(nextProps.file !== this.props.file) {
            this.setState({
                file:nextProps.file
            }, function() {
                this.preview();
            }.bind(this));
        }
    },
    preview:function() {
        var _this = this;
        if(this.state.file && this.state.file.name) {
            var reader = new FileReader();
            reader.onload = function() {
                _this.setState({
                    imageData:this.result
                });
            };
            reader.readAsDataURL(this.state.file);
        }
        else if(this.state.file && typeof this.state.file == 'string') {
            this.setState({
                imageData:this.state.file
            });
        }
    },
    imageLoadComplete:function() {
        var img = ReactDOM.findDOMNode(this.refs.image);
        var imageSize = {
            width:img.width,
            height:img.height
        };
        var parentSize = {
            width:img.parentNode.clientWidth,
            height:img.parentNode.clientHeight
        };

        //img.style.top = Math.max(0, )
        if((imageSize.width / imageSize.height) > (parentSize.width / parentSize.height)) {
            img.style.height = '100%';
            img.style.width = 'auto';
            img.style.top = 0;
            img.style.left = ((parentSize.width - imageSize.width / (imageSize.height / parentSize.height)) / 2) + 'px';
        }else {
            img.style.height = 'auto';
            img.style.width = '100%';
            img.style.left = 0;
            img.style.top = ((parentSize.height - imageSize.height / (imageSize.width / parentSize.width)) / 2) + 'px';
        }
    },
    render:function() {
        return <div style={{width:'100%',height:'100%', background:'#fff'}}>
            <img ref="image" className="upload-preview" onLoad={this.imageLoadComplete} src={this.state.imageData}/>
            <p className="upload-replace">
                替换
            </p>
        </div>;
    }
});

module.exports = React.createClass({
    /**
     * 基础方法
     * @see {@link module:mixins/ComponentBase}
     */
    mixins: [ComponentBase],
    getDefaultProps: function () {
        return {
            /**
             * @instance
             * @default button
             * @type string
             * @desc 组件名称
             */
            cname: 'upload',
            /**
             * @instance
             * @default false
             * @type boolean
             * @desc 设置按钮是否禁用
             */
            disable: false,
            useDragDrop: true,
            showProgress: true,
            showDelete: false,
            multiple: false,
            name: 'image',
            action: '#',
            headers: {},
            onStart: null,
            onError: null,
            onDelete: null,
            onProgress: null,
            beforeUpload: null,
            autoUpload:false,
            editable:null,
            max:-1,
            list:null
        };
    },
    getInitialState:function() {
        return {
            list:this.props.list || [],
            imageEditorConfig:{}
        };
    },
    componentWillReceiveProps:function(nextProps) {
        if(typeof nextProps.list != 'undefined' && nextProps.list != this.state.list) {
            this.setState({
                list:nextProps.list
            });
        }
    },
    fileChangeHandler:function(files, index) {
        if(this.props.multiple) {
            var list = this.state.list;
            files = Array.apply(null, files);
            if(files.length) {
                list.splice.apply(list, Array.prototype.concat.apply([index, files.length], files));
            }else {
                list.splice(index, 1);
            }
            this.setState({
                list:list
            }, ()=>{
                this.edit(index);
            });
        }else {
            this.setState({
                list:files
            }, ()=>{
                this.edit(index);
            });
        }
    },
    edit:function(index) {
        if(this.props.editable) {
            var _this = this;
            var config = Object.assign({
                viewMode:1
            }, this.props.editable);
            config.crop = function(event) {
                _this.__editorCropper = {
                    index:index,
                    detail:event.detail
                };
            };
            config.data = this.state.list[index];
            if(config.data) {
                this.setState({
                    imageEditorConfig: config
                }, ()=> {
                    this.refs.editorDialog.show();
                });
            }else {
                if(this.refs['button' + index]) {
                    this.refs['button' + index].reset();
                }
            }
        }
    },
    editorSubmit:function() {
        if(this.props.editable) {
            var cropper = this.refs.editor.getCropper();
            try {
                var imageType = "image/jpeg";
                if(this.state.imageEditorConfig.data) {
                    if(this.state.imageEditorConfig.data.type) {
                        imageType = this.state.imageEditorConfig.data.type;
                    }
                }
                this.__editorCropper.base64 = cropper.getCroppedCanvas().toDataURL('image/png');
            }catch(e) {
                this.__editorCropper.base64 = null;
            }

            if(this.__editorCropper.base64) {
                var list = this.state.list;
                list[this.__editorCropper.index] = this.__editorCropper.base64;

                this.setState({
                    list:list
                }, ()=>{
                    if(this.props.autoUpload) {
                        this.refs['button' + this.__editorCropper.index].applyUpload(this.__editorCropper);
                    }
                });
            }
            if(this.props.editable && this.props.editable.crop) {
                this.props.editable.crop.call(this.refs.editor, this.__editorCropper);
            }
        }
    },
    editorCancel:function() {
        if(this.__editorCropper) {
            this.fileChangeHandler(null, this.__editorCropper.index);

            this.__editorCropper = null;
        }
    },
    clearList:function(e) {
        if(this.props.multiple) {

        }else {
            this.setState({
                list:[]
            });
        }
    },
    getValue:function() {
        return this.state.list;
    },
    render: function () {
        var classes = className(this.props.className, this.getPropClass());
        var props = require('../util/omit.jsx')(this.props, 'onClick');
        return <div {...props} className={classes + " clearfix"}>
            {this.props.multiple ?
                <div className="rui-upload-list">
                    {this.state.list.concat(null).map(function(file, index) {
                        if(index < this.props.max || this.props.max < 0) {
                            return <UploadButton {...props} onChange={this.fileChangeHandler} file={file} key={index} index={index} ref={"button" + index}/>;
                        }
                        return null;
                    }.bind(this))}
                </div> :
                <div>
                    <UploadButton {...props} onChange={this.fileChangeHandler}/>
                    {!!this.state.list.length &&
                        <div className="rui-upload-info">
                            <RUI.Icon name="attach" style={{marginLeft:'10px'}} />
                            <div style={{width:'152px',float:'left'}}>
                                <RUI.Link style={{width:'142px'}}>
                                    {this.state.list[0].name}
                                </RUI.Link>
                                <RUI.Tooltip align="top-center">{this.state.list[0].name}</RUI.Tooltip>
                            </div>
                            <RUI.Link className="rui-upload-info-clear" onClick={this.clearList} style={{margin:'0 10px'}}><RUI.Icon name="close" /></RUI.Link>
                        </div>
                    }
                </div>
            }
            <RUI.Dialog ref="editorDialog" buttons="cancel,submit" title="编辑图片" onSubmit={this.editorSubmit} onCancel={this.editorCancel}>
                <RUI.ImageEditor ref="editor" {...this.state.imageEditorConfig} />
            </RUI.Dialog>
            {this.props.children}
        </div>;
    }
});