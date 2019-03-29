window.STI = {
    init : function (viewid, divid, account, password, channelKey, voipAccount, voipPassword, senderId, msisdn, extendId, postUrl) {
        $('#' + viewid).click(function () {
            $('#showOperationDailogIframe').remove();

            // 获取点击坐标位置并设置iframe的显示位置
            var top = $(this).offset().top;
            var left = $(this).offset().left;

            var width = $(this).width();

            // 动态添加iframe元素
            var iframeHtml = [];
            var iframeSrc = 'https://cs.kmindo.com:8443/web/iframe/channel/showOperatingDialog?account=' + account +'&password=' + password + '&channelKey=' + channelKey + '&voipAccount=' + voipAccount
                    + '&voipPassword=' + voipPassword +'&senderId=' + senderId + '&callee=' + msisdn
                    + '&extendId=' + extendId + '&postUrl=' + postUrl;

            iframeHtml.push("<iframe id='showOperationDailogIframe' allow='geolocation; microphone; camera; midi; encrypted-media;' frameborder='no' src='" + iframeSrc + "'></iframe>");

            $('#' + divid).append(iframeHtml.join(''));

            var showOperationDailogIframe = $('#showOperationDailogIframe');

            showOperationDailogIframe.css({
                'position' : 'absolute',
                'left'	   : parseInt(left + width + 30) + 'px',
                'top'	   : parseInt(top - 10) + 'px'
            });

            showOperationDailogIframe.on('load', function() {
                console.log('iframe load complete.');
            });

            // 注册消息事件监听，对来自 showOperationDailogIframe 框架的消息进行处理
            window.addEventListener('message', function(e) {
                // 关闭弹框
                if (e.data.act == 'closeOperationDialog') {
                    showOperationDailogIframe.remove();
                }
                // 调整可视区域大小
                else if (e.data.act == 'changeIframeSize') {
                    var width = e.data.msg.width;
                    var height = e.data.msg.height;

                    showOperationDailogIframe.css({
                        'width'     : width + 20,
                        'height'    : height
                    });
                }
                // 发送短信
                else if (e.data.act == 'sendSms') {
                    var code = e.data.msg.code;
                    var desc = e.data.msg.desc;

                    // alert('发送短信：' + code + ' ' + desc);
                }
            }, false);
        });
    },

    call : function (viewid, divid, account, password, channelKey, voipAccount, voipPassword, msisdn, extendId, postUrl) {
        $('#' + viewid).click(function () {
            $('#showCallDailogIframe').remove();

            // 获取点击坐标位置并设置iframe的显示位置
            var top = $('#' + viewid).offset().top;
            var left = $('#' + viewid).offset().left;

            var width = $('#' + viewid).width();

            // 动态添加iframe元素
            var iframeHtml = [];
            var iframeSrc = 'https://cs.kmindo.com:8443/web/iframe/channel/showCallDialog?account=' + account +'&password=' + password + '&channelKey=' + channelKey + '&voipAccount=' + voipAccount
                    + '&voipPassword=' + voipPassword + '&callee=' + msisdn + '&extendId=' + extendId + '&postUrl=' + postUrl;

            iframeHtml.push("<iframe id='showCallDailogIframe' allow='geolocation; microphone; camera; midi; encrypted-media;' frameborder='no' src='" + iframeSrc + "'></iframe>");

            $('#' + divid).append(iframeHtml.join(''));

            var showCallDailogIframe = $('#showCallDailogIframe');

            showCallDailogIframe.css({
                'position' : 'absolute',
                // 'left'	   : '-' + parseInt(left + width + 30) + 'px',
                // 'top'	   : parseInt(top - 10) + 'px'
                'top': '0px',
                'right': '5px'
            });

            showCallDailogIframe.on('load', function() {
                console.log('iframe load complete.');
            });

            // 注册消息事件监听，对来自 showCallDailogIframe 框架的消息进行处理
            window.addEventListener('message', function(e) {
                // 关闭弹框
                if (e.data.act == 'closeCallDialog') {
                    showCallDailogIframe.remove();
                }
                // 调整可视区域大小
                else if (e.data.act == 'changeIframeSize') {
                    var width = e.data.msg.width;
                    var height = e.data.msg.height;

                    showCallDailogIframe.css({
                        'width'     : width + 20,
                        'height'    : height
                    });
                }
            }, false);
        });
        $('#' + viewid).click()
    }

};