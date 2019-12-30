//選擇DOM
var dist = document.getElementById('dist');
var content = document.querySelector('.content');
var conbody = document.querySelector('.content-body');
var hot = document.querySelector('.hot');
var title = document.querySelector('.content-title');
var pagination = document.getElementById('pagination');

//綁監聽事件
dist.addEventListener('change', showlist, false);
hot.addEventListener('click', showlist, false);

//用ajax撈取遠端資料，用get
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send();//讀取資料

xhr.onload = addlist; //資料回傳後就執行function

//將行政區的區域載入到select
function addlist(e) {
    var zone = []

    if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);//將得到的資料字串轉為陣列
        var dataArr = data.result.records;//這個是我要找的資料
        var dataArrLen = data.result.records.length;
        var op = '';
        for (var i = 0; i < dataArrLen; i++) {
            // console.log(dataArr[i].Zone);
            zone.push(dataArr[i].Zone);//把data裡的行政區域撈出來塞進zone陣列
        }
        console.log(zone);
        //計算各行政區遇有幾筆資料
        var counts = {}// 宣告一空物件用來儲存結果資料
        for (var j = 0; j < zone.length; j++) {
            // 將zone[i]值存於num中
            var num = zone[j];
            // 比較counts物件，如相同則該物件存值+1，如不同則存值設為1
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        // 印出物件
        console.log(counts);
        // 印出成員
        console.log(Object.keys(counts));
        // 印出各成員數項
        console.log(counts["三民區"], counts["內門區"], counts["美濃區"]);


        //用indexOf()和filter()取出不重複和重複的行政區域
        var newzone = zone.filter(function (element, index, arr) {
            return arr.indexOf(element) === index;
        });
        var rezone = zone.filter(function (element, index, arr) {
            return arr.indexOf(element) !== index;
        });
        console.log(newzone); // 不重複的陣列，得出有27個行政區域
        console.log(rezone); // 重複的有哪些

        var newzoneLen = newzone.length;
        console.log(newzoneLen);

          
        for (var i = 0; i < newzoneLen; i++) {

            var opt = document.createElement('option');
            opt.setAttribute('value', newzone[i]);
            opt.textContent = newzone[i];
            dist.appendChild(opt);

        }


    }

}

//行政區的旅遊資訊呈現
function showlist(e) {

    var point = e.target.value;//選取select的值或是點擊所取得的值
    if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);//將得到的資料字串轉為陣列
        // console.log(data.result.records);
        var dataArr = data.result.records;//這個是我要找的資料
        // console.log(data.result.records.length);
        var dataArrLen = data.result.records.length;
        var str = '';


        for (var i = 0; i < dataArrLen; i++) {

            if (point == dataArr[i].Zone) {
                title.textContent = point;
                console.log(dataArr[i].Name);

                str += '<div class=' + '"col-md-6 bg-cover">'
                    + '<div class=' + '"card mb-4">'
                    + '<div class=' + '"card-img bg-cover  d-flex justify-content-between align-items-end"' + 'style=' + '"background-image: url(' + dataArr[i].Picture1 + '); height:180px;">'
                    + '<div class=' + '"card-title    text-white font-weight-bold mb-3 ml-4 h3 ">' + dataArr[i].Name + '</div>'
                    + '<div class=' + '"card-loca    text-white font-weight-bold mb-2 mr-3 h5 ">' + dataArr[i].Zone + '</div>'
                    + '</div>'
                    + '<div class=' + '"card-body">'
                    + '<ul class="card-list">'
                    + '<li>' + ' <img src="images/icons_clock.png" alt="">' + dataArr[i].Opentime + '</li>'
                    + '<li>' + '<img src="images/icons_pin.png" alt="">' + dataArr[i].Add + '</li>'
                    + '<li>' + '<img src="images/icons_phone.png" alt="">' + dataArr[i].Tel + '</li>'
                    + '</ul>'
                    + '<span class=' + '"card-tag">' + '<img src=' + '"images/icons_tag.png"' + 'alt="' + '">' + dataArr[i].Ticketinfo + '</span>'

                    + '</div>'
                    + '</div>'
                    + '</div>'
            }
        }
        conbody.innerHTML = str;

        if (str == '') {
            title.innerHTML = '<h3 class="' + 'text-center"' + '>沒有' + point + '資料</h3>';

        }

    }
}

