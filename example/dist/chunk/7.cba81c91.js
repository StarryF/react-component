webpackJsonp([7],{47:function(e,t,a){var n=React.createClass({displayName:"Example",getInitialState:function(){return{data:[{text:"滚动容器滚动容器滚动容器滚动容器滚动容器滚动容器"}]}},addDom:function(){var e=this.state.data;e.push({text:(new Date).getTime()}),this.setState({data:e})},render:function(){return React.createElement("div",{className:"example-scrollview"},React.createElement("h2",{className:"title"},"滚动容器",React.createElement("span",null,"ScrollView")),React.createElement("a",{href:"javascript:;",onClick:this.addDom},"测试"),React.createElement("h3",{className:"sub-title"},"演示"),React.createElement("div",{className:"example"},React.createElement("h4",{className:"final-title"},"默认"),React.createElement("div",null,React.createElement(RUI.ScrollView,null,this.state.data.map(function(e,t){return React.createElement("h1",{key:t},e.text)})))),React.createElement("h3",{className:"sub-title"},"源码"),React.createElement("div",{className:"source"},React.createElement("textarea",{defaultValue:a(97)})))}});e.exports=n},97:function(e,t){e.exports='var Example = React.createClass({\r\n    getInitialState: function () {\r\n        return {\r\n            data: [{\r\n                text : \'滚动容器滚动容器滚动容器滚动容器滚动容器滚动容器\'\r\n            }]\r\n        };\r\n    },\r\n    addDom : function() {\r\n        var data = this.state.data;\r\n        data.push({\r\n            text : new Date().getTime()\r\n        });\r\n        this.setState({\r\n            data : data\r\n        });\r\n    },\r\n    render:function() {\r\n        return <div className="example-scrollview">\r\n            <h2 className="title">滚动容器<span>ScrollView</span></h2>\r\n            <a href="javascript:;" onClick={this.addDom}>测试</a>\r\n            <h3 className="sub-title">演示</h3>\r\n            <div className="example">\r\n                <h4 className="final-title">默认</h4>\r\n                <div>\r\n                    <RUI.ScrollView>\r\n                        {\r\n                            this.state.data.map(function(item, index) {\r\n                                return <h1 key={index}>{item.text}</h1>\r\n                            })\r\n                        }\r\n                    </RUI.ScrollView>\r\n                </div>\r\n            </div>\r\n            <h3 className="sub-title">源码</h3>\r\n            <div className="source">\r\n                <textarea defaultValue={require(\'raw!./scrollview.js\')} />\r\n            </div>\r\n        </div>;\r\n    }\r\n});\r\n\r\nmodule.exports = Example;'}});