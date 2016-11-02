//基础工具
class UtilBase {
    static isApp(appName) {
        let appList = {
            tt: /tt4android|tt4ios/
        }
        if (appName && appList[appName]) {
            return UtilBase.inUserAgent(appList[appName]);
        } else {
            if (!appName) {
                for (let i in appList) {
                    if (UtilBase.inUserAgent(appName)) {
                        return true;
                    }
                }
                return false;
            } else {
                return UtilBase.inUserAgent(appName);
            }
        }
    }

    promiseProgress(promise) {
        this.showProgress();
        promise.then(()=> {
            this.hideProgress();
        })
        return promise;
    }

    pushWindow(url) {
        this.pushWindow(url)
    }

    popWindow(url) {
        this.popWindow(url)
    }

    redirectURL(url) {
        this.redirect(url)
    }

    formatData(date, format = 'YYYYMMDD') {
        return moment(date).format(format);
    }

    static inUserAgent(val) {
        return val.test(navigator.userAgent.toLowerCase());
    }

    exChange2Https(url) {
        return url.replace(/(http|https):\/\/(s\d+\.(mogujie|mogucdn))/, "https://s10.mogucdn");
    }
}

//h5 容器封装
class Hybrid extends UtilBase {
    ajax(options) {
        return $.ajax(options).then((res) => {
            if (res.code === '302') {
                location.href = res.data.redirect + '?redirect=' + location.href;
            }
            return res;
        }).fail((err) => {
            this.tips('请求失败');
            this.hideProgress();
        })
    }

    tips(msg) {
        return hdp.do('navigator.notification.tips', msg);
    }

    setTitle(title, color) {
        return hdp.do('tt.navigation.setTitle', title, color)
    }

    setRightItemTitle(title, color) {
        return hdp.do('tt.navigation.rightitem.setTitle', title, color)
    }

    setDropMenu(data) {
        return hdp.do('tt.navigation.setDropMenu', data)
    }

    showDropMenu(data) {
        return hdp.do('tt.navigation.showDropMenu')
    }

    alert(msg, title, buttonLabel) {
        hdp.do('navigator.notification.alert', msg, title, buttonLabel)
            .catch(function (msg) {
            });
    }

    selectDate() {
        return hdp.do('tt.ttcalendar.selectDate')
    }

    selectTime() {
        return hdp.do('tt.ttcalendar.selectTime')
    }

    selectCustomTime(data) {
        return hdp.do('tt.ttcalendar.selectCustomTime', data)
    }

    selectBetweenDateTime() {
        return hdp.do('tt.ttcalendar.selectBetweenDateTime')
    }

    selectDateTime() {
        return hdp.do('tt.ttcalendar.selectDateTime')
    }

    confirm(msg, title, buttonLabel) {
        return hdp.do('navigator.notification.confirm', msg, title, buttonLabel)
    }

    showProgress() {
        return hdp.do('tt.progress.show').catch(function (msg) {
        });
    }

    hideProgress() {
        return hdp.do('tt.progress.hide')
    }

    getUserInfo() {
        return hdp.do('tt.user.getUserInfo')
    }

    imageUpdate() {
        return hdp.do('tt.ttimage.imageUpdate')
    }

    selectSingleDepartment() {
        return hdp.do('tt.ttcontact.selectSingleDepartment')
    }

    selectSingleContact() {
        return hdp.do('tt.ttcontact.selectSingleContact')
    }

    getContactById(id) {
        return hdp.do('tt.ttcontact.getContactById', id)
    }

    openWindow(url) {
        return hdp.do('tt.navigation.pushWindow', url)
    }

    // android 显示问题
    popWindow(url) {
        location.href = url;
    }

    redirect(url) {
        location.href = url;
    }

    removeNotification(name) {
        return hdp.do('tt.notification.removeNotification', name)
    }

    sendNotification(name, data) {
        return hdp.do('tt.notification.sendNotification', name, data)
    }

    registerNotification(name) {
        return hdp.do('tt.notification.registerNotification', name)
    }
}

//非h5容器封装
class NormalUtil extends UtilBase {
    // 未用
    ajax(options) {
        return $.ajax(options).then((res) => {
            if (res.code === '302'
            ) {
                location.href = res.data.redirect + '?redirect=' + location.href;
            }
            return res;
        }).fail((err) => {
            this.tips('请求失败');
            this.hideProgress();
        })
    }

    tips(msg) {
        //return $.when({})
    }

    setTitle(title, color) {
        //return $.when({})
    }

    setRightItemTitle(title, color) {
        //return $.when({})
    }

    setRightItemTitle(title, color) {
        //return $.when({})
    }

    alert(msg, title, buttonLabel) {
        //return $.when({})
    }

    selectDate() {
        //return $.when({})
    }

    selectTime() {
        //return $.when({})
    }

    selectCustomTime(data) {
        //return $.when({})
    }

    selectBetweenDateTime() {
        //return $.when({})
    }

    selectDateTime() {
        //return $.when({})
    }

    confirm(msg, title, buttonLabel) {
        //return $.when({})
    }

    showProgress() {
        //return $.when({})
    }

    getContactById(id) {
        //return $.when({})
    }

    hideProgress() {
        //return $.when({})
    }

    getUserInfo() {
        //return $.when({})
    }

    removeNotification(name) {
        //return $.when({})
    }

    sendNotification(name, data) {
        //return $.when({})
    }

    registerNotification(name) {
        //return $.when({})
    }

    pushWindow(url) {
        location.href = url;
    }

    popWindow(url) {
        location.href = url;
    }
}
let isInApp = window.hasOwnProperty("hdp") && UtilBase.isApp('tt');
let util = isInApp ? (new Hybrid) : (new NormalUtil);
util.isInApp = isInApp;

export default util;