//分頁設定


// 當前頁
var pageNum = 1;
// 每一個分頁顯示的數量 -> 4 筆
var contentNum = 4;
// 頁碼數量
let pageLeng = 0;

var selectData = [];
var optionStr = '';
var county = [];
var displayData = [];
for (var i = 0; i < standData.length; i++) {
    county.push(standData[i]['區域']);
}
var select = county.filter(function (element, index, arr) {
    return arr.indexOf(element) === index;
})
var countyStr = '';
var firstSelected = `<option disabled selected>- - 請選擇行政區- -</option>`;
for (var i = 0; i < select.length; i++) {
    countyStr += `<option value="${select[i]}">${select[i]}</option>`
}
area.innerHTML = firstSelected + countyStr;


//監聽
area.addEventListener('change', function (e) {
    displayData = []; // 清空上一筆資料
    selectData = []; // 清空上一筆資料
    pageNum = 1; // 回到第一頁
    for (var i = 0; i < standData.length; i++) {
        if (e.target.value == standData[i]['區域']) {
            selectData.push(standData[i]);
        }
    }
    displayData = selectData;
    displayDistrict();
});

function displayDistrict() {
    var str = '';
    // 選取開始的陣列位置 -> 頁碼乘以每頁顯示數量

    var start = pageNum * contentNum;
    var dataLen = displayData.length;
    // 頁數
    countPageNum(dataLen);
    // 如果長度大於 start，以 start 作為迴圈停止條件
    if (dataLen > start) {
        dataLen = start;
    } else {
        dataLen = displayData.length;
    }
    // 以 start - 每頁顯示數量座位開始條件
    for (var i = start - contentNum; i < dataLen; i++) {
        // 顯示筆數
        str += `<li class="standInfo"><p>區域：${displayData[i]['區域']}</p><p>攤名：${displayData[i]['攤名']}</p><p>電話：${displayData[i]['電話']}</p><p>地址：${displayData[i]['地址']}</p></li>`
    }
    list.innerHTML = str;
}

function countPageNum(num) {
    if (num > contentNum) {
        pageLeng = Math.ceil(num / contentNum);
        var prevPage = `<li class="page-item" ><a class="page-link" href="#">Previous</a></li>`;
        var nextPage = `<li class="page-item"><a class="page-link" href="#">Next</a></li>`;
        var str = '';
        for (var i = 1; i <= pageLeng; i++) {
            if (i == pageNum) {
                str += `<li class="page-item active"><a class="page-link" href="#">${i}</a>`;
            } else {
                str += `<li class="page-item "><a class="page-link" href="#">${i}</a>`;
            }
        }
        pagination.innerHTML = prevPage + str + nextPage;

    } else {
        str = `<li class="page-item active" data-page="0"><a class="page-link" href="#" data-page="0">1</a>`;
        pagination.innerHTML = str2;
    }

}



pagination.addEventListener('click', function (e) {
    e.preventDefault();
    var currentPage = e.target.textContent;

    if (e.target.textContent == 'Next') {
        console.log(pageNum, pageLeng)
        if (pageNum == pageLeng) {
            pageNum = pageLeng // 頁面到最後一頁時候 pageNum = pageLeng
        } else {
            pageNum++; // 尚未到最後頁面則按下 NEXT 進到下一頁
        }
    } else if (e.target.textContent == 'Previous') {
        if (pageNum == 1) {
            pageNum = 1;
        } else {
            pageNum--;
        }
    } else {
        pageNum = parseInt(e.target.textContent);
    }
    displayDistrict()
})