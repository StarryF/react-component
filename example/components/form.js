var Example = React.createClass({
    submitHandler:function(data, form) {
        alert(JSON.stringify(data));
        return false;
    },
    render:function() {
        var selectData = [
            { key:'管理员', value:1 },
            { key:'编辑', value:2 },
            { key:'审查', value:3 }
        ];

        return <div className="example-form">
            <h2 className="title">表单<span>Form</span></h2>
            <h3 className="sub-title">演示</h3>
            <div className="example">
                <h4 className="final-title">基本使用</h4>
                <div>
                    <RUI.Form>
                        <RUI.Form.Control name="name" label="用户名" />
                        <RUI.Form.Control name="password" label="密码" type="password" />
                    </RUI.Form>
                </div>
                <h4 className="final-title">水平布局</h4>
                <div>
                    <RUI.Form className="horizonal">
                        <RUI.Form.Control name="name" label="用户名" />
                        <RUI.Form.Control name="password" label="密码" type="password" />
                        <RUI.Form.Control name="interest" label="兴趣" type="checkbox">
                            <RUI.Checkbox value="1">科技</RUI.Checkbox>
                            <RUI.Checkbox value="2">摄影</RUI.Checkbox>
                            <RUI.Checkbox value="3">旅游</RUI.Checkbox>
                            <RUI.Checkbox value="4">娱乐</RUI.Checkbox>
                        </RUI.Form.Control>
                    </RUI.Form>
                </div>
                <h4 className="final-title">提交与重置</h4>
                <div>
                    <RUI.Form className="horizonal" onSubmit={this.submitHandler}>
                        <RUI.Form.Control name="name" label="用户名" placeholder="请输入邮箱或者手机号" />
                        <RUI.Form.Control name="password" label="密码" type="password" placeholder="请输入密码" />
                        <RUI.Form.Control name="interest" label="兴趣" type="checkbox">
                            <RUI.Checkbox value="1">科技</RUI.Checkbox>
                            <RUI.Checkbox value="2">摄影</RUI.Checkbox>
                            <RUI.Checkbox value="3">旅游</RUI.Checkbox>
                            <RUI.Checkbox value="4">娱乐</RUI.Checkbox>
                        </RUI.Form.Control>
                        <RUI.Form.Control name="male" label="性别" type="radio">
                            <RUI.Radio value="1">男</RUI.Radio>
                            <RUI.Radio value="0">女</RUI.Radio>
                            </RUI.Form.Control>
                        <RUI.Form.Control name="role" label="角色" type="select" data={selectData} />
                        <RUI.Form.Control name="desc" label="描述" type="textarea" maxLength={100} />
                        <RUI.Form.Submit>保存</RUI.Form.Submit>
                    </RUI.Form>
                </div>
                <h4 className="final-title">验证</h4>
                <div>
                    <RUI.Form onSubmit={this.submitHandler}>
                        <div style={{backgroundColor:'#d90000'}}>
                            <RUI.Form.Control name="role" label="角色" type="select" data={selectData} />
                        </div>
                        <RUI.Form.Submit>保存</RUI.Form.Submit>
                    </RUI.Form>
                </div>
            </div>
            <h3 className="sub-title">源码</h3>
            <div className="source">
                <textarea defaultValue={require('raw!./form.js')} />
            </div>
        </div>;
    }
});

module.exports = Example;