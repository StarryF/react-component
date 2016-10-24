/**
 * 表单行组件
 * @module containers/form/Control
 */

import ComponentBase from '../../mixins/ComponentBase.jsx';

import omit from '../../util/omit.jsx';
import className from '../../util/className.jsx';

var Label = React.createClass({
    render:function() {
        return <label className={"rui-form-label"}>{this.props.children}</label>;
    }
});

var Content = React.createClass({
    render:function() {
        return <div className={"rui-form-content is-validating has-feedback"}>{this.props.children}</div>
    }
});

var Control = React.createClass({
    /**
     * 基础方法
     * @see {@link module:mixins/ComponentBase}
     */
    mixins:[ComponentBase],
    getDefaultProps:function() {
        return {
            /**
             * @instance
             * @default control
             * @type string
             * @desc 组件名称
             */
            cname:'control',
            /**
             * @instance
             * @default input
             * @type string
             * @desc 表单行内的表单输入类型，可选值有 input, password, checkbox, radio 等
             */
            type: 'input',
            /**
             * @instance
             * @type string
             * @desc 表单行组件显示的文本内容
             */
            label: null,
        };
    },
    /**
     * 获取当前表单行的值
     * @instance
     * @returns {*|null}
     */
    getValue:function() {
        return this.refs.content.getValue && (this.refs.content.getValue() || null);
    },
    render:function() {
        var ControlMap = Control.findControlMap(this.props.type);

        //is-success, is-error, is-warn, is-validating
        var props = omit(this.props, 'cname');

        return <div {...this.props} className={className(this.props.className, this.getPropClass())}>
            <Label>{this.props.label}</Label>
            <Content>
                <span className="input-wrapper">
                    <ControlMap.tag {...props} {...ControlMap.props} ref="content">
                        {this.props.children}
                    </ControlMap.tag>
                </span>
                <div className="form-explain">错误信息</div>
            </Content>
        </div>;
    }
});

Control.findControlMap = function(type) {
    var result = null;

    type = type || 'input';
    
    if(type == 'password') {
        result = {
            tag:'Input',
            props:{
                type:'password'
            }
        };
    }
    if(type == 'checkbox') {
        result = {
            tag:'CheckboxGroup'
        };
    }
    if(type == 'radio') {
        result = {
            tag:'RadioGroup'
        };
    }

    if(!result) {
        result = {
            tag:type.substring(0, 1).toUpperCase() + type.substring(1)
        };
    }

    result.tag = RUI[result.tag];
    result.props = result.props || {};

    return result;
};

module.exports = Control;