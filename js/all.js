//選擇DOM
var dist = document.getElementById('dist');
var content = document.querySelector('.content');
var conbody = document.querySelector('.content-body');
var hot = document.querySelector('.hot');
var title = document.querySelector('.content-title');
var pagination = document.getElementById('pagination');
var topbtn = document.querySelector('.gotop-btn');

var pageNum = 1;// 當前頁
var contentNum = 6;// 每一個分頁顯示的數量 -> 6 筆
var pageLeng = 0;// 頁碼數量

var data=[]
var zone = [];
var selectData = [];
var displayData = [];

//綁監聽事件
dist.addEventListener('change', showlist, false);
hot.addEventListener('click', showlist, false);
pagination.addEventListener('click', switchPages, false);
topbtn.addEventListener('click', goTop, false);


//用ajax撈取遠端資料，用get
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send();//讀取資料

xhr.onload = addinfo; //資料回傳後就執行function

//將行政區的區域載入到select
function addinfo(e) {
    var array = JSON.parse(xhr.responseText).result.records;//將得到的資料字串轉為陣列
   
    
    for (var i = 0; i < array.length; i++) {
        data.push(array[i]);
        zone.push(array[i].Zone);//把data裡的行政區域撈出來塞進zone陣列
    }
    console.log(zone);
    //用indexOf()和filter()取出不重複的行政區域
    var norepeatzone = zone.filter(function (element, index, arr) {
        return arr.indexOf(element) === index;
    });
    console.log(norepeatzone); // 不重複的陣列，得出有27個行政區域
    
    //新增網頁上的option選項  
    for (var i = 0; i < norepeatzone.length; i++) {

        var opt = document.createElement('option');
        opt.setAttribute('value', norepeatzone[i]);
        opt.textContent = norepeatzone[i];
        dist.appendChild(opt);

    }

}

function showlist(e){
    

    displayData = []; // 清空上一筆資料，擺放要顯示在網頁上的區域資料
    selectData = []; // 清空上一筆資料，擺放選取的區域資料
    pageNum = 1; // 回到第一頁
    for (var i = 0; i < data.length; i++) {
        if (e.target.value == data[i].Zone) {
            selectData.push(data[i]);////把data裡的行政區域撈出來塞進
            title.textContent = e.target.value;
        }
        if (e.target.value !== data[i].Zone){
            title.textContent=e.target.value;
        }
        
    }

    displayData = selectData;
    displayDistrict();
    
}

function displayDistrict() {
    var str = '';
    
    // 選取開始的陣列位置 -> 頁碼乘以每頁顯示數量
    var start = pageNum * contentNum;//1頁*6筆
    var dataLen = displayData.length;//顯示在網頁上的區域資料總共有幾筆
    countPageNum(dataLen);//計算有幾頁的function

    // 如果長度大於 start，以 start 作為迴圈停止條件
    if (dataLen > start) {
        dataLen = start;
    } else {
        dataLen = displayData.length;
    }
   
    // 以 start - 每頁顯示數量為開始條件，如果有2頁開始條件會變成12-6=6，從序列6開始
    for (var i = start - contentNum; i < dataLen; i++) {
        // 顯示筆數
        
        str += '<div class=' + '"col-md-6 bg-cover">'
            + '<div class=' + '"card mb-4">'
            + '<div class=' + '"card-img bg-cover  d-flex justify-content-between align-items-end"' + 'style=' + '"background-image: url(' + displayData[i].Picture1 + '); height:180px;">'
            + '<div class=' + '"card-title    text-white font-weight-bold mb-3 ml-4 h3 ">' + displayData[i].Name + '</div>'
            + '<div class=' + '"card-loca    text-white font-weight-bold mb-2 mr-3 h5 ">' + displayData[i].Zone + '</div>'
            + '</div>'
            + '<div class=' + '"card-body">'
            + '<ul class="card-list">'
            + '<li>' + ' <img src="images/icons_clock.png" alt="">' + displayData[i].Opentime + '</li>'
            + '<li>' + '<img src="images/icons_pin.png" alt="">' + displayData[i].Add + '</li>'
            + '<li>' + '<img src="images/icons_phone.png" alt="">' + displayData[i].Tel + '</li>'
            + '</ul>'
            + '<span class=' + '"card-tag">' + '<img src=' + '"images/icons_tag.png"' + 'alt="' + '">' + displayData[i].Ticketinfo + '</span>'

            + '</div>'
            + '</div>'
            + '</div>'
    }

    conbody.innerHTML = str;
    if(str==''){
        conbody.className +=' justify-content-center';
        conbody.innerHTML = '<div class="'+'h3 "'+'>沒有該區資料</div>';
    }else{
        conbody.className = 'row content-body';
    }
   
}
//計算頁碼，unm為該區有幾筆資料
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
        pagination.innerHTML = str;
    }

}

 function switchPages (e) {
    e.preventDefault();
    var currentPage = e.target.textContent;

    if (e.target.textContent == 'Next') {
        console.log(pageNum, pageLeng);
        if (pageNum == pageLeng) {
            pageNum = pageLeng // 頁面到最後一頁時候 pageNum = pageLeng
        } else {
            pageNum++; // 尚未到最後頁面則按下 NEXT 進到下一頁
        }
        console.log(pageNum, pageLeng);
    } else if (e.target.textContent == 'Previous') {
        if (pageNum == 1) {
            pageNum = 1;
        } else {
            pageNum--;
        }
    } else {
        pageNum = parseInt(e.target.textContent);
    }
    displayDistrict();
}



// 回到頂端
window.onscroll = function () {
   //onscroll是當頁面滾動時會觸發function
    if (document.documentElement.scrollTop > 600) {
        topbtn.style.display = "block";//滾動高度>600會顯示出向上圖示

    } else {
        topbtn.style.display = "none";//反之則隱藏
    }
};


function goTop(e) {
    e.preventDefault();
    
    window.scrollTo({ 'behavior': 'smooth', 'top': dist.offsetTop })
}